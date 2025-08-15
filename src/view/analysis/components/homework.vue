<script setup lang="ts">
import * as echarts from 'echarts';
import rankProcess from './rank-process.vue';
import stageEvaluation from './stage-evaluation.vue';
import { getAnalysePreviewOrHomework } from '@/axios';
import { calculateAverage } from '@/utils/analysis';

const props = defineProps<{
	teachPlanId: string;
}>();

let dom: HTMLElement | null;
let chart: echarts.ECharts | null;
let dom1: HTMLElement | null;
let chart1: echarts.ECharts | null;
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
	title: {
		text: '练习内容完成度占比分析',
		left: 'center',
	},
	tooltip: {
		trigger: 'item',
	},
	legend: {
		left: 'center',
		bottom: '5%',
	},
	series: [
		{
			type: 'pie',
			radius: ['40%', '70%'],
			avoidLabelOverlap: false,
			padAngle: 5,
			itemStyle: {
				borderRadius: 10,
			},
			label: {
				show: false,
				position: 'center',
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 40,
					fontWeight: 'bold',
				},
			},
			labelLine: {
				show: false,
			},
			data: [
				{ value: 0, name: '极差' },
				{ value: 0, name: '差' },
				{ value: 0, name: '一般' },
				{ value: 0, name: '好' },
				{ value: 0, name: '极好' },
			],
		},
	],
});

const option1 = ref({
	title: {
		text: '练习完成情况',
		left: 'center',
	},
	tooltip: {
		trigger: 'item',
	},
	legend: {
		bottom: '5%',
		left: 'center',
	},
	series: [
		{
			type: 'pie',
			radius: ['40%', '70%'],
			avoidLabelOverlap: false,
			label: {
				show: false,
				position: 'center',
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 40,
					fontWeight: 'bold',
				},
			},
			labelLine: {
				show: false,
			},
			data: [
				{ value: 100, name: '完成练习' },
				{ value: 100, name: '未完成练习' },
			],
		},
	],
});

function onResize() {
	chart?.resize();
}

function onResize1() {
	chart1?.resize();
}

watch(
	() => props.teachPlanId,
	(val) => {
		if (val) {
			getAnalysePreviewOrHomework({ type: 2, teachPlanId: props.teachPlanId }).then(async (res) => {
				const { failedCount, completedCount, studentScoreList, afterScoreList } = res;				
				option.value.series[0].data.forEach((item, index) => {
					item.value = afterScoreList[index];
				});
				option1.value.series[0].data[0].value = completedCount;
				option1.value.series[0].data[1].value = failedCount;
				state.topTen = studentScoreList
					.map((item) => ({
						name: item.name,
						score: item.score * 20,
					}))
					.slice(0, 10);
				state.average = calculateAverage(studentScoreList.map((item) => item.score * 20));
				await nextTick(() => {
					dom = document.getElementById('content');
					dom1 = document.getElementById('exercise');
					if (dom) {
						chart = echarts.init(dom);
						chart.setOption(option.value);
						window.addEventListener('resize', onResize);
					}
					if (dom1) {
						chart1 = echarts.init(dom1);
						chart1.setOption(option1.value);
						window.addEventListener('resize1', onResize1);
					}
				});
			});
		}
	},
	{ immediate: true, deep: true },
);
onBeforeUnmount(() => {
	window.removeEventListener('resize', onResize);
	window.removeEventListener('resize1', onResize1);
});
</script>

<template>
	<a-card size="small">
		<template #title>
			<div class="card-title">课后练习情况统计</div>
		</template>
		<div style="height: calc(100vh - 402px)" class="flex flex-col justify-around">
			<template class="grid grid-cols-3 gap-4" style="height: calc(100vh - 480px)">
				<!-- 预习内容情况 -->
				<div id="content" class="w-full h-full"></div>
				<!-- 完成情况 -->
				<div id="exercise" class="w-full h-full"></div>
				<rank-process title="课后练习情况" :top-ten="state.topTen" type="percent"></rank-process>
			</template>
			<stage-evaluation title="课后练习统计" :average="state.average" stage-type="percent"></stage-evaluation>
		</div>
	</a-card>
</template>
