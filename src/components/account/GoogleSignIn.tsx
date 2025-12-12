import { $, component$, useOnDocument, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
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
	const isLoading = useSignal(false);
	const errorMessage = useSignal('');

	const googleSignInCallback = $(async (response: any) => {
		if (!response.credential) {
			errorMessage.value = 'Google Sign-In failed: No credential received';
			isLoading.value = false;
			return;
		}
		// The GraphQL AuthenticationInput generated type doesn't include a
		// federated 'google' field. Cast to any so we can continue iterating on
		// the migration; a proper server-side integration should be implemented
		// to accept Google tokens (or exchange them) instead of relying on
		// this shape.
		const result = await authenticateMutation({ google: { token: response.credential } } as any);
		if (result.__typename !== 'CurrentUser') {
			errorMessage.value = `Google Sign-In failed: ${result.message}`;
			isLoading.value = false;
			return;
		}
		isLoading.value = false;
		navigate('/account');
	});

	const googleSignInInitOptions = {
		client_id: props.googleClientId,
		callback: googleSignInCallback,
		auto_select: true,
		use_fedcm_for_prompt: true,
		use_fedcm_for_button: true,
	};

	// useVisibleTask will run on the browser after rendering, as we need to do DOM manipulation.
	// This is runs on the client only, and will not block rendering.
	// see https://qwik.dev/docs/components/tasks/#usevisibletask
	// https://qwik.dev/docs/guides/best-practices/#register-dom-events-with-useon-useonwindow-or-useondocument
	// useOnDocument is used to register the event listener on the document, which is considered better than useVisibleTask for this case.
	useOnDocument(
		'DOMContentLoaded',
		$(() => {
			// Check if the Google Identity Services library is already loaded
			// Reference: https://developers.google.com/identity/gsi/web/reference/js-reference
			const g = (window as any).google;
			if (!g?.accounts?.id) {
				const script = document.createElement('script');
				script.src = 'https://accounts.google.com/gsi/client';
				script.async = true;
				script.onload = () => {
					// Initialize Google Identity Services after the script is loaded
					const gg = (window as any).google;
					gg.accounts.id.initialize(googleSignInInitOptions);

					// Render the Google Sign-In button
					const buttonContainer = document.getElementById('google-signin-button');
					if (buttonContainer) {
						gg.accounts.id.renderButton(buttonContainer, {
							theme: 'outline',
							size: 'large',
							type: 'standard',
						});
					}
				};
				document.head.appendChild(script);
			} else {
				// Initialize Google Identity Services if the library is already loaded
				g.accounts.id.initialize(googleSignInInitOptions);

				// Render the Google Sign-In button
				const buttonContainer = document.getElementById('google-signin-button');
				if (buttonContainer) {
					g.accounts.id.renderButton(buttonContainer, {
						theme: 'outline',
						size: 'large',
						type: 'standard',
					});
				}
			}
		})
	);

	return (
		<div>
			<div
				id="google-signin-button"
				class="flex justify-center"
				onClick$={() => {
					if (!isLoading.value) {
						isLoading.value = true;
						const gg = (window as any).google;
						if (
							gg &&
							gg.accounts &&
							gg.accounts.id &&
							typeof gg.accounts.id.prompt === 'function'
						) {
							gg.accounts.id.prompt();
						}
					}
				}}
			></div>
			{errorMessage.value && <div class="mt-2 text-red-600 text-sm">{errorMessage.value}</div>}
		</div>
	);
});
