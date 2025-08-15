import { ColumnsType } from 'ant-design-vue/es/table/interface';

export type QueryOccupationParams = {
	parentCode: string;
	code: string;
	name: string;
	disable: number | undefined;
	current: number;
	pageSize: number;
};

export type ResponseOccupationItem = {
	id: string;
	name: string;
	code: string;
	description: string;
	parentCode: string;
	disable: string;
};

export const initOccupation = (): QueryOccupationParams => {
	return {
		parentCode: '',
		code: '',
		name: '',
		disable: undefined,
		current: 1,
		pageSize: 10,
	};
};

export const columns: ColumnsType<ResponseOccupationItem> = [
	{ key: 'parentCode', dataIndex: 'parentCode', title: '上级编码' },
	{ key: 'code', dataIndex: 'code', title: '编码' },
	{ key: 'name', dataIndex: 'name', title: '职业名称' },
	{ key: 'description', dataIndex: 'description', title: '描述' },
	// { key: 'disable', dataIndex: 'disable', title: '启用状态' },
	// { key: 'action', dataIndex: 'action', title: '操作', width: 60 },
];

export const disabledList: { value: boolean; label: string }[] = [
	{ value: false, label: '启用' },
	{ value: true, label: '停用' },
];
