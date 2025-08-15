import { http } from '@/axios';
import {
	Classroom,
	ClassroomAdd,
	ClassroomQuery,
	ClassroomTechPlanDetails,
	DateListAndOptions,
} from '@/view/resource/classroom/config.ts';
import { ResourceCalendar, ResourceCalendarSchedule, TimePlan } from '@/view/__report/components/workplace/calendar';
import { CalendarSchedule } from '@/view/instruction';
import download from '@/utils/download.ts';

/**
 * 获取实训室列表
 * @return Array<Classroom> 实训室列表
 * */
export async function getResourceClassroomList() {
	return (await http.get<Classroom[]>('/resource/classroom')).data;
}

/**
 * @param reportId 报告ID
 * @param timePlanId 时间计划Id
 * @return TimePlan 时间计划
 * */
export async function getTimePlanDataByTimePlanId(reportId: string, timePlanId: string) {
	return (
		await http.get<TimePlan>('/resource/calendar/schedule/getTimePlanDataByTimePlanId', {
			params: { reportId, timePlanId },
		})
	).data;
}

/**
 * 获取专业对应的校历信息
 * */
export async function getCalendarReportCardByDomainId(domainId: string) {
	return (
		await http.get<CalendarSchedule[]>('/resource/calendar/getCalendarReportCardByDomainId', { params: { domainId } })
	).data;
}

export async function getCalendar(reportId: string) {
	return http.get<ResourceCalendar[]>('/resource/calendar', { params: { reportId } }).then((res) => {
		return res.data;
	});
}

export const getClassroomList = async (params: ClassroomQuery) => {
	return (await http.get<Classroom[]>('/resource/classroom', { params })).data;
};

export const updateClassroom = async (data: ClassroomAdd) => {
	return (await http.post('/resource/classroom', data)).data;
};

export const deleteClassroom = async (classroomId: string) => {
	return (await http.delete(`/resource/classroom/${classroomId}`)).data;
};

export const updateDisableClassroom = async (classroomId: string) => {
	return (await http.put(`/resource/classroom/${classroomId}/disable`)).data;
};

export const getDropManagerList = async () => {
	return (await http.get<Option[]>('/resource/classroom/dropMangerList')).data;
};

export const getClassroomDetails = async (classroomId: string) => {
	return (await http.get<Classroom>(`/resource/classroom/${classroomId}`)).data;
};

export const getRelationClassroomAndDate = async () => {
	return (await http.get<DateListAndOptions>('/resource/classroom/getRelationClassroomAndDate')).data;
};

export const getClassroomSchedule = async (teachDate: string) => {
	return (await http.get<string[]>('/resource/classroom/getClassroomSchedule', { params: { teachDate } })).data;
};

export const getClassroomScheduleDetails = async (params: { classroomId: string; teachDate: string }) => {
	return (await http.get<ClassroomTechPlanDetails>('/resource/classroom/getClassroomScheduleDetails', { params })).data;
};

export const getClassroomRelationDate = async (classroomId: string) => {
	return (await http.get<string[]>('/resource/classroom/getClassroomRelationDate', { params: { classroomId } })).data;
};

// 获取可选择的实训室
export const getAdjustCourseClassRoomList = async (teachPlanId: string) => {
	return (await http.get<Classroom[]>('/resource/classroom/getAdjustCourseClassRoomList', { params: { teachPlanId } }))
		.data;
};

// 更新课程计划所属实训室
export const updateTeachPlanClassroom = async (data: { teachPlanId: string; classroomId: string }[]) => {
	return http.put('/resource/classroom/updateTeachPlanClassroom', data);
};

export function createResourceCalendar(data: Partial<ResourceCalendar>) {
	return http.post<ResourceCalendar>('/resource/calendar', data);
}

export function getResourceCalendarSchedule(reportId: string, type: number) {
	return http.get<ResourceCalendarSchedule>('/resource/calendar/schedule', { params: { reportId, type } });
}

export function createResourceCalendarSchedule(data: ResourceCalendarSchedule) {
	return http.post<ResourceCalendarSchedule>('/resource/calendar/schedule', data);
}

export function exportCalendarSchedule(reportId: string, type: number) {
	http.get<string>('/resource/calendar/schedule/exportCalendarSchedule', { params: { reportId, type } }).then((res) => {
		download(res.data);
	});
}
