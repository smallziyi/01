<script setup lang="ts">
import emitter from '@/utils/event.ts';
import { message, Modal } from 'ant-design-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import InstructionBook from '@/view/__report/components/workplace/instruction-book.vue';
import _ from 'lodash';
import { ReportAuditTableRecord, ReportTable } from '@/view/__report';
import { getReportTableList, getTableAudit, saveSurveyTable, getReportTable } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';

const { user } = useUserStore();
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
const initTableData = ref<ReportTable<string>>(initTable());
const form = ref();
const emitterEvent = {
	temporarySave: () => {
		saveSurveyTable(table.value).then(() => {});
	},
	saveTable: () => {
		form.value.validate().then(() => {
			saveSurveyTable<string>(table.value).then((res) => {
				if (table.value.id) {
					fetchTableAudit();
				}
				message.success('保存成功');
				table.value = res;
			});
		});
	},
	resetTableData: () => {
		Modal.confirm({
			title: '确认重置',
			content: '是否确认重置表格数据？此操作不可恢复。',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				form.value?.resetFields();
				table.value.tableData = '';
			},
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
				initTableData.value = _.cloneDeep(res);
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
	<instruction-book :report-type="2" :type="menu.type" />
	<a-form :model="table" ref="form">
		<a-form-item :rules="[{ required: true, message: '请输入' }]" name="tableData">
			<a-textarea
				v-model:value="table.tableData"
				:auto-size="{ minRows: 6 }"
				placeholder="请输入"
				:disabled="![2, 3].includes(reportStatus)"
			></a-textarea>
		</a-form-item>
	</a-form>
	<report-comment v-if="table.id" v-model:table-id="table.id" :report-status="props.reportStatus" />
</template>
