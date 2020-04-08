import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Node, NewComponentData } from '../utils/TypeDefs';
import { FlowModule } from '../flow.module';
@Injectable({
	providedIn: 'root'
})
export class DynamicComponentService {
	newCompData: NewComponentData;
	attachedCompList: { [key: string]: Array<NewComponentData> } = {};

	constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

	appendNodeToFlow({ component, inputBindings, outputBindings, flow, uniqueId }: Node.New): NewComponentData {
		this.newCompData = this.loadComponent(flow, component);
		this.updateComponentBindings({ inputBindings, outputBindings });
		this._updateComponentInstaceMembers({ id: uniqueId });
		return this.newCompData;
	}

	loadComponent(parent: ViewContainerRef, component: any): NewComponentData {
		const compFactory = this.componentFactoryResolver.resolveComponentFactory(component);
		const compRef = parent.createComponent(compFactory);
		const newCompData = { compRef, inputs: compFactory.inputs, outputs: compFactory.outputs };
		this.attachedCompList[compFactory.selector] && this.attachedCompList[compFactory.selector].push(newCompData) ||
			(this.attachedCompList[compFactory.selector] = [newCompData]);
		return newCompData;
	}

	updateComponentBindings({ inputBindings, outputBindings }: Partial<Node.New>, newCompData?: NewComponentData) {
		inputBindings && this._updateInputBindings(inputBindings, newCompData);
		outputBindings && this._updateOutputBindings(outputBindings, newCompData);
		(inputBindings || outputBindings) && (newCompData || this.newCompData).compRef.changeDetectorRef.detectChanges();
	}

	private _updateInputBindings(inputBindings, component?: NewComponentData) {
		const compData = component || this.newCompData;
		if (compData.inputs && compData.inputs.length) {
			compData.inputs.forEach(({ propName }) => {
				if (inputBindings[propName]) {
					compData.compRef.instance[propName] = inputBindings[propName];
				}
			});
		}
	}
	private _updateOutputBindings(outputBindings, component?: NewComponentData) {
		const compData = component || this.newCompData;
		if (compData.outputs && compData.outputs.length) {
			compData.outputs.forEach(({ propName }) => {
				if (outputBindings[propName]) {
					compData.compRef.instance[propName].subscribe((res) => {
						outputBindings[propName](res);
					})
				}
			});
		}
	}

	private _updateComponentInstaceMembers(kvObject: { [key: string]: any }, component?: any) {
		const componentInstance = (component || this.newCompData).compRef.instance;
		Object.assign(componentInstance, kvObject);
	}

	clearAttachedComps(containerRef: ViewContainerRef, selector: string) {
		containerRef.clear();
		this.attachedCompList[selector] = [];
	}
}
