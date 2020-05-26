export const _ = {
	attr(elm: HTMLElement, attr: string) {
		return elm.attributes.getNamedItem(attr).value;
	},

	each(
		o: Record<string, any>,
		keySelector?: (k: any) => boolean | RegExp,
		op?: "get" | "delete",
		cb?: (k: string, v: any) => void
	) {
		const retO = {};
		const cbs = [];
		const keys = Object.keys(o);
		if (cb) {
			cbs.push(cb);
		}
		if (op === "delete") {
			cbs.push((key) => {
				delete o[key];
			});
		} else if (op === "get") {
		}
		keys.forEach((key) => {
			let t = false;
			if (
				(typeof keySelector === "function" && keySelector(key)) ||
				(keySelector && ((<unknown>keySelector) as RegExp).test(key)) ||
				!keySelector
			) {
				cbs.forEach((cb) => {
					cb(key, o[key] || retO[key]);
					retO[key] = o[key];
				});
			}
		});
		return retO;
	},

	generateUUID() {
		function __s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return __s4() + __s4() + "-" + __s4() + "-" + __s4() + "-" + __s4() + "-" + __s4() + __s4() + __s4();
	},
};
