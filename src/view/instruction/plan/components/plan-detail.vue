<script setup lang="ts">
import { useDictionaryStore } from '@/store/modules/dictionaryStore.ts';
import { translationKey } from '@/utils/dictionary';
import { getTeachPlanDetails } from '@/axios';

const props = defineProps<{
	teachPlanId: string;
}>();
const open = defineModel('open', { type: Boolean, required: true });

const { dictionaryOption } = useDictionaryStore();
const info = ref<
	Partial<{
		relationReportName: string;
		domainName: string;
		courseName: string;
		courseType: string;
		courseNature: string;
		description: string;
		coverUrl: string;
		relationCalendarName: string;
		calendarPlanName: string;
		treeNodeNames: string;
		teacherName: string;
		teachDate: string;
		timeSlotName: string;
		classRoomName: string;
		groupName: string;
	}>
>({});
onMounted(() => {
	getTeachPlanDetails(props.teachPlanId).then((res) => {
		const {
			courseData: { relationReportName, courseName, domainName, courseType, courseNature, description, coverUrl },
			coursePlanData: {
				relationCalendarName,
				teacherName,
				teachDate,
				classRoomName,
				timeSlotScheduleDto: {
					timePlanData: { name: calendarPlanName },
					dayPartData: { dayPartType },
					timeSlotData: { timeSlotName, startTime, endTime },
				},
				treeNodeNames,
			},
			groupData,
		} = res;
		info.value = {
			relationReportName,
			courseName,
			domainName,
			courseType: translationKey(courseType, dictionaryOption),
			courseNature: translationKey(courseNature, dictionaryOption),
			description,
			coverUrl,
			relationCalendarName,
			calendarPlanName,
			teacherName,
			teachDate,
			classRoomName,
			timeSlotName:
				['清晨', '上午', '中午', '下午', '晚上'][dayPartType - 1] +
				'/' +
				`${timeSlotName}:${startTime.slice(0, 5)}~${endTime.slice(0, 5)}`,
			treeNodeNames: treeNodeNames.join('-'),
			groupName: groupData.map((item: { groupName: string }) => item.groupName).join(','),
		};
	});
});
</script>

<template>
	<a-drawer v-model:open="open" width="50%" :close-icon="false">
		<template #title>
			<div class="card-title">详情</div>
		</template>
		<template #extra>
			<a-button @click="open = false" type="text">
				<template #icon>
					<i class="bi bi-x-lg"></i>
				</template>
			</a-button>
		</template>
		<div class="drawer-title">基础信息</div>
		<a-descriptions :column="2" size="small">
			<a-descriptions-item label="教学用书">
				{{ info.relationReportName }}
			</a-descriptions-item>
			<a-descriptions-item label="所属专业">
				{{ info.domainName }}
			</a-descriptions-item>
			<a-descriptions-item label="课程名称">
				{{ info.courseName }}
			</a-descriptions-item>
			<a-descriptions-item label="课程类型">
				{{ info.courseType }}
			</a-descriptions-item>
			<a-descriptions-item label="课程性质">
				{{ info.courseNature }}
			</a-descriptions-item>
			<a-descriptions-item label="课程描述">
				{{ info.description }}
			</a-descriptions-item>
			<a-descriptions-item label="课程图片" :span="2">
				<a-image v-if="info.coverUrl" :src="info.coverUrl" class="size-20"></a-image>
			</a-descriptions-item>
		</a-descriptions>
		<div class="drawer-title">授课信息</div>
		<a-descriptions :column="2" size="small">
			<a-descriptions-item label="校历名称">
				{{ info.relationCalendarName }}
			</a-descriptions-item>
			<a-descriptions-item label="作息方案">
				{{ info.calendarPlanName }}
			</a-descriptions-item>
			<a-descriptions-item label="课程章节">
				{{ info.treeNodeNames }}
			</a-descriptions-item>
			<a-descriptions-item label="授课教师">
				{{ info.teacherName }}
			</a-descriptions-item>
			<a-descriptions-item label="授课日期">
				{{ info.teachDate }}
			</a-descriptions-item>
			<a-descriptions-item label="授课课节">
				{{ info.timeSlotName }}
			</a-descriptions-item>
			<a-descriptions-item label="授课地点">
				{{ info.classRoomName }}
			</a-descriptions-item>
			<a-descriptions-item label="授课班级">
				{{ info.groupName }}
			</a-descriptions-item>
		</a-descriptions>
	</a-drawer>
</template>
