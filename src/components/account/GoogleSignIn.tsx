import { $, component$, useVisibleTask$ } from '@qwik.dev/core';
import { useNavigate } from '@qwik.dev/router';
import { GOOGLE_CLIENT_ID } from '~/constants';
import { authenticateMutation } from '~/providers/shop/account/account';

/**
 * The Google Client ID is used for Google Sign-In in routes/sign-in.tsx. You can create a new one in the
 * There is no need to hide this as this is a public key.
 * You can find it in in GCP -> [Your GCP project] -> Google Auth Platform -> Client -> [Your App]
 * Also in the same place you need to set the allowed redirect URIs to your app's URL.
 */

export const GoogleSignInButton = component$(() => {
	const navigate = useNavigate();

	const googleSignInCallback = $(async (response: any) => {
		if (!response.credential) {
			console.error('Google Sign-In failed: No credential received.');
			return;
		}
		const result = await authenticateMutation({ google: { token: response.credential } });
		if (result.__typename !== 'CurrentUser') {
			console.error('Google Sign-In failed:', result.message);
			return;
		}
		navigate('/account');
	});

	useVisibleTask$(() => {
		// Check if the Google Identity Services library is already loaded
		if (!window.google?.accounts?.id) {
			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.onload = () => {
				// Initialize Google Identity Services after the script is loaded
				google.accounts.id.initialize({
					client_id: GOOGLE_CLIENT_ID,
					callback: googleSignInCallback,
				});
			};
			document.head.appendChild(script);
		} else {
			// Initialize Google Identity Services if the library is already loaded
			google.accounts.id.initialize({
				client_id: GOOGLE_CLIENT_ID,
				callback: googleSignInCallback,
			});
		}
	});

	return (
		<button
			class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
			onClick$={() => {
				// Trigger Google login flow
				window.google.accounts.id.prompt();
			}}
		>
			<img
				src="https://developers.google.com/identity/images/g-logo.png"
				alt="Google Logo"
				class="h-5 w-5 mr-2"
			/>
			Sign in with Google
		</button>
	);
});
