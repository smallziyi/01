export interface QueryAnalyseParams {
	clientId: string;
	collegeId?: string;
	domainId?: string;
	majorCode?: string;
	year?: string;
	groupId?: string;
	studentId?: string;
	teachPlanId?: string;
	courseId?: string;
	situationId?: string;
	taskId?: string;
	stepId?: string;
	id?: string;
	startTime?: string;
	endTime?: string;
}

export type StudentInfo = {
	avatarUrl: string;
	gender: 0 | 1;
	name: string;
	number: string;
	userId: string;
};

export type AnalysisInfo = {
	groupId: string;
	name: string;
	scores: number[];
};

export type QueryActivityStatistic = {
	type: 1 | 2;
	teachPlanId: string;
};

export type ActivityStatistic = {
	totalCount: number;
	completedCount: number;
	failedCount: number;
	studentScoreList: Array<{
		studentId: string;
		name: string;
		number: string;
		score: number;
	}>;
	tableFormCountList: Array<number>;
	afterScoreList: Array<number>;
};

export type Comment = {
	id: string;
	comment: string;
	teachPlanId: string;
};
