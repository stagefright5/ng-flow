import { InjectionToken } from "@angular/core";

export const DESC_PANEL_DATA = new InjectionToken<any>("DescriptionPanelData", {
	providedIn: "root",
	factory: () => {}
});
export enum CONST_DIRECTIONS {
	FROM_LEFT = 0,
	FROM_RIGHT,
	FROM_TOP
}
export const CONST_SELECTORS = {
	NODE: "node",
	FLOW: "flow,[flow]",
	WHEEL: "wheel"
};
export const NODE_ID_PREFIX = "node_no_";
export const Events = {
	NODE_DELETE: "node-delete"
};
