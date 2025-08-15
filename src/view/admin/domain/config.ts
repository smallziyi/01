import { v4 as uuid } from 'uuid';
import useUserStore from '@/store/modules/useUserStore.ts';

export type Domain = {
	clientId: string;
	name: string;
	description: string;
	disable: boolean;
	isMajorGroup: boolean;
	majorCount: number | undefined;
	domainMajorDataList: DomainMajor[][];
	domainPostDataList: DomainPost[][];
	domainIndustryDataList: DomainIndustry[][];
	domainCertificateDataList: DomainCertificate[];
	domainOccupationDataList: DomainOccupation[][];
	majorDetailsDtos?: DomainData[];
} & BaseEntity;

export type DomainData = {
	domainId?: string;
	domainName: string;
	id?: string;
	name: string;
	code: string;
	target: string;
	categoryName: string;
	categoryCode: string;
	bigCategoryName: string;
	bigCategoryCode: string;
};
export const initDomain = (type: boolean): Domain => {
	const { user } = useUserStore();
	return {
		clientId: user.value!.clientId,
		majorCount: undefined,
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		description: '',
		disable: false,
		domainMajorDataList: [],
		domainPostDataList: [],
		domainIndustryDataList: [],
		domainCertificateDataList: [],
		domainOccupationDataList: [],
		id: '',
		isMajorGroup: type,
		lastUpdateTime: '',
		name: '',
	};
};

export type DomainMajor = {
	id: string;
	target: string;
	name: string;
	code: string;
	parentCode: string;
	isMain: boolean;
	uuid: string;
	data: DomainMajor[];
};
export const initDomainMajor = (): DomainMajor => {
	return { code: '', id: '', isMain: false, name: '', parentCode: '', target: '', uuid: uuid(), data: [] };
};
export type DomainPost = {
	uuid: string;
	id: string;
	name: string;
	code: string;
	parentCode: string;
	description: string;
	data: DomainPost[];
};
export const initDomainPost = (): DomainPost => {
	return { code: '', description: '', id: '', name: '', parentCode: '', uuid: uuid(), data: [] };
};
export type DomainIndustry = {
	uuid: string;
	id: string;
	name: string;
	code: string;
	parentCode: string;
	description: string;
	data: DomainIndustry[];
};
export const initDomainIndustry = (): DomainIndustry => {
	return { code: '', description: '', id: '', name: '', parentCode: '', uuid: uuid(), data: [] };
};
export type DomainCertificate = {
	id: string;
	name: string;
	type?: number;
	description: string;
	uuid: string;
};
export const initDomainCertificate = (): DomainCertificate => {
	return { description: '', id: '', name: '', type: undefined, uuid: uuid() };
};
export type DomainOccupation = {
	id: string;
	name: string;
	code: string;
	parentCode: string;
	description: string;
	uuid: string;
	data: DomainOccupation[];
};

export const initDomainOccupation = (): DomainOccupation => {
	return { code: '', description: '', id: '', name: '', parentCode: '', uuid: uuid(), data: [] };
};

export type DomainQueryParams = {
	name?: string;
	containMajor?: string;
	disable?: number;
	isMajorGroup?: number;
};

export const initDomainQueryParams = (): DomainQueryParams => {
	return {
		name: undefined,
		containMajor: undefined,
		disable: undefined,
		isMajorGroup: undefined,
	};
};

export const majorColumns = [
	{ key: 'bigCategoryCode', dataIndex: 'bigCategoryCode', title: '专业大类编码' },
	{ key: 'bigCategoryName', dataIndex: 'bigCategoryName', title: '专业大类', ellipsis: true },
	{ key: 'categoryCode', dataIndex: 'categoryCode', title: '专业类编码' },
	{ key: 'categoryName', dataIndex: 'categoryName', title: '专业类', ellipsis: true },
	{ key: 'domainCode', dataIndex: 'domainCode', title: '专业编码' },
	{ key: 'domainName', dataIndex: 'domainName', title: '专业名称', ellipsis: true },
	{ key: 'target', dataIndex: 'target', title: '专业培养方向', ellipsis: true },
];

export const industryColumns = [
	{ key: 'bigCategoryCode', dataIndex: 'bigCategoryCode', title: '行业大类编码' },
	{ key: 'bigCategoryName', dataIndex: 'bigCategoryName', title: '行业大类', ellipsis: true },
	{ key: 'categoryCode', dataIndex: 'categoryCode', title: '行业类编码' },
	{ key: 'categoryName', dataIndex: 'categoryName', title: '行业类', ellipsis: true },
	{ key: 'industryCode', dataIndex: 'industryCode', title: '行业编码' },
	{ key: 'industryName', dataIndex: 'industryName', title: '行业名称', ellipsis: true },
];

export const occupationColumns = [
	{ key: 'bigCategoryCode', dataIndex: 'bigCategoryCode', title: '职业大类编码' },
	{ key: 'bigCategoryName', dataIndex: 'bigCategoryName', title: '职业大类', ellipsis: true },
	{ key: 'categoryCode', dataIndex: 'categoryCode', title: '职业类编码' },
	{ key: 'categoryName', dataIndex: 'categoryName', title: '职业类', ellipsis: true },
	{ key: 'occupationCode', dataIndex: 'occupationCode', title: '职业编码' },
	{ key: 'occupationName', dataIndex: 'occupationName', title: '职业名称', ellipsis: true },
];

export const postColumns = [
	{ key: 'bigCategoryCode', dataIndex: 'bigCategoryCode', title: '岗位大类编码' },
	{ key: 'bigCategoryName', dataIndex: 'bigCategoryName', title: '岗位大类', ellipsis: true },
	{ key: 'categoryCode', dataIndex: 'categoryCode', title: '岗位类编码' },
	{ key: 'categoryName', dataIndex: 'categoryName', title: '岗位类', ellipsis: true },
	{ key: 'postCode', dataIndex: 'postCode', title: '岗位编码' },
	{ key: 'postName', dataIndex: 'postName', title: '岗位名称', ellipsis: true },
];

export const certificateColumns = [
	{ key: 'certificateName', dataIndex: 'certificateName', title: '证书名称', ellipsis: true },
	{ key: 'certificateType', dataIndex: 'certificateType', title: '证书类型' },
	{ key: 'description', dataIndex: 'description', title: '描述', ellipsis: true },
];
