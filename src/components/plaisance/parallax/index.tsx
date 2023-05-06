import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import FlavorsSection from './flavors';
import IdentitySection from './identity';
import TraditionSection from './tradition';
import WinInMixtureSection from './win-in-mixture';

export default component$(() => {
	const activeSection = useSignal('winIsAMixture');
	return (
		<div class="relative h-[400vh]">
			<WinInMixtureSection activeSection={activeSection} />
			<TraditionSection activeSection={activeSection} />
			<IdentitySection activeSection={activeSection} />
			<FlavorsSection activeSection={activeSection} />

			<div class="sticky bottom-16 left-10 top-0 z-10 -mt-12 mb-0 w-20">
				<div class="flex flex-col space-y-4">
					<Link
						href="#winIsAMixture"
						// @click.prevent="scrollAnchors($el)"
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'winIsAMixture' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
					<Link
						href="#tradition"
						// @click.prevent="scrollAnchors($el)"
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'tradition' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
					<Link
						href="#identity"
						// @click.prevent="scrollAnchors($el)"
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'identity' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
					<Link
						href="#flavors"
						// @click.prevent="scrollAnchors($el)"
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'flavors' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
				</div>
			</div>
		</div>
	);
});
