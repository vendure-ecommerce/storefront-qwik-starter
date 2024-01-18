import {
	$,
	component$,
	QRL,
	useContext,
	useSignal,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { Address, CreateAddressInput, CreateCustomerInput } from '~/generated/graphql';
import { getActiveCustomerAddressesQuery } from '~/providers/shop/customer/customer';
import { getActiveOrderQuery } from '~/providers/shop/orders/order';
import { isActiveCustomerValid, isShippingAddressValid } from '~/utils';
import AddressForm from '../address-form/AddressForm';
import LockClosedIcon from '../icons/LockClosedIcon';
import ShippingMethodSelector from '../shipping-method-selector/ShippingMethodSelector';

type IProps = {
	onForward$: QRL<
		(customer: CreateCustomerInput, shippingAddress: CreateAddressInput) => Promise<void>
	>;
};

export default component$<IProps>(({ onForward$ }) => {
	const appState = useContext(APP_STATE);
	const isFormValidSignal = useSignal(false);

	useVisibleTask$(async () => {
		const activeOrder = await getActiveOrderQuery();
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
			const shippingAddress = activeOrder?.shippingAddress;
			if (shippingAddress) {
				appState.shippingAddress = {
					city: shippingAddress.city ?? '',
					company: shippingAddress.company ?? '',
					country: shippingAddress.country ?? '',
					countryCode: shippingAddress.countryCode ?? '',
					fullName: shippingAddress.fullName ?? '',
					phoneNumber: shippingAddress.phoneNumber ?? '',
					postalCode: shippingAddress.postalCode ?? '',
					province: shippingAddress.province ?? '',
					streetLine1: shippingAddress.streetLine1 ?? '',
					streetLine2: shippingAddress.streetLine2 ?? '',
				};
			}
		}
		const activeCustomer = await getActiveCustomerAddressesQuery();
		if (activeCustomer?.addresses) {
			const [defaultShippingAddress] = activeCustomer.addresses.filter(
				(address: Address) => !!address.defaultShippingAddress
			);
			if (defaultShippingAddress) {
				const appStateDefaultShippingAddress = {
					city: defaultShippingAddress.city ?? '',
					company: defaultShippingAddress.company ?? '',
					country: defaultShippingAddress.country.code ?? '',
					countryCode: defaultShippingAddress.country.code ?? '',
					fullName: defaultShippingAddress.fullName ?? '',
					phoneNumber: defaultShippingAddress.phoneNumber ?? '',
					postalCode: defaultShippingAddress.postalCode ?? '',
					province: defaultShippingAddress.province ?? '',
					streetLine1: defaultShippingAddress.streetLine1 ?? '',
					streetLine2: defaultShippingAddress.streetLine2 ?? '',
				};
				appState.shippingAddress = {
					...appState.shippingAddress,
					...appStateDefaultShippingAddress,
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

			<AddressForm shippingAddress={appState.shippingAddress} />

			<div class="mt-10 border-t border-gray-200 pt-10">
				<ShippingMethodSelector appState={appState} />
			</div>

			<button
				class="bg-primary-600 hover:bg-primary-700 flex w-full items-center justify-center space-x-2 mt-24 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-300"
				onClick$={$(() => {
					if (isFormValidSignal.value) {
						const { emailAddress, firstName, lastName, phoneNumber, title } = appState.customer;
						const {
							fullName,
							streetLine1,
							streetLine2,
							company,
							city,
							province,
							postalCode,
							countryCode,
							phoneNumber: shippingAddressPhone,
							defaultShippingAddress,
							defaultBillingAddress,
						} = appState.shippingAddress;
						const createCustomerInput: CreateCustomerInput = {
							emailAddress: emailAddress ?? '',
							firstName,
							lastName,
							phoneNumber,
							title,
						};
						const createShippingInput: CreateAddressInput = {
							fullName,
							streetLine1: streetLine1 ?? '',
							streetLine2,
							company,
							city,
							province,
							postalCode,
							countryCode: countryCode ?? '',
							phoneNumber: shippingAddressPhone ?? '',
							defaultShippingAddress,
							defaultBillingAddress,
						};
						onForward$(createCustomerInput, createShippingInput);
					}
				})}
				disabled={!isFormValidSignal.value}
			>
				<LockClosedIcon />
				<span>{$localize`Proceed to payment`}</span>
			</button>
		</div>
	);
});
