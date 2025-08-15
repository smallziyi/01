<template>
	<a-style-provider hash-priority="high">
		<a-config-provider
			:auto-insert-space-in-button="false"
			:locale="zhCN"
			:theme="{
				token: theme,
				components: {
					Menu: menuTheme,
				},
			}"
		>
			<a-spin :spinning="loading">
				<RouterView />
			</a-spin>
		</a-config-provider>
	</a-style-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useStorage } from '@vueuse/core';
import themeToken from '@/theme.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import useUserStore from '@/store/modules/useUserStore.ts';

dayjs.locale('zh-cn');

const theme = useStorage('theme', ref(themeToken.defaultTheme), sessionStorage);

const { appTheme } = useAppTheme();

const menuTheme = computed(() => {
	switch (appTheme.value) {
		case 'white':
			return {
				colorItemBgSelected: '#1c59af',
				colorItemText: 'rgba(148, 163, 184, 1)',
				colorItemTextHover: '#ffffff',
				colorItemBgHover: '#3057b8',
				colorItemTextSelected: '#ffffff',
				colorBgElevated: '#1e4198',
			};
		case 'blue':
			return {};
	}
});

watch(appTheme, () => {
	switch (appTheme.value) {
		case 'white':
			theme.value = themeToken.zhaolubaiTheme;
			break;
		case 'blue':
			theme.value = themeToken.kejilanTheme;
			break;
	}
});

const { loading } = useUserStore();

onMounted(() => {
	theme.value = appTheme.value === 'white' ? themeToken.zhaolubaiTheme : themeToken.kejilanTheme;
});
</script>
