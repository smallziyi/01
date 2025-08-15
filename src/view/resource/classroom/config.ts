export type Classroom = {
	clientId: string;
	name: string;
	source: number;
	nature: number;
	type: number;
	typeDictionaryId: number;
	constructStatus: number;
	mangerId: string;
	mangerName: string;
	location: string;
	description: string;
	capacity: number;
	coverId: string;
	coverUrl: string;
	disable: number;
} & BaseEntity;

export type ClassroomAdd = Partial<Classroom>;
export type ClassroomQuery = Partial<
	Pick<
		Classroom,
		'name' | 'source' | 'nature' | 'type' | 'typeDictionaryId' | 'mangerId' | 'disable' | 'constructStatus' | 'location'
	>
>;

export type ClassroomTechPlan = {
	teachPlanId: string;
	courseData: {
		relationReportId: string;
		relationReportName: string;
		courseName: string;
		courseType: string;
		courseNature: string;
		description: string;
		coverId: string;
		coverUrl: string;
		domainId: string;
		domainName: string;
	};

	groupData: Array<{
		groupId: string;
		groupName: string;
		domainId: string;
		domainName: string;
		collegeId: string;
		collegeName: string;
	}>;

	coursePlanData: {
		classRoomId: string;
		classRoomName: string;
		startTime: string;
		endTime: string;
		location: string;
		teacherId: string;
		teacherName: string;
		phone: string;
	};
};

export type ClassroomTechPlanDetails = Classroom & {
	classroomTeachPlanList: Array<ClassroomTechPlan>;
};

export const sourceOption: Option[] = [
	{ value: 1, label: '校内实训基地' },
	{ value: 2, label: '校外实训基地' },
];

export const natureOption: Option[] = [
	{ value: 1, label: '学校自建校内实训基地' },
	{ value: 2, label: '校企共建校内实训基地' },
	{ value: 3, label: '企业建设校内实训基地' },
	{ value: 4, label: '企业自建企业实训基地' },
	{ value: 5, label: '校企共建企业实训基地' },
	{ value: 6, label: '学校自建企业实训基地' },
];

export const typeOption: Option[] = [
	{ value: 1, label: '生产性实训基地' },
	{ value: 2, label: '虚拟仿真实训基地' },
];

export const disableOption: Option[] = [
	{ value: 0, label: '启用' },
	{ value: 1, label: '停用' },
];

export const constructStatusOption: Option[] = [
	{ value: 1, label: '筹备中' },
	{ value: 2, label: '建设中' },
	{ value: 3, label: '已建成' },
];

export enum ENABLED_STATE {
	PLAN = 1,
	BUILDING,
	BUILDED,
}

export type CourseArrangement = {
	id: string;
	time: string;
	courseInfo: {
		courseName: string;
		courseNatureName: string;
		courseTypeName: string;
		coverUrl: string;
	};
	// classRoomName: string;
	// location: string;
	teacherName: string;
	contact: string;
};

export type OtherArrangement = {
	key: string;
	item: string;
	class?: string;
	startTime: string;
	endTime: string;
	description: string;
};

export type DateListAndOptions = {
	dateList: Array<string>;
	options: Array<Option>;
};

export const courseArrangementColumns: TableColumns<CourseArrangement> = [
	{ key: 'time', title: '上课时间', dataIndex: 'time' },
	{ key: 'courseInfo', title: '课程信息', dataIndex: 'courseInfo' },
	{ key: 'teacherName', title: '授课教师', dataIndex: 'teacherName' },
	{ key: 'contact', title: '联系方式', dataIndex: 'contact' },
	{ key: 'operation', title: '操作', dataIndex: 'operation' },
	// { key: 'classRoomName', title: '实训室名称', dataIndex: 'classRoomName' },
	// { key: 'location', title: '实训室地点', dataIndex: 'location' },
];

export const otherArrangementColumns: TableColumns<OtherArrangement> = [
	{ key: 'item', title: '事项', dataIndex: 'item' },
	{ key: 'class', title: '课节/时段', dataIndex: 'class' },
	{ key: 'startTime', title: '开始时间', dataIndex: 'startTime' },
	{ key: 'endTime', title: '结束时间', dataIndex: 'endTime' },
	{ key: 'description', title: '事项描述', dataIndex: 'description' },
	{ key: 'operation', title: '操作', dataIndex: 'operation', width: 130 },
];
