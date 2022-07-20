import { component$ } from '@builder.io/qwik';
import { removeOrderLineQuery } from '~/graphql/mutations';
import { CurrencyCode, Line } from '~/types';
import { sendQuery } from '~/utils/api';
import Price from '../products/Price';

type IProps = {
	orderLines: Line[];
	currencyCode: CurrencyCode;
	editable: boolean;
	adjustOrderLine?: (lineId: string, quantity: number) => void;
	removeItem?: (lineId: string) => void;
};

export default component$<IProps>(({ orderLines, currencyCode, editable }) => {
	const isEditable = editable !== false;
	return (
		<div className="flow-root">
			<ul role="list" className="-my-6 divide-y divide-gray-200">
				{(orderLines ?? []).map((line) => (
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
										<a href={`/products/${line.productVariant.product.slug}`}>
											{line.productVariant.name}
										</a>
									</h3>
									<Price
										priceWithTax={line.linePriceWithTax}
										currencyCode={currencyCode}
										className={'ml-4'}
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
											// onChange={(e) => adjustOrderLine && adjustOrderLine(line.id, +e.target.value)}
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
											type="submit"
											name="removeItem"
											value={line.id}
											className="font-medium text-primary-600 hover:text-primary-500"
											onClick$={() => sendQuery(removeOrderLineQuery(line.id))}
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
