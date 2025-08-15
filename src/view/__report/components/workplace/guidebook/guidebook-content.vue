<script lang="tsx" setup>
import { getMenuCourseData } from '@/axios';
import tabsForm from './tabs-form2.vue';
import taskTabs from './task-tabs.vue';
import { ReportMenuCourse, ReportMenuLooseLeaf } from '@/view/__report';
import LearningTree from '@/view/__report/components/workplace/textbook/learning-tree.vue';
import useLearningTree from '@/view/__report/components/workplace/textbook/useLearningTree.ts';
import homework from './homework.vue';

import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();

const backgroundColor = computed(() => {
	return appTheme.value === 'white' ? 'white' : '#283560';
});

const props = defineProps<{
	textBookTrees: Array<Tree>;
	type: 'edit' | 'audit' | 'preview';
	reportStatus: number;
}>();

const emits = defineEmits(['update:task']);

const taskRecord = ref<ReportMenuCourse>();
const looseLeftRecord = ref<ReportMenuLooseLeaf>();

const fetchTaskData = () => {
	getMenuCourseData<ReportMenuCourse>(props.textBookTrees[1].id).then((res) => {
		taskRecord.value = res;
	});
};

const fetchTabsData = () => {
	getMenuCourseData<ReportMenuLooseLeaf>(props.textBookTrees[2].id).then((res) => {
		looseLeftRecord.value = res;
	});
};

const { data } = useLearningTree();

const activeKey = ref(1);
watch(
	() => props.textBookTrees,
	(newVal) => {
		activeKey.value = newVal.length;
		if (newVal.length === 2) {
			fetchTaskData();
		}
		if (newVal.length === 3) {
			taskRecord.value = undefined;
			looseLeftRecord.value = undefined;
			fetchTaskData();
			fetchTabsData();
		}
	},
	{ deep: true },
);

const dataLength = computed(() => {
	return props.textBookTrees.length;
});
</script>

<template>
	<a-tabs v-model:activeKey="activeKey" class="bg-color-padding" type="card">
		<a-tab-pane :key="1" tab="知识图谱">
			<learning-tree :id="data.id" :level="data.level" :parent-id="data.parentId" :tree="textBookTrees[0]" />
		</a-tab-pane>
		<a-tab-pane v-if="dataLength > 1" :key="2" tab="任务单">
			<template v-if="taskRecord">
				<task-tabs
					v-model:data="taskRecord"
					:key="textBookTrees[1].id"
					:key-id="textBookTrees[1].id"
					:data-length="dataLength"
					:type="type"
					:reportStatus="reportStatus"
				>
				</task-tabs>
			</template>
		</a-tab-pane>
		<a-tab-pane v-if="dataLength === 3" :key="3" tab="活页表单">
			<template v-if="looseLeftRecord && taskRecord">
				<tabs-form
					:data="looseLeftRecord"
					:key="textBookTrees[2].id"
					:report-status="reportStatus"
					:type="type"
				></tabs-form>
			</template>
		</a-tab-pane>
		<a-tab-pane v-if="dataLength === 3" :key="4" tab="课后练习" :force-render="true">
			<homework :key="textBookTrees[2].id" :menu-id="textBookTrees[2].id"></homework>
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
.bg-color-padding {
	background-color: v-bind(backgroundColor);
	padding: 8px;
}
:deep(.ant-tabs-nav) {
	margin-bottom: 8px !important;
}
:deep(.ant-tabs-tab) {
	padding: 8px !important;
}
:deep(.ant-tabs .ant-tabs-tab + .ant-tabs-tab) {
	margin-left: 8px !important;
}
</style>
