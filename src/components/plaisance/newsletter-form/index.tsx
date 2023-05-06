import { component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
	const isShowForm = useSignal(false);
	return (
		<>
			<section class="py-12 lg:mt-40 lg:py-24">
				<div class="container max-w-2xl pt-5">
					<h2 class="text-center font-heading text-2xl font-bold text-white sm:text-4xl">
						Sign up to our newsletter to receive updates, exclusive discounts, and VIP access.
					</h2>
					<div class="mt-8 flex justify-center">
						<button
							onClick$={() => {
								isShowForm.value = true;
							}}
							class="btn-outline"
						>
							Count me in!
						</button>
					</div>
				</div>
			</section>
			{isShowForm.value && (
				<div
					// x-transition.opacity.duration.500ms
					x-data="newsletterForm"
					class="fixed inset-0 z-40 bg-black/95"
				>
					<form action="#" x-ref="form" class="h-full w-full">
						<button
							type="button"
							class="fixed right-4 top-4 z-50 text-white hover:text-red-600"
							onClick$={() => {
								isShowForm.value = false;
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						<div class="relative mx-auto h-full w-full max-w-3xl py-10">
							<div
								x-show="step === 'complete'"
								class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
								x-transition:enter="transition ease-out duration-500"
								x-transition:enter-start="-translate-x-full opacity-0"
								x-transition:enter-end="-translate-x-0 opacity-100"
								x-transition:leave="transition ease-in duration-300"
								x-transition:leave-start="-translate-x-0 opacity-100"
								x-transition:leave-end="-translate-x-full opacity-0"
							>
								<div>
									<p class="text-center font-heading text-lg font-bold text-white sm:text-2xl">
										You're all set. You'll see us in your inbox soon!
									</p>
									<div class="mt-2 text-center text-green-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mx-auto h-12 w-12"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<div class="mt-4 text-center">
										<button
											type="button"
											// @click.prevent="reset"
											class="btn-outline"
										>
											Return
										</button>
									</div>
								</div>
							</div>
							<div
								x-show="step === 1"
								x-trap="step === 1"
								class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
								x-transition:enter="transition ease-out duration-500"
								x-transition:enter-start="-translate-y-full"
								x-transition:enter-end="-translate-y-0"
								x-transition:leave="transition ease-in duration-300"
								x-transition:leave-start="-translate-y-0"
								x-transition:leave-end="-translate-y-full"
							>
								<div>
									<label for="firstname" class="block font-heading text-3xl text-white">
										First up, what is your first name?
									</label>
									<input
										type="text"
										x-model="firstname"
										id="firstname"
										// @keyup.enter="goNext"
										placeholder="type your first name here"
										class="w-full border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
										// @input="firstname ? error=null : error='firstname'"
									/>
									<div class="mt-4 flex items-center space-x-2">
										<button
											// :disabled="error== 'firstname'"
											// @click="goNext"
											type="button"
											class="btn-outline px-3 py-2 font-sans text-sm"
										>
											<span>Ok</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</button>
										<p class="text-sm text-gray-100">
											press <b>Enter ↩</b>
										</p>
									</div>
								</div>
							</div>
							<div
								x-show="step === 2"
								x-trap="step === 2"
								class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
								x-transition:enter="transition ease-out duration-500"
								x-transition:enter-start="translate-y-full"
								x-transition:enter-end="translate-y-0"
								x-transition:leave="transition ease-in duration-500"
								x-transition:leave-start="translate-y-0"
								x-transition:leave-end="translate-y-full"
							>
								<div>
									<label for="lastname" class="block font-heading text-3xl text-white">
										And your last name?
									</label>
									<input
										type="text"
										id="lastname"
										x-model="lastname"
										// @keyup.enter="goNext"
										placeholder="type your lastname here"
										class="w-full border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
										// @input="error = lastname ? null : 'lastname'"
									/>
									<div class="mt-4 flex items-center space-x-2">
										<button
											// :disabled="error== 'lastname'"
											// @click="goNext"
											type="button"
											class="btn-outline px-3 py-2 font-sans text-sm"
										>
											<span>Ok</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</button>
										<p class="text-sm text-gray-100">
											press <b>Enter ↩</b>
										</p>
									</div>
								</div>
							</div>
							<div
								x-show="step === 3"
								x-trap="step === 3"
								class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
								x-transition:enter="transition ease-out duration-500"
								x-transition:enter-start="translate-y-full"
								x-transition:enter-end="translate-y-0"
								x-transition:leave="transition ease-in duration-500"
								x-transition:leave-start="translate-y-0"
								x-transition:leave-end="translate-y-full"
							>
								<div>
									<div class="relative">
										<label for="email" class="block font-heading text-3xl text-white">
											Great! Now what's your email,
											<span x-text="firstname"></span>?
										</label>
										<input
											type="email"
											id="email"
											x-model="email"
											// @keyup.enter="goNext"
											autoComplete="off"
											placeholder="type your email here"
											class="w-full border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
											// @input="error= email ? validateEmail(email) ? null : 'email' : 'email'"
										/>
										<p
											class="absolute top-full text-sm font-medium text-red-600"
											x-transition
											x-show="email ? (validateEmail(email) ? false : true) : false"
										>
											Please enter a valid email
										</p>
									</div>
									<div class="mt-6 flex items-center space-x-2">
										<button
											// :disabled="error== 'email'"
											// @click="goNext"
											type="button"
											class="btn-outline px-3 py-2 font-sans text-sm"
										>
											<span>Ok</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</button>
										<p class="text-sm text-gray-100">
											press <b>Enter ↩</b>
										</p>
									</div>
								</div>
							</div>
							<div
								x-show="step === 4"
								class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
								x-transition:enter="transition ease-out duration-500"
								x-transition:enter-start="translate-y-full"
								x-transition:enter-end="translate-y-0"
								x-transition:leave="transition ease-in duration-500"
								x-transition:leave-start="translate-y-0"
								x-transition:leave-end="translate-y-full"
							>
								<div>
									<div>
										<label for="birthdate" class="block font-heading text-3xl text-white">
											Oh, one last thing. When's your birthday? We might have a little something for
											you then.
										</label>
										<input
											type="text"
											id="date-picker"
											readOnly
											placeholder="Select A date"
											class="mt-3 w-full cursor-default border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
											x-init="
                      new Rolldate({
                        el: $el,
                        format: 'MM-DD-YYYY',
                        beginYear: 1920,
                        endYear: 2100,
                        lang: {
                          title: 'Select A Date',
                          cancel: 'Cancel',
                          confirm: 'Confirm',
                          year: '',
                          month: '',
                          day: '',
                        },
                        confirm: function(date) {
                          birthdate = date;
                          error = birthdate ? null : 'birthdate'
                        },
                      })
                    "
										/>
										<div class="mt-6 flex items-center space-x-2">
											<button
												// :disabled="error== 'birthdate'"
												// @click="goNext"
												type="button"
												class="btn-outline px-3 py-2 font-sans text-sm"
											>
												<span>Ok</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
							<div
								x-show="step === 5"
								x-trap="step === 5"
								class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
								x-transition:enter="transition ease-out duration-500"
								x-transition:enter-start="translate-y-full"
								x-transition:enter-end="translate-y-0"
								x-transition:leave="transition ease-in duration-500"
								x-transition:leave-start="translate-y-0"
								x-transition:leave-end="translate-y-full"
							>
								<div>
									<div>
										<p class="mb-3 block font-heading text-3xl text-white">
											Finally, do you accept our
											<a href="/en/privacy-policy.html" class="hover:underline">
												Privacy Policy
											</a>
											?
										</p>
										<div class="items-center xs:flex xs:space-x-3">
											<label
												for="accept"
												class="mb-2 flex cursor-pointer items-center space-x-2 xs:mb-0"
											>
												<input
													type="radio"
													x-model="privacyPolicy"
													class="bg-transparent text-red-600"
													id="accept"
													name="privacy-policy"
													value="accepted"
												/>
												<span class="text-white">I accept</span>
											</label>
											<label for="notAccept" class="flex cursor-pointer items-center space-x-2">
												<input
													type="radio"
													x-model="privacyPolicy"
													class="bg-transparent text-red-600"
													name="privacy-policy"
													id="notAccept"
													value="not-accepted"
												/>
												<span class="text-white">I don't accept</span>
											</label>
										</div>
									</div>
									<div class="mt-8">
										<button
											type="submit"
											class="btn-outline"
											// @click.prevent="handleSubmit"
										>
											Submit
										</button>
									</div>
								</div>
							</div>
							<div
								x-trap="step === 'complete'"
								x-show="step !== 'complete'"
								class="absolute bottom-2 right-0 flex items-center space-x-3"
							>
								<button
									type="button"
									// @click.prevent="goPrev"
									// :disabled="step <= 1"
									class="p-2 text-white transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 hover:disabled:text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 15l7-7 7 7"
										/>
									</svg>
								</button>
								<button
									type="button"
									// @click.prevent="step <= 5 ? goNext() : step = 5"
									// :disabled="step === 5 || error"
									class="p-2 text-white transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 hover:disabled:text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</div>
						</div>
					</form>
				</div>
			)}
		</>
	);
});
