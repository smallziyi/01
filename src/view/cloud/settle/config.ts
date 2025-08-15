import { ColumnsType } from 'ant-design-vue/es/table/interface';
import useUserStore from '@/store/modules/useUserStore.ts';

export type Settle = {
	brokerageId: string;
	payment: number;
	fileId: string;
	fileName: string;
	salesmanId: string;
	salesmanName: string;
	createTime: string;
	createUser: string;
} & BaseEntity;

export const initSettle = (): Settle => {
	const { user } = useUserStore();
	return {
		brokerageId: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		fileId: '',
		fileName: '',
		id: '',
		payment: 0,
		salesmanId: '',
		salesmanName: '',
		lastUpdateTime: '',
	};
};

export const settleColumns: ColumnsType<Settle> = [
	{ key: 'payment', dataIndex: 'payment', title: '结算金额(元)', ellipsis: true },
	{ key: 'fileName', dataIndex: 'fileName', title: '结算凭证', ellipsis: true },
	{ key: 'createTime', dataIndex: 'createTime', title: '结算日期', ellipsis: true },
	{ key: 'createUser', dataIndex: 'createUser', title: '操作员', ellipsis: true },
];
