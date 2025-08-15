<script setup lang="ts">
import { theme } from 'ant-design-vue';
import MHeader from '@/layout/m-header.vue';
import MFooter from '@/layout/m-footer.vue';
import useAxios, { fetchReportStatusCountByMonth, getReportTypeStatistic } from '@/axios';
import dayjs from 'dayjs';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { REPORT_PAGE_TYPE, ReportTypeStatistic } from '@/view/__report';
import * as echarts from 'echarts';
import useAppTheme from '@/hooks/useAppTheme.ts';

const router = useRouter();
const token = theme.useToken().token;

const content = ref('暂无公告！');

const axios = useAxios();

const functionList = ref<Array<{ path: string; name: string; code: string; iconFileUrl: string; reportType: number }>>(
	[],
);
const echartsList = ref<Array<{ path: string; name: string; code: string; iconFileUrl: string; reportType: number }>>(
	[],
);
const activeKey = ref();

onMounted(() => {
	axios.get('/base/auth/getUserFunction').then((res) => {
		functionList.value = res.data;
		echartsList.value = functionList.value.filter((item) => item.reportType);
		if (functionList.value.length > 0) {
			activeKey.value = functionList.value[0].reportType;
		}
	});
	const cu = new Date();
	date.value.year = cu.getFullYear();
	date.value.month = cu.getMonth();
	date.value.day = cu.getUTCDate();
	generateDay();
});
const functionTypeCode = computed(() => {
	return functionList.value.map((item) => item.code);
});
const [list] = useAutoAnimate();
const date = ref({ year: 2024, month: 7, day: 17 });
const days = ref<Array<number>>([]);

const generateDay = () => {
	const mouth = dayjs(new Date(date.value.year, date.value.month, 1));
	let week = mouth.day() - 1;
	if (week < 0) {
		week = week + 7;
	}
	const dayList = [];
	for (let i = 0; i < week; i++) {
		dayList.push(-1);
	}
	for (let j = 0; j < mouth.daysInMonth(); j++) {
		dayList.push(j);
	}
	days.value = dayList;
};

const handleClickYear = (type: 1 | 2) => {
	if (type === 1) {
		date.value.year = date.value.year - 1;
	} else {
		date.value.year = date.value.year + 1;
	}
	generateDay();
};
const handleClickMonth = (type: 1 | 2) => {
	if (type === 1) {
		if (date.value.month >= 1) {
			date.value.month = date.value.month - 1;
		} else {
			date.value.month = 11;
			date.value.year = date.value.year - 1;
		}
	} else {
		if (date.value.month <= 10) {
			date.value.month = date.value.month + 1;
		} else {
			date.value.month = 0;
			date.value.year = date.value.year + 1;
		}
	}
	generateDay();
};
const toToday = () => {
	const today = new Date();
	date.value.year = today.getFullYear();
	date.value.month = today.getMonth();
	date.value.day = today.getUTCDate();
	generateDay();
};

const editTable = ref<Array<ReportTypeStatistic>>([]);
const fetchEditTable = () => {
	getReportTypeStatistic(REPORT_PAGE_TYPE.EDIT, activeKey.value).then((res) => {
		editTable.value = res.slice(0, 5);
	});
};

const auditTable = ref<Array<ReportTypeStatistic>>([]);
const fetchAuditTable = () => {
	getReportTypeStatistic(REPORT_PAGE_TYPE.AUDIT, activeKey.value).then((res) => {
		auditTable.value = res.slice(0, 5);
	});
};

const reportTypeMap = ['未知类型', '企业调研报告', '人才培养方案', '课程结构', '课程标准', '活页式教材'];

