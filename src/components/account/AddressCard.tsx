import { component$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { deleteCustomerAddressMutation } from '~/graphql/mutations';
import { ShippingAddress } from '~/types';
import { execute } from '~/utils/api';
import { Button } from '../buttons/Button';
import { HighlightedButton } from '../buttons/HighlightedButton';
import PencilIcon from '../icons/PencilIcon';
import XCircleIcon from '../icons/XCircleIcon';

type IProps = {
	address: ShippingAddress;
};

export default component$<IProps>(({ address }) => {
	const navigate = useNavigate();

	return (
		<div class="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden my-4">
			<div class="py-4 px-6">
				<h1 class="text-2xl font-semibold text-gray-800">
					{address.fullName}{' '}
					{address.company && <span class="py-2 text-lg text-gray-700"> - {address.company}</span>}
				</h1>
				<p class="py-2 text-lg text-gray-700">{address.streetLine1}</p>
				<p class="text-lg text-gray-700">{address.streetLine2}&nbsp;</p>

				<div class="flex items-center mt-4 text-gray-700">
					<svg class="h-6 w-6 fill-current" viewBox="0 0 512 512">
						<path d="M256 32c-88.004 0-160 70.557-160 156.801C96 306.4 256 480 256 480s160-173.6 160-291.199C416 102.557 344.004 32 256 32zm0 212.801c-31.996 0-57.144-24.645-57.144-56 0-31.357 25.147-56 57.144-56s57.144 24.643 57.144 56c0 31.355-25.148 56-57.144 56z" />
					</svg>
					<h1 class="px-2 text-sm">
						{address.city}, {address.province}
					</h1>
				</div>
				<div class="flex items-center mt-4 mb-4 text-gray-700">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
						/>
					</svg>
					<h1 class="px-2 text-sm">{address.phoneNumber}</h1>
				</div>
				<div class="flex justify-around">
					<HighlightedButton
						onClick$={() => {
							navigate(`/account/address-book/${address.id}`);
						}}
					>
						<PencilIcon /> &nbsp; Edit
					</HighlightedButton>
					<Button
						onClick$={async () => {
							if (address.id) {
								await execute<{
									id: string;
								}>(deleteCustomerAddressMutation(address.id));
								navigate();
							}
						}}
					>
						<XCircleIcon /> &nbsp; Delete
					</Button>
				</div>
			</div>
		</div>
	);
});
