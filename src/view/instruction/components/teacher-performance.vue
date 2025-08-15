<script lang="ts" setup>
import { TeacherActivity } from '@/view/instruction';
import useRouterParams from '@/hooks/useRouterParams';
import { getTeacherCourseActive } from '@/axios';

const activityInfo = ref<TeacherActivity>({
	afterPracticeCount: 0,
	beforePreviewCount: 0,
	signInCount: 0,
	noSignInCount: 0,
	quickResponseCount: 0,
	raiseHandCount: 0,
	tableCompleteCounts: [],
});

const { teachPlanId } = useRouterParams<{ teachPlanId: string }>();

const topData = computed(() => {
	const { beforePreviewCount, afterPracticeCount, signInCount, noSignInCount, raiseHandCount, quickResponseCount } =
		activityInfo.value;
	return [
		{ label: '课前预习', value: beforePreviewCount },
		{ label: '课后练习', value: afterPracticeCount },
		{ label: '已签到数', value: signInCount },
		{ label: '未签到数', value: noSignInCount },
		{ label: '举手人次', value: raiseHandCount },
		{ label: '抢答人次', value: quickResponseCount },
	];
});

const bottonData = computed(() => {
	const { tableCompleteCounts } = activityInfo.value;
	return [
		{ label: '资讯', value: tableCompleteCounts[0] },
		{ label: '计划', value: tableCompleteCounts[1] },
		{ label: '决策', value: tableCompleteCounts[2] },
		{ label: '实施', value: tableCompleteCounts[3] },
		{ label: '检查', value: tableCompleteCounts[4] },
		{ label: '评价', value: tableCompleteCounts[5] },
	];
});
let intervalId: NodeJS.Timeout;

onMounted(() => {
	getTeacherCourseActive(teachPlanId).then((res) => {
		activityInfo.value = res;
	});

	intervalId = setInterval(() => {
		getTeacherCourseActive(teachPlanId).then((res) => {
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
		<div class="absolute top-[18px] left-[135px] z-10 text-base text-white">课堂活跃情况</div>
		<a-card class="h-full w-full">
			<div class="mt-4">
				<div class="grid grid-cols-2 gap-1 mb-2">
					<div v-for="(item, index) in topData" :key="index">
						{{ item.label }}:
						<template v-if="item.value === null">
							<span class="text-[#F0AE43]">&nbsp;&nbsp;--</span>
						</template>
						<span v-else class="text-[#F0AE43]">
							&nbsp;&nbsp;
							{{ item.value || 0 }}
							&nbsp;&nbsp;
						</span>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-1">
					<div v-for="(item, index) in bottonData" :key="index">
						{{ item.label }}:
						<template v-if="item.value === null">
							<span class="text-[#F0AE43]">--</span>
						</template>
						<span v-else class="text-[#F0AE43]">
							&nbsp;&nbsp;
							{{ item.value || 0 }}
							&nbsp;&nbsp;
						</span>
					</div>
				</div>
			</div>
		</a-card>
	</div>
</template>
