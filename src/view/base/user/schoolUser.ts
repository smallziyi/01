import { ColumnsType } from 'ant-design-vue/es/table/interface';
import useUserStore from '@/store/modules/useUserStore.ts';

// id 数据的id，编辑传  types 用户类型  idType 1 部门  2教研室 3班级
export type SelectUserParams = {
	id?: string;
	types: number[];
	idType?: number;
};

export const openCreate = ref<boolean>(false);

export const initUser = (roleCode: string): User => {
	const { user } = useUserStore();
	return {
		nativePlace: '',
		roleList: [],
		address: '',
		avatarId: '',
		birthday: '',
		clientId: user.value!.clientId,
		clientName: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		disable: false,
		email: '',
		gender: undefined,
		id: '',
		idCard: '',
		lastUpdateTime: '',
		name: '',
		number: '',
		permissions: [],
		phone: '',
		roleCode,
	};
};

export const columns: ColumnsType<User> = [
	{ key: 'index', title: '序号', width: 60, align: 'center' },
	{ dataIndex: 'name', key: 'name', title: '姓名', width: 120, ellipsis: true },
	{ dataIndex: 'number', key: 'number', title: '编号', width: 120, ellipsis: true },
	{ dataIndex: 'phone', key: 'phone', title: '联系电话', width: 150 },
	{ dataIndex: 'birthday', key: 'birthday', title: '年龄', width: 80 },
	{ dataIndex: 'gender', key: 'gender', title: '性别', width: 80 },
	{ dataIndex: 'idCard', key: 'idCard', title: '身份证号', ellipsis: true, width: 200 },
	{ dataIndex: 'address', key: 'address', title: '地址', ellipsis: true, width: 200 },
	{ dataIndex: 'disable', key: 'disable', title: '状态', ellipsis: true },
	{ title: '操作', key: 'operation', fixed: 'right', width: 60, ellipsis: true },
];

export type UserTypeQuery = {
	clientId: string;
	code?: string;
	name?: string;
	number?: string;
	phone?: string;
	pageSize: number;
	current: number;
	disable?: boolean;
};

export const initUserTypeQuery = (code: string): UserTypeQuery => {
	const { user } = useUserStore();
	return {
		name: undefined,
		number: undefined,
		phone: undefined,
		pageSize: 10,
		current: 1,
		code,
		clientId: user.value!.clientId,
	};
};
