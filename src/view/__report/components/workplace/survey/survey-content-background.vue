<script setup lang="ts">
import security from '@/utils/security.ts';
import { message, Modal } from 'ant-design-vue';
import { FormInstance } from 'ant-design-vue/es/form';
import emitter from '@/utils/event.ts';
import ReportComment from '@/view/__report/components/workplace/report-comment.vue';
import InstructionBook from '../instruction-book.vue';
import _ from 'lodash';
import { REPORT_TYPE, ReportAuditTableRecord, ReportTable, SurveyContentBackground } from '@/view/__report';
import { getReportTable, getReportTableList, getTableAudit, saveSurveyTable } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';

const props = defineProps<{ menu: Tree; reportStatus: number }>();
const router = useRouter();
const { user } = useUserStore();

const params = security.base64Decode<{ reportId: string; type: 'edit' | 'audit' | 'preview' }>(
	router.currentRoute.value.query.v as string,
);

const fetchTableData = () => {
	getReportTableList({ menuId: props.menu.id, reportId: params.reportId }).then((res) => {
		if (res.length) {
			getReportTable<SurveyContentBackground>({ tableId: res[0].value as string }).then((res) => {
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
		form.value
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
				form.value?.resetFields();
				table.value.tableData = {
					background_detail_1: '',
					background_detail_2: '',
					background_detail_3: '',
				};
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
		tableData: {
			background_detail_1: '',
			background_detail_2: '',
			background_detail_3: '',
		},
		id: '',
		createBy: user.value!.id,
		createUser: user.value!.name,
		createTime: '',
		lastUpdateTime: '',
	};
};
const table = ref<ReportTable<SurveyContentBackground>>(initTable());
const initTableData = ref<ReportTable<SurveyContentBackground>>(initTable());

const form = ref<FormInstance>();

const label1 = computed(() => {
	if (props.menu.type === 'background_1') {
		return '1.1 世界相关产业生产技术水平的升级情况';
	} else if (props.menu.type === 'background_2') {
		return '2.1 中国相关产业生产技术水平的升级情况';
	} else {
		return '3.1 区域相关产业生产技术水平的升级情况';
	}
});
const label2 = computed(() => {
	if (props.menu.type === 'background_1') {
		return '1.2 世界相关产业生产技术规模和数量变化';
	} else if (props.menu.type === 'background_2') {
		return '2.2 中国相关产业生产技术规模和数量变化';
	} else {
		return '3.2 区域相关产业生产技术规模和数量变化';
	}
});
const label3 = computed(() => {
	if (props.menu.type === 'background_1') {
		return '1.3 世界相关产业生产技术岗位职责变动情况';
	} else if (props.menu.type === 'background_2') {
		return '2.3 中国相关产业生产技术岗位职责变动情况';
	} else {
		return '3.3 区域相关产业生产技术岗位职责变动情况';
	}
});
// const message1 = computed(() => {
// 	if (props.menu.type === 'background_1') {
// 		return '请填写世界相关产业生产技术水平的升级情况';
// 	} else if (props.menu.type === 'background_2') {
// 		return '请填写中国相关产业生产技术水平的升级情况';
// 	} else {
// 		return '请填写区域相关产业生产技术水平的升级情况';
// 	}
// });
// const message2 = computed(() => {
// 	if (props.menu.type === 'background_1') {
// 		return '请填写世界相关产业生产技术规模和数量变化';
// 	} else if (props.menu.type === 'background_2') {
// 		return '请填写中国相关产业生产技术规模和数量变化';
// 	} else {
// 		return '请填写区域相关产业生产技术规模和数量变化';
// 	}
// });
// const message3 = computed(() => {
// 	if (props.menu.type === 'background_1') {
// 		return '请填写世界相关产业生产技术岗位职责变动情况';
// 	} else if (props.menu.type === 'background_2') {
// 		return '请填写中国相关产业生产技术岗位职责变动情况';
// 	} else {
// 		return '请填写区域相关产业生产技术岗位职责变动情况';
// 	}
// });
</script>

<template>
	<div class="flex justify-center">
		<instruction-book :report-type="REPORT_TYPE.SURVEY" :type="menu.type" />
	</div>
	<div class="flex gap-4">
		<div class="grow">
			<a-form :model="table" layout="vertical" ref="form">
				<!--				<a-form-item-->
				<!--					:label="label1"-->
				<!--					:name="['tableData', 'background_detail_1']"-->
				<!--					:rules="[{ required: true, message: message1 }]"-->
				<!--				>				-->
				<a-form-item
					:label="label1"
					:name="['tableData', 'background_detail_1']"
				>
					<a-textarea
						v-model:value="(table.tableData as SurveyContentBackground).background_detail_1"
						placeholder="请输入"
						:auto-size="{ minRows: 3 }"
						:disabled="params.type !== 'edit'"
					></a-textarea>
				</a-form-item>
				<!--				<a-form-item-->
				<!--					:label="label2"-->
				<!--					:name="['tableData', 'background_detail_2']"-->
				<!--					:rules="[{ required: true, message: message2 }]"-->
				<!--				>-->
				<a-form-item
					:label="label2"
					:name="['tableData', 'background_detail_2']"
				>
					<a-textarea
						placeholder="请输入"
						:auto-size="{ minRows: 3 }"
						:disabled="params.type !== 'edit'"
						v-model:value="(table.tableData as SurveyContentBackground).background_detail_2"
					></a-textarea>
				</a-form-item>
				<a-form-item
					:label="label3"
					:name="['tableData', 'background_detail_3']"
				>
					<!--					<a-form-item-->
					<!--					:label="label3"-->
					<!--					:name="['tableData', 'background_detail_3']"-->
					<!--					:rules="[{ required: true, message: message3 }]"-->
					<!--				>-->
					<a-textarea
						placeholder="请输入"
						:auto-size="{ minRows: 3 }"
						:disabled="params.type !== 'edit'"
						v-model:value="(table.tableData as SurveyContentBackground).background_detail_3"
					></a-textarea>
				</a-form-item>
			</a-form>
		</div>
		<report-comment v-if="table.id" v-model:table-id="table.id" :report-status="$props.reportStatus" />
	</div>
</template>

<style scoped></style>
