<script lang="tsx" setup>
import { getMenuCourseData } from '@/axios';
import { ReportMenuCourse, ReportMenuLooseLeaf } from '@/view/__report';
import LearningTree from '@/view/instruction/components/learning-tree.vue';
import useLearningTree from '@/view/__report/components/workplace/textbook/useLearningTree.ts';
import taskTabs from '@/view/instruction/plan/components/task-tabs4.vue';
import tabsForm from '@/view/instruction/plan/components/tabs-form4.vue';
import homework from '@/view/instruction/plan/components/homework.vue';

import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();

const backgroundColor = computed(() => {
	return appTheme.value === 'white' ? 'white' : '#283560';
});

const props = defineProps<{
	teachTrees: Array<Tree>;
}>();

const emits = defineEmits(['update:task']);

const taskRecord = ref<ReportMenuCourse>();
const looseLeftRecord = ref<ReportMenuLooseLeaf>();
const fetchTaskData = () => {
	getMenuCourseData<ReportMenuCourse>(props.teachTrees[1].id, 7).then((res) => {
		taskRecord.value = res;
	});
};

const fetchTabsData = () => {
	getMenuCourseData<ReportMenuLooseLeaf>(props.teachTrees[2].id, 7).then((res) => {
		looseLeftRecord.value = res;
	});
};

const { data } = useLearningTree();

const activeKey = ref(1);
watch(
	() => props.teachTrees,
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
	return props.teachTrees.length;
});

defineExpose({
	fetchTabsData,
});
</script>

<template>
	<a-tabs v-model:activeKey="activeKey" class="bg-color-padding" type="card">
		<a-tab-pane :key="1" tab="知识图谱">
			<learning-tree
				v-if="teachTrees[0] && data && activeKey === 1"
				:id="data.id"
				:level="data.level"
				:parent-id="data.parentId"
				:tree="teachTrees[0]"
			/>
		</a-tab-pane>
		<a-tab-pane v-if="dataLength > 1" :key="2" tab="任务单">
			<template v-if="taskRecord">
				<task-tabs v-model:data="taskRecord" :key="teachTrees[1].id"> </task-tabs>
			</template>
		</a-tab-pane>
		<a-tab-pane v-if="dataLength === 3" :key="3" tab="活页表单">
			<template v-if="looseLeftRecord && taskRecord">
				<tabs-form v-model:data="looseLeftRecord" :key="teachTrees[2].id"></tabs-form>
			</template>
		</a-tab-pane>
		<a-tab-pane v-if="dataLength === 3" :key="4" tab="课后练习">
			<homework :menu-id="teachTrees[2].id"></homework>
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
