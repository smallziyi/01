import { http } from '@/axios';
export const disabledList: Option[] = [
	{
		value: 0,
		label: '启用',
	},
	{
		value: 1,
		label: '停用',
	},
];
export const templateList: Option[] = [
	{
		value: 1,
		label: '4k',
	},
	{
		value: 2,
		label: '2k',
	},
];
export const refreshTimeList: Option[] = [
	{
		value: 3,
		label: '3s',
	},
	{
		value: 6,
		label: '6s',
	},
];

export const screenShowTypeList: Option[] = [
	{
		value: 1,
		label: '指标',
	},
	{
		value: 2,
		label: '条形柱状图',
	},
	{
		value: 3,
		label: '横向柱状图',
	},
	{
		value: 4,
		label: '锥形柱状图',
	},
	{
		value: 5,
		label: '饼图',
	},
	{
		value: 6,
		label: '环形图',
	},
	{
		value: 7,
		label: '单条折线图',
	},
	{
		value: 8,
		label: '多条折线图',
	},
	{
		value: 9,
		label: '六维雷达图',
	},
]

export type ScreenQuery = {
	name?: string,
	screenTemplate?: number;
	disabled?: number;
}

export type CardDataList = {
	cardType: number,
	cardName?: string,
	content?: string,
	fileShowType?: number,
	fileDataList?: Array<{ 
		fileUrl: string, 
		fileName: string,
		fileId: string
	}>,
	intervalTime?: number,
	speed?: number
}


export type DataIndexList = {
	indexCount: number,
	refresh: number,
	indexSetList: Array<{ 
		indexName: string, 
		dataSourceType?: number, 
		showType?: number
		options?: Array<Option>
	}>
}

export type Screen = {
	clientId: string,
	name: string,
	screenTemplate: number,
	coverId: string,
	cardDataList: Array<CardDataList>,
	dataIndex: DataIndexList
	disable: boolean,
	coverUrl: string
} & BaseEntity

export interface TemplateCardList {
	cardType: number;
	name: string;
}

export interface DataLists extends BaseEntity {
	fileUrl: string;
	fileId: number;
}

export type DataIndexSourceList = {
	name: string;
	type: number;
	showTypeList: number[];
}

// 获取大屏数据列表
export async function getscreenView(params: ScreenQuery) {
	return (await http.get<Screen[]>('/analyse/screen', { params })).data;
}

// 新增大屏
export async function postScreenCard(data: Screen) {
	return (await http.post('/analyse/screen', data)).data;
}

export async function updateScreenCard(id: string) {
	return await http.put(`/analyse/screen/${id}/disable`);
}

export async function deleteScreenCard(id: string) {
	return await http.delete(`/analyse/screen/${id}`);
}

export function getDataIndexList() {
	return http.get<DataIndexList>(`/analyse/screen/getDataIndexList`);
}

export function getDataIndexSourceList() {
	return http.get<DataIndexSourceList[]>(`/analyse/screen/getDataIndexSourceList`);
}

export function getTemplateCardList(templateType: number) {
	return http.get<TemplateCardList[]>(`/analyse/screen/getTemplateCardList`, { params: { templateType } });
}

export function getCardDataList() {
	return http.get<CardDataList[]>(`/analyse/screen/getCardDataList`);
}

export function getScreenCardDetail(dataScreenId: string) {
	return http.get<Screen>(`/analyse/screen/getDataScreenDetails/${dataScreenId}`);
}
