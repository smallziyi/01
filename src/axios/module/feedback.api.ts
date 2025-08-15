import { http } from '@/axios';

export interface Feedback extends BaseEntity {
	type: number;
	function: string[];
	title: string;
	content: string;
	files: { id: string; name: string; contentType: string; url: string; seconds: number }[];
	avatar: string;
	commentCount: number;
	down: number;
	up: number;
	showComment: boolean;
	comments: FeedbackComment[];
	newComment: string;
	showLikeAnimation: boolean;
}

export interface FeedbackComment extends BaseEntity {
	feedbackId: string;
	content: string;
	avatar: string;
}

export interface FeedbackAction extends BaseEntity {
	feedbackId: string;
	userId: string;
	agree: boolean;
}

/**
 * 添加反馈
 * */
export function createFeedback(data: Partial<Feedback>) {
	return http.post<Feedback>('/feedback', data);
}

/**
 * 修改反馈
 * */
export function updateFeedback(data: Feedback) {
	return http.put<Feedback>('/feedback', data);
}

/**
 * 获取列表
 * */
export function getFeedbackList(params: { keyword?: string; type: 1 | 2 | 3 | 4; onlyMe: boolean }) {
	return http.get<Array<Feedback>>('/feedback', { params });
}

/**
 * 获取TOP10
 * */
export function getFeedbackTop10() {
	return http.get<Array<Feedback>>('/feedback/hot');
}

/**
 * 删除评论
 * */
export function deleteFeedback(id: number) {
	return http.delete(`/feedback/${id}`);
}

/**
 * 获取用户点赞，踩列表
 */
export function getFeedbackAction() {
	return http.get<FeedbackAction[]>('/feedback/action');
}

/**
 * 创建用户点赞，踩列表
 */
export function createFeedbackAction(data: Partial<FeedbackAction>) {
	return http.post<FeedbackAction>('/feedback/action', data);
}

/**
 * 修改用户点赞，踩列表改用户点赞，踩
 */
export function updateFeedbackAction(data: FeedbackAction) {
	return http.put<Feedback>('/feedback/action', data);
}

/**
 * 删除用户点赞，踩
 */
export function deleteFeedbackAction(data: FeedbackAction) {
	return http.delete('/feedback/action', { data });
}

/**
 * 获取评论
 */
export function getFeedbackComment(feedbackId: string) {
	return http.get<FeedbackComment[]>(`/feedback/comment/${feedbackId}`);
}

/**
 * 创建评论
 */
export function createFeedbackComment(data: Partial<FeedbackComment>) {
	return http.post<FeedbackComment>('/feedback/comment', data);
}

/**
 * 删除评论
 */
export function deleteFeedbackComment(comment: FeedbackComment) {
	return http.delete(`/feedback/comment`, { data: comment });
}
