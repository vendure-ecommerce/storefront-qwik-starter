const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xs: '480px',
			...defaultTheme.screens,
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
			},
		},
		fontFamily: {
			sans: ['Kumbh Sans', 'sans-serif'],
			heading: ['Italiana', 'sans-serif'],
		},
		extend: {
			keyframes: {
				slideRight: {
					'0%': {
						transform: 'translateX(0)',
					},
					'50%': {
						transform: 'translateX(105%)',
					},
					'51%': {
						opacity: '0',
					},
					'52%': {
						color: 'red',
						opacity: '1',
						transform: 'translateX(-105%)',
					},
					'100%': {
						color: 'red',
						opacity: '1',
						transform: 'translateX(0)',
					},
				},
			},
			animation: {
				slideright: 'slideRight 0.5s ease-in-out forwards',
			},
			colors: {
				dark: {
					600: '#0D0D0D',
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
