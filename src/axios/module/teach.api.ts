import { http } from '@/axios';
import {
	MiddlePracticeData,
	QuestionsRecord,
	StudentActivity,
	StudentAnswer,
	TeacherActivity,
	TeachPlan,
	TeachScene,
	TeachStructure,
} from '@/view/instruction';
import {
	StudentEvaluate,
	StudentEvaluateDetail,
	StudentTeam,
	TeacherEvaluate,
	TeachInteraction,
} from '@/view/classroom/type.ts';
import { Dayjs } from 'dayjs';
import { Comment } from '@/view/analysis';

/**
 * 获取某一天的教学教学计划
 * */
export async function getTeachPlanList() {}

/**
 * 获取教学场景信息
 * @param teachPlanId 教学计划ID
 * @return TeachScene 教学场景
 * */
export async function getTeachScene(teachPlanId: string) {
	return (await http.get<TeachScene>(`/teach/scene/${teachPlanId}`)).data;
}

/**
 * 学生是否可以举手
 * @param teachPlanId 课堂ID
 * @param studentId 学生ID
 * @return boolean 是否可以举手
 */
export async function studentRaiseHandFlag(teachPlanId: string, studentId: string) {
	return (
		await http.get<boolean>('/teach/interaction/studentRaiseHandFlag', {
			params: {
				teachPlanId,
				studentId,
			},
		})
	).data;
}

/**
 * 获取课堂互动数据
 * @param teachPlanId 课堂ID
 * @param single 取消请求
 * @return Array<TeachInteraction> 互动数据
 * */
export function getInteractionList(teachPlanId: string, single?: AbortSignal) {
	return http.get<TeachInteraction[]>(`/teach/interaction/${teachPlanId}`, { signal: single });
}

/**
 * 更新互动数据
 * @param data 互动数据
 * */
export function updateTeachInteractionSuccessFlag(data: {
	teachPlanId: string;
	interactionId: string;
	successFlag: boolean;
	studentId: string;
	teacherId: string;
}) {
	return http.put('/teach/interaction/updateTeachInteractionSuccessFlag', data);
}

/**
 * 发起抢答
 * @param teachPlanId 课堂ID
 * @return string 抢答ID
 * */
export function addQuickResponse(teachPlanId: string) {
	return http.post<string>(`/teach/scene/addQuickResponse/${teachPlanId}`);
}

/**
 * 抢答结束
 */
export function quickResponseEnd(teachPlanId: string, quickResponseId: string) {
	return http.post(`/teach/scene/quickResponseEnd/${teachPlanId}/${quickResponseId}`);
}

/**
 * 学生是否可以抢答
 * @param teachPlanId 课堂ID
 * @param studentId 学生ID
 * @param quickResponseId 抢答ID
 * @return boolean 是否可以抢答
 * */
export function studentQuickResponseFlag(teachPlanId: string, studentId: string, quickResponseId: string) {
	return http.get<boolean>('/teach/interaction/studentQuickResponseFlag', {
		params: { teachPlanId, studentId, quickResponseId },
	});
}

/**
 * 学生抢答
 * @param data 抢答记录
 * */
export function studentQuickResponseInteraction(data: Partial<TeachInteraction>) {
	return http.post('/teach/interaction/studentQuickResponseInteraction', data);
}

/**
 * 获取抢答ID
 * @param teachPlanId 课堂ID
 * @return string 抢答ID
 * */
export function getCurrentQuickResponse(teachPlanId: string) {
	return http.get<string | null>('/teach/scene/getCurrentQuickResponse', { params: { teachPlanId } });
}

export function previewDelivery(data: { teachPlanId: string; beforePreviewDataList: number[] }) {
	return http.put('/teach/scene/releasePreview', data);
}

export async function getTeachMenuCourseTree(teachPlanId: string) {
	return (await http.get<Tree[]>('/teach/plan/getTeachMenuCourseTree', { params: { teachPlanId } })).data;
}

export async function addTeachEvaluate(data: StudentEvaluate) {
	return await http.put('/teach/evaluate/addTeachEvaluate', data);
}

export async function getStudentEvaluateTeachData(teachPlanId: string, userId: string) {
	return (
		await http.get<StudentEvaluateDetail>('/teach/evaluate/getStudentEvaluateTeachData', {
			params: { teachPlanId, userId },
		})
	).data;
}

