import { ref } from 'vue';
import { ColumnsType } from 'ant-design-vue/es/table/interface';
import { Certificate } from '@/view/base/code/certificate/config.ts';

export const columns: ColumnsType<Certificate> = [
	{ dataIndex: 'type', key: 'type', title: '类型', ellipsis: true, width: 140 },
	{ dataIndex: 'name', key: 'name', title: '名称', ellipsis: true },
	{ dataIndex: 'disable', key: 'disable', title: '状态', width: 60 },
	{ dataIndex: 'description', key: 'description', title: '描述', ellipsis: true },
	{ key: 'operation', title: '操作', fixed: 'right', width: 60 },
];

export type QueryCertificateParams = {
	type: number | undefined;
	name: string;
	current: number;
	pageSize: number;
};

export const queryCertificateParams = ref<QueryCertificateParams>({
	current: 1,
	name: '',
	pageSize: 10,
	type: undefined,
});
