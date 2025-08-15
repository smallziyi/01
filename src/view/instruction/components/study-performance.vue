<script lang="ts" setup>
import doneSvg from '@/assets/image/instruction/done.svg';
import undoneSvg from '@/assets/image/instruction/undone.svg';
import { StudentActivity } from '@/view/instruction';
import useRouterParams from '@/hooks/useRouterParams';
import { getStudentCourseActive } from '@/axios';

const { teachPlanId, studentId } = useRouterParams<{ teachPlanId: string; studentId: string }>();
const activityInfo = ref<StudentActivity>({
	afterPracticeFlag: false,
	beforePreviewFlag: false,
	quickResponseCount: 0,
	raiseHandCount: 0,
	score: 0,
	signInFlag: false,
	tableCompleteFlags: [false, false, false, false, false, false],
});

const topData = computed(() => {
	const { score, afterPracticeFlag, beforePreviewFlag, quickResponseCount, raiseHandCount, signInFlag } =
		activityInfo.value;
	return [
		{ label: '课堂积分', value: score, unit: '分' },
		{ label: '上课签到', value: signInFlag },
		{ label: '课堂抢答', value: quickResponseCount, unit: '次' },
		{ label: '课前预习', value: beforePreviewFlag },
		{ label: '课堂举手', value: raiseHandCount, unit: '次' },
		{ label: '课后练习', value: afterPracticeFlag },
	];
});

const bottonData = computed(() => {
	const { tableCompleteFlags } = activityInfo.value;
	return [
		{ label: '资讯', value: tableCompleteFlags[0] },
		{ label: '计划', value: tableCompleteFlags[1] },
		{ label: '决策', value: tableCompleteFlags[2] },
		{ label: '实施', value: tableCompleteFlags[3] },
		{ label: '检查', value: tableCompleteFlags[4] },
		{ label: '评价', value: tableCompleteFlags[5] },
	];
});
let intervalId: NodeJS.Timeout;

onMounted(() => {
	getStudentCourseActive(teachPlanId, studentId).then((res) => {
		activityInfo.value = res;
	});
	intervalId = setInterval(() => {
		getStudentCourseActive(teachPlanId, studentId).then((res) => {
			activityInfo.value = res;
		});
	}, 30000);
});
// 清理定时器
onBeforeUnmount(() => {
	clearInterval(intervalId);
});
</script>

<template>
	<div class="w-[378px] h-[220px] bg-[#EBF3FF] p-4 relative">
		<img src="@/assets/image/instruction/course.png" alt="" class="absolute top-[-6px] left-20 z-10"/>
		<div class="absolute top-[18px] left-[150px] z-10 text-base text-white">课堂表现</div>
		<a-card class="h-full w-full">
			<div class="mt-4">
				<div class="grid grid-cols-2 gap-1 mb-2">
					<div v-for="(item, index) in topData" :key="index" class="flex">
						{{ item.label }}: &nbsp;&nbsp;
						<template v-if="item.value === null">
							<span class="text-[#F0AE43]">--</span>
						</template>
						<template v-else-if="[0, 2, 4].includes(index)">
							<span class="text-[#F0AE43]">{{ item.value }}&nbsp;&nbsp;{{ item.unit }}</span>
						</template>
						<template v-else-if="item.value">
							<done-svg />
						</template>
						<template v-else>
							<undone-svg />
						</template>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-1">
					<div v-for="(item, index) in bottonData" :key="index" class="flex">
						{{ item.label }}: &nbsp;&nbsp;
						<template v-if="item.value === null">
							<span class="text-[#F0AE43]">--</span>
						</template>
						<template v-else-if="item.value">
							<done-svg />
						</template>
						<template v-else>
							<undone-svg />
						</template>
					</div>
				</div>
			</div>
		</a-card>
	</div>
</template>
