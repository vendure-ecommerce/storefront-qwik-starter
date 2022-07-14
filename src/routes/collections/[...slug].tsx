import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CollectionCard from '~/components/collection-card/collection-card';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';

export const collection = {
  id: '2',
  name: 'Electronics',
  slug: 'electronics',
  breadcrumbs: [
    { id: '1', name: '__root_collection__', slug: '__root_collection__' },
    { id: '2', name: 'Electronics', slug: 'electronics' },
  ],
  children: [
    {
      id: '3',
      name: 'Computers',
      slug: 'computers',
      featuredAsset: {
        id: '5',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/9c/alexandru-acea-686569-unsplash__preview.jpg',
      },
    },
    {
      id: '4',
      name: 'Camera & Photo',
      slug: 'camera-photo',
      featuredAsset: {
        id: '12',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/b5/eniko-kis-663725-unsplash__preview.jpg',
      },
    },
  ],
};
export const result = {
  totalItems: 20,
  items: [
    {
      productId: '1',
      productName: 'Laptop',
      slug: 'laptop',
      productAsset: {
        id: '1',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/71/derick-david-409858-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 155880, max: 275880 },
    },
    {
      productId: '2',
      productName: 'Tablet',
      slug: 'tablet',
      productAsset: {
        id: '2',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/b8/kelly-sikkema-685291-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 39480, max: 53400 },
    },
    {
      productId: '3',
      productName: 'Wireless Optical Mouse',
      slug: 'cordless-mouse',
      productAsset: {
        id: '3',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/a1/oscar-ivan-esquivel-arteaga-687447-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 2279, max: 2279 },
    },
    {
      productId: '4',
      productName: '32-Inch Monitor',
      slug: '32-inch-monitor',
      productAsset: {
        id: '4',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/d2/daniel-korpai-1302051-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 37200, max: 37200 },
    },
    {
      productId: '5',
      productName: 'Curvy Monitor',
      slug: 'curvy-monitor',
      productAsset: {
        id: '5',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/9c/alexandru-acea-686569-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 17249, max: 20393 },
    },
    {
      productId: '6',
      productName: 'High Performance RAM',
      slug: 'high-performance-ram',
      productAsset: {
        id: '6',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/58/liam-briese-1128307-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 16542, max: 33817 },
    },
    {
      productId: '7',
      productName: 'Gaming PC',
      slug: 'gaming-pc',
      productAsset: {
        id: '7',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/5a/florian-olivo-1166419-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 111744, max: 131994 },
    },
    {
      productId: '8',
      productName: 'Hard Drive',
      slug: 'hard-drive',
      productAsset: {
        id: '8',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/96/vincent-botta-736919-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 4559, max: 16122 },
    },
    {
      productId: '9',
      productName: 'Clacky Keyboard',
      slug: 'clacky-keyboard',
      productAsset: {
        id: '9',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/09/juan-gomez-674574-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 8987, max: 8987 },
    },
    {
      productId: '10',
      productName: 'Ethernet Cable',
      slug: 'ethernet-cable',
      productAsset: {
        id: '10',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/7b/thomas-q-1229169-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 716, max: 716 },
    },
    {
      productId: '11',
      productName: 'USB Cable',
      slug: 'usb-cable',
      productAsset: {
        id: '11',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/64/adam-birkett-239153-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 8280, max: 8280 },
    },
    {
      productId: '12',
      productName: 'Instant Camera',
      slug: 'instant-camera',
      productAsset: {
        id: '12',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/b5/eniko-kis-663725-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 20999, max: 20999 },
    },
    {
      productId: '13',
      productName: 'Camera Lens',
      slug: 'camera-lens',
      productAsset: {
        id: '13',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/9b/brandi-redd-104140-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 12480, max: 12480 },
    },
    {
      productId: '14',
      productName: 'Vintage Folding Camera',
      slug: 'vintage-folding-camera',
      productAsset: {
        id: '14',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/3c/jonathan-talbert-697262-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 642000, max: 642000 },
    },
    {
      productId: '15',
      productName: 'Tripod',
      slug: 'tripod',
      productAsset: {
        id: '15',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/21/zoltan-tasi-423051-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 1798, max: 1798 },
    },
    {
      productId: '16',
      productName: 'Instamatic Camera',
      slug: 'instamatic-camera',
      productAsset: {
        id: '16',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/5b/jakob-owens-274337-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 2400, max: 2400 },
    },
    {
      productId: '17',
      productName: 'Compact Digital Camera',
      slug: 'compact-digital-camera',
      productAsset: {
        id: '17',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/bc/patrick-brinksma-663044-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 107999, max: 107999 },
    },
    {
      productId: '18',
      productName: 'Nikkormat SLR Camera',
      slug: 'nikkormat-slr-camera',
      productAsset: {
        id: '18',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/95/chuttersnap-324234-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 73800, max: 73800 },
    },
    {
      productId: '19',
      productName: 'Compact SLR Camera',
      slug: 'compact-slr-camera',
      productAsset: {
        id: '19',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/9d/robert-shunev-528016-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 62520, max: 62520 },
    },
    {
      productId: '20',
      productName: 'Twin Lens Camera',
      slug: 'twin-lens-camera',
      productAsset: {
        id: '20',
        preview:
          'https://readonlydemo.vendure.io/assets/preview/ef/alexander-andrews-260988-unsplash__preview.jpg',
      },
      currencyCode: 'USD',
      priceWithTax: { min: 95880, max: 95880 },
    },
  ],
  facetValues: [
    {
      count: 20,
      facetValue: { id: '1', name: 'Electronics', facet: { id: '1', name: 'category' } },
    },
    { count: 11, facetValue: { id: '2', name: 'Computers', facet: { id: '1', name: 'category' } } },
    { count: 2, facetValue: { id: '3', name: 'Apple', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '4', name: 'Logitech', facet: { id: '2', name: 'brand' } } },
    { count: 2, facetValue: { id: '5', name: 'Samsung', facet: { id: '2', name: 'brand' } } },
    { count: 2, facetValue: { id: '6', name: 'Corsair', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '7', name: 'ADMI', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '8', name: 'Seagate', facet: { id: '2', name: 'brand' } } },
    { count: 9, facetValue: { id: '9', name: 'Photo', facet: { id: '1', name: 'category' } } },
    { count: 1, facetValue: { id: '10', name: 'Polaroid', facet: { id: '2', name: 'brand' } } },
    { count: 2, facetValue: { id: '11', name: 'Nikkon', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '12', name: 'Agfa', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '13', name: 'Manfrotto', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '14', name: 'Kodak', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '15', name: 'Sony', facet: { id: '2', name: 'brand' } } },
    { count: 1, facetValue: { id: '16', name: 'Rolleiflex', facet: { id: '2', name: 'brand' } } },
  ],
};

export default component$(() => {
  const { pathname, params } = useLocation();

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
          {collection.name}
        </h2>

        <FiltersButton filterCount={1} onClick={() => console.log('ping')} />
      </div>
      <Breadcrumbs items={collection.breadcrumbs}></Breadcrumbs>
      {collection.children?.length ? (
        <div className="max-w-2xl mx-auto py-16 sm:py-16 lg:max-w-none border-b mb-16">
          <h2 className="text-2xl font-light text-gray-900">Collections</h2>
          <div className="mt-6 grid max-w-xs sm:max-w-none mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {collection.children.map((child) => (
              <CollectionCard key={child.id} collection={child}></CollectionCard>
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="mt-6 grid sm:grid-cols-5 gap-x-4">
        {/* <FacetFilterControls
          facetFilterTracker={facetValuesTracker.current}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        /> */}
        <div className="sm:col-span-5 lg:col-span-4">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {result.items.map((item) => (
              <ProductCard key={item.productId} {...item}></ProductCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
