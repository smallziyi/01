<script setup lang="ts">
import { ReportField } from '@/view/__report';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { getReportProcess } from '@/axios';

const { appTheme } = useAppTheme();

const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});

const props = defineProps<{ report: ReportField }>();

const process = ref<{
	percent: string;
	remainingTime: { key: number; value: string };
	reportStatusChangeDataList: { time: string; status: number; statusFlag: boolean; operationType: number }[];
}>({
	percent: '0',
	remainingTime: { key: 1, value: '0天' },
	reportStatusChangeDataList: [
		{
			time: '',
			status: 1,
			statusFlag: true,
			operationType: 1,
		},
		{
			time: '',
			status: 2,
			statusFlag: true,
			operationType: 1,
		},
		{
			time: '',
			status: 3,
			statusFlag: true,
			operationType: 1,
		},
		{
			time: '',
			status: 4,
			statusFlag: true,
			operationType: 1,
		},
	],
});
onMounted(() => {
	getReportProcess(props.report.id).then((res) => {
		process.value = res;
	});
});
const progressColor = computed(() => {
	if (props.report.status === 5) {
		return 'bg-green-500';
	} else if (props.report.status === 6) {
		return 'bg-[#899ECC]';
	} else {
		if (process.value.remainingTime.key === 3) {
			return 'bg-red-500';
		} else {
			return 'bg-[#1777ff]';
		}
	}
});
const tipColor = computed(() => {
	const { key, value } = process.value.remainingTime;
	if (key === 1) {
		return 'green';
	} else if (key === 2) {
		if (value.includes('小时')) {
			return 'red';
		} else {
			const days = parseInt(value, 10);
			return days >= 30 ? 'green' : days >= 8 ? 'orange' : 'red';
		}
	} else {
		return 'red';
	}
});
const getPopupContainer = (trigger: HTMLElement) => {
	return trigger;
};
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
				<div class="text-[#999]">计划开始时间</div>
				<div class="text-lg font-bold">
					<a-statistic :value="new Date(report.startTime as string).getFullYear()" groupSeparator=""></a-statistic>
				</div>
				<div class="text-base font-bold">
					{{ new Date(report.startTime as string).getMonth() + 1 }}月
					{{ new Date(report.startTime as string).getDate() }}日
				</div>
			</div>
			<div class="grow flex flex-col justify-end py-2">
				<div class="h-2 rounded bg-[rgb(240,240,240)]">
					<a-tooltip
						:title="
							(process.remainingTime.key === 1 ? '距开始' : process.remainingTime.key === 2 ? '剩余' : '已超时') +
							process.remainingTime.value
						"
						placement="top"
						:color="tipColor"
						:get-popup-container="getPopupContainer"
						:open="![5, 6].includes(report.status)"
					>
						<div
							class="rounded h-2 w-0 transition-[width] duration-1000"
							:style="{ width: `${process.percent}% !important` }"
							:class="progressColor"
						></div>
					</a-tooltip>
				</div>
			</div>
			<div class="leading-6">
				<div class="text-right text-[#999]">计划结束时间</div>
				<a-statistic
					class="text-right font-bold"
					groupSeparator=""
					:value="new Date(report.endTime as string).getFullYear()"
				></a-statistic>
				<div class="text-base font-bold text-right">
					{{ new Date(report.endTime as string).getMonth() + 1 }}月 {{ new Date(report.endTime as string).getDate() }}日
				</div>
			</div>
		</div>
		<a-divider class="my-4"></a-divider>
		<div class="flex justify-between gap-2">
			<div class="flex flex-col items-center">
				<div><i class="bi bi-check-circle text-blue-500 text-4xl"></i></div>
				<div class="font-bold">创建</div>
				<div class="text-[#999]">{{ $datetime.format(report?.createTime!, 'date') }}</div>
			</div>
			<div class="grow">
				<a-divider class="bg-blue-400 h-0.5" />
			</div>
			<div class="flex flex-col items-center">
				<div v-if="process!.reportStatusChangeDataList[1].statusFlag">
					<i class="bi bi-check-circle text-blue-500 text-4xl"></i>
				</div>
				<div v-else>
					<i class="bi bi-2-circle-fill text-blue-500 text-4xl"></i>
				</div>
				<div class="font-bold">编辑</div>
				<div class="text-[#999]">
					{{
						process!.reportStatusChangeDataList[1].time &&
						$datetime.format(process!.reportStatusChangeDataList[1].time, 'date')
					}}
				</div>
			</div>
			<div class="grow">
				<a-divider class="h-0.5" :class="process!.reportStatusChangeDataList[2].time ? 'bg-blue-400' : 'bg-blue-200'" />
			</div>
			<div class="flex flex-col items-center">
				<div v-if="process!.reportStatusChangeDataList[2].statusFlag">
					<i class="bi bi-check-circle text-blue-500 text-4xl"></i>
				</div>
				<div
					v-if="!process!.reportStatusChangeDataList[2].statusFlag && process!.reportStatusChangeDataList[1].statusFlag"
				>
					<i class="bi bi-3-circle-fill text-blue-500 text-4xl"></i>
				</div>
				<div
					v-if="
						!process!.reportStatusChangeDataList[2].statusFlag && !process!.reportStatusChangeDataList[1].statusFlag
					"
				>
					<i class="bi bi-3-circle text-neutral-500/30 text-4xl"></i>
				</div>
				<div class="font-bold">提交</div>
				<div class="text-[#999]">
					{{
						process!.reportStatusChangeDataList[2].time &&
						$datetime.format(process!.reportStatusChangeDataList[2].time, 'date')
					}}
				</div>
			</div>
			<div class="grow">
				<a-divider class="h-0.5" :class="process!.reportStatusChangeDataList[3].time ? 'bg-blue-400' : 'bg-blue-200'" />
			</div>
			<div class="flex flex-col items-center">
				<div v-if="process!.reportStatusChangeDataList[3].statusFlag">
					<span v-if="process!.reportStatusChangeDataList[3].operationType === 4">
						<i class="bi bi-x-circle-fill text-red-500 text-4xl"></i>
					</span>
					<span v-else-if="process!.reportStatusChangeDataList[3].operationType === 2">
						<i class="bi bi-x-circle text-red-500 text-4xl"></i>
					</span>
					<span v-else-if="process!.reportStatusChangeDataList[3].operationType === 3">
						<i class="bi bi-check-circle text-blue-500 text-4xl"></i>
					</span>
				</div>
				<div
					v-if="!process!.reportStatusChangeDataList[3].statusFlag && process!.reportStatusChangeDataList[2].statusFlag"
				>
					<i class="bi bi-4-circle-fill text-blue-500 text-4xl"></i>
				</div>
				<div
					v-if="
						!process!.reportStatusChangeDataList[3].statusFlag && !process!.reportStatusChangeDataList[2].statusFlag
					"
				>
					<i class="bi bi-4-circle text-neutral-500/30 text-4xl"></i>
				</div>
				<div class="text-center">
					<div>
						<span v-if="process!.reportStatusChangeDataList[3].operationType === 2" class="font-bold">驳回</span>
						<span v-else-if="process!.reportStatusChangeDataList[3].operationType === 3" class="font-bold"
							>审核通过</span
						>
						<span v-else-if="process!.reportStatusChangeDataList[3].operationType === 4" class="font-bold"
							>不予通过</span
						>
						<span v-else class="font-bold">审核</span>
					</div>
					<div class="text-[#999]">
						{{
							process!.reportStatusChangeDataList[3].time &&
							$datetime.format(process!.reportStatusChangeDataList[3].time, 'date')
						}}
					</div>
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
