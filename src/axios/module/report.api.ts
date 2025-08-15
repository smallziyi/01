import { http } from '@/axios';
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import {
	AddStructureTreeParams,
	AddTreeStructuresParams,
	CommentRecord,
	QueryReportCardParams,
	ReportAction,
	ReportField,
	ReportApprovalRecords,
	ReportAuditTableRecord,
	ReportError,
	ReportStatusCountByMonth,
	ReportStatusStatistic,
	ReportTable,
	ReportType,
	ReportTypeStatistic,
	TableDataGeneric,
	StructureData,
	UpdateParams,
	ReportMenuCourse,
	ReportMenuLooseLeaf,
} from '@/view/__report';

/**
 * 获取报告列表
 * @param data 查询参数
 * @returns 报告列表 Array<T>
 * */
export async function fetchReportCardList<T>(data: QueryReportCardParams) {
	return (await http.post<Array<T>>('/report/getReportCardList', data)).data;
}

/**
 * 根据报表 ID 获取报告详情
 * @param reportId 报告 ID
 * @returns 报表详情 T
 * */
export async function getReportInfo<T>(reportId: string) {
	return (await http.get<T>(`/report/${reportId}`)).data;
}

/**
 * 创建更新报告
 * @param data 报告
 * @return T 报告
 * */
export async function createOrUpdateReport<T>(data: ReportField) {
	return (await http.post<T>('/report', data)).data;
}

/**
 * 开始编辑报告
 * @param reportId 报告ID
 * */
export async function startEditReport(reportId: string) {
	return http.put(`/report/${reportId}/startEditReport`);
}

/**
 * 禁用/启用报告
 * @param reportId 报告ID
 * */
export async function updateReportDisable(reportId: string) {
	return await http.put(`/report/${reportId}/disable`, reportId);
}

/**
 * 获取报告下拉选项
 * @param reportType 报告类型
 * @returns 选项列表
 */
export async function reportDropdown(reportType: ReportType) {
	return (await http.get<Array<Option>>('/report/dropOptions', { params: { reportType } })).data;
}

/**
 * 获取可用的报告下拉选项
 * @param reportType 报告类型
 * @returns 可用选项列表
 */
export async function reportUsableDropdown(reportType: ReportType) {
	return (await http.get<Array<Option>>('/report/dropUsableOptions', { params: { reportType } })).data;
}

/**
 * 获取报告处理进度
 * @param reportId 报告ID
 * @returns 报告详情
 */
export async function getReportProcess(reportId: string) {
	return (await http.get('/report/getReportDetails', { params: { reportId } })).data;
}

/**
 * 获取报告下拉选项配置
 * @param pageType 页面类型
 * @param reportType 报告类型
 * @returns 领域、年份和关联报告信息
 */
export async function getReportDropOptions(pageType: number, reportType: number) {
	return (
		await http.get<{
			domains: { domainName: string; domainId: string }[];
			years: string[];
			relationReport: Option[];
		}>('/report/getReportDropOptions', { params: { pageType, reportType } })
	).data;
}

/**
 * 获取菜单树
 * @param params 包含reportId的参数对象
 * @returns 树形结构数据
 */
export async function getMenuTree(params: { reportId: string }) {
	return (await http.get<Array<Tree>>('/report/getMenuTree', { params })).data;
}

/**
 * 获取报告状态统计
 * @param reportType 报告类型
 * @returns 状态统计数据
 */
export async function getReportStatusStatistic(reportType: ReportType) {
	return (
		await http.get<ReportStatusStatistic>('/report/dashboard/getReportStatusCount', {
			params: { reportType },
		})
	).data;
}

/**
 * 获取报告类型统计
 * @param pageType 页面类型
 * @param reportType 报告类型
 * @returns 报告类型统计数据
 */
export async function getReportTypeStatistic(pageType: number, reportType: ReportType) {
	return (
		await http.get<Array<ReportTypeStatistic>>('/report/dashboard/getReportMessageList', {
			params: { pageType, reportType },
		})
	).data;
}

/**
 * 获取报告状态统计
 * @param reportType 报告类型
 * @returns 状态统计数据
 */
