import { component$, useSignal } from '@qwik.dev/core';
import FontSelector, {
	AdditiveFontOptions,
} from '~/components/custom-option-visualizer/FontSelector';

export default component$(() => {
	const selectedFont = useSignal<string>('Comic_Neue__bold');
	return (
		<div>
			<div>
				<h1>Custom Option Visualizer</h1>
				<p>
					This page is for testing custom options in the Select component. Select a font to see how
					it looks.
				</p>
				<FontSelector
					fontOptions={AdditiveFontOptions}
					selectedValue={selectedFont}
					fieldTitle="top side font"
				/>
			</div>

			<div>
				<h1>Selected Font: {selectedFont.value}</h1>
			</div>
		</div>
	);
});
