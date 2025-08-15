<script setup lang="ts">
import * as echarts from 'echarts';
import { calculateArea, calculateBasic } from '@/utils/analysis';
import rankProcess from './rank-process.vue';
import stageEvaluation from './stage-evaluation.vue';
import { AnalysisInfo } from '@/view/analysis';
import useUserStore from '@/store/modules/useUserStore.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const { user } = useUserStore();
const bgColor = computed(() => (appTheme.value === 'white' ? 'bg-gray-50' : 'bg-[rgb(34,41,72)]'));
const props = defineProps<{
	analysisInfoList: AnalysisInfo[];
	type: 'student' | 'teacher';
}>();
let dom: HTMLElement | null;
let chart: echarts.ECharts | null;
const state = reactive<{
	average: number;
	topTen: {
		name: string;
		score: number;
	}[];
}>({
	average: 0,
	topTen: [],
});

const option = ref({
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		data: ['平均值'],
		selected: {
			平均值: true,
		} as Record<string, boolean>, // 添加类型声明
		bottom: 0,
		type: 'scroll',
	},
	radar: {
		indicator: [
			{ name: '评价', max: 5 },
			{ name: '检查', max: 5 },
			{ name: '实施', max: 5 },
			{ name: '决策', max: 5 },
			{ name: '计划', max: 5 },
			{ name: '资讯', max: 5 },
		],
		startAngle: 150,
		center: ['50%', '45%'],
	},
	series: [
		{
			type: 'radar',
			tooltip: {
				trigger: 'item',
				formatter: function (params: any) {
					const score = +calculateArea(params.value).toFixed(2);
					return `${params.marker} ${params.name} 综合得分: ${score}`;
				},
			},
			data: [
				{
					value: [0, 0, 0, 0, 0, 0],
					name: '平均值',
					areaStyle: {},
				},
			],
		},
	],
});
interface Skill {
	label: string;
	value: number;
}

const skills = ref<Skill[]>([
	{ label: '陈述性知识', value: 0 },
	{ label: '程序性知识', value: 0 },
	{ label: '策略性知识', value: 0 },
	{ label: '操作技能', value: 0 },
	{ label: '心智技能', value: 0 },
	{ label: '智慧型技能', value: 0 },
]);

function onResize() {
	chart?.resize(); // 调整 ECharts 图表大小
}

watch(
	() => props.analysisInfoList,
	async (val) => {
		if (val.length > 0) {
			chart?.dispose();
			const xDataList = props.analysisInfoList.map((item) => item.name);
			if (props.type === 'teacher') {
				option.value.legend.data = ['平均值', ...xDataList];
			} else {
				option.value.legend.data = ['平均值', user.value?.name ?? ''];
			}
			xDataList.forEach((key: string) => {
				option.value.legend.selected[key] = false;
			});
			const averageList = props.analysisInfoList.map((item) => calculateBasic(item.scores));
			const averages = averageList[0].map(
				(_, colIndex) => +(averageList.reduce((sum, row) => sum + row[colIndex], 0) / averageList.length).toFixed(2),
			);
			option.value.series[0].data[0].value = averages;
			const yDataList = averageList.map((item, index) => ({ name: xDataList[index], value: item, areaStyle: {} }));
			option.value.series[0].data.push(...yDataList);
			const reverseList = averages.slice().reverse();
			const averageAreaItem = props.analysisInfoList.map((item) => calculateArea(item.scores));
			state.topTen = averageAreaItem
				.map((item, index) => ({ name: xDataList[index], score: item }))
				.sort((a, b) => b.score - a.score)
				.slice(0, 10);
			if (props.type === 'teacher') {
				state.average = calculateArea(averages);
				skills.value = skills.value
					.map((item, index) => ({ ...item, value: reverseList[index] }))
					.sort((a, b) => b.value - a.value);
			} else {
				const find = props.analysisInfoList.find((item) => item.groupId === user.value?.id);
				const findIndex = props.analysisInfoList.findIndex((item) => item.groupId === user.value?.id);
				if (find) {
					state.average = calculateArea(find.scores);
					const temp = averageList[findIndex].slice().reverse();
					skills.value = skills.value
						.map((item, index) => ({ ...item, value: temp[index] }))
						.sort((a, b) => b.value - a.value);
				} else {
					state.average = 0;
				}
			}
			await nextTick(() => {
				dom = document.getElementById('professional');
				if (dom) {
					chart = echarts.init(dom);
					chart.setOption(option.value);
					window.addEventListener('resize', onResize);
				}
			});
		}
	},
	{ immediate: true, deep: true },
);

onBeforeUnmount(() => {
	window.removeEventListener('resize', onResize);
});
</script>

<template>
	<a-card size="small">
		<template #title>
			<div class="card-title">职业行动能力</div>
		</template>
		<div style="height: calc(100vh - 402px)" class="flex flex-col justify-between">
			<div class="grid grid-cols-3 gap-4" style="height: calc(100vh - 480px)">
				<div id="professional" class="w-full h-full"></div>
				<div class="p-6 rounded-lg" :class="bgColor">
					<div class="font-bold mb-8">优劣势职业能力倾向</div>
					<div v-for="(item, index) in skills" :key="item.label" class="flex items-center mb-4">
						<!-- 标签 -->
						<div class="w-24 text-right pr-4">
							{{ item.label }}
						</div>
						<!-- 进度条 -->
						<div class="flex-1 bg-gray-200 rounded-full relative">
							<div
								class="bg-blue-300 h-6 rounded-full flex items-center pr-2 text-white"
								:class="item.value < 1.5 ? 'justify-start' : 'justify-end'"
								:style="{ width: `${item.value * 20}%` }"
							>
								{{ item.value.toFixed(2) }}
							</div>
						</div>
						<!-- 趋势标签 -->
						<div
							v-if="index !== 6"
							class="w-20 pl-4 text-sm font-medium"
							:class="item.value >= 3.75 ? 'text-red-500' : 'text-gray-500'"
						>
							{{ item.value >= 3.75 ? '优势倾向' : item.value <= 2 ? '劣势倾向' : '' }}
						</div>
					</div>
				</div>
				<rank-process title="职业行动能力" type="percent" :top-ten="state.topTen"></rank-process>
			</div>
			<stage-evaluation title="职业行动能力" :average="state.average" stage-type="percent"></stage-evaluation>
		</div>
	</a-card>
</template>
