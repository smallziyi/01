import { Dayjs } from 'dayjs';
import { REPORT_TYPE } from './config';
// 报告类型 1: 企业调研  2: 人才培养方案  3: 课程结构  4: 课程标准 5: 活页式教材
export type ReportType = (typeof REPORT_TYPE)[keyof typeof REPORT_TYPE];
// 报告页面类型 1: 管理列表  2： 审核列表
export type ReportPageType = 1 | 2;

// 报告公共字段
export type PublicReportAdd = {
	name?: string;
	menuVersion: number;
	reportType: ReportType;
	copyReportId?: string;
	status: number;
	currentYear: number;
	createType?: number;
	collegeData: DataOption;
	domainData: DataOption;
	majorData: DataOption;
	disable?: boolean;
	majorDetails: ReportMajorDetails;
	startTime: string | Dayjs;
	endTime: string | Dayjs;
	score?: number;
	auditingType?: number;
	coverId?: string;
	coverUrl?: string;
	description: string;
	reportEditorData: Array<ReportUser>;
	reportAuditorData: Array<ReportUser>;
	relationReportId?: string;
	relationReportName: string;
	userAuditFlag?: boolean;
	clientId: string;
	submitUserId: string;
	wordFileId?: string;
} & BaseEntity;

type OtherField = {
	industryName: string;
	industryCode: string;
	enrollmentTarget: string;
	grade: string;
	qualification: string;
	learningModality: string;
	courseName: string;
	courseType: string;
	courseNature: string;
	certificateLevel: string;
	certificateName: string;
	// 校历
	domainIds: string[];
	domainList: Array<
		{
			collegeNameArray: string;
			domainMajorDataList: {
				code: string;
				id: number;
				isMain: boolean;
				name: string;
				parentCode: string;
			}[][];
		} & BaseEntity
	>;
};

export type ReportField = {
	reportProgress: string;
	otherField: Partial<OtherField>;
} & PublicReportAdd;

export type ReportUser = {
	userId: string;
	userName?: string;
	phone?: string;
	number?: string;
	isSubmitter: boolean;
};

export type ReportMajorDetails = {
	bigCategoryName: string;
	bigCategoryCode: string;
	categoryName: string;
	categoryCode: string;
	typeName: string;
	typeCode: string;
	target: string;
};

export type QueryReportCardParams = {
	// 公共查询参数
	reportType: ReportType;
	pageType: ReportPageType;
	name?: string;
	currentYear?: number;
	domainId?: string;
	status?: number;
	ascFlag?: boolean;
	startTime?: string;
	endTime?: string;
	// 企业调研
	industryName?: string;
	// 人才培养方案
	relationReportId?: string;
	grade?: string;
	enrollmentTarget?: string;
	qualification?: string;
	learningModality?: string;
	// 课程标准
	courseName?: string;
	courseType?: string;
	courseNature?: string;
};
// 报告审核状态
export type ReportStatusStatistic = {
	2: number; // 编辑中
	3: number; // 已驳回
	4: number; // 审核中
	5: number; // 审核通过
	6: number; // 审核未通过
};

export type ReportTypeStatistic = {
	time: string;
	message: string;
	remainingTime: {
		// 1. 距开始 2. 距离结束 3.超时
		key: 1 | 2 | 3;
		value: string;
	};
};
export type ReportStatusCountByMonth = {
	years: string[];
	editCounts: number[];
	auditCounts: number[];
	passCounts: number[];
	rejectedCounts: number[];
	notPassCounts: number[];
};

export type TableDataGeneric =
	| TableData
	| SurveyContentBackground
	| SurveyContentMeaning
	| SurveyContentOtherSuggest
	| CourseStandardPreparationNote
	| CourseOverviewTable
	| ProfessionalCourseSystemTable
	| string
	| object;

export type ReportTable<T extends TableDataGeneric = object> = {
	reportId: string;
	menuId: string;
	name: string;
	number?: string;
	type: string;
	sort?: number;
	tableData: T;
	fileId?: string;
	tableDescription?: string;
} & BaseEntity;

export type ReportAuditTableRecord = {
	reportId: string;
	menuId: string;
	tableId: string;
	reportAuditStatus?: number;
	auditDataList: Array<CommentRecord>;
	auditDataTree: Array<CommentRecordTree>;
} & BaseEntity;

