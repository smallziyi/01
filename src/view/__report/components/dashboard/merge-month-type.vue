<script setup lang="ts">
import { REPORT_PAGE_TYPE, ReportType, ReportTypeStatistic } from '@/view/__report';
import useAppTheme from '@/hooks/useAppTheme.ts';
// 按需导入 echarts 模块
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LegendComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import { useRouter } from 'vue-router';
import { fetchReportStatusCountByMonth, getReportTypeStatistic } from '@/axios';

// 注册必需的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LegendComponent,
	BarChart,
	LabelLayout,
	UniversalTransition,
	SVGRenderer,
]);

const router = useRouter();
const resizeObserver = ref<ResizeObserver | null>(null);
const chart = ref<echarts.ECharts | null>(null);
const { appTheme } = useAppTheme();
const tableTitleBgColor = computed(() => (appTheme.value === 'white' ? '#e8eaed' : '#1F253E'));
const borderColor = computed(() => (appTheme.value === 'white' ? '#f0f0f0' : '#626E9F'));
const props = defineProps<{
	reportType: ReportType;
	domId: string;
}>();

const pathNameMap = new Map([
	[1, '/school/orientation/survey'],
	[2, '/school/orientation/cultivate'],
	[3, '/school/develop/structure'],
	[4, '/school/develop/standard'],
	[5, '/school/develop/textbook'],
	[6, '/school/instruction/guidebook'],
	[9, '/school/resource/calendar'],
]);
const pathName = computed(() => pathNameMap.get(props.reportType) || '');

const state = reactive<{ edit: Array<ReportTypeStatistic>; audit: Array<ReportTypeStatistic> }>({
	edit: [],
	audit: [],
});

const getColor = ({ key, value }: { key: number; value: string }) => {
	if (key === 1) return 'text-green-500';
	if (key === 2) {
		if (value.includes('小时')) return 'text-red-500';
		const days = parseInt(value, 10);
		return days >= 30 ? 'text-green-500' : days >= 8 ? 'text-orange-500' : 'text-red-500';
	}
	return 'text-red-500';
};

const getText = (remainingTime: { key: number; value: string }) => {
	const { key, value } = remainingTime;
	return textMap[key] + value;
};
const textMap: any = {
	2: '剩余',
	3: '已超时',
};

const fetchData = async () => {
	const [editData, auditData] = await Promise.all([
		getReportTypeStatistic(REPORT_PAGE_TYPE.EDIT, props.reportType),
		getReportTypeStatistic(REPORT_PAGE_TYPE.AUDIT, props.reportType),
	]);
	state.edit = editData.slice(0, 5);
	state.audit = auditData.slice(0, 5);
};

watch(() => props.reportType, fetchData);

