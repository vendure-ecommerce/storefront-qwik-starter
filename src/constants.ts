import { createContext } from '@builder.io/qwik';
import { AppState } from './types';

export const APP_STATE = createContext<AppState>('app_state');

export const AUTH_TOKEN = 'authToken';
