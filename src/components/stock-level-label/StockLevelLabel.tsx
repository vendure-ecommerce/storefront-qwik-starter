import { component$ } from '@builder.io/qwik';

export type StockLevel = 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';

export default component$<{ stockLevel?: string }>(({ stockLevel }) => {
	let stockLevelLabel = '';
	let badgeClasses = '';
	switch (stockLevel as StockLevel) {
		case 'IN_STOCK':
			stockLevelLabel = $localize`In stock`;
			badgeClasses = 'badge-success';
			break;
		case 'OUT_OF_STOCK':
			stockLevelLabel = $localize`Out of stock`;
			badgeClasses = 'badge-error';
			break;
		case 'LOW_STOCK':
			stockLevelLabel = $localize`Low stock`;
			badgeClasses = 'badge-warning';
			break;
	}
	return <div class={'badge badge-outline ' + badgeClasses}>{stockLevelLabel}</div>;
});
