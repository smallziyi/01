<script setup lang="ts">
import InformationForm from './information-form4.vue';
import PlanForm from './plan-form4.vue';
import DecisionForm from './decision-form4.vue';
import ImplementForm from './implement-form4.vue';
import CheckForm from './check-form4.vue';
import EvaluationForm from './evaluation-form4.vue';
import { ReportMenuLooseLeaf } from '@/view/__report';
import useRouterParams from '@/hooks/useRouterParams';

const { courseType } = useRouterParams<{ courseType: 'preview' | 'detail' }>();
const data = defineModel<ReportMenuLooseLeaf>('data', { required: true });
const props = defineProps<{
	beforePreviewDataList: number[];
	middlePracticeDataList: {
		tableFormType: number;
		time: string;
		duration: number;
	}[];
}>();
const activeKey = ref(1);
const currentTableId = computed(() => {
	return data.value.tableFormData[activeKey.value - 1].tableId;
});

const isMiddlePractice = computed(() => {
	return props.middlePracticeDataList.map((item) => item.tableFormType);
});

const tabsConfig = [
	{ key: 1, tab: '资讯', component: InformationForm },
	{ key: 2, tab: '计划', component: PlanForm },
	{ key: 3, tab: '决策', component: DecisionForm },
	{ key: 4, tab: '实施', component: ImplementForm },
	{ key: 5, tab: '检查', component: CheckForm },
	{ key: 6, tab: '评价', component: EvaluationForm },
];
const preTabs = computed(() => {
	return tabsConfig.filter((item) => props.beforePreviewDataList.includes(item.key));
});

provide('tabsForm', data);
provide('activeKey', activeKey);
provide('currentTableId', currentTableId);
</script>

<template>
	<a-tabs v-model:activeKey="activeKey">
		<template v-if="courseType === 'preview'">
			<a-tab-pane v-for="{ key, tab, component } in preTabs" :key="key" :tab="tab">
				<component :is="component" :data="data" :key="key" :is-preview-flag="true" :question-flag="false" />
			</a-tab-pane>
		</template>
		<template v-else>
			<a-tab-pane v-for="{ key, tab, component } in tabsConfig" :key="key" :tab="tab">
				<component
					:is="component"
					:data="data"
					:key="key"
					:is-preview-flag="false"
					:question-flag="isMiddlePractice.includes(key)"
				/>
			</a-tab-pane>
		</template>
	</a-tabs>
</template>

<style scoped>
:deep(.ant-tabs-content) {
	height: calc(100vh - 380px);
	overflow-y: auto;
}
</style>
