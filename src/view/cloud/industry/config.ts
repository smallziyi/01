import { ref } from 'vue';
import { ColumnsType } from 'ant-design-vue/es/table/interface';

export type Industry = {
	name: string;
	code: string;
	parentCode: string;
	description: string;
	childrenFlag: string;
	disable: boolean;
	children?: Industry[];
} & BaseEntity;

export const columns: ColumnsType<Industry> = [
	{ dataIndex: 'parentCode', key: 'parentCode', title: '上级编码', width: 100, ellipsis: true },
	{ dataIndex: 'code', key: 'code', title: '编码', width: 100, ellipsis: true },
	{ dataIndex: 'name', key: 'name', title: '名称', width: 200, ellipsis: true },
	{ dataIndex: 'description', key: 'description', title: '描述', ellipsis: true },
	// { key: 'operation', title: '操作', fixed: 'right', width: 60 },
];

export type QueryParams = {
	current: number;
	pageSize: number;
};

export const queryParams = ref<QueryParams>({ current: 1, pageSize: 10 });