export type CommentRecord = {
	id: string;
	parentId: string;
	userId: string;
	userName?: string;
	avatarUrl?: string;
	auditStatus: number;
	opinion: string;
	createTime: string;
	cellIds: Array<number>;
};

export type CommentRecordTree = {
	children?: Array<CommentRecord>;
} & CommentRecord;

export type ReportError = {
	menuId: string;
	tableIdList: Array<string>;
};

export type ReportAction = {
	reportId: string;
	userId: string;
	// 1: 提交 2: 审核
	actionType: 1 | 2;
	// 1: 提交审核 2: 驳回  3: 审核通过 4: 审核不通过
	operationType: 1 | 2 | 3 | 4;
	opinion?: string | number;
};

export type ReportApprovalRecords = {
	reportId: string;
	userId: string;
	actionType: number;
	operationType: number;
	opinion: string;
	userName: string;
	operationResult: string;
} & BaseEntity;

// 企业调研背景
export type SurveyContentBackground = {
	background_detail_1: string;
	background_detail_2: string;
	background_detail_3: string;
};
// 企业调研意义
export type SurveyContentMeaning = {
	meaning_detail_1: string;
	meaning_detail_2: string;
	meaning_detail_3: string;
};
// 企业调研其他建议
export type SurveyContentOtherSuggest = {
	value: string;
};

// 课程标准编制表
export type CourseStandardPreparationNote = {
	organization: string;
	professionalNameCode: string;
	professionalCategoriesCode: string;
	courseNameAndCode: string;
	writer: string;
	leadingMember: string;
	reviewer: string;
	specifyDate: string;
	revisionDate: string;
};

// 课程概述表
export type CourseOverviewTable = {
	courseName: string;
	courseManagementUnit: string;
	readingNature: string;
	assessmentNature: string;
	professionalCode: string;
	openingSemester: string;
	leadingCourse: string;
	subsequentCourses: string;
	totalCreditHours: string;
	credit: string;
	courseType: string[];
	supportingPersonnelTrainingPlan: string;
};

// 专业课程体系总表
export type ProfessionalCourseSystemTable = {
	mapData: Record<string, string[]>;
	// 1: 通用 2: 专用 3: 拓展 4: 公共基础课程
	courseNature: number;
	courseResource: Array<string>;
	baseCourse: Array<string>;
}[];

export interface Node {
	name: string;
	id: string;
	parentId: string;
	type: string;
	children?: Node[];
}
// 结构树新增
export type AddTreeStructuresParams = {
	reportId: string;
	structureDataList: Node[] | StructureData[];
};

// 课程体系结构树
export type AddStructureTreeParams = Array<
	{
		reportId: string;
	} & StructureData
>;

export type DataOption = {
	label?: string;
	value?: string;
};

export type OccupationQuality = {
	task: string;
	workMethod: string;
	workObject: string;
	tool: string;
	ethics: string;
	workOrganization: string;
	targetValue: string;
	product: string;
};

// 课程开发，职业要求表结构
export type StructureData = {
	id: string;
	parentId: string;
	name: string;
	sort?: number;
	data?: string;
	level: number;
	type: 'studyContext' | 'studyTask' | 'studyStep' | 'studyOccupationQuality';
	occupationQualityData?: OccupationQuality[];
	occupationQuality?: OccupationQuality;
	children: StructureData[];
};

export interface ReportMenuCourse extends BaseEntity {
	name: string;
	reportId: string;
	parentId: string;
	type: string;
	level: string;
	sort: string;
	occupationQualityData: Array<{
		task: string;
		workMethod: string;
		workObject: string;
		tool: string;
		ethics: string;
		workOrganization: string;
		targetValue: string;
		product: string;
	}>;
	tableFormData: [
		{
			auditRecordData: AuditRecordData | null;
			type: string;
			data: TaskForm;
			editedFlag: boolean;
			tableId: string;
			showFlag: boolean;
		},
		{
			auditRecordData: AuditRecordData | null;
			type: string;
			data: MaterialToolsData;
			editedFlag: boolean;
			tableId: string;
			showFlag: boolean;
		},
		{
			auditRecordData: AuditRecordData | null;
			type: string;
			data: ImplementationPlanDetails;
			editedFlag: boolean;
			tableId: string;
			showFlag: boolean;
		},
	];
	tableFormLearnPointsData: Array<TableFormLearnPoint>;
	questionData: Array<string>;
}

