<script lang="tsx" setup>
import { MenuProps } from 'ant-design-vue';
import SidebarCloseSvg from '@/assets/menu/sidebar-close.svg';
import SidebarOpenSvg from '@/assets/menu/sidebar-open.svg';
import { useStorage } from '@vueuse/core';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useUserStore from '@/store/modules/useUserStore.ts';
import { RouteRecordRaw } from 'vue-router';
import { clickMenu } from '@/axios';
import RecursiveMenu from '@/layout/components/RecursiveMenu.tsx';

const collapsed = defineModel('collapsed', { required: true, type: Boolean });
const openKeys = useStorage<Array<string | number>>('menu_open_keys', [], sessionStorage);
const selectedKeys = useStorage<Array<string | number>>('menu_selected_keys', [], sessionStorage);
const router = useRouter();
const handleClick: MenuProps['onClick'] = (menuInfo) => {
	if (router.currentRoute.value.path === (menuInfo.key as string)) return;
	router.push(menuInfo.key as string).then(() => {
		const permission = permissions.value.find((permission) => permission.path === (menuInfo.key as string));
		if (permission) {
			clickMenu(permission.id);
		}
	});
};

const { appTheme } = useAppTheme();

const { hasPermission, permissions } = useUserStore();

const filteredRoutes = computed(() => {
	const filterHiddenRoutes = (routes: RouteRecordRaw[], parentPath: string = ''): RouteRecordRaw[] => {
		return routes
			.filter((route) => {
				const fullPath = parentPath + '/' + route.path.replace(/^\//, '');
				return !route.meta?.isHide && hasPermission(fullPath);
			})
			.map((route) => {
				const fullPath = parentPath + '/' + route.path.replace(/^\//, '');
				return {
					...route,
					path: fullPath,
					children: route.children ? filterHiddenRoutes(route.children, fullPath) : undefined,
				} as RouteRecordRaw;
			})
			.filter((route) => !route.children || route.children.length > 0);
	};

	return filterHiddenRoutes([...router.options.routes]);
});

onMounted(() => {
	selectedKeys.value = [window.location.pathname];
});
</script>

<template>
	<a-menu
		:inline-collapsed="collapsed"
		mode="inline"
		class="rounded-lg h-full select-none overflow-y-auto text-slate-400 scroll"
		:class="appTheme === 'white' ? 'bg-[#1d4198]' : ''"
		@click="handleClick"
		v-model:open-keys="openKeys"
		v-model:selected-keys="selectedKeys"
	>
		<div class="h-10 w-full m-1 py-1">
			<div
				class="w-8 h-8 rounded text-center leading-8 hover:bg-black/5 hover:text-white flex items-center justify-center"
				:class="collapsed ? 'ml-1' : 'ml-4'"
				@click="collapsed = !collapsed"
			>
				<a-tooltip v-if="!collapsed" title="收起" placement="right">
					<sidebar-close-svg></sidebar-close-svg>
				</a-tooltip>
				<a-tooltip v-else title="展开" placement="right">
					<sidebar-open-svg></sidebar-open-svg>
				</a-tooltip>
			</div>
		</div>
		<recursive-menu :routes="filteredRoutes" />
	</a-menu>
</template>

<style scoped>
.scroll::-webkit-scrollbar {
	width: 0;
}

.scroll::-webkit-scrollbar-track {
	/* 针对滚动条轨道 */
	background: transparent; /* 设置轨道为透明 */
}

.scroll::-webkit-scrollbar-thumb {
	background: transparent;
}
.scroll {
	scrollbar-width: none;
}
</style>
