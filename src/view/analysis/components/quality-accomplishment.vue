<script setup lang="ts">
import * as echarts from 'echarts';
import { AnalysisInfo } from '@/view/analysis';
import { calculateXY } from '@/utils/analysis';
import rankProcess from './rank-process.vue';
import stageEvaluation from './stage-evaluation.vue';
import useUserStore from '@/store/modules/useUserStore.ts';
import { calculateAverage } from '@/utils/analysis';
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
		axisPointer: {
			type: 'shadow',
		},
	},
	legend: {
		data: ['陈述性知识', '程序性知识', '策略性知识', '操作技能', '心智技能', '智慧型技能', '平均值'],
		right: 'right',
		top: 'middle',
	},
	xAxis: {
		type: 'category',
		data: ['第一组', '第二组'],
	},
	yAxis: {
		type: 'value',
		max: 100,
	},
	grid: {
		left: '5%', // 调整左边距
		right: '18%',
		top: '5%',
	},
	dataZoom: [
		{
			type: 'slider',
			show: true,
			xAxisIndex: [0],
			start: 0,
			end: 25,
		},
	],
	series: [
		{
			name: '陈述性知识',
			data: [0],
			type: 'bar',
		},
		{
			name: '程序性知识',
			data: [0],
			type: 'bar',
		},
		{
			name: '策略性知识',
			data: [0],
			type: 'bar',
		},
		{
			name: '操作技能',
			data: [0],
			type: 'bar',
			itemStyle: {
				color: '#73C0DE',
			},
		},
		{
			name: '心智技能',
			data: [0],
			type: 'bar',
			itemStyle: {
				color: '#3BA272',
			},
		},
		{
			name: '智慧型技能',
			data: [0],
			type: 'bar',
			itemStyle: {
				color: '#FC8452',
			},
		},
		{
			name: '平均值',
			data: [0],
			type: 'bar',
			itemStyle: {
				color: '#EE6666',
			},
		},
	],
});

function onResize() {
	chart?.resize(); // 调整 ECharts 图表大小
}

watch(
	() => props.analysisInfoList,
	async (val) => {
		if (val.length > 0) {
			chart?.dispose();
			if (props.type === 'teacher') {
				if (val.length < 3) {
					option.value.dataZoom[0].show = false;
				}
			} else {
				option.value.dataZoom[0].show = false;
			}
			const { xData, yData } = calculateXY(props.analysisInfoList);
			if (props.type === 'teacher') {
				option.value.xAxis.data = xData;
				option.value.series.forEach((item, index) => {
					item.data = yData[index];
				});
				state.average = calculateAverage(yData[6]);
			} else {
				option.value.xAxis.data = [user.value?.name ?? ''];
				const indexIndex = xData.findIndex((item) => item === user.value?.name);
				option.value.series.forEach((item, index) => {
					item.data = [yData[index][indexIndex]];
				});
				state.average = yData[6][indexIndex];
			}
			state.topTen = yData[6]
				.map((item, index) => ({ name: xData[index], score: item }))
				.sort((a, b) => b.score - a.score)
				.slice(0, 10);
			await nextTick(() => {
				dom = document.getElementById('quality');
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
			<div class="card-title">素质与素养目标</div>
		</template>
		<div style="height: calc(100vh - 402px)" class="flex flex-col justify-between">
			<div class="grid grid-cols-2 gap-4" style="height: calc(100vh - 480px)">
				<div id="quality" class="w-full h-full"></div>
				<rank-process title="素质与素养目标" :top-ten="state.topTen" type="percent"></rank-process>
			</div>
			<stage-evaluation title="素质与素养目标" :average="state.average" stage-type="percent"></stage-evaluation>
		</div>
	</a-card>
</template>
