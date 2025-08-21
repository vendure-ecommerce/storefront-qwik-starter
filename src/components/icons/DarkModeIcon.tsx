import { component$ } from '@qwik.dev/core';

export default component$<{ forcedClass?: string }>(({ forcedClass }) => {
	return (
		<svg width="20px" height="20px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
			<g id="Layer_2" data-name="Layer 2">
				<g id="Icons">
					<g>
						<rect width="48" height="48" fill="white" />
						<g>
							<path d="M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z" />
							<path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	);
});
