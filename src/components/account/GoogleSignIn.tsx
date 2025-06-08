import { $, component$, useVisibleTask$ } from '@qwik.dev/core';
import { useNavigate } from '@qwik.dev/router';
import { authenticateMutation } from '~/providers/shop/account/account';

/**
 * GoogleSignInButton component
 *
 * The Google Client ID is used for Google Sign-In in routes/sign-in.tsx.
 * You can create a new one in the GCP console -> [Your GCP project] -> Google Auth Platform -> Clients
 * Also in the same place you need to set the allowed redirect URIs to your app's URL.
 *
 * Note that There is no need to hide this as this is a public key.
 * However you can define it in `.env` with key `VITE_GOOGLE_CLIENT_ID` (Note VITE_ prefix is required for Vite to expose it to the client-side code),
 * Then edit `src/env.ts` and `src/constants.ts` so you can use it in your app.
 */
export const GoogleSignInButton = component$((props: { googleClientId: string }) => {
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
					client_id: props.googleClientId,
					callback: googleSignInCallback,
				});
			};
			document.head.appendChild(script);
		} else {
			// Initialize Google Identity Services if the library is already loaded
			google.accounts.id.initialize({
				client_id: props.googleClientId,
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
