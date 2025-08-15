<script setup lang="ts">
import emitter from '@/utils/event.ts';
import { message, Modal } from 'ant-design-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import AddCourseTag from './add-course-tag.vue';
import AddResourceTag from './add-resource-tag.vue';
import _ from 'lodash';
import { ProfessionalCourseSystemTable, ReportAuditTableRecord, ReportTable } from '@/view/__report';
import useAppTheme from '@/hooks/useAppTheme.ts';
import imgSrc from '@/assets/image/other/arrow.png';
import { getReportTable, getTableAudit, saveSurveyTable, getReportTableList } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});

const { user } = useUserStore();
const props = defineProps<{
	menu: Tree;
	reportId: string;
	reportStatus: number;
}>();

const isEdit = computed(() => {
	return [2, 3].includes(props.reportStatus);
});
const loading = ref<boolean>(false);
const pageState = reactive({ addComment: false });
const initTable = () => {
	return {
		reportId: props.reportId,
		menuId: props.menu.id,
		name: '',
		number: '',
		type: props.menu.type!,
		// 1: 通用 2: 专用 3: 拓展 4: 公共基础课程
		tableData: [
			{
				mapData: { '1': [], '2': [], '3': [], '4': [] },
				baseCourse: [],
				courseNature: 1,
				courseResource: [],
			},
			{
				mapData: { '1': [], '2': [], '3': [], '4': [] },
				baseCourse: [],
				courseNature: 2,
				courseResource: [],
			},
			{
				mapData: { '1': [], '2': [], '3': [], '4': [] },
				baseCourse: [],
				courseNature: 3,
				courseResource: [],
			},
			{
				mapData: { '1': [], '2': [], '3': [], '4': [] },
				baseCourse: [],
				courseNature: 4,
				courseResource: [],
			},
		],
		id: '',
		createBy: user.value!.id,
		createUser: user.value!.name,
		createTime: '',
		lastUpdateTime: '',
	};
};
const table = ref<ReportTable<ProfessionalCourseSystemTable>>(initTable());
const initTableData = ref<ReportTable<ProfessionalCourseSystemTable>>(initTable());
const emitterEvent = {
	temporarySave: () => {
		saveSurveyTable(table.value).then(() => {});
	},
	saveTable: () => {
		saveSurveyTable(table.value).then((res) => {
			if (table.value.id) {
				fetchTableAudit();
			}
			message.success('保存成功');
			table.value = res;
		});
	},
	resetTableData: () => {
		Modal.confirm({
			title: '确认重置',
			content: '是否确认重置表格数据？此操作不可恢复。',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				table.value.tableData.length = 0;
				table.value = initTable();
			},
		});
	},
	addComment: () => {
		pageState.addComment = true;
	},
};
const fetchTableData = () => {
	loading.value = true;
	getReportTableList({ menuId: props.menu.id, reportId: props.reportId })
		.then((res) => {
			if (res.length) {
				getReportTable<ProfessionalCourseSystemTable>({ tableId: res[0].value as string }).then((res) => {
					table.value = res;
					initTableData.value = _.cloneDeep(res);
					fetchTableAudit();
				});
			} else {
				table.value = initTable();
				tableAudit.value = null;
			}
		})
		.finally(() => {
			loading.value = false;
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
	emitter.on('report_table_reset_table_data', emitterEvent.resetTableData);
	fetchTableData();
});
onUnmounted(() => {
	emitter.off('report_table_save', emitterEvent.saveTable);
	emitter.off('report_table_reset_table_data', emitterEvent.resetTableData);
	if (!_.isEqual(table.value, initTableData.value)) {
		emitterEvent.temporarySave();
	}
});
</script>
<template>
	<div v-if="!loading" class="flex justify-center">
		<table class="w-full h-[776.6px]">
			<caption>
				表6-1-0-1 专业课程体系总表{{
					isEdit
				}}
			</caption>
			<tbody>
				<tr>
					<td class="text-center bg-gray-200">课程类型</td>
					<td class="text-center bg-gray-200">课程性质</td>
					<td class="text-center bg-gray-200">课程（学习场）名称</td>
					<td class="text-center bg-gray-200 w-[142px]">课程功能</td>
					<td class="text-center bg-gray-200 w-44">课程（教学）资源</td>
				</tr>
				<tr>
					<td rowspan="3" class="text-center bg-gray-200">行动逻辑课程</td>
					<td class="text-center h-[200px] bg-gray-200">专业拓展课程（拓展学习场）</td>
					<td>
						<add-course-tag
							v-model:tags="table.tableData[0].baseCourse"
							color="cyan"
							:isCourse="false"
							:is-edit="isEdit"
						></add-course-tag>
					</td>
					<td class="w-[141px] relative" rowspan="11">
						<img alt="" class="absolute top-0 left-0" :src="imgSrc" />
						<div class="absolute top-1/2 left-[13%] da">课 程 思 政</div>
						<div class="absolute top-[4%] left-[62%] da">拓展专业技能</div>
						<div class="absolute top-[24%] left-[62%] da">专业核心技能</div>
						<div class="absolute top-[42%] left-[62%] da">专业基础技能</div>
						<div class="absolute top-[74%] left-[62%] da">奠定基础知识</div>
					</td>
					<td>
						<add-resource-tag v-model:tags="table.tableData[0].courseResource" :is-edit="isEdit"></add-resource-tag>
					</td>
				</tr>
				<tr>
					<td class="text-center bg-gray-200 h-[170px]">专业核心课程/方向课程（专用学习场）</td>
					<td>
						<add-course-tag
							v-model:tags="table.tableData[1].baseCourse"
							color="cyan"
							:isCourse="false"
							:is-edit="isEdit"
						></add-course-tag>
					</td>
					<td>
						<add-resource-tag v-model:tags="table.tableData[1].courseResource" :is-edit="isEdit"></add-resource-tag>
					</td>
				</tr>
				<tr>
					<td class="text-center bg-gray-200 h-[170px]">专业基础课程（通用学习场）</td>
					<td>
						<add-course-tag
							v-model:tags="table.tableData[2].baseCourse"
							color="cyan"
							:isCourse="false"
							:is-edit="isEdit"
						></add-course-tag>
					</td>
					<td>
						<add-resource-tag v-model:tags="table.tableData[2].courseResource" :is-edit="isEdit"></add-resource-tag>
					</td>
				</tr>
				<tr>
					<td rowspan="8" class="text-center bg-gray-200">学科逻辑课程</td>
					<td rowspan="8" class="text-center bg-gray-200 h-[370px]">公共基础课程/通识课程</td>
					<td class="text-center bg-gray-200 h-8">文化基础类课程</td>
					<td rowspan="8">
						<add-resource-tag v-model:tags="table.tableData[3].courseResource" :is-edit="isEdit"></add-resource-tag>
					</td>
				</tr>
				<tr>
					<td>
						<add-course-tag
							v-model:tags="table.tableData[3].mapData['1']"
							color="orange"
							is-course
							:is-edit="isEdit"
						></add-course-tag>
					</td>
				</tr>
				<tr>
					<td class="text-center bg-gray-200 h-8">思想政治类课程</td>
				</tr>
				<tr>
					<td>
						<add-course-tag
							v-model:tags="table.tableData[3].mapData['2']"
							color="red"
							is-course
							:is-edit="isEdit"
						></add-course-tag>
					</td>
				</tr>
				<tr>
					<td class="text-center bg-gray-200 h-8">劳动体育类课程</td>
				</tr>
				<tr>
					<td>
						<add-course-tag
							v-model:tags="table.tableData[3].mapData['3']"
							color="green"
							is-course
							:is-edit="isEdit"
						></add-course-tag>
					</td>
				</tr>
				<tr>
					<td class="text-center bg-gray-200 h-8">通识类课程</td>
				</tr>
				<tr>
					<td>
						<add-course-tag
							v-model:tags="table.tableData[3].mapData['4']"
							color="blue"
							is-course
							:is-edit="isEdit"
						></add-course-tag>
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
	border: 1px solid v-bind(borderColor);
	line-height: 32px;
	padding: 0 8px;
}

th {
	text-align: right;
}

table {
	table-layout: fixed;
}

.da {
	writing-mode: vertical-rl;
	user-select: none;
}
</style>
