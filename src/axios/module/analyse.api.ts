import { http } from '@/axios';

import { ActivityStatistic, AnalysisInfo, QueryActivityStatistic, QueryAnalyseParams } from '@/view/analysis';

export const getAnalysisList = async (data: QueryAnalyseParams, type: number) => {
	return (await http.post<Array<AnalysisInfo> | number[]>(`/analyse/student/${type}`, data)).data;
};

export const getAnalyseAllTree = async (startTime?: string, endTime?: string) => {
	return (await http.get('/analyse/student/getAnalyseTree', { params: { startTime, endTime } })).data;
};

export const getAnalyseCourseTree = async (startTime?: string, endTime?: string) => {
	return (await http.get('/analyse/student/getAnalyseCourseTree', { params: { startTime, endTime } })).data;
};

export const getAnalysePreviewOrHomework = async (params: QueryActivityStatistic) => {
	return (await http.get<ActivityStatistic>('/analyse/student/getStudentActivityStatistic', { params })).data;
};
