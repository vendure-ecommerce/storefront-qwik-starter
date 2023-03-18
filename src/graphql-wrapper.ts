import { getSdk } from '~/generated/graphql';
import { requester } from '~/utils/api';

export const sdk = getSdk(requester);
