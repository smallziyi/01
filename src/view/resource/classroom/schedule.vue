<script setup lang="ts">
import {
	getClassroomList,
	getDropManagerList,
	getRelationClassroomAndDate,
	getClassroomSchedule,
	getClassroomRelationDate,
} from '@/axios';
import dayjs, { Dayjs } from 'dayjs';
import scheduleItem from './components/schedule-item.vue';
import { Classroom } from './config';
import { useAutoAnimate } from '@formkit/auto-animate/vue';

const [list] = useAutoAnimate();
const mangerOption = ref<Option[]>([]);
const activeClassroomId = ref<string>();
const currentYearMonth = ref<Dayjs>();
// 0代表周日以此类推
const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const currentYear = computed(() => {
	return dayjs(currentYearMonth.value).year();
});
const currentMonth = computed(() => {
	return padZero(dayjs(currentYearMonth.value).month() + 1);
});
const currentDay = ref<string>('01');
// 当月日期集合
const currentDate = ref<{ day: string; weekDay: string }[]>([]);
const currentClassroomDate = ref<string[]>([]);
const classroomStatus = ref<number>(0);
// 卡片信息
const cardDataList = ref<Classroom[]>([]);

const showCardData = computed(() => {
	if (classroomStatus.value === 0) {
		return cardDataList.value;
	} else if (classroomStatus.value === 1) {
		return cardDataList.value.filter((item) => hasScheduleClassroomIds.value.includes(item.id));
	} else if (classroomStatus.value === 2) {
		return cardDataList.value.filter((item) => !hasScheduleClassroomIds.value.includes(item.id));
	} else {
		return [];
	}
});

// 查询实训基地名称
const resultCardData = ref<Classroom>();
// 有排课的日期
const scheduleDateList = ref<string[]>([]);
// 实训室合集
const classroomOptions = ref<Option[]>([]);
const showDot = (date: string): boolean => {
	return scheduleDateList.value.includes(`${currentYear.value}-${currentMonth.value}-${date}`);
};

const classroomShowDot = (date: string): boolean => {
	return currentClassroomDate.value.includes(`${currentYear.value}-${currentMonth.value}-${date}`);
};
// 当天有排课的实训室id列表集合
const hasScheduleClassroomIds = ref<string[]>([]);

// 补 0 函数
const padZero = (num: number): string => {
	return num < 10 ? `0${num}` : `${num}`;
};

const getMonthDaysInfo = (year: number, month: string) => {
	const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
	const daysInfo = [];
	for (let day = 1; day <= daysInMonth; day++) {
		const date = dayjs(`${year}-${month}-${day}`);
		const weekDay = weekDayNames[date.day()]; // 0: Sunday, 1: Monday, ..., 6: Saturday
		daysInfo.push({
			day: padZero(day),
			weekDay, // 返回的数字可以通过进一步转换为中文或其他格式
		});
	}
	currentDate.value = daysInfo;
};

watch(
	() => currentYear.value,
	(year) => {
		getMonthDaysInfo(year, currentMonth.value);
		const dayList = currentDate.value.map((item) => item.day);
		if (dayList.includes(currentDay.value)) {
			return;
		} else {
			currentDay.value = dayList[0];
		}
	},
);

watch(
	() => currentMonth.value,
	(month) => {
		getMonthDaysInfo(currentYear.value, month);
		const dayList = currentDate.value.map((item) => item.day);
		if (dayList.includes(currentDay.value)) {
			return;
		} else {
			currentDay.value = dayList[0];
		}
	},
);
const teachDate = computed(() => {
	return `${currentYear.value}-${currentMonth.value}-${currentDay.value}`;
});

watch(
	() => teachDate.value,
	() => {
		fetchClassroom();
	},
);

