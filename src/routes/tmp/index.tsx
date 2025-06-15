import { component$ } from '@qwik.dev/core';
import FontSelector, {
	additiveFontOptions,
} from '~/components/custom-option-visualizer/FontSelector';

export default component$(() => {
	return <FontSelector fontOptions={additiveFontOptions} />;
});
