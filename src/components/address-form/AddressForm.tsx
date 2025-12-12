import { component$, useContext } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import { ShippingAddress } from '~/types';

type IProps = {
	shippingAddress: ShippingAddress;
};

export default component$<IProps>(({ shippingAddress }) => {
	const appState = useContext(APP_STATE);
	return (
		<div>
			{shippingAddress.countryCode && (
				<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
					<div>
						<label html-for="fullName" class="block text-sm font-medium text-gray-700">
							{$localize`Full name`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								id="fullName"
								name="fullName"
								value={shippingAddress.fullName}
								autoComplete="given-name"
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										fullName: el.value,
									};
								}}
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="company" class="block text-sm font-medium text-gray-700">
							{$localize`Company`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="company"
								id="company"
								value={shippingAddress.company}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										company: el.value,
									};
								}}
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="streetLine1" class="block text-sm font-medium text-gray-700">
							{$localize`Address`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="streetLine1"
								id="streetLine1"
								value={shippingAddress.streetLine1}
								autoComplete="street-address"
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										streetLine1: el.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="streetLine2" class="block text-sm font-medium text-gray-700">
							{$localize`Apartment, suite, etc.`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="streetLine2"
								id="streetLine2"
								value={shippingAddress.streetLine2}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										streetLine2: el.value,
									};
								}}
							/>
						</div>
					</div>

					<div>
						<label html-for="city" class="block text-sm font-medium text-gray-700">
							{$localize`City`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="city"
								id="city"
								autoComplete="address-level2"
								value={shippingAddress.city}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={(_, el) => {
									appState.shippingAddress = { ...appState.shippingAddress, city: el.value };
								}}
							/>
						</div>
					</div>

					<div>
						<label html-for="countryCode" class="block text-sm font-medium text-gray-700">
							{$localize`Country`}
						</label>
						<div class="mt-1">
							{appState.availableCountries && (
								<select
									id="countryCode"
									name="countryCode"
									value={shippingAddress.countryCode}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									onChange$={(_, el) => {
										appState.shippingAddress = {
											...appState.shippingAddress,
											countryCode: el.value,
										};
									}}
								>
									{appState.availableCountries.map((item) => (
										<option
											key={item.id}
											value={item.code}
											selected={item.code === shippingAddress.countryCode}
										>
											{item.name}
										</option>
									))}
								</select>
							)}
						</div>
					</div>

					<div>
						<label html-for="province" class="block text-sm font-medium text-gray-700">
							{$localize`State / Province`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="province"
								id="province"
								value={shippingAddress.province}
								autoComplete="address-level1"
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										province: el.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<label html-for="postalCode" class="block text-sm font-medium text-gray-700">
							{$localize`Postal code`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="postalCode"
								id="postalCode"
								value={shippingAddress.postalCode}
								autoComplete="postal-code"
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										postalCode: el.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="phoneNumber" class="block text-sm font-medium text-gray-700">
							{$localize`Phone`}
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="phoneNumber"
								id="phoneNumber"
								value={shippingAddress.phoneNumber}
								autoComplete="tel"
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										phoneNumber: el.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>
					<div class="sm:col-span-1">
						<label
							html-for="defaultShippingAddress"
							class="block text-sm font-medium text-gray-700"
						>
							{$localize`Default Shipping Address`}
						</label>
						<div class="mt-1">
							<input
								type="checkbox"
								name="defaultShippingAddress"
								id="defaultShippingAddress"
								checked={shippingAddress.defaultShippingAddress}
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										defaultShippingAddress: el.checked,
									};
								}}
							/>
						</div>
					</div>
					<div class="sm:col-span-1">
						<label html-for="defaultBillingAddress" class="block text-sm font-medium text-gray-700">
							{$localize`Default Billing Address`}
						</label>
						<div class="mt-1">
							<input
								type="checkbox"
								name="defaultBillingAddress"
								id="defaultBillingAddress"
								checked={shippingAddress.defaultBillingAddress}
								onChange$={(_, el) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										defaultBillingAddress: el.checked,
									};
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});
