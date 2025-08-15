<script lang="tsx" setup>
import { getMenuCourseData } from '@/axios';
import TaskForm from '@/view/__report/components/workplace/textbook/task-form.vue';
import tabsForm from './tabs-form.vue';
import { ReportMenuCourse, ReportMenuLooseLeaf } from '@/view/__report';
import LearningTree from '@/view/__report/components/workplace/textbook/learning-tree.vue';
import useLearningTree from '@/view/__report/components/workplace/textbook/useLearningTree.ts';
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

const taskRecord = ref<ReportMenuCourse>();
const looseLeftRecord = ref<ReportMenuLooseLeaf>();

const { data } = useLearningTree();
const taskFormRef = ref();
const tabsFormRef = ref();

const activeKey = ref(1);

const dataLength = computed(() => {
	return props.textBookTrees.length;
});

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
</script>

<template>
	<a-tabs v-model:activeKey="activeKey" class="bg-color-padding" type="card">
		<a-tab-pane :key="1" tab="知识图谱">
			<learning-tree :id="data.id" :level="data.level" :parent-id="data.parentId" :tree="textBookTrees[0]" />
		</a-tab-pane>
		<a-tab-pane v-if="dataLength > 1" :key="2" tab="学习性工作任务单">
			<template v-if="taskRecord">
				<task-form
					ref="taskFormRef"
					:data="taskRecord"
					:report-status="reportStatus"
					:type="type"
					:data-length="dataLength"
					@update="$emit('update:task')"
					@approved="fetchTaskData"
				/>
			</template>
		</a-tab-pane>
		<a-tab-pane v-if="dataLength === 3" :key="3" tab="活页表单">
			<template v-if="looseLeftRecord && taskRecord">
				<tabs-form
					ref="tabsFormRef"
					:key="textBookTrees[2].id"
					v-model:tabs-form="looseLeftRecord"
					:task-form-data="taskRecord"
					:report-status="reportStatus"
					:type="type"
				></tabs-form>
			</template>
		</a-tab-pane>
	</a-tabs>
</template>

<style scoped>
.bg-color-padding {
	background-color: v-bind(backgroundColor);
	padding: 12px;
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
