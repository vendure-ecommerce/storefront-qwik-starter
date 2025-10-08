import {
	$,
	component$,
	QRL,
	useContext,
	useSignal,
	useTask$,
	useVisibleTask$,
} from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { CreateAddressInput, CreateCustomerInput } from '~/generated/graphql';
import {
	getActiveOrderQuery,
	setOrderShippingAddressMutation,
} from '~/providers/shop/orders/order';
import { ShippingAddress } from '~/types';
import { isActiveCustomerValid, isShippingAddressValid } from '~/utils';
import { HighlightedButton } from '../buttons/HighlightedButton';
import CartContents from '../cart-contents/CartContents';
import CartTotals from '../cart-totals/CartTotals';
import AddressInformation from '../checkout/AddressInformation';
import ContactCard from '../checkout/ContactCard';
import { parseToShippingAddress } from '../common/address';
import Info from '../common/Info';
import SectionWithLabel from '../common/SectionWithLabel';
import LockClosedIcon from '../icons/LockClosedIcon';
import ShippingMethodSelectorV2 from '../shipping-method-selector/ShippingMethodSelectorV2';

type IProps = {
	onForward$: QRL<(customer: CreateCustomerInput) => Promise<void>>;
};

export default component$<IProps>(({ onForward$ }) => {
	const appState = useContext(APP_STATE);
	const isFormValidSignal = useSignal(false);
	const reCalculateShipping = useSignal(true);
	const orderLineReadyToProceed = useSignal(true);

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
		}
		if (activeOrder?.shippingAddress) {
			const orderShippingAddress = activeOrder.shippingAddress;
			if (orderShippingAddress) {
				appState.shippingAddress = parseToShippingAddress(orderShippingAddress);
			}
			console.warn(
				'Getting shipping address from active order',
				JSON.stringify(appState.shippingAddress, null, 2)
			);
		}
	});

	useVisibleTask$(async ({ track }) => {
		// Track changes to shipping address and trigger recalculation
		track(() => appState.shippingAddress);
		const addressToOrder = parseShippingAddressToCreateAddressInput(appState.shippingAddress);
		await setOrderShippingAddressMutation(addressToOrder);
		reCalculateShipping.value = true;
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
				<SectionWithLabel label={$localize`Contact information`}>
					<ContactCard
						onEditSave$={async (emailAddress, firstName, lastName) => {
							appState.customer.emailAddress = emailAddress;
							appState.customer.firstName = firstName;
							appState.customer.lastName = lastName;
						}}
					/>
				</SectionWithLabel>

				<SectionWithLabel label={$localize`Shipping information`} topBorder={true}>
					<AddressInformation />
				</SectionWithLabel>
			</div>
			<div class="mt-10 lg:mt-0">
				<SectionWithLabel label={$localize`Order summary`}>
					<CartContents
						readyToProceedSignal={orderLineReadyToProceed}
						onOrderLineChange$={async () => {
							reCalculateShipping.value = true;
						}}
					/>
				</SectionWithLabel>

				{/* Delivery Method */}

				<SectionWithLabel label={$localize`Delivery method`} topBorder={true}>
					<ShippingMethodSelectorV2 reCalculateShipping$={reCalculateShipping} />
				</SectionWithLabel>

				{!reCalculateShipping.value && (
					<SectionWithLabel>
						<CartTotals order={appState.activeOrder} />
					</SectionWithLabel>
				)}

				<div class="relative">
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
						disabled={
							!isFormValidSignal.value ||
							reCalculateShipping.value ||
							!orderLineReadyToProceed.value
						}
					>
						<div class="flex items-center space-x-4">
							<LockClosedIcon />
							<p>{$localize`Proceed to payment`}</p>
						</div>
					</HighlightedButton>
					{!isFormValidSignal.value ||
					reCalculateShipping.value ||
					!orderLineReadyToProceed.value ? (
						<div class="absolute -top-4 -left-2">
							<Info
								text={
									!isFormValidSignal.value
										? $localize`Please complete the Contact and Shipping information`
										: reCalculateShipping.value
											? $localize`Please wait until shipping method is ready`
											: !orderLineReadyToProceed.value
												? $localize`Please update your cart before proceeding to payment`
												: ''
								}
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
});

/**
 * remove `id` , `country`, `defaultShippingAddress` and `defaultBillingAddress` from Address
 * @param address - ShippingAddress
 * @returns
 */
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
