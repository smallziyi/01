<script setup lang="ts">
import InformationForm2 from './information-form2.vue';
import PlanForm2 from './plan-form2.vue';
import DecisionForm2 from './decision-form2.vue';
import ImplementForm2 from './implement-form2.vue';
import CheckForm2 from './check-form2.vue';
import EvaluationForm2 from './evaluation-form2.vue';
import { ReportMenuLooseLeaf } from '@/view/__report';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';
import useErrorTable from '@/view/__report/components/workplace/useErrorTable.ts';
import guidebookTabsComment from '../components/guidebook-tabs-comment.vue';

const data = defineModel<ReportMenuLooseLeaf>('data', { required: true });
defineProps<{
	type: 'audit' | 'edit' | 'preview';
}>();
const activeKey = ref(1);
const currentTableId = computed(() => {
	return data.value.tableFormData[activeKey.value - 1].tableId;
});

const tabsConfig = [
	{ key: 1, tab: '资讯', component: InformationForm2 },
	{ key: 2, tab: '计划', component: PlanForm2 },
	{ key: 3, tab: '决策', component: DecisionForm2 },
	{ key: 4, tab: '实施', component: ImplementForm2 },
	{ key: 5, tab: '检查', component: CheckForm2 },
	{ key: 6, tab: '评价', component: EvaluationForm2 },
];

const saveStatus = ref([false, false, false, false, false, false]);

const handleSave = () => {
	saveStatus.value[activeKey.value] = true;
};

defineExpose({ handleSave });

const { reportInfo } = useReportInfo();
const { errorTables } = useErrorTable();
provide('tabsForm', data);
provide('activeKey', activeKey);
provide('currentTableId', currentTableId);
</script>

<template>
	<a-tabs v-model:activeKey="activeKey">
		<a-tab-pane v-for="{ key, tab, component } in tabsConfig" :key="key">
			<template #tab>
				<template v-if="type === 'audit'">
					<a-badge v-if="data.tableFormData[key - 1].auditRecordData" status="success"></a-badge>
					<a-badge v-else status="warning"></a-badge>
					<span :class="errorTables.includes(data.tableFormData[key - 1].tableId) ? 'text-red-500' : ''">{{
						tab
					}}</span>
				</template>
				<template v-else-if="type === 'edit'">
					<a-badge v-if="data.tableFormData[key - 1].editedFlag" status="success"></a-badge>
					<a-badge v-else status="warning"></a-badge>
					<span :class="errorTables.includes(data.tableFormData[key - 1].tableId) ? 'text-red-500' : ''">{{
						tab
					}}</span>
				</template>
				<template v-else>
					<span>{{ tab }}</span>
				</template>
			</template>
			<guidebook-tabs-comment
				:type="reportInfo.pageType"
				:report-status="reportInfo.reportStatus"
				v-model:save="saveStatus[key - 1]"
				:tabs-form="data"
				:active-key="activeKey"
				:current-table-id="currentTableId"
			>
				<component :is="component" v-model:data="data" :key="key" v-model:save="saveStatus[key - 1]" />
			</guidebook-tabs-comment>
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
:deep(.ant-tabs-content) {
	height: calc(100vh - 332px);
	overflow-y: auto;
}
</style>
