<script setup lang="ts">
import emitter from '@/utils/event.ts';
import ReportExcelUpload from '@/view/__report/components/workplace/report-excel-upload.vue';
import ReportExcelTable from '@/view/__report/components/workplace/report-excel-table.vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import InstructionBook from './instruction-book.vue';
import { ReportAuditTableRecord, ReportTable, ReportType } from '@/view/__report';
import { deleteTable, getReportTable, getReportTableList, getTableAudit, saveSurveyTable } from '@/axios';
import _ from 'lodash';

const props = defineProps<{
	reportType: ReportType;
	menuId: string;
	type: string;
	pageType: 'edit' | 'audit' | 'preview';
	reportId: string;
	reportStatus: number;
	error: Array<string>;
	checkError: boolean;
}>();

const emitterEvent = {
	temporarySave: () => {
		if (table.value) {
			saveSurveyTable(table.value).then(() => {});
		}
	},
	saveTable: () => {
		if (table.value) {
			saveSurveyTable(table.value).then(() => {
				message.success('保存成功');
			});
		} else {
			message.info('未上传数据，无需保存');
		}
	},

	uploadExcel: () => {
		pageState.resetTable = false;
		pageState.uploadExcel = true;
	},
	resetTableData: () => {
		if (pageState.activeKey) {
			pageState.resetTable = true;
			pageState.uploadExcel = true;
		} else {
			message.warning('尚未上传数据');
		}
	},
	showTableErrorCells: (cells: string) => {
		pageState.errorCells = JSON.parse(JSON.stringify(cells));
	},
};
const dataFetchEvent = {
	fetchTableList: () => {
		getReportTableList({ menuId: props.menuId, reportId: props.reportId }).then((res) => {
			tableList.value = res.map((item) => ({ value: item.value as string, label: item.label as string }));
			if (tableList.value.length > 0) {
				pageState.activeKey = tableList.value[0].value;
			}
		});
	},
	fetchTableData: () => {
		pageState.loading = true;
		getReportTable<TableData>({ tableId: pageState.activeKey })
			.then((res) => {
				table.value = res;
				initTable = _.cloneDeep(table.value);
			})
			.finally(() => {
				pageState.loading = false;
			});
	},
	fetchTableAudit: () => {
		getTableAudit({ tableId: pageState.activeKey }).then((res) => {
			tableAudit.value = res;
		});
	},
};
let initTable: any;
onMounted(() => {
	emitter.on('report_table_save', emitterEvent.saveTable);
	emitter.on('report_table_upload_excel', emitterEvent.uploadExcel);
	emitter.on('report_table_reset_table_data', emitterEvent.resetTableData);
	emitter.on('report_table_comment_cells', emitterEvent.showTableErrorCells);
	dataFetchEvent.fetchTableList();
});
onUnmounted(() => {
	emitter.off('report_table_save', emitterEvent.saveTable);
	emitter.off('report_table_upload_excel', emitterEvent.uploadExcel);
	emitter.off('report_table_reset_table_data', emitterEvent.resetTableData);
	emitter.off('report_table_comment_cells', emitterEvent.showTableErrorCells);
	if (!_.isEqual(table.value, initTable)) {
		emitterEvent.temporarySave();
	}
});
const table = ref<ReportTable<TableData>>();
const tableList = ref<Array<{ value: string; label: string }>>([]);
const pageState = reactive<{
	activeKey: string;
	loading: boolean;
	uploadExcel: boolean;
	resetTable: boolean;
	editTableName: boolean;
	newTableName: string;
	errorCells: Array<number>;
}>({
	activeKey: '',
	loading: false,
	uploadExcel: false,
	resetTable: false,
	editTableName: false,
	newTableName: '',
	errorCells: [],
});

const tableAudit = ref<ReportAuditTableRecord>();

const handleUploadExcelSuccess = (res: { value: string; label: string }) => {
	if (pageState.resetTable) {
		tableList.value.find((item) => item.value === res.value)!.label = res.label;
		dataFetchEvent.fetchTableData();
	} else {
		tableList.value.push(res);
		pageState.activeKey = res.value;
	}
};
const handleDeleteTable = (tableId: string) => {
	deleteTable({ tableId }).then(() => {
		tableList.value = tableList.value.filter((item) => item.value !== tableId);
		if (tableList.value.length > 0) {
			pageState.activeKey = tableList.value[0].value;
		} else {
			pageState.activeKey = '';
		}
	});
};
const handleUpdateTableName = () => {
	if (!pageState.newTableName.trim()) {
		message.warning('请输入表格名称');
		return;
	}
	if (pageState.newTableName !== table.value?.name) {
		handleUpdateTable();
	}
	pageState.editTableName = false;
};
const handleUpdateTable = () => {
	saveSurveyTable({ ...table.value!, name: pageState.newTableName || table.value!.name })
		.then((res) => {
			message.success('修改成功');
			table.value = res;
			pageState.editTableName = false;
			tableList.value.find((item) => item.value === pageState.activeKey)!.label = res.name;
		})
		.finally(() => {
			pageState.editTableName = false;
		});
};
const existenceDeclaration = [
	'cultivate_goals',
	'cultivate_specification',
	'cultivate_mode',
	'teaching_method',
	'teaching_management',
	'teaching_objective',
	'organization_management',
	'curriculum_system',
	'evaluation_method',
	'professional_teaching_team',
	'learning_resources',
];

