<script setup lang="ts">
import { getAddressTree, getAnalysisList, getGroupStudentInfo, getAnalyseCourseTree, getAnalyseAllTree } from '@/axios';

import { QueryAnalyseParams } from '@/view/analysis';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import type { CascaderProps } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import previewClass from '../components/preview-class.vue';
import basicDimension from '../components/basic-dimension.vue';
import cognitionKnowledge from '../components/cognition-knowledge.vue';
import skillsAbilities from '../components/skills-abilities.vue';
import qualityAccomplishment from '../components/quality-accomplishment.vue';
import professionalBehavior from '../components/professional-behavior.vue';
import homework from '../components/homework.vue';
import { AnalysisInfo } from '@/view/analysis';
import transformData from '@/utils/processData';
import recursionData from '@/utils/recursionData';
import useUserStore from '@/store/modules/useUserStore.ts';
import teacherEvaluation from '../components/teacher-evaluation.vue';

type RangeValue = [Dayjs, Dayjs] | [string, string] | undefined;
const { user } = useUserStore();
const route = useRoute();
const formRef = ref();
const dateTimeValue = ref<RangeValue>();
const analysisModel = ref({
	addressTree: [],
	schoolTree: [],
	majorTree: [],
	classTree: [],
	courseTree: [],
	dateTime: [] as string[],
});

