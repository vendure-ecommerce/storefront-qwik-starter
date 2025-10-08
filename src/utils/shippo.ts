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

	let suggestedChanges: Array<{ field: FieldToCheck; suggested: string }> = [];

	FIELDS_TO_CHECK_EQUAL.forEach((field) => {
		const suggested = validationResult?.[field] || '';
		const current = formData[field] || '';
		if (field === 'postalCode' && formData.countryCode === 'US') {
			if (current.slice(0, 5) !== suggested.slice(0, 5)) {
				suggestedChanges.push({ field, suggested: suggested.slice(0, 5) });
			} else if (current.length > 5 && current !== suggested) {
				// if the user has already typed a ZIP+4, and it's different from suggested, offer the change
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

/**
 * Map free-text Shippo messages to form field paths so the UI can attach issues.
 * Returns an array of { path, message } entries. If a message implicates multiple
 * fields, one entry per field is returned. If none matched, a fallback path is used.
 */
export function mapShippoMessagesToIssues(messages: string[] | undefined) {
	if (!messages || messages.length === 0) return [];
	const issues: Array<{ path: (string | number)[]; message: string }> = [];

	messages.forEach((m) => {
		const lower = String(m).toLowerCase();
		const matchedPaths: Array<(string | number)[]> = [];
		if (lower.includes('postal') || lower.includes('zip')) matchedPaths.push(['postalCode']);
		if (lower.includes('state') || lower.includes('province')) matchedPaths.push(['province']);
		if (lower.includes('street') || lower.includes('address')) matchedPaths.push(['streetLine1']);
		if (lower.includes('city')) matchedPaths.push(['city']);

		if (matchedPaths.length > 1) {
			matchedPaths.forEach((p) => issues.push({ path: p, message: m }));
		} else if (matchedPaths.length === 1) {
			issues.push({ path: matchedPaths[0], message: m });
		} else {
			// fallback to a visible field so the message surfaces in the UI
			issues.push({ path: ['streetLine1'], message: m });
		}
	});

	return issues;
}

export default shippoMessagesToStrings;
