<script setup lang="ts">
import InformationForm from './information-form.vue';
import PlanForm from './plan-form.vue';
import DecisionForm from './decision-form.vue';
import ImplementForm from './implement-form.vue';
import CheckForm from './check-form.vue';
import EvaluationForm from './evaluation-form.vue';
import { AuditRecordData, ReportMenuCourse, ReportMenuLooseLeaf } from '@/view/__report';

const props = defineProps<{
	taskFormData: ReportMenuCourse;
	type: 'edit' | 'audit' | 'preview';
	reportStatus: number;
}>();
const emits = defineEmits(['approved']);

const tabsForm = defineModel<ReportMenuLooseLeaf>('tabsForm', { required: true });
const activeKey = ref(1);
const currentTableId = computed(() => {
	return tabsForm.value.tableFormData[activeKey.value - 1].tableId;
});

const disabledList = computed(() => {
	return tabsForm.value.tableFormData.map((item) => item.editedFlag);
});
const auditRecordList = computed(() => {
	return tabsForm.value.tableFormData.map((item) => !!item.auditRecordData);
});

const handleApproved = (record: AuditRecordData | null) => {
	tabsForm.value.tableFormData[activeKey.value - 1].auditRecordData = record;
};
provide('taskForm', props.taskFormData.tableFormData[0].data);
provide('tabsForm', tabsForm.value);
provide('activeKey', activeKey);
provide('currentTableId', currentTableId);
</script>

<template>
	<a-tabs class="tabs-form" v-model:activeKey="activeKey">
		<a-tab-pane :key="1">
			<template #tab>
				<div class="flex">
					<a-badge v-if="type === 'audit' && auditRecordList[0]" status="success"></a-badge>
					<div class="mr-1">资讯</div>
				</div>
			</template>
			<information-form :type="type" :report-status="reportStatus" @approved="handleApproved"></information-form>
		</a-tab-pane>
		<a-tab-pane :key="2" :disabled="!disabledList[0]">
			<template #tab>
				<div class="flex">
					<a-badge v-if="type === 'audit' && auditRecordList[1]" status="success"></a-badge>
					<div class="mr-1">计划</div>
				</div>
			</template>
			<plan-form :type="type" :report-status="reportStatus" @approved="handleApproved"></plan-form>
		</a-tab-pane>
		<a-tab-pane :key="3" :disabled="!disabledList[1]">
			<template #tab>
				<div class="flex">
					<a-badge v-if="type === 'audit' && auditRecordList[2]" status="success"></a-badge>
					<div class="mr-1">决策</div>
				</div>
			</template>
			<decision-form :type="type" :report-status="reportStatus" @approved="handleApproved"></decision-form>
		</a-tab-pane>
		<a-tab-pane :key="4" :disabled="!disabledList[2]">
			<template #tab>
				<div class="flex">
					<a-badge v-if="type === 'audit' && auditRecordList[3]" status="success"></a-badge>
					<div class="mr-1">实施</div>
				</div>
			</template>
			<implement-form :type="type" :report-status="reportStatus" @approved="handleApproved"></implement-form>
		</a-tab-pane>
		<a-tab-pane :key="5" :disabled="!disabledList[3]">
			<template #tab>
				<div class="flex">
					<a-badge v-if="type === 'audit' && auditRecordList[4]" status="success"></a-badge>
					<div class="mr-1">检查</div>
				</div>
			</template>
			<check-form :type="type" :report-status="reportStatus" @approved="handleApproved"></check-form>
		</a-tab-pane>
		<a-tab-pane :key="6" :disabled="!disabledList[4]">
			<template #tab>
				<div class="flex">
					<a-badge v-if="type === 'audit' && auditRecordList[5]" status="success"></a-badge>
					<div class="mr-1">评价</div>
				</div>
			</template>
			<evaluation-form :type="type" :report-status="reportStatus" @approved="handleApproved"></evaluation-form>
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
:deep(.ant-tabs-content) {
	height: calc(100vh - 332px);
	overflow-y: auto;
}
</style>
