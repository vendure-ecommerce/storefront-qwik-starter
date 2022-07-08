import { createContext } from '@builder.io/qwik';
import { ICollection } from './types';

export const COLLECTIONS = createContext<{ collections: ICollection[] }>(
	'collections'
);
