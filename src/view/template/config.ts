import useUserStore from '@/store/modules/useUserStore.ts';

export type QueryTemplateFile = {
	//  1企业调研 2人陪方案 3课程标准
	type: number;
	name?: string;
	version?: number;
	startTime?: string;
	endTime?: string;
	current: number;
	pageSize: number;
};

export type TemplateFile = {
	clientId: string;
	name?: string;
	version?: number;
	startTime?: string;
	endTime?: string;
	type: number;
	fileId?: string;
	fileName?: string;
	url?: string;
} & BaseEntity;

export type UpdateTemplateDisable = {
	reportType: number;
	enableMenuIds: string[];
};

export const initQueryTemplateFile = (type: number): QueryTemplateFile => {
	return {
		type,
		version: undefined,
		startTime: undefined,
		endTime: undefined,
		current: 1,
		pageSize: 10,
	};
};

export const initTemplateFile = (type: number): TemplateFile => {
	const { user } = useUserStore();
	return {
		type,
		clientId: user.value!.clientId,
		version: 1,
		startTime: undefined,
		endTime: undefined,
		fileId: undefined,
		fileName: undefined,
		url: undefined,
		name: '',
		id: '',
		createBy: user.value!.id,
		createUser: '',
		createTime: '',
		lastUpdateTime: '',
	};
};

export const columns: TableColumns<TemplateFile> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'name', dataIndex: 'name', title: '模板名称', ellipsis: true, width: 200 },
	{ key: 'version', dataIndex: 'version', title: '版本', width: 60 },
	{ key: 'createTime', dataIndex: 'createTime', title: '上传日期', width: 100 },
	{ key: 'url', dataIndex: 'url', title: '文件名称', ellipsis: true, width: 260 },
	{ key: 'operation', dataIndex: 'operation', title: '操作', fixed: 'right', width: 250 },
];
