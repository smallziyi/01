import { ColumnsType } from 'ant-design-vue/es/table/interface';

export type Position = {
	name: string;
	parentCode: string;
	code: string;
	description: string;
	disable: boolean;
	children?: Position[];
} & BaseEntity;

export const columns: ColumnsType<Position> = [
	{ dataIndex: 'name', key: 'name', title: '名称' },
	{ dataIndex: 'description', key: 'description', title: '描述' },
	{ dataIndex: 'operation', key: 'operation', title: '操作' },
];

export type QueryPositionParams = {
	current: number;
	pageSize: number;
};
