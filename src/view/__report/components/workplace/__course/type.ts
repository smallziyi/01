export interface ReportCourseQuestion extends Partial<BaseEntity> {
	tableId: string;
	learnPointsCellId: string;
	type: number;
	source: string;
	title: string;
	options: Array<QuestionOptions>;
	analysis: string;
	sort: number;
	tableFormType: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface QuestionOptions {
	id: string;
	content: string;
	isCorrect: boolean;
}

export enum QuestionType {
	SINGLE_CHOICE = 1,
	MULTIPLE_CHOICE,
	TRUE_FALSE,
	FILL_IN_THE_BLANKS,
}
