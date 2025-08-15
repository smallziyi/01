import useUserStore from '@/store/modules/useUserStore.ts';

export type Permission = {
	parentId: string;
	name: string;
	code: string;
	type: number;
	apiType: string;
	functionType: 1 | 2 | 3;
	sort: number;
	disable: boolean;
	children?: Permission[];
	path: string;
	iconId?: string;
	iconFileUrl?: string;
	defaultRoleCodes: string[];
} & BaseEntity;

export const initPermission = (type: number, parentId: string): Permission => {
	const { user } = useUserStore();
	return {
		apiType: '',
		code: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		disable: false,
		id: '',
		lastUpdateTime: '',
		name: '',
		sort: 0,
		path: '',
		parentId,
		type,
		functionType: 1,
		defaultRoleCodes: [],
	};
};
