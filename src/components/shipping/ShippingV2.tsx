import {
	$,
	component$,
	QRL,
	Signal,
	useContext,
	useSignal,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { CreateAddressInput, CreateCustomerInput } from '~/generated/graphql-shop';
import {
	getActiveOrderQuery,
	setCustomerForOrderMutation,
	setOrderShippingAddressMutation,
} from '~/providers/shop/orders/order';
import { ActiveCustomer, ShippingAddress } from '~/types';
import { isActiveCustomerValid, isGuestCustomer, isShippingAddressValid } from '~/utils';
import { HighlightedButton } from '../buttons/HighlightedButton';
import AddressInformation from '../checkout/AddressInformation';
import ContactCard from '../checkout/ContactCard';
import { parseToShippingAddress } from '../common/address';
import Info from '../common/Info/Info';
import SectionWithLabel from '../common/SectionWithLabel';
import LockClosedIcon from '../icons/LockClosedIcon';
import ShippingMethodSelectorV2 from '../shipping-method-selector/ShippingMethodSelectorV2';

type IProps = {
	reCalculateShipping: Signal<boolean>;
	orderLineReadyToProceed: Signal<boolean>;
	onForward$: QRL<() => Promise<void>>;
};

export default component$<IProps>(
	({ reCalculateShipping, orderLineReadyToProceed, onForward$ }) => {
		const appState = useContext(APP_STATE);
		const isFormValidSignal = useSignal(false);
		const isGuest = useSignal(false);
		const errorMessage = useSignal<string | null>(null);

		if (!appState.activeOrder?.id) {
			return <div>Loading Order...</div>;
		}

		useVisibleTask$(async () => {
			isGuest.value = isGuestCustomer(appState);
			const activeOrder = await getActiveOrderQuery();

			if (activeOrder?.customer) {
				const customer = activeOrder.customer;
				appState.customer = {
					title: customer.title ?? '',
					firstName: customer.firstName,
					// Note that if a Guest customer had submit the order but abandon the checkout halfway (didn't pay),
					// he will have a customer.id in the activeOrder. We need to override it to CUSTOMER_NOT_DEFINED_ID
					// to avoid confusion of our system. As this page uses this id to determine if the customer is a guest
					// or not.
					id: isGuest.value ? CUSTOMER_NOT_DEFINED_ID : customer.id,
					lastName: customer.lastName,
					emailAddress: customer.emailAddress,
					phoneNumber: customer.phoneNumber ?? '',
					upvoteReviewIds: [],
				};
			}
			if (activeOrder?.shippingAddress) {
				const orderShippingAddress = activeOrder.shippingAddress;
				if (orderShippingAddress) {
					appState.shippingAddress = parseToShippingAddress(orderShippingAddress);
				}
			}
		});

		useVisibleTask$(async ({ track }) => {
			// Track changes to shipping address and trigger recalculation
			track(() => appState.shippingAddress);
			if (appState.shippingAddress?.streetLine1) {
				const addressToOrder = parseShippingAddressToCreateAddressInput(appState.shippingAddress);
				await setOrderShippingAddressMutation(addressToOrder);
				reCalculateShipping.value = true;
			} else {
				reCalculateShipping.value = false;
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
				isShippingAddressValid(appState.shippingAddress) &&
				isActiveCustomerValid(appState.customer);
		});

		return (
			<div>
				{/* Contact Information */}

				<SectionWithLabel label={$localize`Contact information`}>
					<ContactCard
						onEditSave$={async (customer) => {
							appState.customer = customer;
							// Note that if the user is a guest, the customer.id should remain be CUSTOMER_NOT_DEFINED_ID
						}}
					/>
				</SectionWithLabel>

				{/* Shipping Information */}

				<SectionWithLabel label={$localize`Shipping information`} topBorder={true}>
					<AddressInformation />
				</SectionWithLabel>

				{/* Delivery Method */}

				<SectionWithLabel label={$localize`Delivery method`} topBorder={true}>
					<ShippingMethodSelectorV2
						reCalculateShipping={reCalculateShipping}
						errorMessage={errorMessage}
					/>
				</SectionWithLabel>

				<div class="relative">
					<HighlightedButton
						extraClass="mt-6 w-full"
						onClick$={$(async () => {
							const createCustomerInput = parseCustomerToCreateCustomerInput(appState.customer);
							if (isGuest.value) {
								// Note that the following will create a new customer in Customer entity and update then Order entry.
								// However, noted that I didn't do `appState.customer = setCustomerForOrder.customer`,
								// which will set appState.customer.id to the newly created customer's id.
								// I didn't do that is to avoid creating multiple customers if user goes back and forth in checkout steps.
								// since different customer.id will trigger the create customer logic again. If the customer is a guest,
								// the appState.customer.id should remain CUSTOMER_NOT_DEFINED_ID.
								// This is a trade-off between UX and data integrity. This will be a little inconvenient for Guest users only.
								// If a guest user abandons the checkout halfway, the guest will have to input their info again next time.
								const setCustomerForOrder = await setCustomerForOrderMutation(createCustomerInput);
								if (setCustomerForOrder && (setCustomerForOrder as any).__typename === 'Order') {
									onForward$();
								} else {
									errorMessage.value = $localize`Failed to create customer. Guest checkout may not be enabled. Please contact support or sign up for an account.`;
								}
							} else {
								onForward$();
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
					{(!isFormValidSignal.value ||
						reCalculateShipping.value ||
						!orderLineReadyToProceed.value) && (
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
					)}
					{errorMessage.value && (
						<div class="mt-4">
							<span class="text-red-600">{errorMessage.value}</span>
						</div>
					)}
				</div>
			</div>
		);
	}
);

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

const parseCustomerToCreateCustomerInput = (customer: ActiveCustomer): CreateCustomerInput => {
	return {
		emailAddress: customer.emailAddress ?? '',
		firstName: customer.firstName,
		lastName: customer.lastName,
		phoneNumber: customer.phoneNumber,
		title: customer.title,
	};
};
