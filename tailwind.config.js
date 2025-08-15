// noinspection JSUnusedGlobalSymbols

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			screens: {
				mobile: '480px', // 手机设备
				tablet: '768px', // 平板设备
				laptop: '1024px', // 笔记本设备
				desktop: '1280px', // 桌面设备
				'large-desktop': '1536px', // 大型桌面设备
				'ultra-wide': '1920px', // 超宽屏设备
			},
		},
	},
	plugins: [],
	important: true,
};
