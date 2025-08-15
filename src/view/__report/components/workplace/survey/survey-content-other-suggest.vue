<script setup lang="ts">
import security from '@/utils/security.ts';
import { FormInstance } from 'ant-design-vue/es/form';
import emitter from '@/utils/event.ts';
import { message, Modal } from 'ant-design-vue';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import InstructionBook from '../instruction-book.vue';
import _ from 'lodash';
import { REPORT_TYPE, ReportAuditTableRecord, ReportTable } from '@/view/__report';
import { saveSurveyTable, getTableAudit, getReportTableList, getReportTable } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';

const props = defineProps<{ menu: Tree; reportStatus: number }>();
const router = useRouter();
const { user } = useUserStore();

const params = security.base64Decode<{ reportId: string; type: 'edit' | 'audit' }>(
	router.currentRoute.value.query.v as string,
);

const fetchTableData = () => {
	getReportTableList({ menuId: props.menu.id, reportId: params.reportId }).then((res) => {
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

const pageState = reactive({ addComment: false });
const emitterEvent = {
	temporarySave: () => {
		saveSurveyTable(table.value).then(() => {});
	},
	saveTable: () => {
		form.value?.validate().then(() => {
			saveSurveyTable(table.value).then((res) => {
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

const initTable = () => {
	return {
		reportId: params.reportId,
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
const form = ref<FormInstance>();

watch(
	() => props.menu,
	() => {
		form.value?.clearValidate();
		fetchTableData();
		fetchTableAudit();
	},
);
</script>

<template>
	<div class="flex justify-center">
		<instruction-book :report-type="REPORT_TYPE.SURVEY" :type="menu.type" />
	</div>
	<div class="flex gap-4">
		<div class="grow">
			<a-form :model="table" layout="vertical" ref="form">
				<a-form-item name="tableData" :rules="{ required: true, message: '请填写其他方面建议' }">
					<a-textarea
						v-model:value="table.tableData"
						:auto-size="{ minRows: 5 }"
						placeholder="请输入建议"
						:disabled="params.type !== 'edit'"
					></a-textarea>
				</a-form-item>
			</a-form>
		</div>
		<report-comment v-if="table.id" v-model:table-id="table.id" :report-status="$props.reportStatus" />
	</div>
</template>

<style scoped></style>
