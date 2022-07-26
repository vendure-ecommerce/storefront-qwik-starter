import { createContext } from '@builder.io/qwik';
import { ActiveOrder, Collection } from './types';

export const APP_STATE = createContext<{
	collections: Collection[];
	activeOrder: ActiveOrder;
	showCart: boolean;
}>('app_state');

export const AUTH_TOKEN = 'AUTH_TOKEN';
