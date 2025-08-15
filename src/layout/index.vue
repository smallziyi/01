<template>
	<!--	<div class="flex bg-[var(&#45;&#45;color-page-container)]" style="height: calc(100vh - 56px)"></div>-->
	<a-layout>
		<a-layout-header :style="{ backgroundColor: `${token.colorBgContainer}` }" class="p-4 flex justify-between h-14">
			<m-header />
		</a-layout-header>
		<a-layout-content class="flex h-[calc(100vh-56px)] overflow-auto">
			<div :class="collapsed ? 'w-16' : 'w-60 min-w-60'" class="py-4 pl-4">
				<m-menu v-model:collapsed="collapsed" />
			</div>
			<div
				:style="collapsed ? { width: 'calc(100% - 64px)' } : { width: 'calc(100% - 240px)' }"
				class="p-4 overflow-y-auto space-y-4 min-w-[1200px]"
				style="height: calc(100vh - 56px)"
			>
				<router-view />
			</div>
		</a-layout-content>
	</a-layout>
</template>

<script setup lang="ts">
import MHeader from '@/layout/m-header.vue';
import MMenu from '@/layout/m-menu.vue';
import { useStorage } from '@vueuse/core';
import { theme } from 'ant-design-vue';

const collapsed = useStorage<boolean>('menu_collapsed', false, sessionStorage);

const token = theme.useToken().token;
</script>
