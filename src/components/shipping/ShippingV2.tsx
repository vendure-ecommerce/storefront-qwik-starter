import {
	$,
	component$,
	QRL,
	useContext,
	useSignal,
	useTask$,
	useVisibleTask$,
} from '@qwik.dev/core';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import {
	Address,
	CreateAddressInput,
	CreateCustomerInput,
	OrderAddress,
} from '~/generated/graphql';
import { getActiveCustomerAddressesQuery } from '~/providers/shop/customer/customer';
import {
	getActiveOrderQuery,
	setOrderShippingAddressMutation,
} from '~/providers/shop/orders/order';
import { ShippingAddress } from '~/types';
import { isActiveCustomerValid, isShippingAddressValid } from '~/utils';
import { HighlightedButton } from '../buttons/HighlightedButton';
import CartContents from '../cart-contents/CartContents';
import CartTotals from '../cart-totals/CartTotals';
import AddressSelector from '../checkout/AddressSelector';
import LockClosedIcon from '../icons/LockClosedIcon';
import ShippingMethodSelectorV2 from '../shipping-method-selector/ShippingMethodSelectorV2';

type IProps = {
	onForward$: QRL<(customer: CreateCustomerInput) => Promise<void>>;
};

// The idea is to replace all undefined or null values with empty strings
const parseToShippingAddress = (address: OrderAddress | Address): ShippingAddress => {
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
	};
};

export default component$<IProps>(({ onForward$ }) => {
	const appState = useContext(APP_STATE);
	const isFormValidSignal = useSignal(false);
	const addressAddedToOrder = useSignal(false);
	const shippingNeedsToBeCalculated = useSignal(true);
	const isShippingCalculating = useSignal(false);

	useVisibleTask$(async () => {
		const activeOrder = await getActiveOrderQuery();
		const activeCustomer = await getActiveCustomerAddressesQuery();

		if (activeOrder?.customer) {
			const customer = activeOrder.customer;
			appState.customer = {
				title: customer.title ?? '',
				firstName: customer.firstName,
				id: customer.id,
				lastName: customer.lastName,
				emailAddress: customer.emailAddress,
				phoneNumber: customer.phoneNumber ?? '',
			};
		}
		if (activeOrder?.shippingAddress) {
			const orderShippingAddress = activeOrder.shippingAddress;
			if (orderShippingAddress) {
				appState.shippingAddress = parseToShippingAddress(orderShippingAddress);
			}
		}
		if (activeCustomer?.addresses) {
			const [customerDefaultShippingAddress] = activeCustomer.addresses.filter(
				(address: Address) => !!address.defaultShippingAddress
			);
			if (customerDefaultShippingAddress) {
				appState.shippingAddress = {
					...appState.shippingAddress,
					...parseToShippingAddress(customerDefaultShippingAddress),
				};
			}
		}
	});

	useTask$(({ track }) => {
		track(() => appState.customer);
		track(() => appState.shippingAddress);
		if (!appState.shippingAddress.countryCode) {
			appState.shippingAddress = {
				...appState.shippingAddress,
				countryCode: appState.availableCountries[0].code,
			};
		}
		isFormValidSignal.value =
			isShippingAddressValid(appState.shippingAddress) && isActiveCustomerValid(appState.customer);
	});

	return (
		<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
			<div>
				<div>
					<h2 class="text-lg font-medium text-gray-900">{$localize`Contact information`}</h2>
					<form>
						<div class="mt-4">
							<label class="block text-sm font-medium text-gray-700">{$localize`Email address`}</label>
							<div class="mt-1">
								<input
									type="email"
									value={appState.customer?.emailAddress}
									disabled={appState.customer?.id !== CUSTOMER_NOT_DEFINED_ID}
									onChange$={(_, el) => {
										appState.customer = { ...appState.customer, emailAddress: el.value };
									}}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>
						<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
							<div>
								<label class="block text-sm font-medium text-gray-700">{$localize`First name`}</label>
								<div class="mt-1">
									<input
										type="text"
										value={appState.customer?.firstName}
										disabled={appState.customer?.id !== CUSTOMER_NOT_DEFINED_ID}
										onChange$={(_, el) => {
											appState.customer = { ...appState.customer, firstName: el.value };
										}}
										class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									/>
								</div>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700">{$localize`Last name`}</label>
								<div class="mt-1">
									<input
										type="text"
										value={appState.customer?.lastName}
										disabled={appState.customer?.id !== CUSTOMER_NOT_DEFINED_ID}
										onChange$={(_, el) => {
											appState.customer = { ...appState.customer, lastName: el.value };
										}}
										class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									/>
								</div>
							</div>
						</div>
					</form>
				</div>

				<input type="hidden" name="action" value="setCheckoutShipping" />
				<div class="mt-10 border-t border-gray-200 pt-10">
					<h2 class="text-lg font-medium text-gray-900">{$localize`Shipping information`}</h2>
				</div>

				<AddressSelector
					onSelectAddress$={async (address: ShippingAddress) => {
						appState.shippingAddress = address;
						shippingNeedsToBeCalculated.value = true;
						const addressToOrder = parseShippingAddressToCreateAddressInput(
							appState.shippingAddress
						);
						const setOrderAddressResult = await setOrderShippingAddressMutation(addressToOrder);
					}}
				/>
			</div>
			<div class="mt-10 lg:mt-0">
				{/* Order Summary */}

				<h2 class="text-lg font-medium text-gray-900 mb-4">{$localize`Order summary`}</h2>
				<CartContents
					onOrderLineChange$={async () => {
						shippingNeedsToBeCalculated.value = true;
					}}
				/>

				{/* Delivery Method */}

				<div class="mt-10 border-t border-gray-200 pt-10">
					<ShippingMethodSelectorV2 needCalculateShipping$={shippingNeedsToBeCalculated} />
				</div>

				{!shippingNeedsToBeCalculated.value && <CartTotals order={appState.activeOrder} />}
				<HighlightedButton
					extraClass="mt-6 w-full"
					onClick$={$(() => {
						if (isFormValidSignal.value) {
							const { emailAddress, firstName, lastName, phoneNumber, title } = appState.customer;

							const createCustomerInput: CreateCustomerInput = {
								emailAddress: emailAddress ?? '',
								firstName,
								lastName,
								phoneNumber,
								title,
							};
							onForward$(createCustomerInput);
						}
					})}
					disabled={!isFormValidSignal.value || shippingNeedsToBeCalculated.value}
				>
					<div class="flex items-center space-x-4">
						<LockClosedIcon />
						<p>{$localize`Proceed to payment`}</p>
					</div>
				</HighlightedButton>
			</div>
		</div>
	);
});

const parseShippingAddressToCreateAddressInput = (address: ShippingAddress): CreateAddressInput => {
	return {
		fullName: address.fullName,
		streetLine1: address.streetLine1,
		streetLine2: address.streetLine2,
		city: address.city,
		province: address.province,
		postalCode: address.postalCode,
		countryCode: address.countryCode,
		phoneNumber: address.phoneNumber,
		company: address.company,
	};
};
