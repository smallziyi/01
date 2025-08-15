<script setup lang="ts">
import dayjs from 'dayjs';
import useHoliday from '@/view/__report/components/workplace/calendar/useHoliday.ts';
import { createResourceCalendar } from '@/axios';
import useVacation from '@/view/__report/components/workplace/calendar/useVacation.ts';
import { message } from 'ant-design-vue';
import useRouterParams from '@/hooks/useRouterParams.ts';

const props = defineProps<{ day: number; month: number; year: number }>();

const { vacations } = useVacation();
const { holidays } = useHoliday();
const params = useRouterParams<{ reportId: string; type: 'edit' | 'audit' | 'preview' }>();

const pageType = computed(() => {
	return params.type;
});

const isWeekend = ref(false);
const isHoliday = ref(false);
const isSetting = computed(
	() =>
		vacations.value.length > 0 &&
		vacations.value.some(
			(item) => item.year === props.year && item.month === props.month && item.day === props.day && item.settingFlag,
		),
);

onMounted(() => {
	isHoliday.value = holidays.value.some((item) => item.day[0] === props.month && item.day[1] === props.day);
	isWeekend.value =
		dayjs(`${props.year}-${props.month}-${props.day}`).day() === 6 ||
		dayjs(`${props.year}-${props.month}-${props.day}`).day() === 0;
});

const handleSet = () => {
	if (isHoliday.value) return;
	if (pageType.value !== 'edit') return;
	let entity = vacations.value.find(
		(item) => item.year === props.year && item.month === props.month && item.day === props.day,
	);

	if (entity) {
		createResourceCalendar({ ...entity, settingFlag: !entity.settingFlag }).then((res) => {
			vacations.value.find((item) => item.id === res.data.id)!.settingFlag = res.data.settingFlag;
			message.success(res.data.settingFlag ? '设置完成' : '取消设置');
		});
	} else {
		createResourceCalendar({
			year: props.year,
			month: props.month,
			day: props.day,
			settingFlag: true,
			reportId: params.reportId,
		}).then((res) => {
			vacations.value.push(res.data);
			message.success(res.data.settingFlag ? '设置完成' : '取消设置');
		});
	}
};
</script>

<template>
	<div
		class="base hover:bg-blue-500 hover:text-white select-none"
		:class="{ 'text-neutral-400': isWeekend && !isHoliday, 'text-white bg-blue-500': isHoliday || isSetting }"
		@click="handleSet"
	>
		{{ $props.day }}
		<div
			v-if="isHoliday && !isSetting"
			class="absolute -top-3 -right-3 size-6 rounded-full text-center leading-6 bg-orange-500 text-white"
		>
			节
		</div>
		<div
			v-else-if="isSetting"
			class="absolute -top-3 -right-3 size-6 rounded-full text-center leading-6 bg-orange-500 text-white"
		>
			{{ isHoliday ? '班' : isWeekend ? '班' : '休' }}
		</div>
	</div>
</template>

<style scoped>
.base {
	width: 40px;
	height: 40px;
	border-radius: 4px;
	text-align: center;
	line-height: 40px;
	font-family: monospace;
	position: relative;
}
</style>
