/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{tsx,ts,jsx,js}"],
	theme: {
		extend: {
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
	plugins: [],
};