const initChart = async () => {
	const dom = document.getElementById(props.domId);
	if (!dom) return;

	chart.value?.dispose();
	chart.value = echarts.init(dom, appTheme.value === 'blue' ? 'dark' : 'light', { renderer: 'svg' });

	chart.value.setOption({
		backgroundColor: appTheme.value === 'blue' ? '#242f54' : 'white',
		legend: {
			data: ['编辑中', '审核中', '审核通过', '已驳回', '审核未通过'],
		},
		xAxis: { type: 'category', data: [] },
		yAxis: { type: 'value' }, // 确保 yAxis 类型设置为 'value'
		series: [
			{ name: '编辑中', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#0091FF' }, barWidth: '40%' },
			{ name: '审核中', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#F0AE43' }, barWidth: '40%' },
			{ name: '审核通过', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#68D1A5' }, barWidth: '40%' },
			{ name: '已驳回', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#EC5156' }, barWidth: '40%' },
			{ name: '审核未通过', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#899ECC' }, barWidth: '40%' },
		],
	});

	resizeObserver.value?.disconnect();
	resizeObserver.value = new ResizeObserver(() => chart.value?.resize());
	resizeObserver.value.observe(dom);

	const res = await fetchReportStatusCountByMonth(props.reportType);
	const { years, editCounts, auditCounts, passCounts, rejectedCounts, notPassCounts } = res;
	chart.value.setOption({
		tooltip: {}, // 确保 tooltip 触发类型为 'axis'
		legend: {
			data: ['编辑中', '审核中', '审核通过', '已驳回', '审核未通过'],
			left: 'left',
		},
		xAxis: { type: 'category', data: years },
		yAxis: {}, // 确保 yAxis 类型设置为 'value'
		series: [
			{ name: '编辑中', type: 'bar', stack: '总量', data: editCounts, itemStyle: { color: '#0091FF' } },
			{ name: '审核中', type: 'bar', stack: '总量', data: auditCounts, itemStyle: { color: '#F0AE43' } },
			{ name: '审核通过', type: 'bar', stack: '总量', data: passCounts, itemStyle: { color: '#68D1A5' } },
			{ name: '已驳回', type: 'bar', stack: '总量', data: rejectedCounts, itemStyle: { color: '#EC5156' } },
			{ name: '审核未通过', type: 'bar', stack: '总量', data: notPassCounts, itemStyle: { color: '#899ECC' } },
		],
		grid: { left: '0%', right: '0%', top: '10%', bottom: '0%', containLabel: true },
	});
};

watch(appTheme, initChart);

onMounted(() => {
	fetchData();
	initChart();
});

onUnmounted(() => {
	resizeObserver.value?.disconnect();
	chart.value?.dispose();
});
</script>

<template>
	<div class="grid grid-cols-2 gap-4">
		<div>
			<a-flex class="mb-5" justify="space-between" align="center">
				<div class="card-title text-lg font-bold leading-none">编辑中</div>
				<a @click="router.push(`${pathName}/edit`)">更多&nbsp;<i class="bi bi-three-dots"></i></a>
			</a-flex>
			<div v-if="state.edit.length === 0" class="empty-border">
				<m-empty size="small" />
			</div>
			<div v-else>
				<table class="w-full border">
					<thead>
						<tr :style="{ 'background-color': `${tableTitleBgColor}` }">
							<td class="font-bold text-nowrap">序号</td>
							<td class="font-bold text-nowrap">编辑时间</td>
							<td class="font-bold text-nowrap">消息主题</td>
							<td class="font-bold text-nowrap">距计划完成时间</td>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in state.edit">
							<td class="text-nowrap">{{ index + 1 }}</td>
							<td class="text-nowrap">{{ $datetime.format(item.time, 'full') }}</td>
							<td class="max-w-[277px] truncate">{{ item.message }}</td>
							<td class="text-nowrap">
								<span :class="getColor(item.remainingTime)">{{ getText(item.remainingTime) }}</span>
							</td>
						</tr>
						<template v-if="state.edit.length < 5">
							<tr v-for="_empty in 5 - state.edit.length"></tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
		<div>
			<a-flex class="mb-5" justify="space-between" align="center">
				<div class="card-title text-lg font-bold leading-none">审核中</div>
				<a @click="router.push(`${pathName}/audit`)">更多&nbsp;<i class="bi bi-three-dots"></i></a>
			</a-flex>
			<div v-if="state.audit.length === 0" class="empty-border">
				<m-empty size="small" />
			</div>
			<div v-else>
				<table class="w-full border">
					<thead>
						<tr :style="{ 'background-color': `${tableTitleBgColor}` }">
							<td class="font-bold text-nowrap">序号</td>
							<td class="font-bold text-nowrap">编辑时间</td>
							<td class="font-bold text-nowrap">消息主题</td>
							<td class="font-bold text-nowrap">距计划完成时间</td>
						</tr>
					</thead>
					<tbody class="overflow-y-auto hide-scrollbar">
						<tr v-for="(item, index) in state.audit">
							<td class="text-nowrap">{{ index + 1 }}</td>
							<td class="text-nowrap">{{ $datetime.format(item.time, 'full') }}</td>
							<td class="max-w-[277px] truncate">{{ item.message }}</td>
							<td class="text-nowrap">
								<span :class="getColor(item.remainingTime)">{{ getText(item.remainingTime) }}</span>
							</td>
						</tr>
						<template v-if="state.audit.length < 5">
							<tr class="h-[30px]" v-for="_empty in 5 - state.audit.length"></tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="card-title text-lg leading-none font-bold my-5">综合数据分析</div>
	<div :id="$props.domId" class="w-full bar-height"></div>
</template>

<style scoped>
.empty-border {
	height: 181px;
	border: 1px solid v-bind(borderColor);
}
table {
	border-collapse: collapse;
	font-size: 12px;
}

tr {
	height: 30px;
	border: 1px solid v-bind(borderColor);
}

td {
	padding: 0 8px;
	text-wrap: nowrap;
	text-overflow: ellipsis;
}

.bar-height {
	height: calc(100vh - 413px);
}
</style>
