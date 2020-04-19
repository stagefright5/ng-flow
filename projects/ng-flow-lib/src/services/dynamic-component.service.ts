import { Injectable, ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { Node, AttachedComponentData } from "../utils/TypeDefs";
@Injectable({
	providedIn: "root"
})
export class DynamicComponentService {
	attachedCompList: { [key: string]: Array<AttachedComponentData> } = {};

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

	appendNodeToFlow(newNode: Node.New): AttachedComponentData {
		const { component, __data__, inputBindings, outputBindings, flow, id } = newNode;
		const newCompData = this.loadComponent(flow, { component, __data__ });
		this.updateComponentBindings({ inputBindings, outputBindings }, newCompData);
		this._updateComponentInstaceMembers({ id: id }, newCompData);
		return newCompData;
	}

	loadComponent(
		parent: ViewContainerRef,
		newNode: { component: any; __data__?: any; id?: string }
	): AttachedComponentData {
		const compFactory = this.componentFactoryResolver.resolveComponentFactory(newNode.component);
		const compRef = parent.createComponent(compFactory);
		const newCompData = {
			compRef,
			inputs: compFactory.inputs,
			outputs: compFactory.outputs,
			__data__: newNode.__data__,
			id: newNode.id
		};
		(this.attachedCompList[compFactory.selector] &&
			this.attachedCompList[compFactory.selector].push(newCompData)) ||
			(this.attachedCompList[compFactory.selector] = [newCompData]);
		return newCompData;
	}

	updateComponentBindings(
		{ inputBindings = null, outputBindings = null }: Partial<Node.New>,
		compData: AttachedComponentData
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

	private _updateInputBindings(inputBindings, compData: AttachedComponentData) {
		if (compData.inputs && compData.inputs.length) {
			compData.inputs.forEach(({ propName }) => {
				if (inputBindings[propName]) {
					compData.compRef.instance[propName] = inputBindings[propName];
				}
			});
		}
	}
	private _updateOutputBindings(outputBindings, compData: AttachedComponentData) {
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

	private _updateComponentInstaceMembers(kvObject: { [key: string]: any }, component: AttachedComponentData) {
		const componentInstance = component.compRef.instance;
		Object.assign(componentInstance, kvObject);
	}

	clearAttachedComps(containerRef: ViewContainerRef, selector: string) {
		containerRef.clear();
		this.attachedCompList[selector] = [];
	}

	cleanup(containerRef: ViewContainerRef, selector: string) {
		this.clearAttachedComps(containerRef, selector);
	}
}
