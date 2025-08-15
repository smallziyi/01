<script setup lang="ts">
import * as echarts from 'echarts';
import { calculateAverage, calculateBasic } from '@/utils/analysis';
import rankProcess from './rank-process.vue';
import stageEvaluation from './stage-evaluation.vue';
import { AnalysisInfo } from '@/view/analysis';
import useUserStore from '@/store/modules/useUserStore.ts';

const { user } = useUserStore();
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
		type: 'scroll',
		bottom: 0,
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
			},
			data: [
				{
					value: [0, 0, 0, 0, 0, 0],
					name: '平均值',
				},
			],
		},
	],
});

function onResize() {
	chart?.resize();
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
			const yDataList = averageList.map((item, index) => ({ name: xDataList[index], value: item }));
			state.topTen = averageList
				.map((item, index) => ({ name: xDataList[index], score: calculateAverage(item) }))
				.sort((a, b) => b.score - a.score)
				.slice(0, 10);
			if (props.type === 'teacher') {
				state.average = calculateAverage(averageList.map((item) => calculateAverage(item)));
			} else {
				const find = props.analysisInfoList.find((item) => item.groupId === user.value?.id);
				if (find) {
					state.average = calculateAverage(calculateBasic(find.scores));
				} else {
					state.average = 0;
				}
			}
			const tempY = [{ name: '平均值', value: averages }, ...yDataList];
			option.value.series[0].data = tempY;
			await nextTick(() => {
				dom = document.getElementById('basic-dimension');
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
	chart?.dispose();
	dom = null;
	window.removeEventListener('resize', onResize);
});
</script>

<template>
	<a-card size="small">
		<template #title>
			<div class="card-title">基础维度分析</div>
		</template>
		<div style="height: calc(100vh - 402px)" class="flex flex-col justify-between">
			<div class="grid grid-cols-2 gap-4" style="height: calc(100vh - 480px)">
				<div id="basic-dimension" class="w-full h-full"></div>
				<rank-process v-if="state.topTen" title="基础维度分析" :top-ten="state.topTen" type="score"></rank-process>
			</div>
			<stage-evaluation title="基础维度分析" :average="state.average" stage-type="score"></stage-evaluation>
		</div>
	</a-card>
</template>
