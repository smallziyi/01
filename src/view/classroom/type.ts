export interface TeachInteraction extends BaseEntity {
	interactionType: 1 | 2 | 3;
	points: number | null;
	studentId: string;
	successFlag: boolean | null;
	quickResponseId: string;
	quickResultFlag: boolean | null;
	teacherId: string;
	teachPlanId: string;
}

export type StudentEvaluate = {
	teachPlanId: string;
	studentId: string;
	tableEvaluateDataList: Array<{
		tableType: number;
		content: string;
		score: number;
		createTime: string;
	}>;
};

export type StudentEvaluateDetail = {
	contextName: string;
	studyName: string;
	taskName: string;
	workProcess: string;
	totalTime: number;
	stepName: string;
	createTime: string;
	teacherName: string;
	tableEvaluateDataList: Array<{
		tableType: number;
		content: string;
		score: number;
		createTime: string;
	}>;
};

export type TeacherEvaluate = {
	contextName: string;
	studyName: string;
	taskName: string;
	workProcess: string;
	totalTime: number;
	stepName: string;
	studentEvaluateTeachDtos: {
		tableType: number;
		avgScore: number;
		studentEvaluateContentList: {
			content: string;
			createTime: string;
		}[];
	}[];
};

export type Team = {
	id: string;
	name: string;
	userIds: string[];
	leaderId: string;
};
export type StudentTeam = {
	id: string;
	teachPlanId: string;
	teamType: 1 | 2; // 1:自动分组 2: 手动分组
	autoTeamSize: number;
	teamDataList: Team[];
};
