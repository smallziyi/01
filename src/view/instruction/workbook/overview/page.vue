<script setup lang="ts">
import { ReportMenuCourse, ReportMenuLooseLeaf } from '@/view/__report';
import WorkbookMenu from './workbook-menu.tsx';
import LearningTree from '@/view/__report/components/workplace/textbook/learning-tree.vue';
import useLearningTree from '@/view/__report/components/workplace/textbook/useLearningTree.ts';
import TaskForm3 from '@/view/instruction/workbook/overview/components/task-form3.vue';
import { getMenuCourseData } from '@/axios';
import ToolList2 from '@/view/instruction/workbook/overview/components/tool-list2.vue';
import ImplementationPlan2 from '@/view/instruction/workbook/overview/components/implementation-plan2.vue';
import InformationForm3 from '@/view/instruction/workbook/overview/components/information-form3.vue';
import PlanForm3 from '@/view/instruction/workbook/overview/components/plan-form3.vue';
import DecisionForm3 from '@/view/instruction/workbook/overview/components/decision-form3.vue';
import CheckForm3 from '@/view/instruction/workbook/overview/components/check-form3.vue';
import EvaluationForm3 from '@/view/instruction/workbook/overview/components/evaluation-form3.vue';
import ImplementForm3 from '@/view/instruction/workbook/overview/components/implement-form3.vue';
import Homework from '@/view/instruction/workbook/overview/components/homework.vue';
import { getMenuCourseTree } from '@/axios';

const route = useRoute();

const loading = ref(true);
onMounted(() => {
	getMenuCourseTree(route.params.id as string, true).then((res) => {
		menuTree.value = res;
		selectTree.value = [res[0]];
		loading.value = false;
	});
});

const menuTree = ref<Array<Tree>>([]);
const selectTree = ref<Array<Tree>>([]);
const expand = ref(true);

const activeType = ref(1);

const { data, setData } = useLearningTree();
const handleSelect = (result: Array<Tree>) => {
	setData({ level: result.length, id: result.at(-1)?.id!, parentId: result.at(-1)?.id! });

	// 比较新旧选择，只在必要时发起请求
	if (result.length >= 2 && (selectTree.value.length < 2 || result[1].id !== selectTree.value[1].id)) {
		getMenuCourseData<ReportMenuCourse>(result[1].id, 7).then((res) => {
			data1.value = res;
		});
	}

	if (result.length === 3 && (selectTree.value.length < 3 || result[2].id !== selectTree.value[2].id)) {
		getMenuCourseData<ReportMenuLooseLeaf>(result[2].id, 7).then((res) => {
			data2.value = res;
		});
	}

	activeType.value = result.length;
	// 更新上一次选择的树节点
	selectTree.value = result;
};

const data1 = ref<ReportMenuCourse>();
const data2 = ref<ReportMenuLooseLeaf>();

const menuItems = [
	{ type: 1, label: '知识图谱' },
	{ type: 2, label: '任务单' },
	{ type: 3, label: '活页表单' },
	{ type: 4, label: '课后练习' },
];
</script>

