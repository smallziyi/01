<template>
	<div :class="id === 'categories-tree' && props.arrangement === 'horizontal' ? 'h-12' : 'h-[1500px]'" :id="id"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
defineOptions({
	name: 'TreeChart',
});
type TreeData = {
	name: string;
	children?: TreeData[];
};
const props = defineProps<{
	treeData: TreeData[];
	id: string;
	type: string;
	arrangement: string;
}>();

const myChart = ref();
const orientLevel = computed(() => {
	return props.arrangement === 'vertical' ? 'TB' : 'LR';
});

defineExpose({ myChart });
//
const horizontalOption = {
	tooltip: {
		trigger: 'item',
		triggerOn: 'mousemove',
	},
	series: [
		{
			type: 'tree',
			data: props.treeData,
			top: '1%',
			left: '7%',
			bottom: '1%',
			right: '20%',
			symbolSize: 7,
			orient: orientLevel.value,
			label: {
				position: 'left',
				align: 'right',
				verticalAlign: 'middle',
				fontSize: 12,
				color: '#0091ff',
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
			itemStyle: {
				color: '#0091ff',
			},
			expandAndCollapse: false,
			animationDuration: 550,
			animationDurationUpdate: 750,
		},
	],
};
const verticalOption = {
	tooltip: {
		trigger: 'item',
		triggerOn: 'mousemove',
	},
	series: [
		{
			type: 'tree',
			data: props.treeData,
			top: '7%',
			left: '7%',
			bottom: '10%',
			right: '20%',
			symbolSize: 7,
			orient: orientLevel.value,
			label: {
				position: 'top',
				align: 'right',
				verticalAlign: 'middle',
				fontSize: 12,
				rotate: -90,
				color: '#0091ff',
			},
			leaves: {
				label: {
					position: 'bottom',
					verticalAlign: 'middle',
					rotate: -90,
					align: 'left',
				},
			},
			emphasis: {
				focus: 'descendant',
			},
			itemStyle: {
				color: '#0091ff',
			},
			expandAndCollapse: false,
			animationDuration: 550,
			animationDurationUpdate: 750,
		},
	],
};

let resizeObserver = null;
onMounted(() => {
	const container = document.getElementById(props.id);
	myChart.value = echarts.init(container, 'null', { renderer: 'canvas' });
	const option = props.arrangement === 'vertical' ? verticalOption : horizontalOption;
	myChart.value.setOption(option);
	resizeObserver = new ResizeObserver(() => {
		myChart.value.resize();
	});
	resizeObserver.observe(container!);
});
onUnmounted(() => {
	resizeObserver!.disconnect();
	resizeObserver = null;
});
</script>
