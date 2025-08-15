import useUserStore from '@/store/modules/useUserStore.ts';

export type Contract = {
	contractNumber: string;
	contractName: string;
	deployType: number | undefined;
	clientId?: string;
	totalPrice: number | undefined;
	discounts: number | undefined;
	payment: number | undefined;
	salesmanId: number | undefined;
	settleType: number | undefined;
	contractType: number;
	startTime: string;
	endTime: string;
	status: number | undefined;
	fileId: string;
	fileName: string;
	salesmanName: string;
	salesmanPhone: string;
	salesmanEmail: string;
	clientName: string;
} & BaseEntity;

export const initContract = (): Contract => {
	const { user } = useUserStore();
	return {
		clientId: undefined,
		clientName: '',
		contractName: '',
		contractNumber: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		deployType: undefined,
		discounts: undefined,
		endTime: '',
		fileId: '',
		fileName: '',
		id: '',
		lastUpdateTime: '',
		contractType: 1,
		payment: undefined,
		salesmanEmail: '',
		salesmanId: undefined,
		salesmanName: '',
		salesmanPhone: '',
		settleType: undefined,
		startTime: '',
		status: undefined,
		totalPrice: undefined,
	};
};

export type QueryContractParams = {
	current: number;
	pageSize: number;
	contractNumber?: string;
	contractName?: string;
	clientName?: string;
};

export const initQueryContract: QueryContractParams = {
	contractNumber: undefined,
	contractName: undefined,
	clientName: undefined,
	current: 1,
	pageSize: 10,
};

export const columns: TableColumns<Contract> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'contractNumber', dataIndex: 'contractNumber', title: '合同编号', width: 160 },
	{ key: 'contractName', dataIndex: 'contractName', title: '合同名称', ellipsis: true },
	{ key: 'clientName', dataIndex: 'clientName', title: '签约客户', ellipsis: true },
	{ key: 'contractType', dataIndex: 'contractType', title: '合同类型', width: 90 },
	{ key: 'totalPrice', dataIndex: 'totalPrice', title: '合同金额(元)', align: 'right', width: 120, ellipsis: true },
	{ key: 'salesmanName', dataIndex: 'salesmanName', title: '销售员', ellipsis: true },
	{ key: 'deployType', dataIndex: 'deployType', title: '部署方式', ellipsis: true },
	{ key: 'status', dataIndex: 'status', title: '合同状态', ellipsis: true },
	{ key: 'createTime', dataIndex: 'createTime', title: '创建时间', ellipsis: true },
	{ key: 'operation', dataIndex: 'operation', title: '操作', fixed: 'right', ellipsis: true },
];