const analysisQuery = ref<QueryAnalyseParams>({
	clientId: user.value!.clientId,
});
const studentList = ref<{ name: string; id: string }[]>([]);
const activeKey = ref('1');
const teachPlanId = ref<string>('');
const address = ref();
const options = ref<{
	addressTreeList: any;
	schoolTreeList: any;
	majorTreeList: any;
	classTreeList: any;
	courseTreeList: any;
}>({
	addressTreeList: [
		{
			label: '中国',
			value: '1',
			children: address.value,
		},
	],
	schoolTreeList: [],
	majorTreeList: [],
	classTreeList: [],
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
const loadData: CascaderProps['loadData'] = (selectedOptions) => {
	const targetOption = selectedOptions[selectedOptions.length - 1];
	targetOption.loading = true;
	setTimeout(() => {
		targetOption.loading = false;
		getGroupStudentInfo(targetOption.value as string).then((res) => {
			studentList.value = res.map((item) => ({ name: item.name, id: item.userId }));
			targetOption.children = res.map((item) => ({
				label: `${item.name}(${item.number})`,
				value: item.userId,
			}));
		});
	}, 300);
};

const reset = () => {
	analysisModel.value = {
		addressTree: [],
		schoolTree: [],
		majorTree: [],
		classTree: [],
		courseTree: [],
		dateTime: [],
	};
	dateTimeValue.value = undefined;
	analysisQuery.value = {
		clientId: user.value!.clientId,
	};
	activeKey.value = '1';
	search();
};

const typeMapping = {
	studentId: 1,
	planId: 14,
	stepId: 14,
	taskId: 12,
	situationId: 11,
	courseId: 10,
	groupId: 8,
	year: 7,
	majorCode: 6,
	domainId: 5,
	collegeId: 4,
	clientId: 3,
};

const search = () => {
	const { schoolTree, majorTree, classTree, courseTree, dateTime } = analysisModel.value;
	const [clientId, collegeId] = schoolTree || [];
	const [domainId, majorCode, year] = majorTree || [];
	const [groupId, studentId] = classTree || [];
	const [courseId, situationId, taskId, stepId, planId] = courseTree || [];
	const [startTime, endTime] = dateTime || [];
	teachPlanId.value = planId;
	analysisQuery.value = {
		...analysisQuery.value,
		clientId: clientId || user.value!.clientId,
		collegeId,
		domainId,
		majorCode,
		year,
		groupId,
		studentId,
		courseId,
		situationId,
		taskId,
		stepId,
		teachPlanId: planId || undefined,
		startTime: startTime ? `${startTime} 00:00:00` : undefined,
		endTime: endTime ? `${endTime} 23:59:59` : undefined,
	};

	let type = 9; // 默认值
	// 遍历 mapping，查找第一个存在的属性
	for (const [key, value] of Object.entries(typeMapping)) {
		if (eval(key)) {
			// 使用 eval 来动态获取变量值
			type = value;
			break; // 找到第一个满足条件后跳出循环
		}
	}
	getAnalysisList(analysisQuery.value, type).then(() => {
		analysisInfoList.value = [
    {
        "groupId": "197107032312492032",
        "name": "计算机网络技术",
        "scores": [
            3.2,
            4.2,
            5,
            3.5,
            4.6,
            3.8
        ]
    },
    {
        "groupId": "208803107486941184",
        "name": "物联网应用技术",
        "scores": [
            4.8,
            3.2,
            3.0,
            4.1,
            4.7,
            3.9
        ]
    },
    {
        "groupId": "218855462920093696",
        "name": "汽车检测与维修技术",
        "scores": [
            4.9,
            3.7,
            4.5,
            4.6,
            3.2,
						4.3
        ]
    },
    {
        "groupId": "218686185499828224",
        "name": "机电一体化技术",
        "scores": [
            3.2,
            3.6,
            3.8,
            4.7,
            4.5,
            3.9
        ]
    },
    {
        "groupId": "213399761966391296",
        "name": "煤炭清洁利用技术",
        "scores": [
            3.7,
            4.6,
            3.2,
            3.5,
            4.2,
            4.3
        ]
    }
]
		
		// if (type === 1) {
		// 	analysisInfoList.value = [
		// 		{
		// 			groupId: studentId,
		// 			name: studentList.value.find((item) => item.id === studentId)?.name || '',
		// 			scores: res as number[],
		// 		},
		// 	];
		// } else {
		// 	analysisInfoList.value = res as Array<AnalysisInfo>;
		// }
	});
};

interface caseTree {
	label: string;
	value: string;
	parentId: string;
	children?: caseTree[];
}
function updateDeepestValues(nodes: caseTree[]): void {
	nodes.forEach((node) => {
		if (node.children && node.children.length > 0) {
			// 递归调用，处理子节点
			updateDeepestValues(node.children);
		} else {
			// 如果没有子节点，更新 value 为 label
			node.value = node.label;
		}
	});
}
const analysisInfoList = ref<AnalysisInfo[]>([]);

onMounted(() => {
	getAddressTree().then((res) => {
		address.value = recursionData(res);
	});
	getAnalyseAllTree().then((res) => {
		const { schoolDepartmentGroup, classGroup, majorGroup } = transformData(res);
		options.value.schoolTreeList = schoolDepartmentGroup;
		updateDeepestValues(majorGroup);
		options.value.majorTreeList = majorGroup;
		options.value.classTreeList = classGroup.map((item) => ({ ...item, isLeaf: false }));
	});
	getAnalyseCourseTree().then((res) => {
		options.value.courseTreeList = res;
	});
	if (route.query.type === 'look') {
		teachPlanId.value = route.query.teachPlanId as string;
		analysisQuery.value.teachPlanId = route.query.teachPlanId as string;;
		getAnalysisList(analysisQuery.value, 14).then((res) => {
			analysisInfoList.value = res as Array<AnalysisInfo>;
		});
	} else {
		search();
	}
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
				<a-form-item label="地区">
					<a-cascader
						v-model:value="analysisModel.addressTree"
						:options="options.addressTreeList"
						:show-search="{ filter }"
						change-on-select
						placeholder="请选择国家/省/市/区"
					/>
				</a-form-item>
				<a-form-item label="院校">
					<a-cascader
						v-model:value="analysisModel.schoolTree"
						:options="options.schoolTreeList"
						:show-search="{ filter }"
						change-on-select
						placeholder="请选择学校/院系"
					/>
				</a-form-item>
				<a-form-item label="专业（群）">
					<a-cascader
						v-model:value="analysisModel.majorTree"
						:options="options.majorTreeList"
						:show-search="{ filter }"
						change-on-select
						placeholder="请选择专业群/专业/年级"
					/>
				</a-form-item>
				<a-form-item label="班级">
					<a-cascader
						v-model:value="analysisModel.classTree"
						:options="options.classTreeList"
						:load-data="loadData"
						change-on-select
						placeholder="请选择班/学生"
					/>
				</a-form-item>
				<a-form-item label="课程（学习场）" class="col-span-2">
					<a-cascader
						v-model:value="analysisModel.courseTree"
						:options="options.courseTreeList"
						:show-search="{ filter }"
						change-on-select
						placeholder="请选择课程/情境/任务/环节/教学计划"
					/>
				</a-form-item>
				<a-form-item>
					<div class="float-right">
						<a-button class="mr-4" @click="reset" :disabled="route.query.type === 'look'">重置</a-button>
						<a-button type="primary" @click="search" :disabled="route.query.type === 'look'">查询</a-button>
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
						<preview-class v-if="teachPlanId" :teach-plan-id="teachPlanId"></preview-class>
						<basic-dimension type="teacher" :analysis-info-list="analysisInfoList"></basic-dimension>
						<cognition-knowledge type="teacher" :analysis-info-list="analysisInfoList"></cognition-knowledge>
						<skills-abilities type="teacher" :analysis-info-list="analysisInfoList"></skills-abilities>
						<quality-accomplishment type="teacher" :analysis-info-list="analysisInfoList"></quality-accomplishment>
						<professional-behavior type="teacher" :analysis-info-list="analysisInfoList"></professional-behavior>
						<homework v-if="teachPlanId" :teach-plan-id="teachPlanId"></homework>
						<teacher-evaluation v-if="teachPlanId" :teach-plan-id="teachPlanId" :key="teachPlanId"></teacher-evaluation>
					</template>
				</a-tab-pane>
				<a-tab-pane v-if="teachPlanId" key="2" tab="课前预习情况统计">
					<preview-class :teach-plan-id="teachPlanId"></preview-class>
				</a-tab-pane>
				<a-tab-pane v-for="{ key, component, label } in tabs" :key="key" :tab="label">
					<component type="teacher" :is="component" :key="key" :analysis-info-list="analysisInfoList"></component>
				</a-tab-pane>
				<a-tab-pane v-if="teachPlanId" key="8" tab="课后练习情况统计">
					<homework :teach-plan-id="teachPlanId"></homework>
				</a-tab-pane>
				<a-tab-pane v-if="teachPlanId" key="9" tab="教师综合评语">
					<teacher-evaluation :teach-plan-id="teachPlanId" :key="teachPlanId"></teacher-evaluation>
				</a-tab-pane>
			</a-tabs>
		</div>
		<div v-else style="height: calc(100vh - 285px)">
			<m-empty></m-empty>
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
