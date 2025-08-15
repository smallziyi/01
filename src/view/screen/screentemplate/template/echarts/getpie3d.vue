<script lang="ts" setup>
import { onMounted } from 'vue';
import { SCREEN_SWIPER_ENUM } from '@/view/__report/config';
import * as echarts from 'echarts';
const props = withDefaults(
	defineProps<{
		dataList: any;
		typid: number | string;
		listid: string;
	}>(),
	{
		dataList: null,
		typid: 0,
		listid: '',
	},
);
watch(
	() => props.dataList,
	(val) => {
		if (val) {
		}
	},
	{ immediate: true },
);

let echart: echarts.ECharts;
let resizeObserver: ResizeObserver | null = null;

const newDataArray = ref();
// 非空判断
if (props.dataList.data && typeof props.dataList.data === 'object') {
	newDataArray.value = Object.entries(props.dataList.data).map(([key, value]) => ({
		name: key,
		value: value,
	}));
} else {
	newDataArray.value = [{}];
}

const lablist = ['资讯', '计划', '决策', '实施', '检查', '评价'];
const ceList = ['资讯', '计划', '决策'];
const listcel = ['实施', '检查', '评价'];
// const labellist = [{ label: '陈述性知识', value: 0 },
// 	{ label: '程序性知识', value: 0 },
// 	{ label: '策略性知识', value: 0 },
// 	{ label: '操作技能', value: 0 },
// 	{ label: '心智技能', value: 0 },
// 	{ label: '智慧型技能', value: 0 }]
if ([SCREEN_SWIPER_ENUM.INDICATOR].includes(props.dataList.showType)) {
	let pieData = newDataArray.value;
	var titleArr: {
		text: string;
		left: string;
		top: string;
		textAlign: string;
		textStyle: { fontWeight: string; fontSize: string; color: string; textAlign: string };
	}[] = [];
	var seriesArr: any = [];
	pieData.forEach(function (item: { name: any; value: number }, index: number) {
		titleArr.push({
			text: item.name,
			left: index * 34 + 33 + '%',
			top: '1%',
			textAlign: 'center',
			textStyle: {
				fontWeight: 'normal',
				fontSize: '12',
				color: 'white',
				textAlign: 'center',
			},
		});
		seriesArr.push({
			type: 'pie',
			clockWise: false,
			radius: ['50%', '55%'],
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: '#0ff',
						},
						{
							offset: 1,
							color: '#5467df',
						},
					]),
					label: {
						show: false,
					},
					labelLine: {
						show: false,
					},
				},
			},
			hoverAnimation: false,
			center: [index * 34 + 34 + '%', '45%'],
			data: [
				{
					value: 90 - (item.value as number),
					name: 'invisible',
					itemStyle: {
						normal: {
							color: '#ffffff',
						},
						emphasis: {
							color: '#ffffff',
						},
					},
				},
				{
					value: item.value,
					label: {
						normal: {
							formatter: function (params: { value: string }) {
								return params.value + '个';
							},
							position: 'center',
							show: true,
							textStyle: {
								fontSize: '9',
								fontWeight: 'bold',
								color: '#1cc7ff',
							},
						},
					},
				},
			],
		});
	});

	var showSlie = {
		grid: {
			left: '10%',
			right: '2%',
			top: '5%',
			containLabel: true,
		},
		title: titleArr,
		series: seriesArr,
	};
} else if ([SCREEN_SWIPER_ENUM.BAR_CHART].includes(props.dataList.showType)) {
	const xAxisData1 = ref();
	const yAxisData1 = ref();

	if (props.dataList.data && typeof props.dataList.data === 'object') {
		xAxisData1.value = Object.keys(props.dataList.data);
		yAxisData1.value = Object.values(props.dataList.data);
		if ([8, 9, 10, 11, 12].includes(props.dataList.screenSourceType)) {
			if ([9].includes(props.dataList.screenSourceType)) {
				
				xAxisData1.value = ceList
			} else if ([10].includes(props.dataList.screenSourceType)) {
				xAxisData1.value = ceList
			}
			yAxisData1.value = props.dataList.data.map((number: number) => {
				return Number(number.toFixed(2));
			});
		}
	} else {
		yAxisData1.value = [{}];
		xAxisData1.value = ceList;
	}

	var categoryDatas = xAxisData1.value;
	var chartdata = yAxisData1.value;

	var histogram = {
		textStyle: {
			color: '#c0c3cd',
			fontSize: 9,
		},
		toolbox: {
			show: false,
			feature: {
				saveAsImage: {
					backgroundColor: '#031245',
				},
				restore: {},
			},
			iconStyle: {
				borderColor: '#c0c3cd',
			},
		},
		legend: {
			top: 10,
			itemWidth: 8,
			itemHeight: 8,
			icon: 'circle',
			left: 'center',
			padding: 0,
			textStyle: {
				color: '#c0c3cd',
				fontSize: 9,
				padding: [2, 0, 0, 0],
			},
		},
		color: ['#00D7E9', 'rgba(0, 215, 233, 0.9)'],
		grid: {
			containLabel: true,
			left: 20,
			right: 20,
			bottom: 20,
			top: 28,
		},
		xAxis: {
			nameTextStyle: {
				color: '#c0c3cd',
				padding: [0, 0, -10, 0],
				fontSize: 9,
			},
			axisLabel: {
				color: '#c0c3cd',
				fontSize: 7,
				interval: 0,
			},
			axisTick: {
				show: false,
				lineStyle: {
					color: '#384267',
					width: 1,
				},
			},
			splitLine: {
				show: false,
			},
			axisLine: {
				lineStyle: {
					color: '#335971',
				},
				show: true,
			},
			data: categoryDatas,
			type: 'category',
		},
		yAxis: {
			nameTextStyle: {
				color: '#c0c3cd',
				padding: [0, 0, -5, 0],
				fontSize: 7,
			},
			axisLabel: {
				color: '#c0c3cd',
				fontSize: 8,
			},
			axisTick: {
				lineStyle: {
					color: '#668092',
					width: 1,
				},
				show: true,
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#335971',
					// "type": "dashed"
				},
			},
			axisLine: {
				lineStyle: {
					color: '#668092',
					width: 1,
					// "type": "dashed"
				},
				show: true,
			},
			name: '',
		},
		series: [
			{
				data: chartdata,
				type: 'bar',
				barMaxWidth: 'auto',
				barWidth: 20,
				itemStyle: {
					color: {
						x: 0,
						y: 1,
						x2: 0,
						y2: 0,
						type: 'linear',
						colorStops: [
							{
								offset: 0,
								color: '#00D7E9',
							},
							{
								offset: 1,
								color: 'rgba(0, 167, 233,0.3)',
							},
						],
					},
				},
				label: {
					show: true,
					position: 'top',
					distance: 10,
					color: '#fff',
				},
			},
			{
				data: [1, 1, 1, 1, 1, 1],
				type: 'pictorialBar',
				barMaxWidth: '20',
				symbol: 'diamond',
				symbolOffset: [0, '50%'],
				symbolSize: [20, 10],
			},
			{
				data: chartdata,
				type: 'pictorialBar',
				barMaxWidth: '20',

				symbolPosition: 'end',
				symbol: 'diamond',
				symbolOffset: [0, '-50%'],
				symbolSize: [20, 12],
				zlevel: 2,
			},
		],
		tooltip: {
			show: true,
			formatter: '{b}:{c0}',
		},
	};
	// 柱状图
} else if ([3].includes(props.dataList.showType)) {
	const xAxisData2 = ref();
	const yAxisData2 = ref();
	const numXa = ref();
	if (props.dataList.data && typeof props.dataList.data === 'object') {
		// 先确保数组元素都是数字类型
		xAxisData2.value = Object.keys(props.dataList.data);
		yAxisData2.value = Object.values(props.dataList.data);
		let validNumbersArray = yAxisData2.value.map(function (number: string) {
			if (typeof number === 'string') {
				return parseFloat(number);
			}
			return number;
		});
		// 对每个数字进行保留两位小数的操作
		let roundedArray = validNumbersArray.map(function (number: number) {
			return Number((number as number).toFixed(2));
		});
		numXa.value = roundedArray;
		if ([8, 9, 10, 11, 12].includes(props.dataList.screenSourceType)) {
			xAxisData2.value = lablist;
			if ([9].includes(props.dataList.screenSourceType)) {
				xAxisData2.value = ceList;
				numXa.value = roundedArray.slice(0, 3);
			} else if ([10].includes(props.dataList.screenSourceType)) {
				xAxisData2.value = listcel;
				numXa.value = roundedArray.slice(3, 6);
			}
		}
	} else {
		yAxisData2.value = [{}];
		xAxisData2.value =listcel;
	}

	var salvProMax: never[] = []; //背景按最大值
	var categoryData = {
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
						color: '#cccc',
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
				data: numXa.value,
			},
		],
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
				barWidth: 7,
				data: numXa.value,
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
	// 横向柱状图
} else if ([4].includes(props.dataList.showType)) {
	const xAxisData3 = ref();
	const yAxisData3 = ref();
	if (props.dataList.data && typeof props.dataList.data === 'object') {
		xAxisData3.value = Object.keys(props.dataList.data);
		yAxisData3.value = Object.values(props.dataList.data);
		// 先确保数组元素都是数字类型
		let validNumbersArray = yAxisData3.value.map(function (number: string) {
			if (typeof number === 'string') {
				return parseFloat(number);
			}
			return number;
		});

		// 对每个数字进行保留两位小数的操作
		var roundedArray = validNumbersArray.map(function (number: number) {
			return Number((number as number).toFixed(2));
		});

		if ([8, 9, 10, 11, 12].includes(props.dataList.screenSourceType)) {
			if ([9].includes(props.dataList.screenSourceType)) {
				xAxisData3.value = ceList;
				roundedArray.slice(0, 3);
			} else if ([10].includes(props.dataList.screenSourceType)) {
				xAxisData3.value = listcel;
				roundedArray.slice(3, 6);
			} else if ([11].includes(props.dataList.screenSourceType)) {
				xAxisData3.value = lablist;
			}
		}
	}else{
		yAxisData3.value = [{}];
		xAxisData3.value =lablist;
	}

	var barChart = {
		grid: {
			left: '12%',
			top: '15%',
			bottom: '20%',
			right: '8%',
		},
		xAxis: {
			data: xAxisData3.value,
			axisTick: {
				show: false,
			},
			axisLine: {
				lineStyle: {
					color: 'rgba(255, 129, 109,.1)',
					width: 1, //这里是为了突出显示加上的
				},
			},
			axisLabel: {
				textStyle: {
					color: '#999',
					fontSize: 8,
				},
			},
		},
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				axisLine: {
					lineStyle: {
						color: 'rgba(255, 129, 109, 0.1)',
						width: 1, //这里是为了突出显示加上的
					},
				},
				axisLabel: {
					textStyle: {
						color: '#999',
						fontSize: 8,
					},
				},
				splitArea: {
					areaStyle: {
						color: 'rgba(255,255,255,.5)',
					},
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: 'rgba(255, 129, 109, 0.1)',
						width: 0.2,
						type: 'dashed',
					},
				},
			},
		],
		series: [
			{
				type: 'pictorialBar',
				barCategoryGap: '0%',
				symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
				label: {
					show: true,
					position: 'top',
					distance: 7,
					color: '#08DFFE',
					fontWeight: 'bolder',
					fontSize: 8,
				},
				itemStyle: {
					normal: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: '#9A11FF',
								},
								{
									offset: 1,
									color: '#08DFFE',
								},
							],
							global: false, //  缺省为  false
						},
					},
					emphasis: {
						opacity: 0.7,
					},
				},
				data: roundedArray,
			},
		],
	};
	// 追星图
} else if ([5].includes(props.dataList.showType)) {
	var data: {
			value: number;
			name: string;
			itemStyle:
				| {
						normal: {
							borderWidth: number;
							shadowBlur: number;
							borderRadius: number;
							borderColor: string;
							shadowColor: string;
						};
				  }
				| {
						normal: {
							borderWidth: number;
							shadowBlur: number;
							borderRadius: number;
							borderColor: string;
							shadowColor: string;
						};
				  };
		}[] = [],
		data2 = [];
	const trafficWay = newDataArray.value;
	var color = [
		'#2A8BFD',
		'#BAFF7F',
		'#00FAC1',
		'#00CAFF',
		'#FDE056',
		'#4ED33C',
		'#FF8A26',
		'#FF5252',
		'#9689FF',
		'#CB00FF',
	];
	for (var i = 0; i < trafficWay.length; i++) {
		data.push({
			value: trafficWay[i].value as number,
			name: trafficWay[i].name,
			itemStyle: {
				normal: {
					borderWidth: 4,
					shadowBlur: 10,
					borderRadius: 10,
					borderColor: color[i],
					shadowColor: color[i],
				},
			},
		});
		data2.push(
			{
				value: trafficWay[i].value,
				name: trafficWay[i].name,
			},
			{
				value: 5,
				name: '',
				itemStyle: {
					normal: {
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						color: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
						borderWidth: 0,
						opacity: 0.2,
					},
				},
			},
		);
	}
	let angle = 0; //角度，用来做简单的动画效果的
	//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
	function getCirlPoint(x0: number, y0: number, r: number, angle: number) {
		let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
		let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
		return {
			x: x1,
			y: y1,
		};
	}
	function draw() {
		angle = angle + 3;
		echart.setOption(pieCharts, true);
		//window.requestAnimationFrame(draw);
	}
	setInterval(function () {
		//用setInterval做动画感觉有问题
		draw();
	}, 100);
	var pieCharts = {
		color: color,
		legend: {
			right: '1',
			top: '10%',
			icon: 'rect',
			itemWidth: 10,
			itemHeight: 10,
			textStyle: {
				color: '#ffffff',
				fontSize: 9,
			},
		},
		series: [
			{
				//外线1
				name: '',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 3,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
							startAngle: ((0 + angle) * Math.PI) / 180,
							endAngle: ((90 + angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#4EE9E6',
							fill: 'transparent',
							lineWidth: 1.5,
							fontSize: 9,
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				//内线1
				name: '',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 3,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
							startAngle: ((180 + angle) * Math.PI) / 180,
							endAngle: ((270 + angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#4EE9E6',
							fill: 'transparent',
							lineWidth: 1.5,
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				//外线2
				name: '',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 3,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
							startAngle: ((270 + -angle) * Math.PI) / 180,
							endAngle: ((40 + -angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#4EE9E6',
							fill: 'transparent',
							lineWidth: 1.5,
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				//外线2
				name: '',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					return {
						type: 'arc',
						shape: {
							cx: api.getWidth() / 3,
							cy: api.getHeight() / 2,
							r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
							startAngle: ((90 + -angle) * Math.PI) / 180,
							endAngle: ((220 + -angle) * Math.PI) / 180,
						},
						style: {
							stroke: '#4EE9E6',
							fill: 'transparent',
							lineWidth: 1.5,
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				//绿点1
				name: '',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					let x0 = api.getWidth() / 3;
					let y0 = api.getHeight() / 2;
					let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
					let point = getCirlPoint(x0, y0, r, 90 + -angle);
					return {
						type: 'circle',
						shape: {
							cx: point.x,
							cy: point.y,
							r: 4,
						},
						style: {
							stroke: '#66FFFF', //粉
							fill: '#66FFFF',
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				//绿点2
				name: '', //绿点
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					let x0 = api.getWidth() / 3;
					let y0 = api.getHeight() / 2;
					let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
					let point = getCirlPoint(x0, y0, r, 270 + -angle);
					return {
						type: 'circle',
						shape: {
							cx: point.x,
							cy: point.y,
							r: 4,
						},
						style: {
							stroke: '#66FFFF', //粉
							fill: '#66FFFF',
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				//绿点3
				name: '',
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					let x0 = api.getWidth() / 3;
					let y0 = api.getHeight() / 2;
					let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6;
					let point = getCirlPoint(x0, y0, r, 90 + angle);
					return {
						type: 'circle',
						shape: {
							cx: point.x,
							cy: point.y,
							r: 4,
						},
						style: {
							stroke: '#66FFFF', //粉
							fill: '#66FFFF',
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				//绿点4
				name: '', //绿点
				type: 'custom',
				coordinateSystem: 'none',
				renderItem: function (_params: any, api: { getWidth: () => number; getHeight: () => number }) {
					let x0 = api.getWidth() / 3;
					let y0 = api.getHeight() / 2;
					let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6;
					let point = getCirlPoint(x0, y0, r, 270 + angle);
					return {
						type: 'circle',
						shape: {
							cx: point.x,
							cy: point.y,
							r: 4,
						},
						style: {
							stroke: '#66FFFF', //粉
							fill: '#66FFFF',
						},
						silent: true,
					};
				},
				data: [0],
			},
			{
				name: '',
				type: 'pie',
				clockWise: false,
				radius: ['98%', '95%'],
				hoverAnimation: false,
				center: ['33.33%', '50%'],
				top: 'center',
				itemStyle: {
					normal: {
						label: {
							show: false,
						},
					},
				},
				data: data,
			},
			{
				type: 'pie',
				top: 'center',
				startAngle: 90,
				clockwise: false,
				center: ['33.33%', '50%'],
				legendHoverLink: false,
				hoverAnimation: false,
				radius: ['94%', '55%'],
				itemStyle: {
					opacity: 0.15,
				},
				label: {
					show: false,
					position: 'center',
				},
				labelLine: {
					show: false,
				},
				data: data2,
			},
			{
				name: '',
				type: 'pie',
				clockWise: false,
				center: ['33.33%', '50%'],
				radius: ['39%', '38%'],
				hoverAnimation: false,
				top: 'center',
				itemStyle: {
					normal: {
						label: {
							show: false,
						},
					},
				},
				data: data,
			},
		],
	};
	// 环形图
} else if ([6].includes(props.dataList.showType)) {
	var scaleData = newDataArray.value;
	var rich = {
		white: {
			color: '#ddd',
			align: 'center',
			padding: [3, 0],
		},
	};
	var placeHolderStyle = {
		normal: {
			label: {
				show: false,
			},
			labelLine: {
				show: false,
			},
			color: 'rgba(0, 0, 0, 0)',
			borderColor: 'rgba(0, 0, 0, 0)',
			borderWidth: 0,
		},
	};
	var datas = [];
	var color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000'];
	for (var i = 0; i < scaleData.length; i++) {
		datas.push(
			{
				value: scaleData[i].value,
				name: scaleData[i].name,
				itemStyle: {
					normal: {
						borderWidth: 4,
						shadowBlur: 200,
						borderColor: color[i],
						shadowColor: color[i],
					},
				},
			},
			{
				value: 2,
				name: '',
				itemStyle: placeHolderStyle,
			},
		);
	}
	var seriesObj = [
		{
			name: '',
			type: 'pie',
			clockWise: false,
			radius: [0, 50],
			hoverAnimation: false,
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: 'outside',
						color: '#ddd',
						formatter: function (params: { value: number; name: string }) {
							var total = 0;
							for (var i = 0; i < scaleData.length; i++) {
								total += scaleData[i].value as number;
							}
							var percent = ((params.value / total) * 100).toFixed(0);
							if (params.name !== '') {
								return params.name + '\n{white|' + '占比' + percent + '%}';
							} else {
								return '';
							}
						},
						rich: rich,
					},
					labelLine: {
						length: 30,
						length2: 8,
						show: true,
						color: '#00ffff',
					},
				},
			},
			data: datas,
		},
	];

	var aplist3D = {
		tooltip: {
			show: false,
		},
		legend: {
			show: false,
		},
		toolbox: {
			show: false,
		},
		series: seriesObj,
	};
	// 饼图
} else if ([7].includes(props.dataList.showType)) {
	const xAxisData4 = Object.keys(props.dataList.data);
	const yAxisData4 = Object.values(props.dataList.data);
	let xLabel = xAxisData4;
	let goToSchool = yAxisData4;
	let goOutSchool = yAxisData4;
	var recognDatas = {
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'transparent',
			axisPointer: {
				lineStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: 'rgba(126,199,255,0)', // 0% 处的颜色
							},
							{
								offset: 0.5,
								color: 'rgba(126,199,255,1)', // 100% 处的颜色
							},
							{
								offset: 1,
								color: 'rgba(126,199,255,0)', // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
			},
			formatter: (
				p: {
					seriesName: any;
					data: any;
				}[],
			) => {
				let dom = `<div style="width: 79px;
	height: 50px;;color:#fff;position: relative;">
        <svg style="position: absolute;top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);" class="svg" xmlns="http://www.w3.org/2000/svg" width="100" height="71" viewBox="0 0 84 55">
      <defs>
        <style>
          .cls-1 {
            fill: #07172c;
            fill-opacity: 0.8;
            stroke: #a7d8ff;
            stroke-linejoin: round;
            stroke-opacity: 0.2;
            stroke-width: 1px;
            fill-rule: evenodd;
          }

        </style>
      </defs>
      <path id="矩形_419" data-name="矩形 419" class="cls-1" d="M266,595h74v50H266V624.046L261,620l5-3.984V595Z"
        transform="translate(-258.5 -592.5)" />
    </svg>
        <div style="padding: 4px 8px 4px 14px;display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;position: relative;z-index: 1;">
            <div style="margin-bottom: 4px;width:100%;display:${p[0] ? 'flex' : 'none'};justify-content:space-between;align-items:center;">
                <span style="font-size:14px;color:#7ec7ff;">${p[0] ? p[0].seriesName : ''}</span>
                <span style="font-size:14px;color:#fff;">${p[0] ? p[0].data : ''}</span>
            </div>
            <div style="width:100%;height:100%;display:${p[1] ? 'flex' : 'none'};justify-content:space-between;align-items:center;">
                <span style="font-size:14px;color:#7ec7ff;">${p[1] ? p[1].seriesName : ''}</span>
                <span style="font-size:14px;color:#fff;">${p[1] ? p[1].data : ''}</span>
            </div>
        </div>
    </div>`;
				return dom;
			},
		},
		legend: {
			align: 'left',
			right: '5%',
			top: '15%',
			type: 'plain',
			textStyle: {
				color: '#7ec7ff',
				fontSize: 12,
			},
			// icon:'rect',
			itemGap: 25,
			itemWidth: 18,
			icon: 'path://M0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z',
			data: newDataArray.value,
		},
		grid: {
			top: '35%',
			left: '20%',
			right: '20%',
			bottom: '25%',
			// containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				axisLine: {
					//坐标轴轴线相关设置。数学上的x轴
					show: true,
					lineStyle: {
						color: '#233653',
						fontSize: 12,
					},
				},
				axisLabel: {
					//坐标轴刻度标签的相关设置
					textStyle: {
						color: '#7ec7ff',
						padding: 0,
						fontSize: 12,
					},
					formatter: function (data: any) {
						return data;
					},
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#192a44',
					},
				},
				axisTick: {
					show: false,
				},
				data: xLabel,
			},
		],
		yAxis: [
			{
				name: '人数',
				nameTextStyle: {
					color: '#7ec7ff',
					fontSize: 12,
					padding: 5,
				},
				min: 0,
				splitLine: {
					show: true,
					lineStyle: {
						color: '#192a44',
					},
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#233653',
						fontSize: 12,
					},
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: '#7ec7ff',
						padding: 5,
						fontSize: 12,
					},
					formatter: function (value: number) {
						if (value === 0) {
							return value;
						}
						return value;
					},
				},
				axisTick: {
					show: false,
				},
			},
		],
		series: [
			{
				name: newDataArray.value[0].name,
				type: 'line',
				symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
				showAllSymbol: true,
				symbolSize: 0,
				smooth: true,
				lineStyle: {
					normal: {
						width: 5,
						color: 'rgba(25,163,223,1)', // 线条颜色
					},
					borderColor: 'rgba(0,0,0,.4)',
				},
				itemStyle: {
					color: 'rgba(25,163,223,1)',
					borderColor: '#646ace',
					borderWidth: 2,
				},
				tooltip: {
					show: true,
				},
				areaStyle: {
					//区域填充样式
					normal: {
						//线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[
								{
									offset: 0,
									color: 'rgba(25,163,223,.3)',
								},
								{
									offset: 1,
									color: 'rgba(25,163,223, 0)',
								},
							],
							false,
						),
						shadowColor: 'rgba(25,163,223, 0.5)', //阴影颜色
						shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
					},
				},
				data: goToSchool,
			},

			{
				name: newDataArray.value[1].name,
				type: 'line',
				symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
				showAllSymbol: true,
				symbolSize: 0,
				smooth: true,
				lineStyle: {
					normal: {
						width: 5,
						color: 'rgba(10,219,250,1)', // 线条颜色
					},
					borderColor: 'rgba(0,0,0,.4)',
				},
				itemStyle: {
					color: 'rgba(10,219,250,1)',
					borderColor: '#646ace',
					borderWidth: 2,
				},
				tooltip: {
					show: true,
				},
				areaStyle: {
					//区域填充样式
					normal: {
						//线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[
								{
									offset: 0,
									color: 'rgba(10,219,250,.3)',
								},
								{
									offset: 1,
									color: 'rgba(10,219,250, 0)',
								},
							],
							false,
						),
						shadowColor: 'rgba(10,219,250, 0.5)', //阴影颜色
						shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
					},
				},
				data: goOutSchool,
			},
		],
	};
	// 折线图
} else if ([8].includes(props.dataList.showType)) {
	const xAxisData5 = Object.keys(props.dataList.data);
	const yAxisData5 = Object.values(props.dataList.data);
	var fontColor = '#30eee9';
	var xxfpid = {
		grid: {
			left: '2%',
			right: '5%',
			top: '10%',
			bottom: '12%',
			containLabel: true,
		},
		tooltip: {
			show: true,
			trigger: 'item',
		},
		legend: {
			show: true,
			x: 'center',
			y: '35',
			icon: 'stack',
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: '#1bb4f6',
			},
			data: yAxisData5,
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				axisLabel: {
					color: fontColor,
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#397cbc',
					},
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#195384',
					},
				},
				data: xAxisData5,
			},
		],
		yAxis: [
			{
				type: 'value',
				// name : '信息量',
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: '#2ad1d2',
					},
				},
				axisLine: {
					lineStyle: {
						color: '#27b4c2',
					},
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#11366e',
					},
				},
			},
		],
		series: [
			{
				// name: '已采纳',
				type: 'line',
				stack: '总量',
				symbol: 'circle',
				symbolSize: 8,
				itemStyle: {
					normal: {
						color: '#0092f6',
						lineStyle: {
							color: '#0092f6',
							width: 1,
						},
						areaStyle: {
							//color: '#94C9EC'
							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
								{
									offset: 0,
									color: 'rgba(7,44,90,0.3)',
								},
								{
									offset: 1,
									color: 'rgba(0,146,246,0.9)',
								},
							]),
						},
					},
				},
				markPoint: {
					itemStyle: {
						normal: {
							color: 'red',
						},
					},
				},
				data: [9, 3, 5, 3, 2],
			},
			{
				// name: '已发布',
				type: 'line',
				stack: '总量',
				symbol: 'circle',
				symbolSize: 6,

				itemStyle: {
					normal: {
						color: '#00d4c7',
						lineStyle: {
							color: '#00d4c7',
							width: 1,
						},
						areaStyle: {
							//color: '#94C9EC'
							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
								{
									offset: 0,
									color: 'rgba(7,44,90,0.3)',
								},
								{
									offset: 1,
									color: 'rgba(0,212,199,0.9)',
								},
							]),
						},
					},
				},
				data: [1, 3, 6, 5, 2],
			},
			{
				// name: '浏览量',
				type: 'line',
				stack: '总量',
				symbol: 'circle',
				symbolSize: 8,
				itemStyle: {
					normal: {
						color: '#aecb56',
						lineStyle: {
							color: '#aecb56',
							width: 1,
						},
						areaStyle: {
							//color: '#94C9EC'
							color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
								{
									offset: 0,
									color: 'rgba(7,44,90,0.3)',
								},
								{
									offset: 1,
									color: 'rgba(114,144,89,0.9)',
								},
							]),
						},
					},
				},
				data: [1, 2, 3, 4, 7],
			},
		],
	};
	// 多数据折线图
} else if ([9].includes(props.dataList.showType)) {
	const yAxisData6 = ref();
	if (props.dataList.data === null || props.dataList.data === undefined) {
		yAxisData6.value = [{}];
	} else {
		yAxisData6.value = Object.values(props.dataList.data);
		let validNumbersArray = yAxisData6.value.map(function (number: string) {
			if (typeof number === 'string') {
				return parseFloat(number);
			}
			return number;
		});
		let roundedArray = validNumbersArray.map(function (number: number) {
			return Number((number as number).toFixed(2));
		});

		var man = roundedArray;
		const total: any[] = [];
		man.forEach((item: any, index: any) => {
			let max: any = item > (man[index] as number) ? index : man[index];
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
						value: man,
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
			},
		],
	};
}

