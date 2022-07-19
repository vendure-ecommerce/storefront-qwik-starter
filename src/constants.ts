import { createContext } from '@builder.io/qwik';
import { Collection } from './types';

export const COLLECTIONS = createContext<{ collections: Collection[] }>('collections');
