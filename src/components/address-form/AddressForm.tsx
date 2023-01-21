import { $, component$, QwikChangeEvent, useContext } from '@builder.io/qwik';
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
							First name
						</label>
						<div class="mt-1">
							<input
								type="text"
								id="fullName"
								name="fullName"
								value={shippingAddress.fullName}
								autoComplete="given-name"
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={$((e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										fullName: e.target.value,
									};
								})}
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="company" class="block text-sm font-medium text-gray-700">
							Company
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="company"
								id="company"
								value={shippingAddress.company}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										company: e.target.value,
									};
								}}
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="streetLine1" class="block text-sm font-medium text-gray-700">
							Address
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="streetLine1"
								id="streetLine1"
								value={shippingAddress.streetLine1}
								autoComplete="street-address"
								onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										streetLine1: e.target.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="streetLine2" class="block text-sm font-medium text-gray-700">
							Apartment, suite, etc.
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="streetLine2"
								id="streetLine2"
								value={shippingAddress.streetLine2}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										streetLine2: e.target.value,
									};
								}}
							/>
						</div>
					</div>

					<div>
						<label html-for="city" class="block text-sm font-medium text-gray-700">
							City
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="city"
								id="city"
								autoComplete="address-level2"
								value={shippingAddress.city}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = { ...appState.shippingAddress, city: e.target.value };
								}}
							/>
						</div>
					</div>

					<div>
						<label html-for="countryCode" class="block text-sm font-medium text-gray-700">
							Country
						</label>
						<div class="mt-1">
							{appState.availableCountries && (
								<select
									id="countryCode"
									name="countryCode"
									value={shippingAddress.countryCode}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									onChange$={(e: QwikChangeEvent<HTMLSelectElement>) => {
										appState.shippingAddress = {
											...appState.shippingAddress,
											countryCode: e.target.value,
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
							State / Province
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="province"
								id="province"
								value={shippingAddress.province}
								autoComplete="address-level1"
								onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										province: e.target.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<label html-for="postalCode" class="block text-sm font-medium text-gray-700">
							Postal code
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="postalCode"
								id="postalCode"
								value={shippingAddress.postalCode}
								autoComplete="postal-code"
								onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										postalCode: e.target.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>

					<div class="sm:col-span-2">
						<label html-for="phoneNumber" class="block text-sm font-medium text-gray-700">
							Phone
						</label>
						<div class="mt-1">
							<input
								type="text"
								name="phoneNumber"
								id="phoneNumber"
								value={shippingAddress.phoneNumber}
								autoComplete="tel"
								onChange$={(e: QwikChangeEvent<HTMLInputElement>) => {
									appState.shippingAddress = {
										...appState.shippingAddress,
										phoneNumber: e.target.value,
									};
								}}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});
