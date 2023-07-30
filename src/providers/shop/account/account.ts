import gql from 'graphql-tag';
import {
	LoginMutation,
	LogoutMutation,
	RegisterCustomerAccountMutation,
	RegisterCustomerAccountMutationVariables,
	RequestPasswordResetMutation,
	ResetPasswordMutation,
	Success,
	UpdateCustomerEmailAddressMutation,
	UpdateCustomerInput,
	VerifyCustomerAccountMutation,
} from '~/generated/graphql';
import { shopSdk } from '~/graphql-wrapper';

export const loginMutation = async (
	email: string,
	password: string,
	rememberMe: boolean
): Promise<LoginMutation> => {
	return shopSdk.login({ email, password, rememberMe });
};

export const logoutMutation = async (): Promise<Success> => {
	return shopSdk.logout().then((res: LogoutMutation) => res.logout as Success);
};

export const registerCustomerAccountMutation = async (
	variables: RegisterCustomerAccountMutationVariables
): Promise<RegisterCustomerAccountMutation> => {
	return shopSdk.registerCustomerAccount(variables);
};

export const verifyCustomerAccountMutation = async (
	token: string,
	password?: string
): Promise<VerifyCustomerAccountMutation> => {
	return shopSdk.verifyCustomerAccount({ token, password });
};

export const updateCustomerMutation = async (input: UpdateCustomerInput) => {
	return shopSdk.updateCustomer({ input });
};

export const requestUpdateCustomerEmailAddressMutation = async (
	password: string,
	newEmailAddress: string
) => {
	return shopSdk.requestUpdateCustomerEmailAddress({ password, newEmailAddress });
};

export const updateCustomerEmailAddressMutation = async (token: string) => {
	return shopSdk
		.updateCustomerEmailAddress({ token })
		.then((res: UpdateCustomerEmailAddressMutation) => res.updateCustomerEmailAddress);
};

export const resetPasswordMutation = async (token: string, password: string) => {
	return shopSdk
		.resetPassword({ token, password })
		.then((res: ResetPasswordMutation) => res.resetPassword);
};

export const requestPasswordResetMutation = (emailAddress: string) => {
	return shopSdk
		.requestPasswordReset({ emailAddress })
		.then((res: RequestPasswordResetMutation) => res.requestPasswordReset);
};

gql`
	mutation login($email: String!, $password: String!, $rememberMe: Boolean) {
		login(username: $email, password: $password, rememberMe: $rememberMe) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation logout {
		logout {
			success
		}
	}
`;

gql`
	mutation registerCustomerAccount($input: RegisterCustomerInput!) {
		registerCustomerAccount(input: $input) {
			__typename
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation verifyCustomerAccount($token: String!, $password: String) {
		verifyCustomerAccount(token: $token, password: $password) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation updateCustomer($input: UpdateCustomerInput!) {
		updateCustomer(input: $input) {
			__typename
		}
	}
`;

gql`
	mutation requestUpdateCustomerEmailAddress($password: String!, $newEmailAddress: String!) {
		requestUpdateCustomerEmailAddress(password: $password, newEmailAddress: $newEmailAddress) {
			__typename
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation updateCustomerEmailAddress($token: String!) {
		updateCustomerEmailAddress(token: $token) {
			__typename
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation resetPassword($token: String!, $password: String!) {
		resetPassword(token: $token, password: $password) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation requestPasswordReset($emailAddress: String!) {
		requestPasswordReset(emailAddress: $emailAddress) {
			__typename
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