export interface TableFormLearnPoint {
	tableId: string;
	sentencePartList: Array<SentencePartData>;
}

export interface SentencePartData {
	sentencePartList: Array<SentencePart>;
	learnPointsCellId: string;
}

export interface SentencePart {
	isMark: boolean;
	text: string;
}

interface BaseTextbookData {
	studyName: string;
	contextName: string;
	taskName: string;
	totalTime: string;
	workProcess: string;
	referenceResourceList: Array<{ fileName: string; fileId: string; fileUrl: string }>;
	referenceResourceNameList: Array<string>;
}
// 资讯单
export interface InformationFormData extends BaseTextbookData {
	searchInformationMethod: Array<string>;
	stepDescriptionList: Array<WorkStepDetail>;
	stepRequirementList: {
		stepName: string;
		workStepDetails: Array<{ taskName: string; taskContent: string }>;
		files: Array<{ fileId: string; fileName: string; fileUrl: string }>;
	};
}

// 计划单
export interface PlanFormData extends BaseTextbookData {
	planMethodList: Array<string>;
	stepDescriptionList: Array<WorkStepDetail>;
}

//决策单
export interface DecisionFormData extends BaseTextbookData {
	planContrastList: Array<{
		feasibility: string; //计划的可行性
		accuracy: string; //计划的准确性
		operational: string; // 计划的可操作性
		implementationDifficulty: string; //计划的实施难度
		comprehensiveEvaluation: string; // 综合评价
	}>;
}

// 实施单
export interface ImplementFormData extends BaseTextbookData {
	stepDescriptionList: Array<WorkStepDetail>;
}

// 检查单
export interface CheckFormData extends BaseTextbookData {
	checkList: Array<{
		checkItem: string;
		standard: string;
		studentSelfCheck: string;
		studentMutualCheck: string;
		taskContentId: string;
		taskNameId: string;
	}>;
}

// 评价单
export interface EvaluationFormData extends BaseTextbookData {
	evaluateList: Array<{
		stageResult: string;
		evaluationDimension: string;
		groupSelfEvaluation: string;
		groupMutualEvaluation: string;
		teacherMutualEvaluation: string;
	}>;
}

export interface TaskForm extends BaseTextbookData {
	learnGoalList: Array<Array<string>>;
	taskDescriptionList: Array<{
		stepName: string;
		workStepDetails: Array<WorkStepDetail>;
		files: Array<{ fileId: string; fileName: string; fileUrl: string }>;
	}>;
	timeArrange: { 1: string; 2: string; 3: string; 4: string; 5: string; 6: string };
	requirementList: Array<{
		stepName: string;
		workStepDetails: Array<WorkStepDetail>;
		files: Array<{ fileId: string; fileName: string; fileUrl: string }>;
	}>;
}

export interface MaterialToolsData extends BaseTextbookData {
	materialToolsDetails: Array<{
		name: string;
		function: string;
		number: string;
		model: string;
		used: string;
		user: string;
	}>;
}

export interface ImplementationPlanDetails extends BaseTextbookData {
	implementationPlanDetails: Array<{
		stepName: string;
		totalTime: string;
		useTool: string;
		place: string;
		teachingMethod: string;
		notes: string;
	}>;
}

export interface WorkStepDetail {
	taskName: string;
	taskContent: string;
	taskNameId: string;
	taskContentId: string;
}

export const defaultTaskFormData: TaskForm = {
	studyName: '',
	contextName: '',
	taskName: '',
	totalTime: '',
	workProcess: '',
	referenceResourceList: [],
	referenceResourceNameList: [],
	learnGoalList: [],
	timeArrange: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' },
	taskDescriptionList: [],
	requirementList: [],
};

export type LooseLeafFormData =
	| InformationFormData
	| PlanFormData
	| DecisionFormData
	| ImplementFormData
	| CheckFormData
	| EvaluationFormData;

