import { component$, mutable, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { APP_STATE } from '~/constants';
import { adjustOrderLineMutation, removeOrderLineMutation } from '~/graphql/mutations';
import { ActiveOrder, CurrencyCode } from '~/types';
import { execute } from '~/utils/api';
import Price from '../products/Price';

export default component$<{
	currencyCode: CurrencyCode;
	editable: boolean;
}>(({ currencyCode, editable }) => {
	const appState = useContext(APP_STATE);
	const rows = appState.activeOrder?.lines || [];
	const isEditable = editable !== false;
	return (
		<div className="flow-root">
			<ul className="-my-6 divide-y divide-gray-200">
				{(rows ?? []).map((line) => (
					<li key={line.id} className="py-6 flex">
						<div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
							<img
								src={line.featuredAsset?.preview + '?preset=thumb'}
								alt={line.productVariant.name}
								className="w-full h-full object-center object-cover"
							/>
						</div>

						<div className="ml-4 flex-1 flex flex-col">
							<div>
								<div className="flex justify-between text-base font-medium text-gray-900">
									<h3>
										<Link href={`/products/${line.productVariant.product.slug}`}>
											{line.productVariant.name}
										</Link>
									</h3>
									<Price
										priceWithTax={mutable(line.linePriceWithTax)}
										currencyCode={currencyCode}
										forcedClassName="ml-4"
									></Price>
								</div>
							</div>
							<div className="flex-1 flex items-center text-sm">
								{editable ? (
									<form>
										<label htmlFor={`quantity-${line.id}`} className="mr-2">
											Quantity
										</label>
										<select
											disabled={!isEditable}
											id={`quantity-${line.id}`}
											name={`quantity-${line.id}`}
											value={line.quantity}
											onChange$={async (e: any) => {
												const { adjustOrderLine } = await execute<{ adjustOrderLine: ActiveOrder }>(
													adjustOrderLineMutation(line.id, +e.target?.value)
												);
												appState.activeOrder = adjustOrderLine;
											}}
											className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
										>
											<option value={1}>1</option>
											<option value={2}>2</option>
											<option value={3}>3</option>
											<option value={4}>4</option>
											<option value={5}>5</option>
											<option value={6}>6</option>
											<option value={7}>7</option>
											<option value={8}>8</option>
										</select>
									</form>
								) : (
									<div className="text-gray-800">
										<span className="mr-1">Quantity</span>
										<span className="font-medium">{line.quantity}</span>
									</div>
								)}
								<div className="flex-1"></div>
								<div className="flex">
									{isEditable && (
										<button
											value={line.id}
											className="font-medium text-primary-600 hover:text-primary-500"
											onClick$={async () => {
												const { removeOrderLine } = await execute<{ removeOrderLine: ActiveOrder }>(
													removeOrderLineMutation(line.id)
												);
												appState.activeOrder = removeOrderLine;
											}}
										>
											Remove
										</button>
									)}
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
});