export async function getAllStudentEvaluateTeachData(teachPlanId: string) {
	return (
		await http.get<TeacherEvaluate>('/teach/evaluate/getAllStudentEvaluateTeachData', { params: { teachPlanId } })
	).data;
}

export async function addTeachTeam(data: StudentTeam) {
	return (await http.post<string>('/teach/team/addTeachTeam', data)).data;
}

export async function getStudentTeam(teachPlanId: string, userId: string) {
	return (await http.get<StudentTeam>('/teach/team/getStudentTeam', { params: { teachPlanId, userId } })).data;
}

export async function getTeachTeam(teachPlanId: string) {
	return (await http.get<StudentTeam>('/teach/team/getTeachTeam', { params: { teachPlanId } })).data;
}

export async function getStudentActivityRecord(teachPlanId: string, studentId: string) {
	return (await http.get('/teach/activity/getStudentActivityRecord', { params: { teachPlanId, studentId } })).data;
}

export async function getPersonRanking(teachPlanId: string) {
	return (await http.get('/teach/activity/getPersonRanking', { params: { teachPlanId } })).data;
}

export async function getTeamRanking(teachPlanId: string) {
	return (await http.get('/teach/activity/getTeamRanking', { params: { teachPlanId } })).data;
}

export async function getTeachPlan(userId: string, date: string, teachPlanType: 1 | 2) {
	const response = await http.get<TeachPlan[]>('/teach/plan', {
		params: { userId, teachPlanType, teachDate: date },
	});
	return response.data;
}

export async function getTeachPlanTree(userId: string, teachPlanType: 1 | 2) {
	const response = await http.get<TreeNode[]>('/teach/plan/getTeachPlanTree', { params: { userId, teachPlanType } });
	return response.data;
}

export async function studentAnswerQuestion(answerList: StudentAnswer) {
	return await http.post('/teach/answer/addTeachAnswerTable', answerList);
}

export async function getAnswerRecord(params: {
	teachPlanId: string;
	userId: string;
	tableId?: string;
	answerTableType: 1 | 2 | 3;
}) {
	return (await http.get<QuestionsRecord>('/teach/answer/getStudentAnswerTableData', { params })).data;
}

export function getStudent(teachPlanId: string) {
	return http.get<TeachStructure>('/teach/plan/getGroupStudentInfo', { params: { teachPlanId: teachPlanId } });
}

export function getTeachPlanById(teachPlanId: string) {
	return http.get<TeachPlan>('/teach/plan/getTeachPlan', { params: { teachPlanId } });
}

export function updateTeamData(data: object) {
	return http.put('/teach/scene/updateTeamData', data);
}

export function updateSignInFlag(teachPlanId: string) {
	return http.put(`/teach/scene/updateSignInFlag/${teachPlanId}`);
}

export function updateTeachPlanStatus(teachPlanId: string, status: 2 | 3) {
	return http.put(`/teach/plan/updateTeachPlanStatus/${teachPlanId}/${status}`);
}

export function publishFormQuestion(teachPlanId: string, tableId: string) {
	return http.put(`/teach/scene/releaseMiddlePractice/${teachPlanId}/${tableId}`);
}

export function getTeachSceneByTeachPlanId(teachPlanId: string) {
	return http.get<TeachScene>(`/teach/scene/${teachPlanId}`);
}

export async function getTeachPlanDetails(teachPlanId: string) {
	return (await http.get(`/teach/plan/${teachPlanId}`)).data;
}

export async function deleteTeachPlan(teachPlanId: string) {
	return await http.delete(`/teach/plan/${teachPlanId}`);
}

export async function getTeacherCourseActive(teachPlanId: string) {
	return (await http.get<TeacherActivity>(`/teach/activity/getTeacherCourseActivity`, { params: { teachPlanId } }))
		.data;
}

export async function getStudentCourseActive(teachPlanId: string, studentId: string) {
	return (
		await http.get<StudentActivity>(`/teach/activity/getStudentCourseActivity`, { params: { teachPlanId, studentId } })
	).data;
}

export async function finishPreview(teachPlanId: string, studentId: string) {
	return await http.post(`/teach/scene/studentCompleteBeforePreview`, { teachPlanId, studentId });
}

