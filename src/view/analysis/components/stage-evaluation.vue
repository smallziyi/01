<script setup lang="ts">
const props = defineProps<{
	title: string;
	stageType: 'score' | 'percent';
	average: number;
}>();

const evaluativeDimension = [
	{
		score: 4.5,
		percent: 90,
		level: '优秀',
		remark: '成绩优异，再接再厉，请继续保持！',
	},
	{
		score: 3.75,
		percent: 75,
		level: '良好',
		remark: '表现不错，争取更上一层楼！',
	},
	{
		score: 3,
		percent: 60,
		level: '一般',
		remark: '继续努力，相信你能做得更好！',
	},
	{
		score: 2,
		percent: 40,
		level: '较差',
		remark: '需加倍努力，迎头赶上！',
	},
	{
		score: 0,
		percent: 0,
		level: '极差',
		remark: '成绩不佳，请高度重视，必须加倍努力！',
	},
];

const getLevel = (value: number, type: 'score' | 'percent') => {
	// 根据评分规则查找对应的水平
	for (const { score, percent, level, remark } of evaluativeDimension) {
		if ((type === 'score' && value >= score) || (type === 'percent' && value >= percent)) {
			return { level, remark };
		}
	}
	return {
		level: '未知',
		remark: '没有匹配的水平',
	};
};
const state = reactive<{
	level: string;
	remark: string;
}>({ level: '', remark: '' });

watch(
	() => props.average,
	(val) => {
		if (val) {
			const { level, remark } = getLevel(val, props.stageType);
			state.level = level;
			state.remark = remark;
		}
	},
	{ immediate: true },
);
</script>

<template>
	<div>
		<div>本阶段学习评语：</div>
		<div class="text-[#999]">
			根据{{ title }}情况的数据来看，当前综合得分为{{ average }}，处于{{ state.level }}水平，{{ state.remark }}
		</div>
	</div>
</template>
