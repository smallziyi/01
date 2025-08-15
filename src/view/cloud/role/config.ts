import { Permission } from '@/view/base/permission/config.ts';

export type Role = {
	clientId: string;
	name: string;
	description: string;
	isBasic: boolean;
	workbenchId: string;
	permissionArray: string[];
	permissionList: Permission[];
	disable: number;
} & BaseEntity;

export type FetchRole = {
	name?: string;
	disable?: number;
	clientId: string;
	current: number;
	pageSize: number;
};

export const initRoleData = (): Role => {
	return {
		id: '',
		createBy: '',
		createTime: '',
		createUser: '',
		lastUpdateTime: '',
		clientId: '1',
		name: '',
		description: '',
		isBasic: false,
		workbenchId: '',
		permissionArray: [],
		permissionList: [],
		disable: 0,
	};
};

export type CreateRole = {
	role: {
		name: string;
		description: string;
		workbenchId: string;
		clientId: string;
		disable: number;
	};
	permissionIds: Array<Key>;
};

export const initRole = (): FetchRole => {
	return {
		name: undefined,
		disable: undefined,
		clientId: '1',
		current: 1,
		pageSize: 10,
	};
};

export const initCreateRole = (): CreateRole => {
	return {
		role: {
			name: '',
			description: '',
			workbenchId: '',
			clientId: '1',
			disable: 0,
		},
		permissionIds: [],
	};
};

export const disabledList: Option[] = [
	{
		value: 0,
		label: '启用',
	},
	{
		value: 1,
		label: '停用',
	},
];

// 新增部门成员 table
export const columns: TableColumns<Role> = [
	{ key: 'name', dataIndex: 'name', title: '角色名称' },
	{ key: 'description', dataIndex: 'description', title: '角色描述' },
	{ key: 'permissionArray', dataIndex: 'permissionArray', title: '功能授权', ellipsis: true },
	{ key: 'disable', dataIndex: 'disable', title: '启用状态' },
	{ key: 'operation', fixed: 'right', title: '操作', width: 120 },
];
