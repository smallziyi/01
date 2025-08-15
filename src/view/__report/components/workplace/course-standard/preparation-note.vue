<script setup lang="ts">
import emitter from '@/utils/event.ts';
import { message } from 'ant-design-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import { CourseStandardPreparationNote, ReportAuditTableRecord, ReportTable } from '@/view/__report';
import { saveSurveyTable, getTableAudit, getReportTableList, getReportTable } from '@/axios';
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
			organization: '',
			professionalNameCode: '',
			professionalCategoriesCode: '',
			courseNameAndCode: '',
			writer: '',
			leadingMember: '',
			reviewer: '',
			specifyDate: '20X 年 X 月 X 日',
			revisionDate: '20X 年 X 月 X 日',
		},
		id: '',
		createBy: user.value!.id,
		createUser: user.value!.name,
		createTime: '',
		lastUpdateTime: '',
	};
};
const table = ref<ReportTable<CourseStandardPreparationNote>>(initTable());
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
			getReportTable<CourseStandardPreparationNote>({ tableId: res[0].value as string }).then((res) => {
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
				表1-1 课程编制说明表
			</caption>
			<tbody>
				<tr>
					<th class="w-48">编制部门/单位：</th>
					<td>
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.organization"
							:bordered="false"
							placeholder="请输入"
						></a-input>
						<span v-else>{{ table.tableData.organization }}</span>
					</td>
				</tr>
				<tr>
					<th>专业名称及代码：</th>
					<td>
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.professionalNameCode"
							:bordered="false"
							placeholder="(注意：必须符合教育部专业目录)"
						></a-input>
						<span v-else>{{ table.tableData.professionalNameCode }}</span>
					</td>
				</tr>
				<tr>
					<th>专业大类及代码：</th>
					<td>
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.professionalCategoriesCode"
							:bordered="false"
							placeholder="(注意：必须符合教育部专业目录)"
						></a-input>
						<span v-else>{{ table.tableData.professionalCategoriesCode }}</span>
					</td>
				</tr>
				<tr>
					<th>课程名称及代码：</th>
					<td>
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.courseNameAndCode"
							:bordered="false"
							placeholder="(学校统一编码或由编制部门/单位编码)"
						></a-input>
						<span v-else>{{ table.tableData.courseNameAndCode }}</span>
					</td>
				</tr>
				<tr>
					<th>执笔人：</th>
					<td>
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.writer"
							:bordered="false"
							placeholder="请输入"
						></a-input>
						<span v-else>{{ table.tableData.writer }}</span>
					</td>
				</tr>
				<tr>
					<th>主要成员：</th>
					<td>
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.leadingMember"
							:bordered="false"
							placeholder="(注意：必须有企业家)"
						></a-input>
						<span v-else>{{ table.tableData.leadingMember }}</span>
					</td>
				</tr>
				<tr>
					<th>审核人：</th>
					<td>
						<a-input
							v-if="isEditFlag"
							v-model:value="table.tableData.reviewer"
							:bordered="false"
							placeholder="请输入"
						></a-input>
						<span v-else>{{ table.tableData.reviewer }}</span>
					</td>
				</tr>
				<tr>
					<th>指定日期：</th>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.specifyDate" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.specifyDate }}</span>
					</td>
				</tr>
				<tr>
					<th>修订日期：</th>
					<td>
						<a-input v-if="isEditFlag" v-model:value="table.tableData.revisionDate" :bordered="false"></a-input>
						<span v-else>{{ table.tableData.revisionDate }}</span>
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
