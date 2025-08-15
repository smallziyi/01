import { ColumnsType } from 'ant-design-vue/es/table/interface';
import useUserStore from '@/store/modules/useUserStore.ts';

export type Client = {
	clientName: string;
	clientId: string;
	clientCode: string;
	type: number | undefined;
	disable: boolean;
	address: string[] | undefined;
	// formatAddress: string[] | undefined;
	logoId: string;
	contactName: string;
	contactPhone: string;
	contactEmail: string;
	authAccount?: string;
	password?: string;
	name?: string;
	phone?: string;
	email?: string;
} & BaseEntity;

export const initClient = (): Client => {
	const { user } = useUserStore();
	return {
		address: undefined,
		clientCode: '',
		// formatAddress: undefined,
		clientName: '',
		clientId: '',
		contactEmail: '',
		contactName: '',
		contactPhone: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		disable: false,
		id: '',
		lastUpdateTime: '',
		logoId: '',
		type: undefined,
		authAccount: undefined,
		password: undefined,
		name: undefined,
		phone: undefined,
		email: undefined,
	};
};

export const ClientTypeOptions: { label: string; value: number }[] = [
	{ label: '学校端', value: 2 },
	{ label: '教育局端', value: 3 },
];

export type QueryClientParams = {
	clientName?: string;
	type?: number;
	current: number;
	pageSize: number;
};

export const initQueryParams: QueryClientParams = {
	clientName: undefined,
	type: undefined,
	current: 1,
	pageSize: 10,
};

export const columns: ColumnsType<Client> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ dataIndex: 'clientName', key: 'clientName', title: '客户端名称', ellipsis: true },
	{ dataIndex: 'type', key: 'type', title: '客户端类型', width: 90 },
	{ dataIndex: 'clientCode', key: 'clientCode', title: '编码', width: 60 },
	{ dataIndex: 'addressName', key: 'addressName', title: '地址', ellipsis: true },
	{ dataIndex: 'contactName', key: 'contactName', title: '联系人', width: 60, ellipsis: true },
	{ dataIndex: 'contactPhone', key: 'contactPhone', title: '联系电话' },
	{ dataIndex: 'createTime', key: 'createTime', title: '注册日期' },
	{ dataIndex: 'adminUserName', key: 'adminUserName', title: '管理员姓名', width: 90, ellipsis: true },
	{ key: 'operation', title: '操作', fixed: 'right', width: 180 },
];
