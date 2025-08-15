import { ColumnsType } from 'ant-design-vue/es/table/interface';
import useUserStore from '@/store/modules/useUserStore.ts';

export type Brokerage = {
	contractId: string;
	brokerageAmount: string;
	settleAmount: string;
	contractName: string;
	clientName: string;
	salesmanId: string;
	salesmanName: string;
	contactPhone: string;
} & BaseEntity;

export const initBrokerage = (): Brokerage => {
	const { user } = useUserStore();
	return {
		brokerageAmount: '',
		clientName: '',
		contactPhone: '',
		contractId: '',
		contractName: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		id: '',
		lastUpdateTime: '',
		salesmanId: '',
		salesmanName: '',
		settleAmount: '',
	};
};

export const columns: ColumnsType<Brokerage> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'clientName', dataIndex: 'clientName', title: '客户端名称', ellipsis: true },
	{ key: 'contractName', dataIndex: 'contractName', title: '合同名称', ellipsis: true },
	{ key: 'salesmanName', dataIndex: 'salesmanName', title: '销售员', ellipsis: true },
	{ key: 'contactPhone', dataIndex: 'contactPhone', title: '联系电话', ellipsis: true },
	{ key: 'settleAmount', dataIndex: 'settleAmount', title: '应提成金额(元)', align: 'right', ellipsis: true },
	{ key: 'brokerageAmount', dataIndex: 'brokerageAmount', title: '已提成金额', align: 'right', ellipsis: true },
	{ key: 'operation', title: '操作', width: 80, fixed: 'right' },
];

export type QueryClientParams = {
	current: number;
	pageSize: number;
};
