<script setup lang="ts">
import { ReportMenuCourse } from '@/view/__report';
import taskForm from './task-form4.vue';
import toolList from './tool-list4.vue';
import implementationPlan from './implementation-plan4.vue';

const data = defineModel<ReportMenuCourse>('data', { required: true });
const activeKey = ref(1);

const tabsConfig = [
	{ key: 1, tab: '学习性任务单', component: taskForm },
	{ key: 2, tab: '材料工具清单', component: toolList },
	{ key: 3, tab: '教学实施计划单', component: implementationPlan },
];
</script>

<template>
	<a-tabs v-model:activeKey="activeKey">
		<a-tab-pane v-for="{ key, tab, component } in tabsConfig" :key="key" :tab="tab">
			<component :is="component" :data="data" :key="key" />
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
:deep(.ant-tabs-content) {
	height: calc(100vh - 380px);
	overflow-y: auto;
}
</style>
