<script lang="ts" setup>
import { useRouter } from 'vue-router';
import detailCard from './detail-card.vue';
import courseProcess from './course-process.vue';
import useRouterParams from '@/hooks/useRouterParams';
import { useDictionaryStore } from '@/store/modules/dictionaryStore.ts';
import { translationKey } from '@/utils/dictionary';
import studyPerformance from './study-performance.vue';
import teacherPerformance from './teacher-performance.vue';
import { getTeachPlanDetails } from '@/axios';

const router = useRouter();
const { teachPlanId, pageType } = useRouterParams<{ teachPlanId: string; pageType: 'teach' | 'study' }>();
const { dictionaryOption } = useDictionaryStore();
const cardInfo = ref<{
	teachPlanId: string;
	status: number;
	courseName: string;
	courseType: string;
	courseNature: string;
	coverUrl: string;
	currentCourseName: string;
	courseProgress: string;
	teacherName: string;
	classRoomName: string;
}>();

const processInfo = ref<{
	teachDate: string;
	startTime: string;
	endTime: string;
	status: number;
}>();
onMounted(() => {
	getTeachPlanDetails(teachPlanId).then((res) => {
		const {
			courseData: { courseName, courseType, courseNature, coverUrl },
			coursePlanData: {
				currentCourseName,
				courseProgress,
				teacherName,
				teachDate,
				classRoomName,
				timeSlotScheduleDto: {
					timeSlotData: { startTime, endTime },
				},
			},
			status,
			teachPlanId,
		} = res;
		cardInfo.value = {
			teachPlanId,
			courseName,
			courseType: translationKey(courseType, dictionaryOption),
			courseNature: translationKey(courseNature, dictionaryOption),
			coverUrl,
			currentCourseName,
			courseProgress,
			teacherName,
			classRoomName,
			status,
		};
		processInfo.value = {
			teachDate,
			startTime: startTime.slice(0, 5),
			endTime: endTime.slice(0, 5),
			status,
		};
	});
});

function updateReportState(state: 1 | 2 | 3 | 4) {
	if (cardInfo.value) {
		cardInfo.value.status = state;
	}
}

defineExpose({
	updateReportState,
});
</script>

<template>
	<a-card size="small">
		<template #title>
			<div class="card-title">课程(学习场)名称：{{ cardInfo?.courseName || '' }}</div>
		</template>
		<template #extra>
			<a-button type="link" @click="router.back()">&lt;返回列表</a-button>
		</template>
		<div class="flex gap-4" v-if="cardInfo && processInfo">
			<detail-card :card-info="cardInfo"></detail-card>
			<course-process class="flex-1" :process-info="processInfo"></course-process>
			<teacher-performance v-if="pageType === 'teach'"></teacher-performance>
			<study-performance v-else></study-performance>
		</div>
	</a-card>
	<!-- 具体的页面 -->
	<slot></slot>
</template>
