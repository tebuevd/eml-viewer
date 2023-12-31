/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{tsx,ts,jsx,js}"],
	theme: {
		extend: {
			boxShadow: {
				sh: "0 2px 8px 0 rgba(0,0,0,.2), 0 0 0.5px 0 rgba(0,0,0,.1);",
			},
			fontFamily: {
				"sh-adelle": ['"Superhuman Adelle"', "ui-sans-serif"],
			},
			colors: {
				sh: {
					highlight: "#F4F6FB",
					highlightbar: "#AEB1DD",
					sidebar: {
						start: "hsl(220deg, 100%, 99%)",
						end: "hsl(214deg, 100%, 99%)",
					},
				},
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				".shadow-highlight": {
					boxShadow: "0 2px 8px 0 rgba(0,0,0,.2), 0 0 0.5px 0 rgba(0,0,0,.1)",
				},
				".scrollbar-hide": {
					/* IE and Edge */
					"-ms-overflow-style": "none",

					/* Firefox */
					"scrollbar-width": "none",

					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "none",
					},
				},

				".scrollbar-default": {
					/* IE and Edge */
					"-ms-overflow-style": "auto",

					/* Firefox */
					"scrollbar-width": "auto",

					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "block",
					},
				},
			});
		},
	],
};
