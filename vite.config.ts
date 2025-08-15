// noinspection JSUnusedGlobalSymbols

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import svgLoader from 'vite-svg-loader';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		svgLoader(),
		vueJsx(),
		AutoImport({
			imports: ['vue', 'vue-router'],
			resolvers: [],
		}),
		Components({
			// 组件自动引入
			resolvers: [
				AntDesignVueResolver({
					importStyle: false,
				}),
			],
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 8898,
	},
});