watch(
	() => pageState.activeKey,
	() => {
		if (pageState.activeKey) {
			dataFetchEvent.fetchTableData();
			dataFetchEvent.fetchTableAudit();
			pageState.errorCells = [];
		}
	},
);
</script>

<template>
	<div class="flex flex-col" style="height: calc(100vh - 214px)">
		<div class="flex justify-center">
			<!-- 填写说明 -->
			<instruction-book :type="type" />
		</div>
		<div v-if="reportType === 2 && existenceDeclaration.includes(type) && table">
			<!-- 补充说明 -->
			<a-textarea
				v-model:value="table.tableDescription"
				placeholder="请输入表格描述信息"
				:auto-size="{ minRows: 2 }"
				:disabled="pageType !== 'edit'"
			></a-textarea>
		</div>
		<a-button
			v-if="!tableList.length && [2, 3].includes(props.reportStatus)"
			size="large"
			type="dashed"
			class="w-full flex-1"
			@click="emitter.emit('report_table_upload_excel')"
		>
			<div class="flex flex-col justify-center items-center">
				<PlusOutlined class="mb-4" />
				<div>数据导入</div>
			</div>
		</a-button>
		<div v-else-if="!tableList.length && [4, 5, 6].includes(props.reportStatus)" class="bg-white rounded-lg h-full">
			<m-empty />
		</div>
		<a-tabs v-else v-model:active-key="pageState.activeKey" size="small">
			<a-tab-pane v-for="item in tableList" :key="item.value">
				<template #tab>
					<div class="tab_container h-6 leading-6">
						<span :style="checkError && error.includes(item.value) ? { color: '#ff4d4f !important' } : {}">
							{{ item.label }}
						</span>
						<a-popconfirm @confirm="handleDeleteTable(item.value)">
							<template #title><span>确定删除该表格吗？</span></template>
							<a-button
								size="small"
								danger
								type="text"
								class="close_icon"
								v-if="pageState.activeKey === item.value && $props.pageType === 'edit'"
							>
								<template #icon>
									<i class="bi bi-trash3"></i>
								</template>
							</a-button>
						</a-popconfirm>
					</div>
				</template>
			</a-tab-pane>
		</a-tabs>
		<div class="flex gap-4" v-if="pageState.activeKey && !pageState.loading && table">
			<div class="grow">
				<report-excel-table
					v-model:table-data="table!.tableData"
					v-model:error-cells="pageState.errorCells"
					@update="handleUpdateTable"
				>
					<div class="leading-6 flex justify-center gap-2 mb-2">
						<div>{{ table?.number }}</div>
						<div class="flex">
							<div v-if="!pageState.editTableName">{{ table?.name }}</div>
							<div v-else>
								<input
									v-model="pageState.newTableName"
									class="border-[#b4d3ff] border-b outline-none text-center px-2 inline-block w-auto"
								/>
							</div>
							<template v-if="[2, 3].includes($props.reportStatus)">
								<a-button
									size="small"
									type="link"
									@click="
										() => {
											pageState.newTableName = table?.name!;
											pageState.editTableName = true;
										}
									"
									v-if="!pageState.editTableName"
								>
									<template #icon><i class="bi bi-pen-fill"></i></template>
								</a-button>
								<a-button v-else size="small" type="link" @click="handleUpdateTableName">
									<template #icon><i class="bi bi-check-lg"></i></template>
								</a-button>
							</template>
						</div>
					</div>
				</report-excel-table>
			</div>
			<report-comment v-if="table.id" v-model:table-id="table.id" :report-status="reportStatus" />
		</div>
	</div>
	<report-excel-upload
		v-if="pageState.uploadExcel"
		v-model:upload="pageState.uploadExcel"
		:report-id="$props.reportId"
		:menu-id="$props.menuId"
		:reset="pageState.resetTable"
		:sort="tableList.length + 1"
		:type="$props.type"
		:table-id="table?.id || ''"
		@success="handleUploadExcelSuccess"
	/>
</template>

<style scoped>
.close_icon {
	display: none;
}

.tab_container:hover .close_icon {
	display: inline-block;
}
</style>
