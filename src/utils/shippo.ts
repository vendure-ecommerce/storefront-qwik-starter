import type {
	ShippoAddressValidationResult,
	ShippoResponseMessage,
} from '~/generated/graphql-shop';
import { ShippingAddress } from '~/types';

/**
 * Convert Shippo validation messages into an array of user-friendly strings.
 */
export function shippoMessagesToStrings(result?: ShippoAddressValidationResult | null): string[] {
	const msgs: Array<ShippoResponseMessage | null | undefined> =
		result?.validationResults?.messages ?? [];

	return msgs
		.map((m) => {
			if (!m) return undefined;
			// Prefer human-readable text, fall back to code or source when text is missing
			return m.text ?? (m.code ? String(m.code) : m.source ?? undefined);
		})
		.filter(Boolean) as string[];
}

const FIELDS_TO_CHECK_EQUAL = [
	'streetLine1',
	'streetLine2',
	'city',
	'province',
	'postalCode',
] as const;

type FieldToCheck = (typeof FIELDS_TO_CHECK_EQUAL)[number];

/**
 *
 * @param formData
 * @param validationResult it should return like [{field: 'city', suggested: 'New City'}]
 */
export function fieldsNotIdentical(
	formData: ShippingAddress,
	validationResult: ShippoAddressValidationResult
): Array<{ field: FieldToCheck; suggested: string }> {
	const textClean = (s: string) => s.trim().toLowerCase().replace(/\./g, '');
	// for postalCode, only check the first 5 characters
	const postalCodeClean = (s: string) => s.trim().toLowerCase().replace(/\./g, '').slice(0, 5);

	let suggestedChanges: Array<{ field: FieldToCheck; suggested: string }> = [];

	FIELDS_TO_CHECK_EQUAL.forEach((field) => {
		const suggested = validationResult?.[field] || '';
		const current = formData[field] || '';
		if (field === 'postalCode') {
			if (postalCodeClean(suggested) !== postalCodeClean(current)) {
				suggestedChanges.push({ field, suggested });
			}
		} else {
			if (textClean(suggested) !== textClean(current)) {
				suggestedChanges.push({ field, suggested });
			}
		}
	});
	return suggestedChanges;
}
