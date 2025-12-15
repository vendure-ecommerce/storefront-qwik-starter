// A tiny runtime shim for `$localize` used in templates.
// Storybook (and some test environments) may not provide the Angular-style
// `$localize` global. This shim implements a no-op interpolator that
// returns the template with placeholders substituted.

if (!(globalThis as any).$localize) {
	Object.defineProperty(globalThis, '$localize', {
		configurable: true,
		enumerable: false,
		writable: true,
		value: (strings: TemplateStringsArray, ...values: any[]) => {
			let out = '';
			for (let i = 0; i < strings.length; i++) {
				out += strings[i] ?? '';
				if (i < values.length) out += String(values[i]);
			}
			return out;
		},
	});
}

export {};
