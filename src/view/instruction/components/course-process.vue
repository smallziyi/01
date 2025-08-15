<script setup lang="ts">
import useAppTheme from '@/hooks/useAppTheme.ts';
import dayjs from 'dayjs';

const { appTheme } = useAppTheme();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
defineProps<{
	processInfo: {
		teachDate: string;
		startTime: string;
		endTime: string;
		status: number;
	};
}>();
const percent = ref();
let timer: string | number | NodeJS.Timeout | undefined;
// 动态计算出进度条长度
const calculatePercent = () => {
	// 起始时间和结束时间
	const startTime = dayjs().hour(15).minute(30).second(0); // 15:20
	const endTime = dayjs().hour(15).minute(42).second(0); // 16:00
	const now = dayjs();
	// 计算总时长和当前时间已过的时长（以毫秒为单位）
	const totalDuration = endTime.diff(startTime); // 总时长
	const currentDuration = now.diff(startTime); // 当前已过的时间
	// 计算百分比，并限制在 0 - 100 之间
	let calculatedPercent = (currentDuration / totalDuration) * 100;
	calculatedPercent = Math.min(Math.max(calculatedPercent, 0), 100); // 确保百分比范围在 0 到 100 之间
	percent.value = +calculatedPercent; // 保留两位小数
};
onMounted(() => {
	calculatePercent();
	// 每秒更新一次进度
	timer = setInterval(() => {
		if (percent.value <= 100) {
			calculatePercent();
		} else {
			clearInterval(timer);
		}
	}, 10000);
});
onUnmounted(() => {
	clearInterval(timer);
});
</script>

<template>
	<a-card
		:bordered="false"
		:style="{ 'background-color': `${cardBgColor}` }"
		class="h-[220px] box-content"
		size="small"
	>
		<div class="flex justify-between gap-4">
			<div class="leading-6">
				<div class="text-[#999]">上课开始时间</div>
				<div class="text-lg font-bold">
					<div>{{ processInfo.teachDate }}</div>
					<div>{{ processInfo.startTime }}</div>
				</div>
			</div>
			<div class="grow flex flex-col justify-end py-2">
				<a-progress :percent="percent" :show-info="false"></a-progress>
			</div>
			<div class="leading-6">
				<div class="text-right text-[#999]">上课完成时间</div>
				<div class="text-lg font-bold text-right">
					<div>{{ processInfo.teachDate }}</div>
					<div>{{ processInfo.endTime }}</div>
				</div>
			</div>
		</div>
		<a-divider class="my-4"></a-divider>
		<div class="flex justify-between gap-2">
			<div class="flex flex-col items-center">
				<div><i class="bi bi-check-circle text-blue-500 text-4xl"></i></div>
				<div class="font-bold">创建</div>
				<!-- <div class="text-[#999]">创建时间</div> -->
			</div>
			<div class="grow">
				<a-divider class="h-0.5" :class="processInfo.status > 2 ? 'bg-blue-400' : 'bg-blue-200'" />
			</div>
			<div class="flex flex-col items-center">
				<div v-if="processInfo.status > 1">
					<i class="bi bi-check-circle text-blue-500 text-4xl"></i>
				</div>
				<div v-else>
					<i class="bi bi-2-circle text-blue-500 text-4xl"></i>
				</div>
				<div class="font-bold">上课</div>
				<!-- <div class="text-[#999]">
					开始上课时间
				</div> -->
			</div>
			<div class="grow">
				<a-divider class="h-0.5" :class="processInfo.status === 3 ? 'bg-blue-400' : 'bg-blue-200'" />
			</div>
			<div class="flex flex-col items-center">
				<div class="text-center">
					<div v-if="processInfo.status < 3">
						<i class="bi bi-3-circle text-blue-500 text-4xl"></i>
					</div>
					<div v-else-if="processInfo.status === 3">
						<i class="bi bi-check-circle text-blue-500 text-4xl"></i>
					</div>
					<div>
						<span class="font-bold">完成</span>
					</div>
					<!-- <div class="text-[#999]">
						上课完成时间
					</div> -->
				</div>
			</div>
		</div>
	</a-card>
</template>

<style scoped>
:deep(.ant-tooltip) {
	z-index: 10;
}
</style>
