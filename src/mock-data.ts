export const collections = [
	{
		id: '2',
		name: 'Electronics',
		slug: 'electronics',
		parent: { name: '__root_collection__' },
		featuredAsset: {
			id: '16',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/5b/jakob-owens-274337-unsplash__preview.jpg',
		},
	},
	{
		id: '3',
		name: 'Computers',
		slug: 'computers',
		parent: { name: 'Electronics' },
		featuredAsset: {
			id: '5',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/9c/alexandru-acea-686569-unsplash__preview.jpg',
		},
	},
	{
		id: '6',
		name: 'Furniture',
		slug: 'furniture',
		parent: { name: 'Home & Garden' },
		featuredAsset: {
			id: '46',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/69/nathan-fertig-249917-unsplash__preview.jpg',
		},
	},
	{
		id: '9',
		name: 'Equipment',
		slug: 'equipment',
		parent: { name: 'Sports & Outdoor' },
		featuredAsset: {
			id: '23',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/4f/neonbrand-428982-unsplash__preview.jpg',
		},
	},
	{
		id: '4',
		name: 'Camera & Photo',
		slug: 'camera-photo',
		parent: { name: 'Electronics' },
		featuredAsset: {
			id: '12',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/b5/eniko-kis-663725-unsplash__preview.jpg',
		},
	},
	{
		id: '5',
		name: 'Home & Garden',
		slug: 'home-garden',
		parent: { name: '__root_collection__' },
		featuredAsset: {
			id: '47',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/3e/paul-weaver-1120584-unsplash__preview.jpg',
		},
	},
	{
		id: '7',
		name: 'Plants',
		slug: 'plants',
		parent: { name: 'Home & Garden' },
		featuredAsset: {
			id: '37',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/5b/alex-rodriguez-santibanez-200278-unsplash__preview.jpg',
		},
	},
	{
		id: '10',
		name: 'Footwear',
		slug: 'footwear',
		parent: { name: 'Sports & Outdoor' },
		featuredAsset: {
			id: '32',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/a2/thomas-serer-420833-unsplash__preview.jpg',
		},
	},
	{
		id: '8',
		name: 'Sports & Outdoor',
		slug: 'sports-outdoor',
		parent: { name: '__root_collection__' },
		featuredAsset: {
			id: '24',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/96/michael-guite-571169-unsplash__preview.jpg',
		},
	},
];

export const footerCollections = [
	{
		id: '2',
		name: 'Electronics',
		slug: 'electronics',
		parent: { name: '__root_collection__' },
		featuredAsset: {
			id: '16',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/5b/jakob-owens-274337-unsplash__preview.jpg',
		},
	},
	{
		id: '5',
		name: 'Home & Garden',
		slug: 'home-garden',
		parent: { name: '__root_collection__' },
		featuredAsset: {
			id: '47',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/3e/paul-weaver-1120584-unsplash__preview.jpg',
		},
	},
	{
		id: '8',
		name: 'Sports & Outdoor',
		slug: 'sports-outdoor',
		parent: { name: '__root_collection__' },
		featuredAsset: {
			id: '24',
			preview:
				'https://readonlydemo.vendure.io/assets/preview/96/michael-guite-571169-unsplash__preview.jpg',
		},
	},
];

export const headerData = {
	activeCustomer: { activeCustomer: null, _headers: {} },
	activeChannel: { id: '1', currencyCode: 'USD' },
	collections: [
		{
			id: '2',
			name: 'Electronics',
			slug: 'electronics',
			parent: { name: '__root_collection__' },
			featuredAsset: {
				id: '16',
				preview:
					'https://readonlydemo.vendure.io/assets/preview/5b/jakob-owens-274337-unsplash__preview.jpg',
			},
		},
		{
			id: '5',
			name: 'Home & Garden',
			slug: 'home-garden',
			parent: { name: '__root_collection__' },
			featuredAsset: {
				id: '47',
				preview:
					'https://readonlydemo.vendure.io/assets/preview/3e/paul-weaver-1120584-unsplash__preview.jpg',
			},
		},
		{
			id: '8',
			name: 'Sports & Outdoor',
			slug: 'sports-outdoor',
			parent: { name: '__root_collection__' },
			featuredAsset: {
				id: '24',
				preview:
					'https://readonlydemo.vendure.io/assets/preview/96/michael-guite-571169-unsplash__preview.jpg',
			},
		},
	],
};
