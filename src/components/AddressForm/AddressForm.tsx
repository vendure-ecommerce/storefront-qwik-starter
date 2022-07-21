import { component$ } from '@builder.io/qwik';

export default component$<{
	address?: any | null;
	defaultFullName?: string;
	availableCountries?: any;
}>(({ address, defaultFullName, availableCountries }) => {
	return <>abc</>;
});
