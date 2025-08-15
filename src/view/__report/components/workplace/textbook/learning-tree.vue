<script lang="ts" setup>
import * as echarts from 'echarts';

const props = defineProps<{ tree: Tree; level: number; id: string; parentId: string }>();

let chart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

interface Mind {
	name: string;
	children?: Array<Mind>;
	collapsed: boolean;
	id?: string;
}

const data = ref<Mind>({ name: '', children: [], collapsed: false, id: '' });

const generateTreeData = () => {
	data.value.name = props.tree.name || '';
	data.value.id = props.tree.id;

	data.value.children = props.tree.children?.map((item) => {
		return {
			name: item.name || '',
			id: item.id,
			collapsed:
				props.level === 1
					? true
					: props.level === 2
						? props.id !== item.id
						: props.level === 3
							? item.id !== props.parentId
							: false,
			children: item.children?.map((v) => {
				return {
					name: v.name || '',
					id: v.id,
					collapsed: !(props.level === 3 && props.id === v.id),
					children: [
						{
							name: '具体步骤',
							collapsed: false,
							children: (v.tableFormData?.['0'] ?? []).map((c) => {
								return { name: c.taskName, collapsed: false, children: [{ name: c.taskContent, collapsed: false }] };
							}),
						},
						{
							name: '资讯',
							collapsed: true,
							children: (v.tableFormData?.['1'] ?? []).map((c) => {
								return { name: c.taskName, collapsed: false, children: [{ name: c.taskContent, collapsed: false }] };
							}),
						},
						{
							name: '计划',
							collapsed: true,
							children: (v.tableFormData?.['2'] ?? []).map((c) => {
								return { name: c.taskName, collapsed: false, children: [{ name: c.taskContent, collapsed: false }] };
							}),
						},
						{
							name: '决策',
							collapsed: true,
							children: (v.tableFormData?.['3'] ?? []).map((c) => {
								return { name: c.taskName, collapsed: false, children: [{ name: c.taskContent, collapsed: false }] };
							}),
						},
						{
							name: '实施',
							collapsed: true,
							children: (v.tableFormData?.['4'] ?? []).map((c) => {
								return { name: c.taskName, collapsed: false, children: [{ name: c.taskContent, collapsed: false }] };
							}),
						},
						{
							name: '检查',
							collapsed: true,
							children: (v.tableFormData?.['5'] ?? []).map((c) => {
								return { name: c.taskName, collapsed: false, children: [{ name: c.taskContent, collapsed: false }] };
							}),
						},
						{
							name: '评价',
							collapsed: true,
							children: (v.tableFormData?.['6'] ?? []).map((c) => {
								return { name: c.taskName, collapsed: false, children: [{ name: c.taskContent, collapsed: false }] };
							}),
						},
					],
				};
			}),
		};
	});

	return data.value;
};

function renderChart() {
	if (!chart) return;
	chart.setOption({
		tooltip: {
			trigger: 'item',
			triggerOn: 'mousemove',
		},
		series: [
			{
				type: 'tree',

				top: '1%',
				left: '7%',
				bottom: '1%',
				right: '20%',

				data: [generateTreeData()],

				symbolSize: 14,

				label: {
					position: 'left',
					verticalAlign: 'middle',
					align: 'right',
					fontSize: 14,
				},

				leaves: {
					label: {
						position: 'right',
						verticalAlign: 'middle',
						align: 'left',
					},
				},
				emphasis: {
					focus: 'descendant',
				},
				expandAndCollapse: true,
				animationDuration: 550,
				animationDurationUpdate: 750,
				roam: 'move',
				zoom: 0.8,
			},
		],
	});
}

onMounted(() => {
	let dom = document.getElementById('mountNode')!;
	chart = echarts.init(dom);

	renderChart();

	if (resizeObserver) {
		resizeObserver.disconnect();
	}
	resizeObserver = new ResizeObserver(() => {
		if (chart) {
			chart.resize();
		}
	});
	resizeObserver.observe(dom);
});

watch(
	() => props.tree,
	() => {
		renderChart();
	},
);

watch(
	() => props.id,
	() => {
		renderChart();
	},
);

watch(
	() => props.level,
	() => {
		renderChart();
	},
);
</script>

<template>
	<div id="mountNode" class="w-full" style="height: calc(100vh - 286px)"></div>
</template>
