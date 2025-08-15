import useUserStore from '@/store/modules/useUserStore.ts';

export type Group = {
	clientId: string;
	domainName: string;
	domainId?: string;
	collegeId?: string;
	collegeName: string;
	name: string;
	year?: number;
	grade?: string;
	disable: boolean;
	teacherData: string[];
	studentData: string[];
	teacherId: string;
	teacherName: string;
} & BaseEntity;

export type GroupMember = {
	teacherList: User[];
	studentList: User[];
};

export function initGroup(): Group {
	const { user } = useUserStore();
	return {
		clientId: user.value!.clientId,
		collegeId: undefined,
		collegeName: '',
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		disable: false,
		domainId: undefined,
		domainName: '',
		grade: undefined,
		id: '',
		lastUpdateTime: '',
		name: '',
		studentData: [],
		teacherData: [],
		teacherId: '',
		teacherName: '',
	};
}

export type QueryGroupParam = {
	collegeId: string | undefined;
	domainId: string | undefined;
	year: string | undefined;
	name: string;
	disable: number | undefined;
	current: number;
	pageSize: number;
};

export const initQueryGroupParams = (): QueryGroupParam => {
	return {
		collegeId: undefined,
		domainId: undefined,
		year: undefined,
		name: '',
		disable: undefined,
		current: 1,
		pageSize: 10,
	};
};

export const gradeList: Option[] = [
	{ value: 1, label: '一年制' },
	{ value: 2, label: '二年制' },
	{ value: 3, label: '三年制' },
	{ value: 4, label: '四年制' },
	{ value: 5, label: '五年制' },
	{ value: 6, label: '六年制' },
];

export const columns: TableColumns<Group[]> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'name', dataIndex: 'name', title: '班级' },
	{ key: 'collegeName', dataIndex: 'collegeName', title: '所属院系' },
	{ key: 'domainName', dataIndex: 'domainName', title: '所学专业' },
	{ key: 'year', dataIndex: 'year', title: '学级' },
	{ key: 'grade', dataIndex: 'grade', title: '学制' },
	{ key: 'teacherCount', dataIndex: 'teacherCount', title: '教师数量', width: 80 },
	{ key: 'studentCount', dataIndex: 'studentCount', title: '学生数量', width: 80 },
	{ key: 'disable', dataIndex: 'disable', title: '状态' },
	{ key: 'operation', fixed: 'right', title: '操作', width: 120 },
];
