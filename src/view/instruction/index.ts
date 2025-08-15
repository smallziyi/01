import { Dayjs } from 'dayjs';

export interface TeachStructure {
	teachPlanId: string;
	groupDataList: Array<{
		groupId: string;
		groupName: string;
		students: Array<{
			userId: string;
			name: string;
			number: string;
			gender: string;
			avatarUrl: string;
			signInFlag: boolean;
		}>;
	}>;
}

export interface TeachPlan extends BaseEntity {
	teachPlanId: string;
	clientId: string;
	relationReportId: string;
	calendarId: string;
	calendarPlanId: string;
	courseTreeNodes: string[];
	timeSlotId: string;
	teachDate: Dayjs;
	classroomId: string;
	teacherId: string;
	issueBeforePreviewFlag?: boolean;
	issueAfterPracticeFlag?: boolean;
	status: 1 | 2 | 3 | 4;
	groupIdData: string[];
	timeSlotData: string;

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
		relationCalendarId: string;
		relationCalendarName: string;
		treeNodes: [string, string, string, string, string];
		treeNodeNames: [string, string, string];
		courseProgress: string;
		currentCourseName: string;
		classroomDisable: boolean;
		teachDate: string;
		timeSlotScheduleDto: {
			id: string;
			isDelete: string;
			createBy: string;
			createUser: string;
			createTime: string;
			lastUpdateTime: string;
			timePlanData: {
				id: string;
				name: string;
				startTime: string;
				endTime: string;
				dayPartDataList: [];
				useFlag: true;
			};
			dayPartData: {
				dayPartType: number;
				timeSlotData: [];
			};
			timeSlotData: {
				id: string;
				timeSlotName: string;
				sort: number;
				startTime: string;
				endTime: string;
				courseFlag: boolean;
			};
			reportId: string;
		};
		classRoomId: string;
		classRoomName: string;
		location: string;
		teacherId: string;
		teacherName: string;
	};

	teachScene: TeachScene;
}

export interface TeachScene {
	id: string;
	isDelete: false;
	createBy: string;
	createUser: string;
	createTime: string;
	lastUpdateTime: string;
	teachPlanId: string;
	openClassroomFlag: boolean;
	signInFlag: boolean;
	notSignInData: string[];
	team_type: 1 | 2;
	autoTeamSize: number;
	teamDataList: Array<TeamData>;
	beforePreviewDataList: number[];
	afterPracticeDataList: string[];
	afterPracticeFlag: boolean;
	studentEvaluateTeachDataList: Array<StudentEvaluateContent>;
	middlePracticeDataList: Array<MiddlePracticeData>;
}

export type MiddlePracticeData = {
	tableFormType: number;
	time: string;
	duration: number;
};
export interface TeamData {
	id: string;
	name: string;
	sort: number;
	leaderId: string;
	userIds: string[];
	groupId: string;
	groupName: string;
}

export interface AllStudentEvaluateTeachDto {
	tableType: number;
	avgScore: number;
	studentEvaluateContentList: Array<StudentEvaluateContent>;
}
export interface StudentEvaluateContent {
	content: string;
	createTime: string;
}
export interface StudentEvaluateTeachData {
	studentId: string;
	tableEvaluateData: Array<TableEvaluateData>;
	createTime: string;
}
export interface TableEvaluateData {
	tableType: number;
	score: number;
	content: string;
	createTime: string;
}

export type Answer = {
	questionId: string;
	optionIds: string[];
	answerId: string;
	tableFormType?: number;
	correctId?: string;
	analysis?: string;
	source?: string;
	title?: string;
	options?: {
		id: string;
		content: string;
		isCorrect: boolean;
	}[];
};

export type QuestionOptions = {
	id: string;
	content: string;
	isCorrect: boolean;
};

export type QuestionsRecord = {
	tableId: string;
	studentId: string;
	itemScore: number;
	correctRate: string;
	totalScore: number;
	answerTableTime: number;
	afterItemScoreDataList?: Array<number>;
	afterScoreDataList?: Array<number>;
	answerDataList: Array<Answer>;
};

export type StudentAnswer = {
	teachPlanId: string;
	studentId: string;
	tableId?: string;
	tableFormType?: number;
	answerTableType: 1 | 2 | 3;
	answerDataList: Array<Answer>;
};

export interface CalendarSchedule {
	calendarName: string;
	calendarId: string;
	timePlans: {
		id: string;
		name: string;
		startTime: string;
		endTime: string;
		dayPartDataList: {
			dayPartType: number;
			timeSlotData: {
				id: string;
				timeSlotName: string;
				sort: number;
				startTime: string;
				endTime: string;
				courseFlag: boolean;
			}[];
		}[];
		useFlag: boolean;
	}[];
	resourceCalendars: Array<
		{
			reportId: string;
			year: number;
			month: number;
			day: number;
			settingFlag: boolean;
		} & BaseEntity
	>;
	currentYear: number;
}

export type TableColumnsPlan = {
	id: string;
	teachPlanId: string;
	relationReportId: string;
	plan: string;
	time: string;
	info: {
		courseName: string;
		courseType: string;
		courseNature: string;
	};
	content: {
		courseProgress: string;
		currentCourseName: string;
	};
	location: string;
	teacherName: string;
	status: number;
};

export type TeacherActivity = {
	afterPracticeCount: number;
	beforePreviewCount: number;
	signInCount: number;
	noSignInCount: number;
	quickResponseCount: number;
	raiseHandCount: number;
	tableCompleteCounts: number[];
};

export type StudentActivity = {
	afterPracticeFlag: boolean | null;
	beforePreviewFlag: boolean | null;
	quickResponseCount: number;
	raiseHandCount: number;
	score: number;
	signInFlag: boolean | null;
	tableCompleteFlags: (boolean | null)[];
};
