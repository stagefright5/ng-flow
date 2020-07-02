import { Injectable, ComponentFactoryResolver, ViewContainerRef, Injector, InjectionToken } from '@angular/core';
import { Node, AttachedComponent, CustomData } from '../utils/TypeDefs';

@Injectable({
	providedIn: 'root'
})
export class DynamicComponentService {
	attachedCompList: { [key: string]: Array<AttachedComponent> } = {};

	constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

	appendNodeToFlow(newNode: Node.New): AttachedComponent {
		const { component, __data__, injection, inputBindings, outputBindings, flow, id } = newNode;
		const newCompData = this.loadComponent(flow, { component, injection, __data__ });
		this.updateComponentBindings({ inputBindings, outputBindings }, newCompData);
		this._updateComponentInstaceMembers({ id: id }, newCompData);
		return newCompData;
	}

	loadComponent(
		parent: ViewContainerRef,
		newComponent: { component: any; injection?: { data: any, token: InjectionToken<any> }; __data__?: any; id?: string }
	): AttachedComponent {
		const compFactory = this.componentFactoryResolver.resolveComponentFactory(newComponent.component);
		let compRef;
		if (newComponent.injection) {
			const injector = this._createInjector(newComponent.injection.data, newComponent.injection.token);
			compRef = parent.createComponent(compFactory, undefined, injector);
		} else {
			compRef = parent.createComponent(compFactory)
		}
		const newCompData = {
			compRef,
			inputs: compFactory.inputs,
			outputs: compFactory.outputs,
			__data__: newComponent.__data__,
			id: newComponent.id
		};
		(this.attachedCompList[compFactory.selector] &&
			this.attachedCompList[compFactory.selector].push(newCompData)) ||
			(this.attachedCompList[compFactory.selector] = [newCompData]);
		return newCompData;
	}

	updateComponentBindings(
		{ inputBindings = null, outputBindings = null }: Partial<Node.New>,
		compData: AttachedComponent
	) {
		inputBindings && this._updateInputBindings(inputBindings, compData);
		outputBindings && this._updateOutputBindings(outputBindings, compData);
		(inputBindings || outputBindings) && compData.compRef.changeDetectorRef.detectChanges();
	}

	public detachComponent(selector: string, id: string) {
		let deletedNode = null;
		this.attachedCompList[selector] = this.attachedCompList[selector].filter(compData => {
			if ((<any>compData.compRef.instance).id === id) {
				compData.compRef.destroy();
				deletedNode = compData.__data__;
				return false;
			}
			return true;
		});
		return deletedNode;
	}

	private _updateInputBindings(inputBindings, compData: AttachedComponent) {
		if (compData.inputs && compData.inputs.length) {
			compData.inputs.forEach(({ propName }) => {
				if (inputBindings[propName]) {
					compData.compRef.instance[propName] = inputBindings[propName];
				}
			});
		}
	}
	private _updateOutputBindings(outputBindings, compData: AttachedComponent) {
		if (compData.outputs && compData.outputs.length) {
			compData.outputs.forEach(({ propName }) => {
				if (outputBindings[propName]) {
					compData.compRef.instance[propName].subscribe(res => {
						outputBindings[propName](res);
					});
				}
			});
		}
	}

	private _updateComponentInstaceMembers(kvObject: { [key: string]: any }, component: AttachedComponent) {
		const componentInstance = component.compRef.instance;
		Object.assign(componentInstance, kvObject);
	}

	private _createInjector(data: CustomData = {}, InjectionToken: InjectionToken<any>) {
		const providers = [{
			provide: InjectionToken,
			useValue: data
		}];
		const injector: Injector = Injector.create(providers);
		return injector;
	}

	clearAttachedComps(containerRef: ViewContainerRef, selector: string) {
		containerRef.clear();
		this.attachedCompList[selector] = [];
	}

	cleanup(containerRef: ViewContainerRef, selector: string) {
		this.clearAttachedComps(containerRef, selector);
	}
}