export type TableDefaultLooseLeaf = [
	LooseLeaf<InformationFormData>,
	LooseLeaf<PlanFormData>,
	LooseLeaf<DecisionFormData>,
	LooseLeaf<ImplementFormData>,
	LooseLeaf<CheckFormData>,
	LooseLeaf<EvaluationFormData>,
];

export type LooseLeaf<T extends LooseLeafFormData> = {
	auditRecordData: AuditRecordData | null;
	type: '1' | '2' | '3' | '4' | '5' | '6';
	data: T;
	editedFlag: boolean;
	tableId: string;
	showFlag: boolean;
};

export const defaultLooseLeafFormData: TableDefaultLooseLeaf = [
	{
		auditRecordData: {
			userId: '',
			createTime: '',
		},
		type: '1',
		data: {
			studyName: '',
			contextName: '',
			taskName: '',
			totalTime: '',
			workProcess: '',
			referenceResourceList: [],
			referenceResourceNameList: [],
			searchInformationMethod: [],
			stepDescriptionList: [],
			stepRequirementList: {
				stepName: '',
				workStepDetails: [],
				files: [],
			},
		},
		tableId: '',
		editedFlag: false,
		showFlag: false,
	},
	{
		auditRecordData: {
			userId: '',
			createTime: '',
		},
		type: '2',
		data: {
			studyName: '',
			contextName: '',
			taskName: '',
			totalTime: '',
			workProcess: '',
			referenceResourceList: [],
			referenceResourceNameList: [],
			planMethodList: [],
			stepDescriptionList: [],
		},
		showFlag: false,
		tableId: '',
		editedFlag: false,
	},
	{
		auditRecordData: {
			userId: '',
			createTime: '',
		},
		type: '3',
		data: {
			studyName: '',
			contextName: '',
			taskName: '',
			totalTime: '',
			workProcess: '',
			referenceResourceList: [],
			referenceResourceNameList: [],
			planContrastList: [],
		},
		tableId: '',
		editedFlag: false,
		showFlag: false,
	},
	{
		auditRecordData: {
			userId: '',
			createTime: '',
		},
		type: '4',
		data: {
			studyName: '',
			contextName: '',
			taskName: '',
			totalTime: '',
			workProcess: '',
			referenceResourceList: [],
			referenceResourceNameList: [],
			stepDescriptionList: [],
		},
		tableId: '',
		editedFlag: false,
		showFlag: false,
	},
	{
		auditRecordData: {
			userId: '',
			createTime: '',
		},
		type: '5',
		data: {
			studyName: '',
			contextName: '',
			taskName: '',
			totalTime: '',
			workProcess: '',
			referenceResourceList: [],
			referenceResourceNameList: [],
			checkList: [],
		},
		tableId: '',
		editedFlag: false,
		showFlag: false,
	},
	{
		auditRecordData: {
			userId: '',
			createTime: '',
		},
		type: '6',
		data: {
			studyName: '',
			contextName: '',
			taskName: '',
			totalTime: '',
			workProcess: '',
			referenceResourceList: [],
			referenceResourceNameList: [],
			evaluateList: [],
		},
		tableId: '',
		editedFlag: false,
		showFlag: false,
	},
];

export interface ReportMenuLooseLeaf extends Omit<ReportMenuCourse, 'tableFormData'> {
	tableFormData: TableDefaultLooseLeaf;
}

export const defaultReportLooseLeafFormData: ReportMenuLooseLeaf = {
	name: '',
	reportId: '',
	parentId: '',
	type: '',
	level: '',
	sort: '',
	occupationQualityData: [
		{
			task: '',
			workMethod: '',
			workObject: '',
			tool: '',
			ethics: '',
			workOrganization: '',
			targetValue: '',
			product: '',
		},
	],
	tableFormData: defaultLooseLeafFormData,
	tableFormLearnPointsData: [],
	id: '',
	createBy: '',
	createUser: '',
	createTime: '',
	lastUpdateTime: '',
	questionData: [],
};

export type AuditRecordData = {
	userId: string;
	createTime: string;
	userName?: string;
	avatarUrl?: string;
};

export type UpdateParams = {
	tableId: string;
	auditRecordData: AuditRecordData;
};

