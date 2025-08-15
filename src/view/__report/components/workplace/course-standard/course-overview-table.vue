<script setup lang="ts">
import emitter from '@/utils/event.ts';
import { message } from 'ant-design-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import { CourseOverviewTable, ReportAuditTableRecord, ReportTable } from '@/view/__report';
import { getReportTable, getReportTableList, getTableAudit, saveSurveyTable } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';
import useRouterParams from '@/hooks/useRouterParams';

const { user } = useUserStore();
const params = useRouterParams<{ type: 'edit' | 'audit' | 'preview' }>();
const isEditFlag = computed(() => params.type === 'edit');
const props = defineProps<{
	menu: Tree;
	reportId: string;
	reportStatus: number;
}>();
const pageState = reactive({ addComment: false });
const initTable = () => {
	return {
		reportId: props.reportId,
		menuId: props.menu.id,
		name: '',
		number: '',
		type: props.menu.type!,
		tableData: {
			courseName: '',
			courseManagementUnit: '',
			readingNature: '',
			assessmentNature: '',
			professionalCode: '',
			openingSemester: '第 X 学期',
			leadingCourse: '',
			subsequentCourses: '',
			totalCreditHours: '',
			credit: '',
			courseType: [],
			supportingPersonnelTrainingPlan: '',
		},
		id: '',
		createBy: user.value!.id,
		createUser: user.value!.name,
		createTime: '',
		lastUpdateTime: '',
	};
};
const table = ref<ReportTable<CourseOverviewTable>>(initTable());
const courseTypeOptions: Option[] = [
	{ label: '理论课', value: '1' },
	{ label: '理论+实践', value: '2' },
	{ label: '理实一体化', value: '3' },
	{ label: '集中实践课', value: '4' },
	{ label: '专业核心课', value: '5' },
	{ label: '非专业核心课', value: '6' },
];
const emitterEvent = {
	saveTable: () => {
		saveSurveyTable(table.value).then((res) => {
			if (table.value.id) {
				fetchTableAudit();
			}
			message.success('保存成功');
			table.value = res;
		});
	},
	addComment: () => {
		pageState.addComment = true;
	},
};
const fetchTableData = () => {
	getReportTableList({ menuId: props.menu.id, reportId: props.reportId }).then((res) => {
		if (res.length) {
			getReportTable<CourseOverviewTable>({ tableId: res[0].value as string }).then((res) => {
				table.value = res;
				fetchTableAudit();
			});
		} else {
			table.value = initTable();
			tableAudit.value = null;
		}
	});
};
const tableAudit = ref<ReportAuditTableRecord | null>();
const fetchTableAudit = () => {
	if (table.value.id) {
		getTableAudit({ tableId: table.value.id }).then((res) => {
			tableAudit.value = res;
		});
	}
};
onMounted(() => {
	emitter.on('report_table_save', emitterEvent.saveTable);
	fetchTableData();
});
onUnmounted(() => {
	emitter.off('report_table_save', emitterEvent.saveTable);
});
</script>
<template>
	<div class="flex justify-center">
		<table class="w-full">
			<caption>
				表2-1 课程编概述表
			</caption>
			<tbody>
				<tr>
					<td>课程/学习场名称</td>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.courseName" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.courseName }}</span>
					</td>
					<td>管课单位</td>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.courseManagementUnit" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.courseManagementUnit }}</span>
					</td>
				</tr>
				<tr>
					<td>修读性质</td>
					<td>
						<a-radio-group v-model:value="table.tableData.readingNature" name="radioGroup" :disabled="!isEditFlag">
							<a-radio value="1">必修</a-radio>
							<a-radio value="2">选修</a-radio>
						</a-radio-group>
					</td>
					<td>考核性质</td>
					<td>
						<a-radio-group v-model:value="table.tableData.assessmentNature" name="radioGroup" :disabled="!isEditFlag">
							<a-radio value="1">考试</a-radio>
							<a-radio value="2">考查</a-radio>
						</a-radio-group>
					</td>
				</tr>
				<tr>
					<td>适用专业及专业代码</td>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.professionalCode" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.professionalCode }}</span>
					</td>
					<td>开设学期</td>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.openingSemester" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.openingSemester }}</span>
					</td>
				</tr>
				<tr>
					<td>前导课程/学习场</td>
					<td colspan="3">
						<a-input v-if="isEditFlag" v-model:value="table.tableData.leadingCourse" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.leadingCourse }}</span>
					</td>
				</tr>
				<tr>
					<td>后续课程/学习场</td>
					<td colspan="3">
						<a-input v-if="isEditFlag" v-model:value="table.tableData.subsequentCourses" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.subsequentCourses }}</span>
					</td>
				</tr>
				<tr>
					<td>总学时</td>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.totalCreditHours" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.totalCreditHours }}</span>
					</td>
					<td>学分</td>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.credit" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.credit }}</span>
					</td>
				</tr>
				<tr>
					<td>课程类型</td>
					<td colspan="3">
						<a-checkbox-group
							v-model:value="table.tableData.courseType"
							:disabled="!isEditFlag"
							:options="courseTypeOptions"
							name="checkboxgroup"
						/>
					</td>
				</tr>
				<tr>
					<td>配套人才培养方案</td>
					<td colspan="3">
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.supportingPersonnelTrainingPlan"
							:bordered="false"
						></a-input>
						<span v-else>{{ table.tableData.supportingPersonnelTrainingPlan }}</span>
					</td>
				</tr>
			</tbody>
		</table>
		<report-comment v-if="table.id" v-model:table-id="table.id" :report-status="props.reportStatus" />
	</div>
</template>
<style scoped>
table,
td,
th {
	border-collapse: collapse;
	border: 1px solid #b4d3ff;
	line-height: 32px;
	padding: 0 8px;
}

th {
	text-align: right;
}
</style>
