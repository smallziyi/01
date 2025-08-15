<script setup lang="ts">
import * as echarts from 'echarts';
import { calculateArea } from '@/utils/analysis';
const props = withDefaults(
	defineProps<{
		// 标题
		dataLists: any;
		typid: number;
		title: number | string;
	}>(),
	{
		dataLists: null,
		typid: 0,
		title: '',
	},
);
watch(
	() => props.dataLists,
	(val) => {
		if (val) {
		}
	},
	{ immediate: true },
);

let echart: echarts.ECharts;
let resizeObserver: ResizeObserver | null = null;

if (
	props.dataLists.showType === 1 ||
	props.dataLists.showType === 2 ||
	props.dataLists.showType == 3 ||
	props.dataLists.showType === 4 ||
	props.dataLists.showType === 5 ||
	props.dataLists.showType === 6 ||
	props.dataLists.showType === 7 ||
	props.dataLists.showType === 8 ||
	props.dataLists.showType === 9
) {
	const yAxisData6 = ref();
	const man = ref()
	if (props.dataLists.data && typeof props.dataLists.data === 'object') {
		yAxisData6.value = Object.values(props.dataLists.data);
		var validNumbersArray = yAxisData6.value.map(function (number: string) {
			if (typeof number === 'string') {
				return parseFloat(number);
			}
			return number;
		});

		// 对每个数字进行保留两位小数的操作
		let roundedArray = validNumbersArray.map(function (number: number) {
			return Number((number as number).toFixed(2));
		});

		 man.value = roundedArray;
		const total: any[] = [];
		man.value.forEach((item: any, index: any) => {
			let max: any = item > (man.value[index] as number) ? index : man.value[index];
			max = max > 0 ? max * 5 : 10;
			total.push(max);
		});
	}

	const indicator = [
		{
			name: '资讯',
			max: 5,
		},
		{
			name: '计划',
			max: 5,
		},
		{
			name: '决策',
			max: 5,
		},
		{
			name: '实施',
			max: 5,
		},
		{
			name: '检查',
			max: 5,
		},
		{
			name: '评价',
			max: 5,
		},
	];

	var chartradar = {
		tooltip: {
			trigger: 'item',
		},
		color: ['#068AC3', '#B2782C'],

		legend: {
			icon: 'roundRect',
			// left: '47%',
			top: '90%',
			show: true,
			padding: [3, 5],
			// right: '50',
			y: '1',
			center: 0,
			itemWidth: 20,
			itemHeight: 10,
			itemGap: 26,
			z: 3,
			// orient: 'horizontal',
			data: indicator.forEach((item) => {
				return item.name;
			}),
			textStyle: {
				fontSize: 9,
				color: '#F1F7FF',
			},
		},
		radar: {
			center: ['50%', '50%'], // 外圆的位置
			radius: '55%',
			name: {
				textStyle: {
					color: '#fff',
					fontSize: 9,
					fontWeight: 400,
					fontFamily: 'PingFangSC-Regular,PingFang SC',
					fontStyle: 'italic',
				},
			},
			// TODO:
			indicator: indicator,
			splitArea: {
				// 坐标轴在 grid 区域中的分隔区域，默认不显示。
				show: true,
				areaStyle: {
					// 分隔区域的样式设置。
					color: ['#00224A', '#00224A', '#00224A', '#00224A', '#00224A'], // 画布颜色 // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
				},
			},
			axisLine: {
				// 指向外圈文本的分隔线样式
				lineStyle: {
					color: 'rgba(255,255,255,0.2)',
				},
			},
			splitLine: {
				lineStyle: {
					type: 'solid',
					color: ['#1781BA', '#1781BA'], // 分隔线颜色
					width: 1, // 分隔线线宽
				},
			},
		},
		series: [
			{
				name: '平均值',
				type: 'radar',
				symbolSize: 5,
				data: [
					{
						// TODO:
						value: man.value,
						name: '',
						areaStyle: {
							normal: {
								color: {
									type: 'radial',
									x: 0.5,
									y: 0.5,
									r: 0.5,
									colorStops: [
										{
											offset: 0,
											color: 'rgba(46,203,255, 0.14)', // 0% 处的颜色
										},
										{
											offset: 0.15,
											color: 'rgba(46,203,255, 0.14)', // 100% 处的颜色
										},
										{
											offset: 0.75,
											color: '#057FB3', // 100% 处的颜色
										},
										{
											offset: 1,
											color: '#078DC6', // 100% 处的颜色
										},
									],
									global: false, // 缺省为 false
								},
							},
						},
						itemStyle: {
							// 折线拐点标志的样式。
							normal: {
								// 普通状态时的样式
								lineStyle: {
									width: 1,
								},
								opacity: 0.3,
							},
							emphasis: {
								// 高亮时的样式
								lineStyle: {
									width: 5,
								},
								opacity: 0,
							},
						},
					},
				],
				tooltip: {
					trigger: 'item',
					formatter: function (params: any) {
						const score = +calculateArea(params.value).toFixed(2);
						return `${params.marker} ${params.name} 综合得分: ${score}`;
					},
				},
			},
		],
	};
}
function renderChart() {
	if (!echarts) return;
	echart.setOption(chartradar);
}

onMounted(() => {
	let dom = document.getElementById('rbooton')!;
	echart = echarts.init(dom);
	renderChart();
	if (resizeObserver) {
		resizeObserver.disconnect();
	}
	resizeObserver = new ResizeObserver(() => {
		if (echart) {
			echart.resize();
		}
	});
	resizeObserver.observe(dom);
});
</script>

<template>
	<div id="rbooton" class="rbootonClass"></div>
</template>

<style scoped>
.rbootonClass {
	width: 400px;
	height: 170px;
}
</style>
