import { component$, useContext } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import CloseIcon from '../icons/CloseIcon';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const collections = useContext(APP_STATE).collections.filter(
		(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);

	return (
		<>
			{appState.showMenu && (
				<div class="fixed inset-0 overflow-hidden z-20">
					<div class="absolute inset-0 overflow-hidden">
						<div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-100"></div>
						<div class="fixed inset-y-0 pr-10 max-w-full flex">
							<div class="w-screen max-w-md translate-x-0">
								<div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
									<div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
										<div class="flex items-start justify-between">
											<h2 class="text-lg font-medium text-gray-900">{$localize`Menu`}</h2>
											<div class="ml-3 h-7 flex items-center">
												<button
													type="button"
													class="-m-2 p-2 text-gray-400 hover:text-gray-500"
													onClick$={() => (appState.showMenu = false)}
												>
													<span class="sr-only">Close panel</span>
													<CloseIcon />
												</button>
											</div>
										</div>
										<div class="flex flex-col pt-6">
											{collections.map((collection) => (
												<a
													class="text-lg font-medium text-gray-90 hover:text-gray-500 pt-4"
													href={`/collections/${collection.slug}`}
													key={collection.id}
												>
													{collection.name}
												</a>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
});
