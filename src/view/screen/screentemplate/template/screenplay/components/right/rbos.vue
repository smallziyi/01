<script setup lang="ts">
import * as echarts from 'echarts';
const props = withDefaults(
	defineProps<{
		// 标题
		dataLists: any;
		title: number | string;
	}>(),
	{
		dataLists: null,
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

const lablist = ['陈述性知识', '程序性知识', '策略性知识', '操作技能', '心智技能', '智慧型技能'];

let echart: echarts.ECharts;
let resizeObserver: ResizeObserver | null = null;

if (
	props.dataLists.showType === 1 ||
	props.dataLists.showType === 2 ||
	props.dataLists.showType === 3 ||
	props.dataLists.showType === 4 ||
	props.dataLists.showType === 5 ||
	props.dataLists.showType === 6 ||
	props.dataLists.showType === 7 ||
	props.dataLists.showType === 8 ||
	props.dataLists.showType === 9
) {
	const xAxisData2 = ref();
	const yAxisData2 = ref();
	if (props.dataLists.data && typeof props.dataLists.data === 'object') {
		xAxisData2.value = Object.keys(props.dataLists.data);
		yAxisData2.value = Object.values(props.dataLists.data);
		if ([8, 9, 10, 11, 12].includes(props.dataLists.screenSourceType)) {
			xAxisData2.value = lablist;
		}
		// 先确保数组元素都是数字类型
		let validNumbersArray = yAxisData2.value.map(function (number: string) {
			if (typeof number === 'string') {
				return parseFloat(number);
			}
			return number;
		});

		// 对每个数字进行保留两位小数的操作
		var roundedArray = validNumbersArray.map(function (number: number) {
			return Number((number as number).toFixed(2));
		});
	}else{
        yAxisData2.value = [{}];
		xAxisData2.value = lablist;
    }

    var salvProMax: never[] = []; //背景按最大值
		// for (let i = 0; i < yAxisData2.length; i++) {
		//     salvProMax.push(xAxisData2[0])
		// }

	var categoryDatas = {
		grid: {
			left: '7%',
			right: '7%',
			bottom: '2%',
			top: '2%',
			containLabel: true,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'none',
			},
			formatter: function (
				params: {
					[x: string]: string;
					value: string;
				}[],
			) {
				return params[0].name + ' : ' + params[0].value;
			},
		},
		xAxis: {
			show: false,
			type: 'value',
		},
		yAxis: [
			{
				type: 'category',
				inverse: true,
				axisLabel: {
					show: true,
					textStyle: {
						fontSize:11,
						color:''
					},
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				data: xAxisData2.value,
			},
			{
				type: 'category',
				inverse: true,
				axisTick: 'none',
				axisLine: 'none',
				show: true,
				axisLabel: {
					textStyle: {
						color: '#ffffff',
						fontSize: '9',
					},
				},
				data: roundedArray,
			},
		],
        // 壁纸图标（上）
		series: [
			{
				name: '值',
				type: 'bar',
				zlevel: 1,
				itemStyle: {
					normal: {
						barBorderRadius: 20,
						color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
							{
								offset: 0,
								color: 'rgb(57,89,255,1)',
							},
							{
								offset: 1,
								color: 'rgb(46,200,207,1)',
							},
						]),
					},
				},
				barWidth: 10,
				data: roundedArray,
			},
			{
				name: '背景',
				type: 'bar',
				barWidth: 10,
				barGap: '-100%',
				data: salvProMax,
				itemStyle: {
					normal: {
						color: 'rgba(24,31,68,1)',
						barBorderRadius: 20,
					},
				},
			},
		],
	};
}
function renderChart() {
	if (!echarts) return;
	echart.setOption(categoryDatas);
}

onMounted(() => {
	let dom = document.getElementById('rbootonb')!;
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
	<div id="rbootonb" class="rbootob"></div>
</template>

<style scoped>
.item_title {
	height: 38px;
	line-height: 38px;
	width: 100%;
	color: #31abe3;
	text-align: center;
	background: linear-gradient(to right, transparent, #0f0756, transparent);
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.item_title .zuo,
.item_title .you {
	width: 58px;
	height: 14px;
	margin-top: 20px;
}

.item_title .you {
	transform: rotate(180deg);
}

.item_title .title-inner {
	margin-top: 20px;
	font-weight: 900;
	letter-spacing: 2px;
	background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
	background-clip: text;
	-webkit-text-fill-color: transparent;
	position: absolute;
	top: -20px;
}

.rbootob {
	width: 400px;
	height: 170px;
	color: #31abe3;
}
</style>