watch(
	() => activeClassroomId.value,
	(classroomId) => {
		if (classroomId) {
			resultCardData.value = cardDataList.value.find((item) => item.id === classroomId);
			getClassroomRelationDate(classroomId).then((res) => {
				currentClassroomDate.value = res;
			});
		}
	},
);

const fetchManagerOption = () => {
	getDropManagerList().then((res) => {
		mangerOption.value = res;
	});
};

const fetchDateAndClassroom = () => {
	getRelationClassroomAndDate().then((res) => {
		const { dateList, options } = res;
		scheduleDateList.value = dateList;
		classroomOptions.value = options;
	});
};

const fetchClassroom = () => {
	getClassroomSchedule(teachDate.value).then((res) => {
		hasScheduleClassroomIds.value = res;
	});
};

onMounted(() => {
	fetchManagerOption();
	getClassroomList({}).then((res) => {
		cardDataList.value = res;
	});
	currentYearMonth.value = dayjs();
	currentDay.value = padZero(dayjs().date());
	getMonthDaysInfo(currentYear.value, currentMonth.value);
	fetchDateAndClassroom();
	fetchClassroom();
});
</script>

<template>
	<a-card :body-style="{ padding: '16px', height: '132px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-date-picker v-model:value="currentYearMonth" size="large" picker="month" :allow-clear="false"> </a-date-picker>
		<span class="ml-12">实训基地名称:</span>
		<a-select
			v-model:value="activeClassroomId"
			:options="classroomOptions"
			class="ml-2 w-52"
			size="large"
			placeholder="请选择"
			allow-clear
		></a-select>
		<div class="flex mt-2">
			<div v-for="item in currentDate" :key="item.day" class="flex-1 flex flex-col items-center">
				<div class="text-[#999] mb-1">{{ item.weekDay }}</div>
				<template v-if="item.day === currentDay">
					<a-badge :dot="activeClassroomId ? classroomShowDot(item.day) : showDot(item.day)" color="#0091FF">
						<div class="text-[#0091FF]">{{ item.day }}</div>
					</a-badge>
				</template>
				<template v-else>
					<a-badge :dot="activeClassroomId ? classroomShowDot(item.day) : showDot(item.day)" color="#0091FF">
						<div @click="currentDay = item.day" class="cursor-pointer hover:border-2 rounded px-1 border-[#0091FF]">
							{{ item.day }}
						</div>
					</a-badge>
				</template>
			</div>
		</div>
	</a-card>
	<a-card size="small" class="">
		<template #title>
			<div>当前实训基地安排（{{ currentYear }}年{{ currentMonth }}月{{ currentDay }}日）</div>
		</template>
		<template #extra>
			<a-radio-group v-model:value="classroomStatus" :disabled="!!activeClassroomId">
				<a-radio :value="0">全部</a-radio>
				<a-radio :value="1">已排课</a-radio>
				<a-radio :value="2">空闲中</a-radio>
			</a-radio-group>
		</template>
		<div style="height: calc(100vh - 336px)" class="overflow-y-auto">
			<template v-if="activeClassroomId && resultCardData">
				<div ref="list" class="card-layout">
					<schedule-item
						:card-item="resultCardData"
						:has-schedule="hasScheduleClassroomIds.includes(resultCardData.id)"
						:teach-date="teachDate"
						:manger-option="mangerOption"
					/>
				</div>
			</template>
			<template v-else-if="showCardData.length > 0">
				<div ref="list" class="card-layout">
					<schedule-item
						v-for="item in showCardData"
						:card-item="item"
						:has-schedule="hasScheduleClassroomIds.includes(item.id)"
						:teach-date="teachDate"
						:manger-option="mangerOption"
					/>
				</div>
			</template>
			<template v-else>
				<m-empty></m-empty>
			</template>
		</div>
	</a-card>
</template>

<style scoped>
:deep(.ant-tabs-nav::before) {
	display: none !important;
}
:deep(.ant-tabs-top > .ant-tabs-nav) {
	margin-bottom: 0;
}
</style>
