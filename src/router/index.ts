import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes.ts';
import { message } from 'ant-design-vue';
import useUserStore from '@/store/modules/useUserStore.ts';
import { clickMenu } from '@/axios';
import { useStorage } from '@vueuse/core';

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach(async (to, _from, next) => {
	const userStore = useUserStore();
	if (!to.matched.length) {
		next('/404');
		return;
	}

	if (to.path === '/login' || to.path === '/403' || to.path === '/about' || to.path === '/home') {
		next();
		return;
	}

	const token = sessionStorage.getItem('jwt');
	if (token) {
		if (!userStore.permissions.value.length || !userStore.user) {
			try {
				await userStore.loadUserInfo();
			} catch (error) {
				message.warning('获取用户信息失败，请重新登录');
				next('/login');
				return;
			}
		}

		if (userStore.hasPermission(to.path) || to.path === '/feedback') {
			next();
		} else {
			next('/403');
		}
	} else {
		message.warning('登录失效，请重新登录');
		next('/login');
	}
});
router.afterEach((to, from) => {
	if (from.path.startsWith('/workbench')) {
		const { permissions } = useUserStore();
		const permission = permissions.value.find((permission) => {
			return permission.path === to.path;
		});
		if (permission) {
			clickMenu(permission.id);
		}
	}
	const selectedKeys = useStorage<Array<string | number>>('menu_selected_keys', [], sessionStorage);
	if (!to.meta.isHide) {
		selectedKeys.value = [to.path];
	}
});
export default router;
