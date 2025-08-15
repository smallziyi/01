<script setup lang="ts">
import emitter from '@/utils/event.ts';
import { message } from 'ant-design-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import { ReportAuditTableRecord, ReportTable } from '@/view/__report';
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
		tableData: '',
		id: '',
		createBy: user.value!.id,
		createUser: user.value!.name,
		createTime: '',
		lastUpdateTime: '',
	};
};
const table = ref<ReportTable<string>>(initTable());
const emitterEvent = {
	saveTable: () => {
		saveSurveyTable<string>(table.value).then((res) => {
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
			getReportTable<string>({ tableId: res[0].value as string }).then((res) => {
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
		<a-textarea
			v-model:value="table.tableData"
			:auto-size="{ minRows: 10 }"
			placeholder="请输入"
			:disabled="!isEditFlag"
		></a-textarea>
		<report-comment v-if="table.id" v-model:table-id="table.id" :report-status="props.reportStatus" />
	</div>
</template>
