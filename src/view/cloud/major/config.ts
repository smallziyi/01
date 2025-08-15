import { ColumnsType } from 'ant-design-vue/es/table/interface';

export type Major = {
	name: string;
	code: string;
	parentCode: string;
	disable: boolean;
	type: number;
	educationType: string;
} & BaseEntity;

export const columns: ColumnsType<Major> = [
	{ key: 'educationType', dataIndex: 'educationType', title: '教育类型' },
	{ key: 'parentCode', dataIndex: 'parentCode', title: '上级编码' },
	{ key: 'code', dataIndex: 'code', title: '当前编码' },
	{ key: 'name', dataIndex: 'name', title: '专业名称' },
	// { key: 'disable', dataIndex: 'disable', title: '启用状态' },
	// { key: 'action', title: '操作', dataIndex: 'action' },
];
