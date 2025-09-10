import { CustomizableClassDefTag } from '~/routes/constants';

export function parseCustomizableClassDef(
	data: { name: string; optionDefinition: string }[]
): CustomizableClassDefTag[] {
	return data.map((item) => ({
		name: item.name,
		optionDefinition: JSON.parse(item.optionDefinition),
	}));
}

export function checkType<T>(value: any, type: string): boolean {
	if (value === null && type.endsWith('?')) return true;
	return typeof value === type.replace('?', '');
}

/**
 * Get a customizable option object from an option array and its definition array.
 * The optionArray, Arr, is stored in orderLine.customFields.customizableOptionJson as JSON.stringify(Arr)
 *
 * @param optionArray e.g. ["Hello", null]
 * @param optionDefArray e.g. [ { field: "textTop", type: "string?" }, { field: "textMiddle", type: "string?" } ]
 * @returns Option object e.g. { textTop: "Hello", textMiddle: null }
 *
 * @throws Error if the length of optionArray and optionDefArray do not match, or if the types do not match
 */
export function getCustomizableOption(
	optionArray: (string | null | number | boolean)[],
	optionDefArray: { field: string; type: string }[]
): Record<string, any> {
	if (optionArray.length !== optionDefArray.length) {
		throw new Error('Option array length does not match option definition length');
	}

	const result: Record<string, any> = {};

	optionDefArray.forEach((def, index) => {
		// make sure the type matches
		if (!checkType(optionArray[index], def.type)) {
			throw new Error(`Option type does not match definition for field ${def.field}`);
		}
		result[def.field] = optionArray[index];
	});
	return result;
}

/**
 * Get an array of customizable option values from an option object and its definition array.
 * The result array, Arr, will be stored in orderLine.customFields.customizableOptionJson as JSON.stringify(Arr)
 *
 * @param optionObj e.g. { textTop: "Hello", textMiddle: null }
 * @param optionDefArray e.g. [ { field: "textTop", type: "string?" }, { field: "textMiddle", type: "string?" } ]
 * @returns Array of option Values in the order of optionDefArray. e.g. ["Hello", null]
 *
 */
export function getCustomizableOptionArray(
	optionObj: Record<string, string | null | number | boolean>,
	optionDefArray: { field: string; type: string }[]
): (string | null | number | boolean)[] {
	const result = optionDefArray.map((def) => optionObj[def.field]);
	// validate the result
	result.forEach((value, index) => {
		if (!checkType(value, optionDefArray[index].type)) {
			throw new Error(
				`Option type does not match definition for field ${optionDefArray[index].field}`
			);
		}
	});
	return result;
}

/**
 * Generate a hash from a string.
 * @param string credit to: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 * @returns
 */
export const genHash = (string: string) => {
	let hash = 0;
	for (const char of string) {
		hash = (hash << 5) - hash + char.charCodeAt(0);
		hash |= 0; // Constrain to 32bit integer
	}
	return hash;
};
