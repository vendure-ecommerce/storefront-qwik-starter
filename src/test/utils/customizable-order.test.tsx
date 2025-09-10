import { expect, test } from 'vitest';
import {
	getCustomizableOption,
	getCustomizableOptionArray,
	parseCustomizableClassDef,
} from '~/utils/customizable-order';

test('parseCustomizableClassDef should parse valid input', () => {
	const input = [
		{
			name: 'Dummy',
			optionDefinition:
				'[{"field":"textTop","type":"string?"},{"field":"isTopAdditive","type":"boolean"}]',
		},
	];
	const result = parseCustomizableClassDef(input);
	expect(result).toEqual([
		{
			name: 'Dummy',
			optionDefinition: [
				{ field: 'textTop', type: 'string?' },
				{ field: 'isTopAdditive', type: 'boolean' },
			],
		},
	]);
});

test('test getCustomizableOption', () => {
	const optionArray = ['Hello', null, true];
	const optionDefArray = [
		{ field: 'textTop', type: 'string?' },
		{ field: 'textMiddle', type: 'string?' },
		{ field: 'isTopAdditive', type: 'boolean' },
	];
	const result = getCustomizableOption(optionArray, optionDefArray);
	expect(result).toEqual({
		textTop: 'Hello',
		textMiddle: null,
		isTopAdditive: true,
	});
});

test('test getCustomizableOptionArray', () => {
	const optionObj = {
		isTopAdditive: true,
		textMiddle: null,
		textTop: 'Hello',
		someNumber: 123,
	};
	const optionDefArray = [
		{ field: 'textTop', type: 'string?' },
		{ field: 'textMiddle', type: 'string?' },
		{ field: 'isTopAdditive', type: 'boolean' },
		{ field: 'someNumber', type: 'number' },
	];
	const result = getCustomizableOptionArray(optionObj, optionDefArray);
	expect(result).toEqual(['Hello', null, true, 123]);
});