export async function fetchReportStatusCountByMonth(reportType: ReportType) {
	return (
		await http.get<ReportStatusCountByMonth>('/report/dashboard/getReportStatusCountByMonth', {
			params: { reportType },
		})
	).data;
}

/**
 * 获取报告表格列表
 * @param params 包含menuId和reportId的参数对象
 * @returns 报告表格列表
 */
export async function getReportTableList(params: { menuId: string; reportId: string }) {
	return (await http.get<Array<Option>>('/report/workplace/getReportTableByMenuId', { params })).data;
}

/**
 * 删除表格
 * @param params 包含tableId的参数对象
 * @returns 删除结果
 */
export async function deleteTable(params: { tableId: string }) {
	return await http.delete('/report/workplace/deleteTable', { params });
}

/**
 * 获取报告表格
 * @param params 包含tableId的参数对象
 * @returns 报告表格
 */
export async function getReportTable<T extends TableDataGeneric>(params: { tableId: string }) {
	return (
		await http.get<ReportTable<T>>('/report/workplace/getReportTable', {
			params,
			headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache', Expires: '0' },
		})
	).data;
}

/**
 * 保存调查表格
 * @param table 报告表格
 * @returns 保存结果
 */
export async function saveSurveyTable<T extends TableDataGeneric>(table: ReportTable<T>) {
	return (await http.post<ReportTable<T>>('/report/workplace/addTable', table)).data;
}

/**
 * 获取表格审核记录
 * @param params 包含tableId的参数对象
 * @returns 表格审核记录
 */
export async function getTableAudit(params: { tableId: string }) {
	return (await http.get<ReportAuditTableRecord>('/report/workplace/getAuditTableRecord', { params })).data;
}

/**
 * 更新表格审核记录
 * @param data 包含auditTableRecordId和auditDataList的参数对象
 * @returns 更新结果
 */
export async function updateTableAudit(data: { auditTableRecordId: string; auditDataList: Array<CommentRecord> }) {
	return (await http.put<ReportAuditTableRecord>('/report/workplace/updateAuditTableRecord', data)).data;
}

/**
 * 检查报告状态
 * @param params 包含reportId和auditRecordType的参数对象
 * @returns 报告错误列表
 */
export async function checkReportStatus(params: { reportId: string; auditRecordType: 1 | 2 | 3 }) {
	return await http.get<Array<ReportError>>('/report/workplace/getPendingRecord', { params });
}

/**
 * 获取报告审批记录
 * @param reportId 报告ID
 * @returns 报告审批记录列表
 */
export async function getReportApprovalRecord(reportId: string) {
	return (
		await http.get<Array<ReportApprovalRecords>>('/report/workplace/getReportRecordList', { params: { reportId } })
	).data;
}

/**
 * 执行报告操作
 * @param data 报告操作数据
 * @returns 执行结果
 */
export async function doReportAction(data: ReportAction) {
	return await http.post('/report/workplace/addResult', data);
}

/**
 * 新增树结构
 * @param data 树结构数据
 * @returns 新增结果
 */
export async function addTreeStructures(data: AddTreeStructuresParams) {
	return await http.post('/report/workplace/addStructures', data);
}

/**
 * 获取结构树
 * @param reportId 报告ID
 * @returns 结构树数据
 */
export async function getTreeStructures(reportId: string) {
	return await http.get('/report/workplace/getStructureTree', { params: { reportId } });
}

/**
 * 查看报告审核记录
 * @param reportId 报告ID
 * @returns 报告审核记录列表
 */
export async function fetchReportActionRecord(reportId: string) {
	return (await http.get('/report/workplace/getReportRecordList', { params: { reportId } })).data;
}

/**
 * 复制报告
 * @param srcReportId 源报告ID
 * @param destReportId 目标报告ID
 * @returns 复制结果
 */
export async function copyReport(srcReportId: string, destReportId: string) {
	return (await http.post('/report/copyReport', { srcReportId, destReportId })).data;
}

/**
 * 生成报告
 * @param reportId 报告ID
 * @returns 生成结果
 */
export async function generateReport(reportId: string) {
	return await http.get(`/report/word/generate/${reportId}`);
}

/**
 * 删除报告
 * @param reportId 报告ID
 * @returns 删除结果
 */
