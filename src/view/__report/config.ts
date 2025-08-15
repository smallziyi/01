import { ReportField, ReportType, ReportUser } from '@/view/__report/type.ts';
import useUserStore from '@/store/modules/useUserStore.ts';

const { user } = useUserStore();

// 报告页面审核类型
export enum REPORT_PAGE_TYPE {
	EDIT = 1,
	AUDIT,
}
// 报告类型
export enum REPORT_TYPE {
	SURVEY = 1,
	CULTIVATE,
	STRUCTURE,
	STANDARD,
	TEXTBOOK,
	GUIDEBOOK,
	WORKBOOK,
	STUDYBOOK,
	CALENDAR,
}

// 报告审核状态
export enum APPROVE_STATUS {
	DRAFT = 1,
	EDITING,
	REJECTED,
	APPROVING,
	APPROVED,
	DISAPPROVED,
}

export const columnsEdit: TableColumns<ReportUser> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'userName', title: '姓名', dataIndex: 'userName' },
	{ key: 'number', title: '工号', dataIndex: 'number' },
	{ key: 'phone', title: '电话', dataIndex: 'phone' },
	{ key: 'leader', title: '是否为提交人' },
	{ key: 'action', title: '操作' },
];
export const columnsAudit: TableColumns<ReportUser> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'userName', title: '姓名', dataIndex: 'userName' },
	{ key: 'number', title: '工号', dataIndex: 'number' },
	{ key: 'phone', title: '电话', dataIndex: 'phone' },
	{ key: 'action', title: '操作' },
];

export const REPORT_STATUS: Record<number, { label: string; edit_search: boolean; audit_search: boolean }> = {
	1: { label: '草稿', edit_search: false, audit_search: false },
	2: { label: '编辑中', edit_search: true, audit_search: false },
	3: { label: '已驳回', edit_search: true, audit_search: true },
	4: { label: '审核中', edit_search: true, audit_search: true },
	5: { label: '审核通过', edit_search: true, audit_search: true },
	6: { label: '审核未通过', edit_search: true, audit_search: true },
};

export const auditingTypeOption: Option[] = [
	{
		label: '逐级审核',
		value: 1,
	},
	{
		label: '平级审核',
		value: 2,
	},
	{
		label: '评分审核',
		value: 3,
	},
];

export const initReportAll = (reportType: ReportType): ReportField => ({
	id: '',
	createBy: user.value!.id,
	createUser: user.value!.name,
	createTime: '',
	lastUpdateTime: '',
	reportProgress: '',
	clientId: user.value!.clientId,
	name: undefined, // 报告名称
	menuVersion: 1, // 菜单版本号
	reportType, // 报告类型
	status: 1, // 报告状态
	currentYear: new Date().getFullYear(), // 关联学年
	collegeData: {
		label: undefined,
		value: undefined,
	},
	domainData: { label: undefined, value: undefined },
	majorData: { label: undefined, value: undefined },
	majorDetails: {
		bigCategoryName: '',
		bigCategoryCode: '',
		categoryName: '',
		categoryCode: '',
		typeName: '',
		typeCode: '',
		target: '',
	},
	startTime: '', // 开始时间
	endTime: '', // 结束时间
	description: '', // 描述
	reportEditorData: [], // 编辑人列表
	reportAuditorData: [], // 审核人列表
	relationReportId: undefined, // 关联报告 Id
	relationReportName: '', // 关联报告名称
	submitUserId: '', // 提交人 Id
	disable: false, // 是否禁用
	createType: 1, // 创建方式
	otherField: {
		// 已修正拼写错误：otherFiled -> otherField
		// 企业调研
		industryName: undefined,
		industryCode: undefined,
		// 人才培养方案
		enrollmentTarget: undefined,
		grade: undefined,
		qualification: undefined,
		learningModality: undefined,
		// 课程标准
		courseType: undefined,
		courseNature: undefined,
		certificateLevel: undefined,
		certificateName: undefined,
		//校历
		domainIds: undefined,
	},
});

export const ReportEditStatus = [2, 3];

//
export enum SCREEN_CARD_TYPE {
	COLLEGE_INTRO = 1,
	ACHIEVEMENT,
	CONSTRUCTION_DYNAMICS,
	DATA_INDICATOR_MAP,
	PUBLIC_INFO,
}

export enum SCREEN_NUM_TYPE {
	SURVEY = 1,
	CULTIVATE,
	STRUCTURE,
	STANDARD,
	TEXTBOOK,
	GUIDEBOOK,
	WORKBOOK,
	STUDYBOOK,
	CALENDAR,
}

export enum SCREEN_SOURCE_ENUM {
	MAJOR_CONSTRUCTION = 1,
	COURSE_CONSTRUCTION,
	TEACHING_CONSTRUCTION,
	TEACHING_REFORM,
	PRACTICE_BASE,
	TEACHER_CONSTRUCTION,
	STUDENT_DEVELOPMENT,
	BASE,
	RECOGNITION,
	SKILLS,
	QUALITY,
	PROFESSIONAL_ABILITY,
	CUSTOMIZE,
}

export enum SCREEN_SWIPER_ENUM {
	INDICATOR = 1,
	BAR_CHART,
	PIE_CHART,
	RING_CHART,
	LINE_CHART,
	RADAR_CHART,
}

export interface DateDataType {
	dateDay: string;
	dateYear: string;
	dateWeek: string;
	timing: NodeJS.Timer | any;
}

export interface CountUpOptions {
	startVal?: number; // number to start at (0)
	decimalPlaces?: number; // number of decimal places (0)
	duration?: number; // animation duration in seconds (2)
	useGrouping?: boolean; // example: 1,000 vs 1000 (true)
	useEasing?: boolean; // ease animation (true)
	smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
	smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
	separator?: string; // grouping separator (',')
	decimal?: string; // decimal ('.')
	// easingFn: easing function for animation (easeOutExpo)
	easingFn?: (t: number, b: number, c: number, d: number) => number;
	formattingFn?: (n: number) => string; // this function formats result
	prefix?: string; // text prepended to result
	suffix?: string; // text appended to result
	numerals?: string[]; // numeral glyph substitution
	enableScrollSpy?: boolean; // start animation when target is in view
	scrollSpyDelay?: number; // delay (ms) after target comes into view
	scrollSpyOnce?: boolean; // run only once
}
