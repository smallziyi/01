<script setup lang="ts">
import planDetail from '../plan/components/plan-detail.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import usePage from '@/hooks/usePage';

defineProps<{
	cardInfo: {
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
	};
}>();
const { state, onRead } = usePage();
const { appTheme } = useAppTheme();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
const cardActionBgColor = computed(() => {
	return appTheme.value === 'white' ? '#FFF' : '#1F253E';
});
</script>

<template>
	<a-card
		v-if="cardInfo"
		:bordered="false"
		:style="{ 'background-color': `${cardBgColor}` }"
		class="min-w-[378px]"
		size="small"
	>
		<div class="flex h-[146px] gap-5">
			<a-image v-if="cardInfo.coverUrl" :height="146" :src="cardInfo.coverUrl" :width="109.5" class="rounded-lg" />
			<a-image v-else :height="146" :width="109.5" class="rounded-lg" src="/images/cardInfo/default3.png" />
			<div class="grow h-full overflow-hidden">
				<div>
					<a-tag :color="['', '#0091FF', '#F0AE43', '#68D1A5', '#0091FF'][cardInfo.status]">
						{{ ['', '未授课', '授课中', '已授课', '未授课'][cardInfo.status] }}
					</a-tag>
					<a-tag>{{ cardInfo.courseNature }}</a-tag>
				</div>
				<div class="leading-8 font-bold text-base truncate">{{ cardInfo.currentCourseName }}</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-20">课时类型:</div>
					<span class="card-description">{{ cardInfo.courseType }}</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-20">课程地点:</div>
					<span class="card-description">{{ cardInfo.classRoomName }}</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-20">当前课时:</div>
					<span class="card-description">{{ cardInfo.courseProgress }}</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-20">授课教师:</div>
					<span class="card-description">{{ cardInfo.teacherName }}</span>
				</div>
			</div>
		</div>
		<template #actions>
			<div class="flex justify-end mr-4">
				<a-button size="small" type="link" @click="onRead(cardInfo.teachPlanId)">查看基础信息</a-button>
			</div>
		</template>
	</a-card>
	<plan-detail v-if="state.readOpen" v-model:open="state.readOpen" :teach-plan-id="state.currentId" />
</template>

<style scoped>
:deep(.ant-card-actions) {
	background-color: v-bind(cardActionBgColor) !important;
}
</style>
