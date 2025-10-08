import { GUEST_ADDED_ADDRESS_ID } from '~/constants';
import { Address, OrderAddress } from '~/generated/graphql';
import { ShippingAddress } from '~/types';

/**
 * If the given address is set as defaultShippingAddress or defaultBillingAddress,
 * ensure that no other address in the addressBook has the same flag set to true.
 */
export const updateDefaultAddressInBook = (
	address: ShippingAddress,
	addressBook: ShippingAddress[]
): void => {
	if (address.defaultShippingAddress) {
		addressBook.forEach((a) => {
			if (a.id !== address.id && a.defaultShippingAddress) {
				a.defaultShippingAddress = false;
			}
		});
	}
	if (address.defaultBillingAddress) {
		addressBook.forEach((a) => {
			if (a.id !== address.id && a.defaultBillingAddress) {
				a.defaultBillingAddress = false;
			}
		});
	}
};

export const parseToShippingAddress = (
	address: OrderAddress | Address,
	id_default: string = GUEST_ADDED_ADDRESS_ID
): ShippingAddress => {
	let country = '';
	let countryCode = '';
	const isCustomerAddress = (address as Address).country !== undefined;
	if (isCustomerAddress) {
		country = (address as Address).country?.code ?? '';
		countryCode = (address as Address).country?.code ?? '';
	} else {
		country = (address as OrderAddress).country ?? '';
		countryCode = (address as OrderAddress).countryCode ?? '';
	}
	return {
		id: isCustomerAddress ? (address as Address).id : id_default,
		city: address.city ?? '',
		company: address.company ?? '',
		country: country,
		countryCode: countryCode,
		fullName: address.fullName ?? '',
		phoneNumber: address.phoneNumber ?? '',
		postalCode: address.postalCode ?? '',
		province: address.province ?? '',
		streetLine1: address.streetLine1 ?? '',
		streetLine2: address.streetLine2 ?? '',
		defaultShippingAddress: isCustomerAddress
			? (address as Address).defaultShippingAddress ?? false
			: false,
		defaultBillingAddress: isCustomerAddress
			? (address as Address).defaultBillingAddress ?? false
			: false,
	};
};

export default {
	updateDefaultAddressInBook,
	parseToShippingAddress,
};
