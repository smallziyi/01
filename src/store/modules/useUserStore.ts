import { getLoginUserPermission, getUserInfo } from '@/axios';

const user = ref<User>();
const permissions = ref<{ id: string; path: string; name: string; parentId: string }[]>([]);
const loading = ref(false);

const useUserStore = () => {
	function setUser(_user: User) {
		user.value = _user;
	}

	function setPermission(_permissions: { id: string; path: string; name: string; parentId: string }[]) {
		permissions.value = _permissions;
	}

	function hasPermission(path: string) {
		return permissions.value.length && permissions.value.some((permission) => permission.path === path);
	}

	async function loadUserInfo() {
		loading.value = true;
		const [userInfo, permissions] = await Promise.all([getUserInfo(), getLoginUserPermission()]);
		setUser(userInfo);
		setPermission(
			permissions.map((permission) => ({
				id: permission.id,
				path: permission.path,
				name: permission.name,
				parentId: permission.parentId,
			})),
		);
		loading.value = false;
	}

	return { user, setUser, permissions, setPermission, hasPermission, loadUserInfo, loading };
};

export default useUserStore;
