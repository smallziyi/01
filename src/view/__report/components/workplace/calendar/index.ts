export interface ResourceCalendar extends BaseEntity {
	reportId: string;
	year: number;
	month: number;
	day: number;
	settingFlag: boolean;
}

export interface ResourceCalendarSchedule extends BaseEntity {
	reportId: string;
	type: number;
	timePlanData: TimePlan[];
}

export interface TimePlan {
	id: string;
	name: string;
	startTime: string | null;
	endTime: string | null;
	dayPartDataList: [DayPart, DayPart, DayPart, DayPart, DayPart];
	useFlag: boolean;
}

export interface DayPart {
	dayPartType: 1 | 2 | 3 | 4 | 5; // 时间段名称 1 清晨 2 上午 3 中午 4 下午 5 晚上
	timeSlotData: TimeSlot[];
}

export interface TimeSlot {
	id: string;
	timeSlotName: string;
	sort: number;
	startTime: string;
	endTime: string;
	courseFlag: boolean;
}
