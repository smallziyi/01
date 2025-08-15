import { ColumnsType } from 'ant-design-vue/es/table/interface';
import useUserStore from '@/store/modules/useUserStore.ts';

export type QueryDepartmentParam = {
	name: string;
	parentId: string | undefined;
	leaderName: string;
	disable: number | undefined;
};

export type ResponseDepartmentItem = {
	id: string;
	name: string;
	parentName: string;
	parentId: string | undefined;
	disable: boolean;
	leaderId: string;
	leaderName: string;
	memberCount: number;
	description: string;
};

export type formDepartmentParam = {
	clientId?: string;
	name: string;
	parentId?: string;
	parentName: string;
	leaderId: string;
	leaderName: string;
	memberCount: number;
	description: string;
	disable: boolean;
};

export type SaveDepartmentParams = {
	userPostData: {
		userId: string;
		postIds: string[];
	}[];
} & formDepartmentParam;

export type DepartmentUser = {
	postIds: string[];
	isLeader: boolean;
} & User;

export type DepartmentDetail = {
	department: SaveDepartmentParams;
	users: User[];
};

export const initDepartment = (): QueryDepartmentParam => {
	return {
		name: '',
		parentId: undefined,
		leaderName: '',
		disable: undefined,
	};
};

export const initDepartmentItem = (): ResponseDepartmentItem => {
	return {
		id: '',
		name: '',
		parentName: '',
		parentId: undefined,
		disable: true,
		leaderId: '',
		leaderName: '',
		memberCount: 0,
		description: '',
	};
};

export const initDepartmentAdd = (): formDepartmentParam => {
	const { user } = useUserStore();
	return {
		clientId: user.value!.clientId,
		name: '',
		parentName: '',
		leaderId: '',
		leaderName: '',
		memberCount: 0,
		disable: true,
		description: '',
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
export const columns: ColumnsType = [
	{
		key: 'name',
		dataIndex: 'name',
		title: '姓名',
	},
	{
		key: 'roles',
		dataIndex: 'roles',
		title: '角色',
	},
	{
		key: 'postIds',
		dataIndex: 'postIds',
		title: '岗位/职务',
	},
	{
		key: 'isLeader',
		dataIndex: 'isLeader',
		title: '是否为负责人',
	},
	{
		key: 'operation',
		dataIndex: 'operation',
		title: '操作',
	},
];

// 新增部门成员 table
export const detailColumns: ColumnsType = [
	{
		key: 'name',
		dataIndex: 'name',
		title: '姓名',
	},
	{
		key: 'roles',
		dataIndex: 'roles',
		title: '角色',
	},
	{
		key: 'postArray',
		dataIndex: 'postArray',
		title: '岗位/职务',
	},
	{
		key: 'isLeader',
		dataIndex: 'isLeader',
		title: '是否为负责人',
	},
];
