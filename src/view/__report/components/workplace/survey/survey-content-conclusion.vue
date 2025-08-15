<script setup lang="ts">
import emitter from '@/utils/event.ts';
import { message, Modal } from 'ant-design-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import { ReportAuditTableRecord, ReportTable } from '@/view/__report';
import _ from 'lodash';
import { getTableAudit, saveSurveyTable, getReportTableList, getReportTable } from '@/axios';
import useRouterParams from '@/hooks/useRouterParams';
import useUserStore from '@/store/modules/useUserStore.ts';

const params = useRouterParams<{ type: 'preview' | 'edit' | 'audit' }>();
const { user } = useUserStore();
const props = defineProps<{
	menu: Tree;
	reportId: string;
	reportStatus: number;
}>();
const formRef = ref();
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
const pageState = reactive({ addComment: false });
const table = ref<ReportTable<string>>(initTable());
const initTableData = ref<ReportTable<string>>(initTable());
const emitterEvent = {
	temporarySave: () => {
		saveSurveyTable(table.value).then(() => {});
	},
	saveTable: () => {
		formRef.value
			?.validate()
			.then(() => {
				saveSurveyTable(table.value).then((res) => {
					if (table.value.id) {
						fetchTableAudit();
					}
					message.success('保存成功');
					table.value = res;
				});
			})
			.catch((err: FormError) => {
				message.warning(err.errorFields[0].errors[0]);
			});
	},
	resetTableData: () => {
		Modal.confirm({
			title: '确认重置',
			content: '是否确认重置表格数据？此操作不可恢复。',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				formRef.value?.resetFields();
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
	<div>
		<a-form ref="formRef" :model="table">
			<a-form-item :rules="[{ required: true, message: '请输入结论' }]" name="tableData">
				<a-textarea
					v-model:value="table.tableData"
					placeholder="请输入"
					:disabled="params.type !== 'edit'"
					:auto-size="{ minRows: 6 }"
				></a-textarea>
			</a-form-item>
		</a-form>
		<report-comment v-if="table.id" v-model:table-id="table.id" :report-status="props.reportStatus" />
	</div>
</template>
