import {
	component$,
	useContextProvider,
	useServerMount$,
	useStore,
} from '@builder.io/qwik';
import { useHeadMeta, usePage } from '@builder.io/qwik-city';
import { COLLECTIONS } from '../../constants';
import { getCollectionsQuery } from '../../graphql/queries';
import NotFound from '../../layouts/not-found/not-found';
import { ICollection } from '../../types';
import { sendQuery } from '../../utils/api';

export const Page = component$(() => {
	const state = useStore<{ collections: ICollection[] }>({ collections: [] });
	useServerMount$(async () => {
		const data = await sendQuery<{ collections: { items: ICollection[] } }>(
			getCollectionsQuery
		);
		state.collections = data.collections.items;
	});
	useContextProvider(COLLECTIONS, state);
	const page = usePage();
	if (page) {
		const attrs = page.attributes;
		const Layout = page.layout;
		const Content = page.content;

		useHeadMeta({
			title: attrs.title + ' - Qwik',
			description: attrs.description,
		});

		return (
			<Layout>
				<Content />
			</Layout>
		);
	}
	return <NotFound />;
});
