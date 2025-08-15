<script setup lang="ts">
import useAppTheme from '@/hooks/useAppTheme.ts';

defineProps<{
	title: string;
	type: 'score' | 'percent';
	topTen?: RankInfo[];
}>();
const { appTheme } = useAppTheme();

export interface RankInfo {
	name: string;
	score: number;
}
const bgColor = computed(() => (appTheme.value === 'white' ? 'bg-gray-50' : 'bg-[rgb(34,41,72)]'));
</script>

<template>
	<div class="p-6 rounded-lg" :class="bgColor">
		<div class="font-bold mb-4">{{ title }}Top10</div>
		<div v-for="(student, index) in topTen" :key="student.name" class="flex items-center mb-2">
			<!-- 排名号 -->
			<div
				class="w-6 h-6 flex items-center justify-center rounded-full text-white font-semibold"
				:class="index < 3 ? ['bg-red-500', 'bg-orange-400', 'bg-yellow-400'][index] : 'bg-gray-400'"
			>
				{{ index + 1 }}
			</div>
			<!-- 名字 -->
			<div class="w-24 ml-4 ">{{ student.name }}</div>
			<!-- 进度条 -->
			<div class="flex-1 bg-blue-100 rounded-full h-4 mx-4">
				<div
					class="bg-blue-400 h-4 rounded-full"
					:style="{ width: type === 'percent' ? `${student.score}%` : `${(student.score / 5) * 100}%` }"
				></div>
			</div>
			<!-- 分数 -->
			<div class="w-10 text-sm text-right">{{ student.score.toFixed(2) }}</div>
		</div>
	</div>
</template>