let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;
const { appTheme } = useAppTheme();
const initChart = () => {
	if (chart) {
		chart.dispose();
	}
	const container = document.getElementById('chart');
	if (container) {
		const charTheme = appTheme.value === 'blue' ? 'dark' : 'light';
		chart = echarts.init(container, charTheme, {
			renderer: 'svg',
		});
		chart.setOption({
			backgroundColor: 'rgba(0,0,0,0)',
			legend: {
				data: ['编辑中', '审核中', '审核通过', '已驳回', '审核未通过'],
			},
			xAxis: { type: 'category', data: [] },
			yAxis: {},
			series: [
				{ name: '编辑中', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#0091FF' }, barWidth: '40%' },
				{ name: '审核中', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#F0AE43' }, barWidth: '40%' },
				{ name: '审核通过', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#68D1A5' }, barWidth: '40%' },
				{ name: '已驳回', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#EC5156' }, barWidth: '40%' },
				{ name: '审核未通过', type: 'bar', stack: '总量', data: [], itemStyle: { color: '#899ECC' }, barWidth: '40%' },
			],
		});
		fetchReportStatusCountByMonth(activeKey.value).then((res) => {
			const { years, editCounts, auditCounts, passCounts, rejectedCounts, notPassCounts } = res;
			chart!.setOption({
				tooltip: {},
				legend: {
					data: ['编辑中', '审核中', '审核通过', '已驳回', '审核未通过'],
					left: 'left',
				},
				xAxis: { type: 'category', data: years },
				yAxis: {},
				series: [
					{ name: '编辑中', type: 'bar', stack: '总量', data: editCounts, itemStyle: { color: '#0091FF' } },
					{ name: '审核中', type: 'bar', stack: '总量', data: auditCounts, itemStyle: { color: '#F0AE43' } },
					{ name: '审核通过', type: 'bar', stack: '总量', data: passCounts, itemStyle: { color: '#68D1A5' } },
					{ name: '已驳回', type: 'bar', stack: '总量', data: rejectedCounts, itemStyle: { color: '#EC5156' } },
					{ name: '审核未通过', type: 'bar', stack: '总量', data: notPassCounts, itemStyle: { color: '#899ECC' } },
				],
				grid: { left: '0%', right: '0%', top: '10%', bottom: '0%', containLabel: true },
			});
		});
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
		resizeObserver = new ResizeObserver(() => {
			if (chart) {
				chart.resize();
			}
		});
		resizeObserver.observe(container);
	}
};

const handleClickMore = (type: 'edit' | 'audit') => {
	switch (activeKey.value) {
		case 1:
			router.push(`/school/orientation/survey/${type}`);
			break;
		case 2:
			router.push(`/school/orientation/cultivate/${type}`);
			break;
	}
};
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#626E9F';
});

const tableTitleBgColor = computed(() => {
	return appTheme.value === 'white' ? '#e8eaed' : '#1F253E';
});
const goToPage = (code: string) => {
	const path = functionList.value.find((item) => item.code === code)?.path || '';
	const firstPath = path.substring(0, path.lastIndexOf('/'));
	sessionStorage.setItem('menu_open_keys', JSON.stringify([firstPath, path]));
	router.push(path);
};
watch(appTheme, () => {
	initChart();
});

watch(activeKey, () => {
	fetchEditTable();
	fetchAuditTable();
	initChart();
});
</script>

<template>
	<a-layout class="h-screen">
		<a-layout-header :style="{ backgroundColor: `${token.colorBgContainer}` }" class="p-4 flex justify-between h-14">
			<m-header />
		</a-layout-header>
		<a-layout-content class="overflow-y-auto min-w-[1440px]">
			<div class="p-4 space-y-4">
				<a-card :bordered="false" size="small"><i class="bi bi-megaphone mr-2"></i>公告： {{ content }}</a-card>
				<div class="flex gap-4">
					<div class="space-y-4 grow" style="width: calc(100vw - 384px - 48px)">
						<a-card :body-style="{ padding: '18px 32px' }" :bordered="false" style="height: 180px">
							<div class="card-title text-lg font-bold leading-none">功能列表</div>
							<div class="flex py-4">
								<m-empty v-if="functionList.length === 0" class="mx-auto" size="small"></m-empty>
								<a-space :size="30">
									<a-dropdown
										v-if="functionTypeCode.some((code) => code === 'survey' || code === 'cultivate')"
										placement="bottomRight"
										arrow
									>
										<img class="h-[100px]" src="/images/workbench/orientation.png" alt="" />
										<template #overlay>
											<a-menu>
												<a-menu-item v-if="functionTypeCode.includes('survey')" @click="goToPage('survey')"
													>企业调研</a-menu-item
												>
												<a-menu-item v-if="functionTypeCode.includes('cultivate')" @click="goToPage('cultivate')"
													>人才培养方案</a-menu-item
												>
											</a-menu>
										</template>
									</a-dropdown>
									<a-dropdown
										v-if="
											functionTypeCode.some(
												(code) => code === 'structure' || code === 'standard' || code === 'textbook',
											)
										"
										placement="bottomRight"
										arrow
									>
										<img class="h-[100px]" src="/images/workbench/develop.png" alt="" />
										<template #overlay>
											<a-menu>
												<a-menu-item v-if="functionTypeCode.includes('structure')" @click="goToPage('structure')"
													>课程结构</a-menu-item
												>
												<a-menu-item v-if="functionTypeCode.includes('standard')" @click="goToPage('standard')"
													>课程标准</a-menu-item
												>
												<a-menu-item v-if="functionTypeCode.includes('textbook')" @click="goToPage('textbook')"
													>活页教材</a-menu-item
												>
											</a-menu>
										</template>
									</a-dropdown>
									<a-dropdown
										v-if="functionTypeCode.some((code) => code === 'guidebook' || code === 'teach' || code === 'study')"
										placement="bottomRight"
										arrow
									>
										<img class="h-[100px]" src="/images/workbench/implement.png" alt="" />
										<template #overlay>
											<a-menu>
												<a-menu-item v-if="functionTypeCode.includes('guidebook')" @click="goToPage('guidebook')"
													>学材管理</a-menu-item
												>
												<a-menu-item v-if="functionTypeCode.includes('teach')" @click="goToPage('teach')"
													>课程教学</a-menu-item
												>
												<a-menu-item v-if="functionTypeCode.includes('study')" @click="goToPage('study')"
													>课程学习</a-menu-item
												>
											</a-menu>
										</template>
									</a-dropdown>
									<a-dropdown
										v-if="functionTypeCode.some((code) => code === 'calendar' || code === 'classroom')"
										placement="bottomRight"
										arrow
									>
										<img class="h-[100px]" src="/images/workbench/resource.png" alt="" />
										<template #overlay>
											<a-menu>
												<a-menu-item v-if="functionTypeCode.includes('calendar')" @click="goToPage('calendar')"
													>校历</a-menu-item
												>
												<a-menu-item v-if="functionTypeCode.includes('classroom')" @click="goToPage('classroom')"
													>实训基地</a-menu-item
												>
											</a-menu>
										</template>
									</a-dropdown>
								</a-space>
							</div>
						</a-card>
						<a-card :body-style="{ padding: '20px 32px' }" :bordered="false">
							<a-tabs v-model:activeKey="activeKey" type="card">
								<a-tab-pane v-for="item in echartsList" :key="item.reportType" :tab="item.name"></a-tab-pane>
							</a-tabs>
							<div class="grid grid-cols-2 gap-11 mb-8">
								<div>
									<div class="flex justify-between items-center mb-5">
										<div class="card-title text-lg font-bold leading-none">编辑中</div>
										<div @click="handleClickMore('edit')">
											<a>更多&nbsp;<i class="bi bi-three-dots"></i></a>
										</div>
									</div>
									<div v-if="editTable.length === 0" class="empty-border">
										<m-empty size="small" />
									</div>
									<div v-else>
										<table class="w-full border">
											<thead>
												<tr :style="{ 'background-color': `${tableTitleBgColor}` }">
													<td class="w-40 font-bold">类型</td>
													<td class="font-bold">消息主题</td>
												</tr>
											</thead>
											<tbody>
												<tr v-for="item in editTable">
													<td class="w-40">{{ reportTypeMap[activeKey] }}</td>
													<td class="max-w-[361px] truncate">{{ item.message }}</td>
												</tr>
												<template v-if="editTable.length < 5">
													<tr v-for="_empty in 5 - editTable.length"></tr>
												</template>
											</tbody>
										</table>
									</div>
								</div>
								<div>
									<div class="flex justify-between items-center mb-5">
										<div class="card-title text-lg font-bold leading-none">审核中</div>
										<div @click="handleClickMore('audit')">
											<a>更多&nbsp;<i class="bi bi-three-dots"></i></a>
										</div>
									</div>
									<div v-if="auditTable.length === 0" class="empty-border">
										<m-empty size="small" />
									</div>
									<div v-else>
										<table class="w-full border">
											<thead>
												<tr :style="{ 'background-color': `${tableTitleBgColor}` }">
													<td class="w-40 font-bold">类型</td>
													<td class="font-bold">消息主题</td>
												</tr>
											</thead>
											<tbody class="overflow-y-auto hide-scrollbar">
												<tr v-for="item in auditTable">
													<td class="w-40">{{ reportTypeMap[activeKey] }}</td>
													<td>{{ item.message }}</td>
												</tr>
												<template v-if="auditTable.length < 5">
													<tr v-for="_empty in 5 - auditTable.length"></tr>
												</template>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div>
								<div class="card-title text-lg font-bold leading-none mb-4">综合数据分析</div>
								<div id="chart" class="h-[440px] rounded"></div>
							</div>
						</a-card>
					</div>
					<div class="w-[360px] space-y-4">
						<div class="rounded overflow-hidden">
							<img alt="封面图" class="w-[360px]" src="/images/workbench/workbench.png" />
						</div>
						<a-card :bordered="false" size="small">
							<template #title>
								<div class="flex justify-between px-4">
									<div>
										<span @click="handleClickYear(1)"
											><i class="bi bi-chevron-double-left hover:text-blue-500"></i
										></span>
										<span @click="handleClickMonth(1)"
											><i class="bi bi-chevron-left ml-2 hover:text-blue-500"></i
										></span>
									</div>
									<div>{{ date.year }}年 &nbsp;{{ date.month + 1 }}月</div>
									<div>
										<span @click="handleClickMonth(2)">
											<i class="bi bi-chevron-double-right mr-2 hover:text-blue-500"></i>
										</span>
										<span @click="handleClickYear(2)"><i class="bi bi-chevron-right hover:text-blue-500"></i></span>
									</div>
								</div>
							</template>
							<div class="grid grid-cols-7">
								<div class="text-center h-10 leading-10">一</div>
								<div class="text-center h-10 leading-10">二</div>
								<div class="text-center h-10 leading-10">三</div>
								<div class="text-center h-10 leading-10">四</div>
								<div class="text-center h-10 leading-10">五</div>
								<div class="text-center h-10 leading-10">六</div>
								<div class="text-center h-10 leading-10">日</div>
							</div>
							<div ref="list" class="grid grid-cols-7">
								<div v-for="(item, index) in days" :key="index" class="flex justify-center">
									<div
										:class="
											new Date().getFullYear() === date.year &&
											new Date().getMonth() === date.month &&
											new Date().getUTCDate() === item + 1
												? 'bg-[#488dff] border border-[#2b7bff] text-white '
												: ''
										"
										class="size-8 m-1 leading-8 text-center rounded-full font-mono"
									>
										{{ item !== -1 ? item + 1 : '' }}
									</div>
								</div>
							</div>
							<template #actions>
								<a-button type="link" @click="toToday">今天</a-button>
							</template>
						</a-card>
						<a-card :bordered="false" size="small" style="height: 450px">
							<template #title>
								<div class="card-title text-lg font-bold leading-none">日程处理</div>
							</template>
							<div class="h-[373px]">
								<m-empty />
							</div>
							<!-- <table class="w-full">
								<tr class="bg-[#e8eaed]">
									<td class="font-bold">时间</td>
									<td class="font-bold">消息主题</td>
									<td class="font-bold">操作</td>
								</tr>
								<tr>
									<td colspan="3">
										<m-empty class="my-4" />
									</td>
								</tr>
							</table> -->
						</a-card>
					</div>
				</div>
			</div>
			<m-footer :is-transparent="false"></m-footer>
		</a-layout-content>
	</a-layout>
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
</style>
