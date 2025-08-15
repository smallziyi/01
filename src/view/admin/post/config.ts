import useUserStore from '@/store/modules/useUserStore.ts';

export type Post = {
	type: number | undefined;
	name: string;
	description: string;
	clientId: string;
	disable: boolean;
} & BaseEntity;

export const initPost = (): Post => {
	const { user } = useUserStore();
	return {
		type: undefined,
		name: '',
		description: '',
		clientId: user.value!.clientId,
		disable: false,
		id: '',
		createBy: user.value!.id,
		createUser: user.value!.name,
		createTime: '',
		lastUpdateTime: '',
	};
};

export const columns: TableColumns<Post> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'name', dataIndex: 'name', title: '名称', width: 200, ellipsis: true },
	{ key: 'type', dataIndex: 'type', title: '类型', width: 120 },
	{ key: 'description', dataIndex: 'description', title: '描述', ellipsis: true },
	{ key: 'disable', dataIndex: 'disable', title: '状态', width: 120 },
	{ key: 'operation', dataIndex: 'operation', title: '操作', fixed: 'right', width: 60 },
];

export type QueryPostParams = {
	type?: number;
	name?: string;
	disable?: number;
	current: number;
	pageSize: number;
};

export const initPostQuery: QueryPostParams = {
	type: undefined,
	name: undefined,
	disable: undefined,
	current: 1,
	pageSize: 10,
};

export const PostTypeOptions: Option[] = [
	{ label: '部门职务', value: 1 },
	{ label: '教研室职务', value: 2 },
];

export const disableOptions: Option[] = [
	{ label: '启用', value: 0 },
	{ label: '停用', value: 1 },
];
