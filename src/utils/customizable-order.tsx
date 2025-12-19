import { OrderLine } from '~/generated/graphql';
import { batchAddCustomizedImagesToOrderMutation } from '~/providers/shop/orders/customizable-order';
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
	optionObj: Record<string, any>,
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
export const genHash = (string: string): string => {
	let hash = 0;
	for (const char of string) {
		hash = (hash << 5) - hash + char.charCodeAt(0);
		hash |= 0; // Constrain to 32bit integer
	}
	return hash.toString();
};

export const genCustomizableOptionJsonHash = (
	line: Pick<OrderLine, 'productVariant' | 'customFields'>
): string => {
	if (!line.customFields?.customizableOptionJson) {
		return '0';
	}
	const hashKey1 = line.productVariant.product.customFields?.customizableClass ?? '';
	const hashKey2 = line.customFields?.customizableOptionJson ?? '';
	return genHash(hashKey1 + '-' + hashKey2);
};

/**
 * Update the customized image for each order line that has customizable options.
 * Note that the function requires that each customized image in an orderLine is displayed as canvas elements
 * with id format: genCustomizableOptionJsonHash(orderLine)
 * @param lines The current order lines
 * @param compressionRatio Compression ratio for the image (default: 0.5)
 * @param abortSignal Optional AbortSignal to cancel the operation
 */
const updateCustomizedImageForOrderLine = async (
	lines: OrderLine[],
	compressionRatio: number = 0.5,
	abortSignal?: AbortSignal
): Promise<void> => {
	// Check if operation was aborted before starting
	if (abortSignal?.aborted) {
		throw new Error('Operation was aborted');
	}

	const files: File[] = [];
	const lineIds: string[] = [];

	for (const line of lines) {
		// Check abort signal on each iteration
		if (abortSignal?.aborted) {
			throw new Error('Operation was aborted');
		}

		if (!line.customFields?.customizableOptionJson) {
			continue;
		}

		const hash = genCustomizableOptionJsonHash(line);
		const canvas = document.getElementById(hash) as HTMLCanvasElement;

		// Safety check: Canvas might not exist if user navigated away
		if (!canvas) {
			console.warn(`Canvas with id ${hash} not found for order line ${line.id}`);
			continue;
		}

		// Check if canvas is still in the document (not detached)
		if (!document.body.contains(canvas)) {
			console.warn(`Canvas with id ${hash} is no longer in the document for order line ${line.id}`);
			continue;
		}

		try {
			const blob = await new Promise<Blob | null>((resolve, reject) => {
				// Check abort signal before creating blob
				if (abortSignal?.aborted) {
					reject(new Error('Operation was aborted'));
					return;
				}

				canvas.toBlob(
					(b) => {
						// Final check before resolving
						if (abortSignal?.aborted) {
							reject(new Error('Operation was aborted'));
							return;
						}
						resolve(b);
					},
					'image/jpeg',
					compressionRatio
				);
			});

			if (!blob) {
				console.error(`Failed to create blob from canvas for order line ${line.id}`);
				continue;
			}

			const file = new File([blob], `customized-img-${line.id}.jpg`, { type: 'image/jpeg' });
			files.push(file);
			lineIds.push(line.id);
		} catch (error) {
			if (error instanceof Error && error.message === 'Operation was aborted') {
				throw error; // Re-throw abort errors
			}
			console.error(`Error processing canvas for order line`, error);
		}
	}

	// Final check before making the API call
	if (abortSignal?.aborted) {
		throw new Error('Operation was aborted');
	}

	if (files.length > 0) {
		await batchAddCustomizedImagesToOrderMutation(files, lineIds);
	}
};

// In your component or calling code:
export const safeUpdateCustomizedImages = async (lines: OrderLine[]) => {
	const abortController = new AbortController();

	// Cancel if user navigates away (in Qwik, you might use cleanup)
	const cleanup = () => {
		abortController.abort();
	};

	try {
		await updateCustomizedImageForOrderLine(lines, 0.5, abortController.signal);
		console.log('Images updated successfully');
	} catch (error) {
		if (error instanceof Error && error.message === 'Operation was aborted') {
			console.log('Image update was cancelled due to navigation');
		} else {
			console.error('Error updating images:', error);
		}
	}

	// Return cleanup function
	return cleanup;
};