function renderChart(_id: number) {
	if (!echarts) return;
	echart.setOption(
		props.dataList.showType === 1
			? showSlie
			: props.dataList.showType === 2
				? histogram
				: props.dataList.showType === 3
					? categoryData
					: props.dataList.showType === 4
						? barChart
						: props.dataList.showType === 5
							? pieCharts
							: props.dataList.showType === 6
								? aplist3D
								: props.dataList.showType === 7
									? recognDatas
									: props.dataList.showType === 8
										? xxfpid
										: props.dataList.showType === 9
											? chartradar
											: chartradar,
	);
}
onMounted(() => {
	let dom = document.getElementById(
		props.typid === 1
			? 'main1'
			: props.typid === 2
				? 'main2'
				: props.typid === 3
					? 'main3'
					: props.typid === 4
						? 'main4'
						: props.typid === 5
							? 'main5'
							: props.typid === 6
								? 'main6'
								: props.typid === 7
									? 'main7'
									: props.typid === 8
										? 'typ'
										: props.typid === 9
											? 'main9'
											: props.typid === 10
												? 'main10'
												: props.typid === 11
													? 'main11'
													: 'hahha',
	)!;
	echart = echarts.init(dom);
	renderChart(props.dataList.showType);
	if (resizeObserver) {
		resizeObserver.disconnect();
	}
	resizeObserver = new ResizeObserver(() => {
		if (echart) echart.resize();
	});
	resizeObserver.observe(dom);
});
</script>

<template>
	<div
		:id="
			[1].includes(props.typid as number)
				? 'main1'
				: [2].includes(props.typid as number)
					? 'main2'
					: [3].includes(props.typid as number)
						? 'main3'
						: [4].includes(props.typid as number)
							? 'main4'
							: [5].includes(props.typid as number)
								? 'main5'
								: [6].includes(props.typid as number)
									? 'main6'
									: [7].includes(props.typid as number)
										? 'main7'
										: [8].includes(props.typid as number)
											? 'typ'
											: [9].includes(props.typid as number)
												? 'main9'
												: [10].includes(props.typid as number)
													? 'main10'
													: [11].includes(props.typid as number)
														? 'main11'
														: ''
		"
		:class="
			props.typid === 1 || props.typid === 2 || props.typid === 3 || props.typid === 4 || props.typid === 5
				? 'leftClass'
				: 'rightClass'
		"
	></div>
</template>

<style scoped>
.leftClass {
	width: 340px;
	height: 130px;
}

.rightClass {
	width: 400px;
	height: 200px;
}
</style>
