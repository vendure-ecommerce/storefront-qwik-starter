import { sdk } from '~/graphql-wrapper';
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

export const loginMutation = async (
	email: string,
	password: string,
	rememberMe: boolean
): Promise<LoginMutation> => {
	return sdk.login({ email, password, rememberMe });
};

export const logoutMutation = async (): Promise<Success> => {
	return sdk.logout().then((res: LogoutMutation) => res.logout as Success);
};

export const registerCustomerAccountMutation = async (
	variables: RegisterCustomerAccountMutationVariables
): Promise<RegisterCustomerAccountMutation> => {
	return sdk.registerCustomerAccount(variables);
};

export const verifyCustomerAccountMutation = async (
	token: string,
	password?: string
): Promise<VerifyCustomerAccountMutation> => {
	return sdk.verifyCustomerAccount({ token, password });
};

export const updateCustomerMutation = async (input: UpdateCustomerInput) => {
	return sdk.updateCustomer({ input });
};

export const requestUpdateCustomerEmailAddressMutation = async (
	password: string,
	newEmailAddress: string
) => {
	return sdk.requestUpdateCustomerEmailAddress({ password, newEmailAddress });
};

export const updateCustomerEmailAddressMutation = async (token: string) => {
	return sdk
		.updateCustomerEmailAddress({ token })
		.then((res: UpdateCustomerEmailAddressMutation) => res.updateCustomerEmailAddress);
};

export const resetPasswordMutation = async (token: string, password: string) => {
	return sdk
		.resetPassword({ token, password })
		.then((res: ResetPasswordMutation) => res.resetPassword);
};

export const requestPasswordResetMutation = (emailAddress: string) => {
	return sdk
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
