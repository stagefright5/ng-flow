import { Injectable, ComponentFactoryResolver, ViewContainerRef, Inject, ComponentRef } from '@angular/core';
import { CoachComponent } from './coach/coach.component';
import { Coach, LoadedComponentData as NewComponentData } from './TypeDefs';
import { DOCUMENT } from '@angular/common'

@Injectable({
	providedIn: 'root'
})
export class DynamicComponentService {
	newCompData: NewComponentData;
	constructor(private componentFactoryResolver: ComponentFactoryResolver,
		@Inject(DOCUMENT) private d: Document) { }

	addCoach({ component, inputBindings, outputBindings, train, uniqueId }: Coach.New) {
		this.newCompData = this.loadComponent(train, component);
		this.updateComponentBindings({ inputBindings, outputBindings });
		this._updateComponentInstaceMembers({ id: uniqueId });
		(<CoachComponent>this.newCompData.compRef.instance).setPosition();
		this.newCompData.compRef.changeDetectorRef.detectChanges();
	}

	updateComponentBindings({ inputBindings, outputBindings }, newCompData?: NewComponentData) {
		this.updateInputBindings(inputBindings);
		this.updateOutputBindings(outputBindings);
	}

	updateInputBindings(inputBindings, component?: any) {
		const compData = component || this.newCompData;
		if (compData.inputs && compData.inputs.length) {
			compData.inputs.forEach(({ propName }) => {
				if (inputBindings[propName]) {
					compData.compRef.instance[propName] = inputBindings[propName];
				}
			});
		}
	}
	updateOutputBindings(outputBindings, component?: any) {
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

	loadComponent(parent: ViewContainerRef, component: any): NewComponentData {
		const compFactory = this.componentFactoryResolver.resolveComponentFactory(component);
		const compRef = parent.createComponent(compFactory);
		return { compRef, inputs: compFactory.inputs, outputs: compFactory.outputs };
	}
}
