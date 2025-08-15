<script setup lang="ts">
import { ReportMenuCourse } from '@/view/__report';
import taskForm from './task-form2.vue';
import toolList from './tool-list.vue';
import implementationPlan from './implementation-plan.vue';
import useErrorTable from '@/view/__report/components/workplace/useErrorTable.ts';
import guidebookComment from '../components/guidebook-comment.vue';
const { errorTables } = useErrorTable();

const data = defineModel<ReportMenuCourse>('data', { required: true });
defineProps<{
	type: 'edit' | 'audit' | 'preview';
	reportStatus: number;
	dataLength: number;
}>();
const activeKey = ref(1);

const tabsConfig = [
	{ key: 1, tab: '学习性任务单', component: taskForm },
	{ key: 2, tab: '材料工具清单', component: toolList },
	{ key: 3, tab: '教学实施计划单', component: implementationPlan },
];

const saveStatus = ref([false, false, false]);
const handleSave = () => {
	saveStatus.value[activeKey.value] = true;
};

defineExpose({ handleSave });
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
			<guidebook-comment
				v-model:save="saveStatus[key - 1]"
				:type="type"
				:report-status="reportStatus"
				:task-form="data"
				:current-key="key"
				:data-length="dataLength"
			>
				<component :is="component" v-model:data="data" :key="key" v-model:save="saveStatus[key - 1]" />
			</guidebook-comment>
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
:deep(.ant-tabs-content) {
	height: calc(100vh - 332px);
	overflow-y: auto;
}
</style>
