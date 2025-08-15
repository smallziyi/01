import { http } from '@/axios';
import { Post, QueryPostParams } from '@/view/admin/post/config.ts';
import { College, QueryCollegeParam } from '@/view/admin/college/config.ts';
import { Domain, DomainQueryParams } from '@/view/admin/domain/config.ts';
import {
	DepartmentDetail,
	QueryDepartmentParam,
	ResponseDepartmentItem,
	SaveDepartmentParams,
} from '@/view/admin/department/config.ts';
import { Group, GroupMember, QueryGroupParam } from '@/view/admin/group/config.ts';
import {
	CreateResearchParams,
	FetchResearchParams,
	ResearchDetail,
	ResearchListItem,
} from '@/view/admin/research/config.ts';
import { QueryTemplateFile, TemplateFile, UpdateTemplateDisable } from '@/view/template/config.ts';
import { StudentInfo } from '@/view/analysis';

export function uploadStudentExcel(data: File) {
	const form = new FormData();
	form.append('file', data);
	return http.post<Array<User>>('/admin/group/importGroupStudent', form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
}

export const fetchPostData = async (params: QueryPostParams): Promise<Page<Post>> => {
	const response = await http.get<Page<Post>>('/admin/post', { params });
	return response.data;
};

export const createPost = async (data: Post): Promise<Post> => {
	const response = await http.post<Post>('/admin/post', data);
	return response.data;
};

export const updatePost = async (data: Post): Promise<Post> => {
	const response = await http.put<Post>('/admin/post', data);
	return response.data;
};

export const updatePostDisable = async (postId: string) => {
	return await http.put(`/admin/post/${postId}/disable`);
};

export const fetchCollegeList = async (params: QueryCollegeParam) => {
	return (await http.get<College[]>('/admin/college', { params })).data;
};

export const updateCollegeDisable = async (id: string) => {
	return (await http.put(`/admin/college/${id}/disable`)).data;
};

export const getCollegeOptions = async () => {
	return (await http.get<Option[]>('/admin/college/dropOptions')).data;
};

export const createCollege = async (data: College) => {
	return (await http.post('/admin/college', data)).data;
};

export const getCollegeDomainById = async (collegeId: string) => {
	return (await http.get<Domain[]>('/admin/college/getCollegeDetails', { params: { collegeId } })).data;
};

export const getDepartmentList = async (params: QueryDepartmentParam) => {
	return await http.get<ResponseDepartmentItem[]>('/admin/department', { params });
};

export const getParentDepartment = async () => {
	return await http.get<Option[]>('/admin/department/dropOptions');
};

export const changeStartStatus = async (departmentId: string) => {
	return await http.put(`/admin/department/${departmentId}/disable`);
};

export const getDepartmentDetail = async (departmentId: string) => {
	return await http.get<DepartmentDetail>(`/admin/department/${departmentId}`);
};

export const saveDepartment = async (departmentData: SaveDepartmentParams) => {
	return await http.post('/admin/department', departmentData);
};

export const createGroup = async (data: Group) => {
	return await http.post('/admin/group', data);
};

export const fetchGroupList = async (params: QueryGroupParam) => {
	return (await http.get<Page<Group>>('/admin/group', { params })).data;
};

export const deleteGroupById = async (id: string) => {
	return await http.delete(`/admin/group/${id}`);
};

export const getGroupMember = async (id: string) => {
	return await http.get<GroupMember>('/admin/group/getGroupMemberList', { params: { groupId: id } });
};

export const batchUpdateGroupDisable = async (params: { groupIds: string[]; disable: boolean }) => {
	return await http.put('/admin/group/disable', params);
};

export const getGroupTree = async () => {
	return await http.get<TreeNode[]>('/admin/group/queryGroupTree');
};

export const getAlreadyGroupStudent = async () => {
	return (await http.get<string[]>('/admin/group/getAlreadyGroupStudent')).data;
};

export const fetchResearchList = async (params: FetchResearchParams) => {
	return await http.get<ResearchListItem[]>('/admin/research', { params });
};

export const createResearch = async (research: CreateResearchParams) => {
	return await http.post('/admin/research', research);
};

export const updateResearchDisable = async (researchId: string) => {
	return await http.put(`/admin/research/${researchId}/updateDisable`);
};

export const getResearchDropOptions = async () => {
	return await http.get<Option[]>('/admin/research/dropOptions');
};

export const getPostList = async () => {
	return await http.get<Option[]>('/admin/post/dropOptions');
};

export const getResearchDetail = async (researchId: string) => {
	return await http.get<ResearchDetail>(`/admin/research/${researchId}`);
};

export const createDomain = async (domain: Domain) => {
	return await http.post<Domain>('/admin/domain', domain);
};

export const fetchDomainList = async (params?: DomainQueryParams) => {
	return await http.get<Domain[]>('/admin/domain', { params });
};

export const updateDomainDisable = async (domainId: string) => {
	return await http.put(`/admin/domain/${domainId}/disable`);
};

export const getDomainsOptionsByCollegeId = async (collegeId?: string) => {
	return (await http.get<Option[]>('/admin/domain/dropOptions', { params: { collegeId } })).data;
};

export const getDomainsMajorOptionsByCollegeId = async (collegeId?: string) => {
	return (await http.get<Domain[]>('/admin/domain/getDomainByCollegeId', { params: { collegeId } })).data;
};

export const fetchTemplateFileList = async (params: QueryTemplateFile) => {
	return await http.get<Page<TemplateFile>>('/admin/template', { params });
};

// 新增模板
export const createTemplateFile = async (TemplateFile: TemplateFile) => {
	return await http.post<TemplateFile>('/admin/template', TemplateFile);
};

// 获取菜单版本
export const fetchTemplateFileVersion = async (reportType: number) => {
	return await http.get<number[]>('/admin/template/dropMenuVersion', { params: { reportType } });
};

// 模板绑定菜单
export const bandWord = (params: { fileTemplateId: string; menuIdList: string[] }) => {
	return http.post('/admin/template/bindMenu', params);
};

// 获取菜单树
export const getTemplateMenuTree = async (params: {
	menuVersion: number;
	reportType: number;
	fileTemplateId?: string;
}) => {
	return (await http.get('/admin/template/getMenuTree', { params })).data;
};

// 删除模板
export const deleteTemplateFile = async (id: string) => {
	return await http.delete(`/admin/template/${id}`);
};

// 更新模板的选中状态
export const updateReportMenuStatus = async (data: UpdateTemplateDisable) => {
	return await http.put('/admin/template/updateReportMenuStatus', data);
};

export const getGroupStudentInfo = async (groupId: string) => {
	return (await http.get<Array<StudentInfo>>('/admin/group/getGroupStudentInfo', { params: { groupId } })).data;
};