export async function deleteReport(reportId: string) {
	return await http.delete(`/report/${reportId}`);
}

/**
 * 获取课程开发课程名称以及证书列表
 * @param relationReportId 关联报告ID
 * @returns 课程列表
 */
export async function getCourseList(relationReportId: string) {
	return (
		await http.get<{ courseName: string; certificateName: string }[]>('/report/course/getCourseList', {
			params: { relationReportId },
		})
	).data;
}

/**
 * 获取树
 * @param reportId 报告ID
 * @param detailsFlag 是否详细
 * @returns 树形结构数据
 */
export async function getMenuCourseTree(reportId: string, detailsFlag: boolean = false) {
	return (await http.get<Tree[]>('/report/course/getMenuCourseTree', { params: { reportId, detailsFlag } })).data;
}

/**
 * 生成课程开发 menu 菜单树
 * @param reportId 报告ID
 * @returns 菜单树数据
 */
export async function generateCourseReportMenu(reportId: string) {
	return (
		await http.get<Tree[]>('/report/course/generateCourseReportMenu', {
			params: { reportId },
		})
	).data;
}

/**
 * 新增课程体系结构树
 * @param reportMenuCourseList 报告菜单课程列表
 * @returns 新增结果
 */
export async function addMenuCourseTree(reportMenuCourseList: AddStructureTreeParams) {
	return await http.post('/report/course/addMenuCourseList', reportMenuCourseList);
}

/**
 * 获取课程体系结构树
 * @param reportId 报告ID
 * @returns 课程体系结构树数据
 */
export async function getMenuCourse(reportId: string) {
	return (await http.get<StructureData[]>('/report/course/getMenuCourseList', { params: { reportId } })).data;
}

/**
 * 更新审核记录
 * @param updateParams 更新参数
 * @returns 更新结果
 */
export async function updateAuditRecord(updateParams: UpdateParams) {
	return await http.put('/report/workplace/updateAuditRecord', updateParams);
}

/**
 * 获取表单题目
 * @param params {tableId: ‘表单ID’，studyFlag： ‘是否隐藏答案’}
 * @return Array<ReportCourseQuestion> 题目列表
 * */

export async function getTableFormQuestion(params: { tableId: string; studyFlag?: boolean }) {
	return await http.get<Array<ReportCourseQuestion>>('/report/course/getTableCourseQuestionList', { params: params });
}

/**
 * 获取课后练习题
 * @param params  { menuCourseId: '环节Id', studyFlag: ‘是否隐藏答案’ }
 * @return Array<ReportCourseQuestion> 题目列表
 * */
export async function getStepQuestion(params: { menuCourseId: string; studyFlag?: boolean }) {
	return await http.get<Array<ReportCourseQuestion>>('/report/course/getStepQuestionList', { params: params });
}

/**
 * 获取表单数据
 * @param menuCourseId 表单Id
 * @param reportType 报告类型
 * @return T 表单数据 (ReportMenuCourse | ReportMenuLooseLeaf)
 */
export async function getMenuCourseData<T extends ReportMenuCourse | ReportMenuLooseLeaf>(
	menuCourseId: string,
	reportType?: number,
) {
	return (await http.get<T>('/report/course/getMenuCourseData', { params: { menuCourseId, reportType } })).data;
}

/**
 * 更新课程菜单数据
 * */
export async function updateMenuCourseData(data: ReportMenuLooseLeaf) {
	return await http.put('/report/course/updateMenuCourseData', data);
}

/**
 * 批量新增题目
 * */
export async function addCourseQuestionList(tableId: string, questions: Array<ReportCourseQuestion>) {
	return (
		await http.post<Array<ReportCourseQuestion>>('/report/course/addCourseQuestionList', {
			tableId,
			questions: questions,
		})
	).data;
}

// 检测当前报告是否可以通过
export function checkReportAuditPass(reportId: string) {
	return http.get<boolean>('/report/course/checkReportAuditPass', { params: { reportId } });
}

// 更新报告封面图片
export function updateReportCover(reportId: string, fileId: string) {
	return http.put(`/report/updateReportCover/${reportId}/${fileId}`);
}
