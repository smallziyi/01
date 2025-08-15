import useUserStore from '@/store/modules/useUserStore.ts';

export type UserQueryParams = {
	name?: string;
	roleId?: string;
	number?: string;
	disable?: number;
	clientId: string;
	current: number;
	pageSize: number;
};

export const initUserQuery = (): UserQueryParams => {
	const { user } = useUserStore();
	return {
		name: undefined,
		roleId: undefined,
		number: undefined,
		disable: undefined,
		clientId: user.value!.clientId,
		current: 1,
		pageSize: 10,
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
export const columns: TableColumns<User> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'name', dataIndex: 'name', title: '用户名称' },
	{ key: 'roles', dataIndex: 'roles', title: '用户角色', ellipsis: true },
	{ key: 'number', dataIndex: 'number', title: '工号/学号' },
	{ key: 'gender', dataIndex: 'gender', title: '性别', width: 60 },
	{ key: 'birthday', dataIndex: 'birthday', title: '年龄', width: 60, ellipsis: true },
	{ key: 'phone', dataIndex: 'phone', title: '手机号码' },
	{ key: 'email', dataIndex: 'email', title: '邮箱地址', ellipsis: true },
	{ key: 'disable', dataIndex: 'disable', title: '启用状态', width: 100 },
	{ key: 'operation', fixed: 'right', title: '操作', width: 160 },
];