<template>
	<div class="flex gap-4 h-full">
		<a-card size="small" class="w-80" v-show="expand">
			<template #title>
				目录
				<a-tooltip placement="right">
					<i class="bi bi-question-circle-fill"></i>
					<template #title>
						<div class="w-20">
							<a-badge status="success" />已完成<br />
							<a-badge status="processing" />进行中<br />
							<a-badge status="warning" />未开始<br />
						</div>
					</template>
				</a-tooltip>
			</template>
			<template #extra>
				<a-tooltip placement="right" v-if="expand">
					<a-button type="text" @click="expand = !expand">
						<template #icon>
							<i class="bi bi-arrows-collapse-vertical"></i>
						</template>
					</a-button>
					<template #title>收起目录</template>
				</a-tooltip>
			</template>
			<workbook-menu :menu-tree="menuTree" :selected="selectTree" @select="handleSelect" />
		</a-card>
		<a-card class="grow" size="small">
			<template #title>
				<a-space gap="16px">
					<a-tooltip placement="right" v-if="!expand">
						<a-button type="text" @click="expand = !expand">
							<template #icon>
								<i class="bi bi-arrows-expand-vertical"></i>
							</template>
						</a-button>
						<template #title>展开目录</template>
					</a-tooltip>
					<template v-for="(item, index) in menuItems" :key="index">
						<div
							v-if="selectTree.length > index || (selectTree.length === 3 && index === 3)"
							@click="activeType = item.type"
							class="cursor-pointer ml-3"
							:class="{ activeType: activeType === item.type }"
						>
							{{ item.label }}
						</div>
					</template>
				</a-space>
			</template>
			<template v-if="!loading">
				<div v-show="activeType === 1">
					<learning-tree :id="data.id" :tree="selectTree[0]" :level="data.level" :parent-id="data.parentId" />
				</div>
				<div v-show="activeType === 2">
					<a-tabs size="small" v-if="data1">
						<a-tab-pane :key="0">
							<template #tab>
								<a-badge :status="data1.tableFormData[0].showFlag ? 'success' : 'warning'" />学习性任务单
							</template>
							<task-form3 :data="data1" />
						</a-tab-pane>
						<a-tab-pane :key="1">
							<template #tab>
								<a-badge :status="data1.tableFormData[1].showFlag ? 'success' : 'warning'" />材料工具清单
							</template>
							<tool-list2 :data="data1" />
						</a-tab-pane>
						<a-tab-pane :key="2">
							<template #tab>
								<a-badge :status="data1.tableFormData[2].showFlag ? 'success' : 'warning'" />教学实施计划单
							</template>
							<implementation-plan2 :data="data1" />
						</a-tab-pane>
					</a-tabs>
				</div>
				<div v-show="activeType === 3">
					<a-tabs size="small" v-if="data2">
						<a-tab-pane :key="0">
							<template #tab>
								<a-badge :status="data2.tableFormData[0].showFlag ? 'success' : 'warning'" />资讯单
							</template>
							<information-form3 :data="data2" />
						</a-tab-pane>
						<a-tab-pane :key="1">
							<template #tab>
								<a-badge :status="data2.tableFormData[1].showFlag ? 'success' : 'warning'" />计划单
							</template>
							<plan-form3 :data="data2" />
						</a-tab-pane>
						<a-tab-pane :key="2">
							<template #tab>
								<a-badge :status="data2.tableFormData[2].showFlag ? 'success' : 'warning'" />决策单
							</template>
							<decision-form3 :data="data2" />
						</a-tab-pane>
						<a-tab-pane :key="3">
							<template #tab>
								<a-badge :status="data2.tableFormData[3].showFlag ? 'success' : 'warning'" />实施单
							</template>
							<implement-form3 :data="data2" />
						</a-tab-pane>
						<a-tab-pane :key="4">
							<template #tab>
								<a-badge :status="data2.tableFormData[4].showFlag ? 'success' : 'warning'" />检查单
							</template>
							<check-form3 :data="data2" />
						</a-tab-pane>
						<a-tab-pane :key="5">
							<template #tab>
								<a-badge :status="data2.tableFormData[5].showFlag ? 'success' : 'warning'" />评价单
							</template>
							<evaluation-form3 :data="data2" />
						</a-tab-pane>
					</a-tabs>
				</div>
				<div v-show="activeType === 4" v-if="selectTree.length === 3" class="c1">
					<homework :menu-id="selectTree[2].id" />
				</div>
			</template>
		</a-card>
	</div>
</template>

<style scoped>
.activeType {
	position: relative;
}
.activeType::before {
	content: '';
	position: absolute;
	bottom: 0;
	height: 4px;
	border-radius: 4px;
	width: 100%;
	background-color: black;
}
:deep(.ant-tabs-content) {
	max-height: calc(100vh - 48px - 32px - 38px - 38px - 32px - 16px);
	overflow-y: auto;
}
.c1 {
	max-height: calc(100vh - 48px - 48px - 48px - 16px);
	overflow-y: auto;
}
</style>
