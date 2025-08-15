<script setup lang="ts">
import InformationForm3 from './information-form3.vue';
import PlanForm3 from './plan-form3.vue';
import DecisionForm3 from './decision-form3.vue';
import ImplementForm3 from './implement-form3.vue';
import CheckForm3 from './check-form3.vue';
import EvaluationForm3 from './evaluation-form3.vue';
import { ReportMenuLooseLeaf } from '@/view/__report';

const data = defineModel<ReportMenuLooseLeaf>('data', { required: true });
const activeKey = ref(1);
const currentTableId = computed(() => {
	return data.value.tableFormData[activeKey.value - 1].tableId;
});

const tabsConfig = [
	{ key: 1, tab: '资讯', component: InformationForm3 },
	{ key: 2, tab: '计划', component: PlanForm3 },
	{ key: 3, tab: '决策', component: DecisionForm3 },
	{ key: 4, tab: '实施', component: ImplementForm3 },
	{ key: 5, tab: '检查', component: CheckForm3 },
	{ key: 6, tab: '评价', component: EvaluationForm3 },
];

provide('tabsForm', data);
provide('activeKey', activeKey);
provide('currentTableId', currentTableId);
</script>

<template>
	<a-tabs v-if="data.tableFormData" v-model:activeKey="activeKey">
		<a-tab-pane v-for="{ key, tab, component } in tabsConfig" :key="key">
			<template #tab>
				<a-badge :status="data.tableFormData[key - 1].showFlag ? 'success' : 'warning'" />{{ tab }}
			</template>
			<component :is="component" :data="data" :key="key" />
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
:deep(.ant-tabs-content) {
	height: calc(100vh - 332px);
	overflow-y: auto;
}
</style>
