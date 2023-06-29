/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	corePlugins: {
		fontWeight: true,
	},
	theme: {
		extend: {
			keyframes: {
				colorWave: {
					"0%": { filter: "hue-rotate(0deg)" },
					"25%": { filter: "hue-rotate(90deg)" },
					"50%": { filter: "hue-rotate(180deg)" },
					"75%": { filter: "hue-rotate(270deg)" },
					"100%": { filter: "hue-rotate(360deg)" },
				},
			},
			animation: {
				colorWave: "colorWave 5s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
