<script setup lang="ts">
import { getAnalyseCourseTree, getAnalysisList } from '@/axios';
import { QueryAnalyseParams, AnalysisInfo } from '@/view/analysis';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import dayjs, { Dayjs } from 'dayjs';
import basicDimension from '../components/basic-dimension.vue';
import cognitionKnowledge from '../components/cognition-knowledge.vue';
import skillsAbilities from '../components/skills-abilities.vue';
import qualityAccomplishment from '../components/quality-accomplishment.vue';
import professionalBehavior from '../components/professional-behavior.vue';
import useUserStore from '@/store/modules/useUserStore.ts';
import MBreadcrumb from '@/components/m-breadcrumb.vue';

type RangeValue = [Dayjs, Dayjs] | [string, string] | undefined;
const { user } = useUserStore();
const formRef = ref();
const teachplanId = ref<string>('');
const dateTimeValue = ref<RangeValue>();
const analysisModel = ref({
	courseTree: [],
	dateTime: [] as string[],
});

const analysisQuery = ref<QueryAnalyseParams>({
	clientId: user.value!.clientId,
});

const activeKey = ref('1');

const options = ref<{
	courseTreeList: any;
}>({
	courseTreeList: [],
});

const rangePresets = ref([
	{ label: '昨日', value: [dayjs().add(-1, 'd'), dayjs()] },
	{ label: '上周', value: [dayjs().add(-7, 'd'), dayjs()] },
	{ label: '上旬', value: [dayjs().add(-10, 'd'), dayjs()] },
	{ label: '上月', value: [dayjs().add(-1, 'month'), dayjs()] },
	{ label: '上季度', value: [dayjs().add(-3, 'month'), dayjs()] },
	{ label: '上年', value: [dayjs().add(-1, 'year'), dayjs()] },
]);

const onRangeChange = (dates: RangeValue, dateStrings: string[]) => {
	if (dates) {
		analysisModel.value.dateTime[0] = dateStrings[0];
		analysisModel.value.dateTime[1] = dateStrings[1];
	}
};

// 支持搜索
const filter: ShowSearchType['filter'] = (inputValue, path) => {
	return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};

const tabs = [
	{ key: '3', label: '基础维度分析', component: basicDimension },
	{ key: '4', label: '认知与知识目标', component: cognitionKnowledge },
	{ key: '5', label: '技能与能力目标', component: skillsAbilities },
	{ key: '6', label: '素质与素养目标', component: qualityAccomplishment },
	{ key: '7', label: '职业行动能力', component: professionalBehavior },
];

const reset = () => {
	analysisModel.value = {
		courseTree: [],
		dateTime: [],
	};
	dateTimeValue.value = undefined;
	analysisQuery.value = {
		clientId: user.value!.clientId,
	};
};

const search = () => {
	const { courseTree, dateTime } = analysisModel.value;
	const [courseId, situationId, taskId, stepId, planId] = courseTree;
	const [startTime, endTime] = dateTime;
	teachplanId.value = planId;
	analysisQuery.value = {
		...analysisQuery.value,
		groupId: user.value!.groupId,
		clientId: user.value!.clientId,
		courseId,
		situationId,
		taskId,
		stepId,
		teachPlanId: planId || undefined,
		startTime: startTime ? `${startTime} 00:00:00` : undefined,
		endTime: endTime ? `${endTime} 23:59:59` : undefined,
	};
	getAnalysisList(analysisQuery.value, 8).then((res) => {
		analysisInfoList.value = res as AnalysisInfo[];
	});
};

const analysisInfoList = ref<AnalysisInfo[]>([]);

onMounted(() => {
	getAnalyseCourseTree().then((res) => {
		options.value.courseTreeList = res;
	});
  search()
});
</script>

<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb />
		</template>
		<a-form ref="formRef" :model="analysisModel">
			<template class="grid grid-cols-4 gap-4">
				<a-form-item label="时间">
					<a-range-picker
						v-model:value="dateTimeValue"
						class="w-full"
						:presets="rangePresets"
						@change="onRangeChange"
					/>
				</a-form-item>
				<a-form-item label="课程" class="col-span-2">
					<a-cascader
						v-model:value="analysisModel.courseTree"
						:options="options.courseTreeList"
						:show-search="{ filter }"
						change-on-select
						placeholder="请选择课程"
					/>
				</a-form-item>
				<a-form-item></a-form-item>
				<a-form-item></a-form-item>
				<a-form-item></a-form-item>
				<a-form-item></a-form-item>
				<a-form-item>
					<div class="float-right">
						<a-button class="mr-4" @click="reset">重置</a-button>
						<a-button type="primary" @click="search">查询</a-button>
					</div>
				</a-form-item>
			</template>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<div v-if="analysisInfoList.length > 0" style="height: calc(100vh - 285px)" class="overflow-y-auto">
			<a-tabs v-model:activeKey="activeKey" size="small" destroy-inactive-tab-pane>
				<a-tab-pane key="1" tab="全部">
					<template class="grid gap-4">
						<basic-dimension type="student" :analysis-info-list="analysisInfoList"></basic-dimension>
						<cognition-knowledge type="student" :analysis-info-list="analysisInfoList"></cognition-knowledge>
						<skills-abilities type="student" :analysis-info-list="analysisInfoList"></skills-abilities>
						<quality-accomplishment type="student" :analysis-info-list="analysisInfoList"></quality-accomplishment>
						<professional-behavior type="student" :analysis-info-list="analysisInfoList"></professional-behavior>
					</template>
				</a-tab-pane>
				<a-tab-pane v-for="{ key, component, label } in tabs" :key="key" :tab="label">
					<component type="student" :is="component" :key="key" :analysis-info-list="analysisInfoList"></component>
				</a-tab-pane>
			</a-tabs>
		</div>
	</a-card>
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
:deep(.ant-tabs-content) {
	height: calc(100vh - 339px);
	overflow-y: auto;
}
</style>
