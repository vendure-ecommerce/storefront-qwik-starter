interface IndividualPasswordValidationResult {
	isValid: boolean;
	errorMessage?: string;
}

export interface OverallPasswordValidationResult {
	isValid: boolean;
	errorMessages: string[];
}

const COMMON_PASSWORDS = ['password', '1234567', 'qwerty', 'abc123', '111111', 'welcome'];

const hasNumber = (password: string): IndividualPasswordValidationResult => {
	const regex = /\d/;
	if (!regex.test(password)) {
		return {
			isValid: false,
			errorMessage: 'Must contain at least one number.',
		};
	}
	return { isValid: true };
};

const hasSpecialChar = (password: string): IndividualPasswordValidationResult => {
	const regex = /[!@#$%^&*()_+[\]{}|;':",.<>?]/;
	if (!regex.test(password)) {
		return {
			isValid: false,
			errorMessage: 'Must contain at least one special character.',
		};
	}
	return { isValid: true };
};

const isLongEnough = (password: string): IndividualPasswordValidationResult => {
	if (password.length < 8) {
		return {
			isValid: false,
			errorMessage: 'Must be at least 8 characters long.',
		};
	}
	return { isValid: true };
};
const isCommonPassword = (password: string): IndividualPasswordValidationResult => {
	if (COMMON_PASSWORDS.includes(password)) {
		return {
			isValid: false,
			errorMessage: 'Must not contain common password.',
		};
	}
	return { isValid: true };
};

const containsEmail = (password: string, email?: string): IndividualPasswordValidationResult => {
	// if no email is provided, we will just check if the password contains '.+@\w+\.\w+'
	if (!email) {
		const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
		if (emailRegex.test(password)) {
			return {
				isValid: false,
				errorMessage: 'Must not contain an email address.',
			};
		}
	}
	// if email is provided, we will check if the password contains the email
	else {
		const emailRegex = new RegExp(email?.replace(/@/g, '@'), 'i');
		if (emailRegex.test(password)) {
			return {
				isValid: false,
				errorMessage: 'Must not contain the email.',
			};
		}
	}
	return { isValid: true };
};
/**
 * Function for making sure the password is strong enough
 * The password must contain:
 * - At least 8 characters
 * - At least 1 number
 * - At least 1 special character (characters: !@#$%^&*()_+[]{}|;':",./<>?)
 * - No common passwords
 * - cannot contain the email address
 * @returns IndividualPasswordValidationResult
 */
export const isStrongPassword = (
	password: string,
	email?: string
): OverallPasswordValidationResult => {
	const validations = [
		isLongEnough(password),
		hasNumber(password),
		hasSpecialChar(password),
		isCommonPassword(password),
		containsEmail(password, email),
	];

	var errorMessages: string[] = [];
	var isValid = true;
	for (const validation of validations) {
		if (!validation.isValid) {
			// concatenate error messages
			errorMessages.push(validation.errorMessage || '');
			isValid = false;
		}
	}
	if (!isValid) {
		return {
			isValid: false,
			errorMessages: errorMessages,
		};
	}
	return { isValid: true, errorMessages: [] };
};
