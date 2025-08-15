import { ColumnsType } from 'ant-design-vue/es/table/interface';
import useUserStore from '@/store/modules/useUserStore.ts';

export type Salesman = {
	salesmanName: string;
	contactPhone: string;
	contactEmail: string;
	idCard: string;
	disable: boolean;
	type: number | undefined;
	percentage: number;
	area: string;
	settleCycle: number | undefined;
	signedCount: number;
	signedAmount: number;
	dividendAmount: number;
} & BaseEntity;

export const initSalesman = (): Salesman => {
	const { user } = useUserStore();
	return {
		area: '',
		contactEmail: '',
		contactPhone: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		disable: false,
		dividendAmount: 0,
		id: '',
		idCard: '',
		lastUpdateTime: '',
		percentage: 0,
		salesmanName: '',
		settleCycle: undefined,
		signedAmount: 0,
		signedCount: 0,
		type: undefined,
	};
};

export const SalesmanTypeOptions: Option[] = [
	{ label: '一级代理商', value: 1 },
	{ label: '二级代理商', value: 2 },
	{ label: '三级代理商', value: 3 },
	{ label: '专职销售', value: 4 },
	{ label: '兼职销售', value: 5 },
	{ label: '其他', value: 6 },
];

export const SettleCycleOptions: Option[] = [
	{ label: '按次', value: 1 },
	{ label: '按月', value: 2 },
	{ label: '按季度', value: 3 },
	{ label: '按年', value: 4 },
];

export const columns: ColumnsType<Salesman> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ dataIndex: 'salesmanName', key: 'salesmanName', title: '姓名', ellipsis: true },
	{ dataIndex: 'contactPhone', key: 'contactPhone', title: '联系电话', ellipsis: true },
	{ dataIndex: 'contactEmail', key: 'contactEmail', title: '联系邮箱' },
	{ dataIndex: 'disable', key: 'disable', title: '状态', ellipsis: true, width: 100 },
	{ dataIndex: 'type', key: 'type', title: '类型', ellipsis: true },
	{ dataIndex: 'settleCycle', key: 'settleCycle', title: '结算周期', width: 100 },
	{ dataIndex: 'percentage', key: 'percentage', title: '提成比例', width: 80 },
	{ key: 'operation', title: '操作', fixed: 'right', width: 120 },
];

export type QuerySalesmanParams = {
	current: number;
	pageSize: number;
};
