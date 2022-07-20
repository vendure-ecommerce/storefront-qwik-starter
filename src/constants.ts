import { createContext } from '@builder.io/qwik';
import { ActiveOrder, Collection } from './types';

export const COLLECTIONS = createContext<{ collections: Collection[] }>('collections');
export const ACTIVE_ORDER = createContext<{ activeOrder?: ActiveOrder }>('activeOrder');
