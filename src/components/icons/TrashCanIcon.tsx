import { component$ } from '@builder.io/qwik';

export default component$<{ forcedClass?: string }>(({ forcedClass }) => {
	return (
		// <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		//   <path d="M4 6H20L18.4199 20.2209C18.3074 21.2337 17.4512 22 16.4321 22H7.56786C6.54876 22 5.69264 21.2337 5.5801 20.2209L4 6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		//   <path d="M7.34491 3.14716C7.67506 2.44685 8.37973 2 9.15396 2H14.846C15.6203 2 16.3249 2.44685 16.6551 3.14716L18 6H6L7.34491 3.14716Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		//   <path d="M2 6H22" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		//   <path d="M10 11V16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		//   <path d="M14 11V16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		// </svg>
		<svg
			width="20px"
			height="20px"
			viewBox="-0.5 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6.5 7.08499V21.415C6.5 21.695 6.72 21.915 7 21.915H17C17.28 21.915 17.5 21.695 17.5 21.415V7.08499"
				stroke="#0F0F0F"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M14 5.08499H10V3.58499C10 3.30499 10.22 3.08499 10.5 3.08499H13.5C13.78 3.08499 14 3.30499 14 3.58499V5.08499Z"
				stroke="#0F0F0F"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M5 5.08499H19"
				stroke="#0F0F0F"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12 10.465V17.925"
				stroke="#0F0F0F"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M15 9.465V18.925"
				stroke="#0F0F0F"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M9 9.465V18.925"
				stroke="#0F0F0F"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
});
