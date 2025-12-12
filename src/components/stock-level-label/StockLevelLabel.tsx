import { component$ } from '@builder.io/qwik';

export type StockLevel = 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';

export default component$<{ stockLevel?: string }>(({ stockLevel }) => {
	let stockLevelLabel = '';
	let badgeClasses = 'bg-gray-100 text-gray-800';
	switch (stockLevel as StockLevel) {
		case 'IN_STOCK':
			stockLevelLabel = $localize`In stock`;
			badgeClasses = 'bg-green-100 text-green-800';
			break;
		case 'OUT_OF_STOCK':
			stockLevelLabel = $localize`Out of stock`;
			badgeClasses = 'bg-red-100 text-red-800';
			break;
		case 'LOW_STOCK':
			stockLevelLabel = $localize`Low stock`;
			badgeClasses = 'bg-yellow-100 text-yellow-800';
			break;
	}
	return (
		<span
			class={'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ' + badgeClasses}
		>
			{stockLevelLabel}
		</span>
	);
});
