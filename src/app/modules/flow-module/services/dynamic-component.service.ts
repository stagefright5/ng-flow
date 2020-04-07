import { Injectable, ComponentFactoryResolver, ViewContainerRef, Inject, ComponentRef } from '@angular/core';
import { NodeComponent } from '../components/node/node.component';
import { Node, LoadedComponentData as NewComponentData } from '../utils/TypeDefs';
import { DOCUMENT } from '@angular/common'
import { FlowModule } from '../flow.module';

@Injectable({
	providedIn: FlowModule
})
export class DynamicComponentService {
	newCompData: NewComponentData;
	attachedCompList: { [key: string]: Array<NewComponentData> } = {};

	constructor(private componentFactoryResolver: ComponentFactoryResolver,
		@Inject(DOCUMENT) private d: Document) { }

	appendNodeToFlow({ component, inputBindings, outputBindings, flow, uniqueId }: Node.New): void {
		this.newCompData = this.loadComponent(flow, component);
		this.updateComponentBindings({ inputBindings, outputBindings });
		this._updateComponentInstaceMembers({ id: uniqueId });
		(<NodeComponent>this.newCompData.compRef.instance).setPosition();
	}

	loadComponent(parent: ViewContainerRef, component: any): NewComponentData {
		const compFactory = this.componentFactoryResolver.resolveComponentFactory(component);
		const compRef = parent.createComponent(compFactory);
		const newCompData = { compRef, inputs: compFactory.inputs, outputs: compFactory.outputs };
		this.attachedCompList[compFactory.selector] && this.attachedCompList[compFactory.selector].push(newCompData) ||
			(this.attachedCompList[compFactory.selector] = []);
		return newCompData;
	}

	updateComponentBindings({ inputBindings, outputBindings }, newCompData?: NewComponentData) {
		this.updateInputBindings(inputBindings);
		this.updateOutputBindings(outputBindings);
	}

	updateInputBindings(inputBindings, component?: NewComponentData) {
		const compData = component || this.newCompData;
		if (compData.inputs && compData.inputs.length) {
			compData.inputs.forEach(({ propName }) => {
				if (inputBindings[propName]) {
					compData.compRef.instance[propName] = inputBindings[propName];
				}
			});
		}
		compData.compRef.changeDetectorRef.detectChanges();
	}
	updateOutputBindings(outputBindings, component?: NewComponentData) {
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
