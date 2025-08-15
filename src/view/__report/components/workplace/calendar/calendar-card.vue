<script lang="ts" setup>
import dayjs from 'dayjs';
import DayCard from '@/view/__report/components/workplace/calendar/day-card.vue';

const props = defineProps<{ year: number; month: number }>();

// 获取当前月份的天数
const daysInMonth = ref<number>(0);

onMounted(() => {
	daysInMonth.value = dayjs(`${props.year}-${props.month}-1`).daysInMonth();
});

// 获取本月一日是星期几
const firstDayOfWeek =
	dayjs(`${props.year}-${props.month}-01`).day() > 0 ? dayjs(`${props.year}-${props.month}-01`).day() - 1 : 6;

const map: Record<number, string> = {
	1: '一',
	2: '二',
	3: '三',
	4: '四',
	5: '五',
	6: '六',
	7: '七',
	8: '八',
	9: '九',
	10: '十',
	11: '十一',
	12: '十二',
};
</script>

<template>
	<a-card size="small" hoverable>
		<template #title> {{ map[props.month] }}月 </template>

		<div class="grid grid-cols-7 gap-2 select-none">
			<div class="text-center leading-10">一</div>
			<div class="text-center leading-10">二</div>
			<div class="text-center leading-10">三</div>
			<div class="text-center leading-10">四</div>
			<div class="text-center leading-10">五</div>
			<div class="text-center leading-10">六</div>
			<div class="text-center leading-10">日</div>
			<!-- 填充空白天数 -->
			<div v-for="n in firstDayOfWeek" :key="'empty-' + n" class="font-mono text-center leading-10"></div>
			<div v-for="day in daysInMonth" :key="day" class="flex justify-center">
				<day-card :year="$props.year" :month="$props.month" :day="day" />
			</div>
		</div>
	</a-card>
</template>
