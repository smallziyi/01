import useUserStore from '@/store/modules/useUserStore.ts';

export type FetchResearchParams = {
	name: string;
	parentId: string | undefined;
	disable: number | undefined;
};

export const initResearchParams = (): FetchResearchParams => {
	return {
		name: '',
		parentId: undefined,
		disable: undefined,
	};
};

export type ResearchListItem = {
	id: string;
	clientId: string;
	name: string;
	disable: boolean;
	parentId: string | undefined;
	parentName?: string;
	memberCount: number;
	description: string;
};

export type CreateResearchParams = {
	clientId: string;
	name: string;
	disable: boolean;
	parentId: string | undefined;
	parentName?: string;
	memberCount: number;
	description: string;
	userPostData: {
		userId: string;
		postIds: string[];
	}[];
};

export type ResearchMemberListItem = {
	userId: string;
	name: string;
	gender: string;
	phone: string;
	postIds: any;
	postArray: string;
};

export type CreateResearchFormParams = {
	clientId: string;
	name: string;
	parentId: string | undefined;
	memberCount: number;
	description: string;
};

export type ResearchMember = {
	postIds: string[];
	postArray?: string;
} & User;

export type ResearchDetail = {
	research: CreateResearchParams;
	users: User[];
};

export const initCreateResearchForm = (): CreateResearchFormParams => {
	const { user } = useUserStore();
	return {
		clientId: user.value!.clientId,
		name: '',
		parentId: undefined,
		memberCount: 0,
		description: '',
	};
};

export const initResearch = (): CreateResearchParams => {
	return {
		clientId: '',
		name: '',
		parentId: undefined,
		parentName: '',
		disable: true,
		memberCount: 0,
		description: '',
		userPostData: [
			{
				userId: '',
				postIds: [''],
			},
		],
	};
};

export const disabledList: Option[] = [
	{ value: 0, label: '启用' },
	{ value: 1, label: '停用' },
];

export const columns = [
	{ key: 'name', dataIndex: 'name', title: '姓名' },
	{ key: 'gender', dataIndex: 'gender', title: '性别' },
	{ key: 'phone', dataIndex: 'phone', title: '联系方式' },
	{ key: 'postIds', dataIndex: 'postIds', title: '教研组织职务' },
	{ key: 'operation', dataIndex: 'operation', title: '操作' },
];

export const detailColumns = [
	{ key: 'name', dataIndex: 'name', title: '姓名' },
	{ key: 'gender', dataIndex: 'gender', title: '性别' },
	{ key: 'phone', dataIndex: 'phone', title: '联系方式' },
	{ key: 'postArray', dataIndex: 'postArray', title: '教研组织职务' },
];
