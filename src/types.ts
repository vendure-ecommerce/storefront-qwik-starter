export type ICollection = {
	id: string;
	slug: string;
	name: string;
	parent?: { name: '__root_collection__' };
	featuredAsset: { id: string; preview: string };
};