export function releaseMiddlePractice(teachPlanId: string, middlePracticeData: MiddlePracticeData) {
	return http.put(`/teach/scene/releaseMiddlePractice/${teachPlanId}`, middlePracticeData);
}

export function releaseAfterPractice(teachPlanId: string) {
	return http.put(`/teach/scene/releaseAfterPractice/${teachPlanId}`);
}

/**
 * 获取教学计划签到学生ID
 * @param teachPlanId 教学计划ID
 * @param signal 取消请求
 * @return Array<string> 签到学生ID
 * */
export async function getAlreadySignInStudentIdList(teachPlanId: string, signal: AbortSignal) {
	return (
		await http.get<string[]>('/teach/signIn/getAlreadySignInStudentIdList', {
			signal,
			params: { teachPlanId },
		})
	).data;
}

/**
 * 发布课前预习
 * @param id 教学计划ID
 * @param beforePreviewDataList 预习单ID
 * */
export async function releasePrePreview(id: string, beforePreviewDataList: Array<string>) {
	return await http.put('/teach/scene/releasePrePreview', { id, beforePreviewDataList });
}

/**
 *  查询指定日期,指定老师已经占用的时间段
 *  @param teacherId 老师ID
 *  @param teachDate 日期
 *  @return Array<string> 占用时段ID
 * */
export async function getTimeAndTeacherAlreadyTimeSlot(teacherId: string, teachDate: Dayjs) {
	return (
		await http.get<string[]>('/teach/plan/getTimeAndTeacherAlreadyTimeSlot', {
			params: {
				teacherId,
				teachDate: teachDate.format('YYYY-MM-DD'),
			},
		})
	).data;
}

/**
 * 查询指定日期指定时间段已经占用的地点,班级
 *  @param timeSlotId 时间段ID
 *  @param teachDate 日期
 *  @return {groupIds: string[], classroomIds: string[]} 占用的班级ID和教室ID
 * */
export async function getTimeAndTimeSlotAlreadyGroupAndClassroom(timeSlotId: string, teachDate: Dayjs) {
	return (
		await http.get<{
			classroomIds: string[];
			groupIds: string[];
		}>('/teach/plan/getTimeAndTimeSlotAlreadyGroupAndClassroom', {
			params: {
				teachDate: teachDate.format('YYYY-MM-DD'),
				timeSlotId,
			},
		})
	).data;
}

/**
 * 创建教学计划
 * */
export async function addTeachPlan(data: Partial<TeachPlan>) {
	return await http.post('/teach/plan', data);
}

/**
 * 查询工作台老师的咨数据概况
 * */
export async function geTeacherDashboard() {
	return (
		await http.get<{
			A: number;
			B: number;
			C: number;
			D: number;
			E: number;
			F: number;
			G: number;
			H: number;
			I: number;
			courseCount: number;
			groupScoreRank: number;
			score: number;
		}>('/workbench/geTeacherDashboard', {
			params: {},
		})
	).data;
}

/**
 * 查询工作台学生的咨数据概况
 * */
export async function geStudentDashboard() {
	return (
		await http.get<{
			A: number;
			B: number;
			C: number;
			D: number;
			E: number;
			F: number;
			G: number;
			H: number;
			I: number;
			courseCount: number;
			groupScoreRank: number;
			score: number;
		}>('/workbench/geStudentDashboard', {
			params: {},
		})
	).data;
}

export const addTeacherComment = async (data: { teachPlanId: string; comment: string }) => {
	return (await http.post<Comment>('/teach/comment', data)).data;
};

// 更新评语
export const updateTeacherComment = async (data: { teachPlanId: string; comment: string; id: string }) => {
	return (await http.put<Comment>('/teach/comment', data)).data;
};

// 获取评语
export const getTeacherComment = async (teachPlanId: string) => {
	return (await http.get<Comment>(`/teach/comment/${teachPlanId}`)).data;
};

// 教师通知学生回答结果
export const teacherNotifyAnswerResult = async (data: {
	interactionId: string;
	quickResultFlag: boolean;
	teacherId: string;
	studentId: string;
	teachPlanId: string;
}) => {
	return await http.put('/teach/interaction/updateTeachInteractionQuickResultFlag', data);
};
