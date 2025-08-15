import useUserStore from '@/store/modules/useUserStore.ts';

export type Expense = {
	contractId: string;
	payment: number;
	fileId: string;
	fileName: string;
	refund: boolean;
	refundFileId: string;
	refundFileName: string;
	refundUser: string;
	refundTime: string;
	contractName: string;
	contractNumber: string;
	clientName: string;
} & BaseEntity;

export const initExpense = (contractId: string): Expense => {
	const { user } = useUserStore();
	return {
		clientName: '',
		contractId: contractId,
		contractName: '',
		contractNumber: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		fileId: '',
		fileName: '',
		id: '',
		payment: 0,
		refund: false,
		refundFileId: '',
		refundFileName: '',
		refundTime: '',
		refundUser: '',
		lastUpdateTime: '',
	};
};

export type QueryExpenseParams = {
	current: number;
	pageSize: number;
};

export const columns: TableColumns<Expense> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'contractNumber', dataIndex: 'contractNumber', title: '合同编号', width: 150 },
	{ key: 'contractName', dataIndex: 'contractName', title: '关联合同', width: 160, ellipsis: true },
	{ key: 'payment', dataIndex: 'payment', title: '缴费金额(元)', align: 'right' },
	{ key: 'createTime', dataIndex: 'createTime', title: '缴费时间', width: 200 },
	{ key: 'createUser', dataIndex: 'createUser', title: '缴费操作员' },
	{ key: 'fileName', dataIndex: 'fileName', title: '缴费凭证' },
	{ key: 'refund', dataIndex: 'refund', title: '状态' },
	{ key: 'operation', dataIndex: 'operation', title: '操作', fixed: 'right' },
];
