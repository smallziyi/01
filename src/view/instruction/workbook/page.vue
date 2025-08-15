<script setup lang="ts">
import { QueryReportCardParams, REPORT_PAGE_TYPE, REPORT_TYPE } from '@/view/__report';
import { translationKey } from '@/utils/dictionary';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import { fetchReportCardList } from '@/axios';

const { dictionaryOption } = useDictionaryStore();

const { appTheme } = useAppTheme();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
const cardActionBgColor = computed(() => {
	return appTheme.value === 'white' ? '#FFF' : '#1F253E';
});
const pageState = reactive<{
	params: QueryReportCardParams;
	query: { name: string; major: string };
}>({
	params: {
		reportType: REPORT_TYPE.WORKBOOK,
		pageType: REPORT_PAGE_TYPE.EDIT,
	},
	query: { name: '', major: '' },
});

const search = () => {
	const params = { ...pageState.params, ...pageState.query };
	fetchReportCardList<Guidebook>(params).then((res) => {
		allData.value = res;
	});
};

onMounted(async () => {
	search();
});

interface Guidebook {
	id: string;
	name: string;
	createTime: string;
	majorData: { label: string; value: string };
	reportProgress: string;
	otherField: {
		courseName: string;
		courseType: string;
	};
	coverUrl?: string;
	startTime: string;
	endTime: string;
}

const allData = ref<Array<Guidebook>>([]);
const router = useRouter();
const handleViewReport = (id: string) => {
	router.push(`/school/instruction/guidebook/workbook/overview/${id}`);
};

const reset = () => {
	pageState.query = { name: '', major: '' };
	search();
};
</script>

<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form ref="form" :model="pageState.query" class="w-full">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item label="教材名称" name="startTime">
					<a-input placeholder="教材名称" v-model:value="pageState.query.name" class="w-full" allow-clear></a-input>
				</a-form-item>
				<a-form-item label="专业" name="name">
					<a-input v-model:value="pageState.query.major" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item></a-form-item>
				<a-form-item class="text-right">
					<a-button class="mr-4" @click="reset">重置</a-button>
					<a-button type="primary" @click="search">查询</a-button>
				</a-form-item>
			</div>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small" style="min-height: calc(100vh - 253px)">
		<template #title>
			<div class="card-title">学习用书列表</div>
		</template>
		<div class="overflow-y-scroll" style="height: calc(100vh - 323px)">
			<template v-if="allData.length > 0">
				<div ref="list" class="card-layout">
					<a-card
						v-for="report in allData"
						:bordered="false"
						:style="{ 'background-color': `${cardBgColor}` }"
						class="min-w-[378px]"
						hoverable
						size="small"
					>
						<div class="flex h-[146px] gap-5">
							<a-image v-if="report.coverUrl" :width="109.5" :height="146" class="rounded-lg" :src="report.coverUrl" />
							<a-image v-else :width="109.5" :height="146" class="rounded-lg" src="/images/report/default3.png" />
							<div class="grow h-full overflow-hidden">
								<div class="flex justify-between">
									<div>
										<span>{{ report.reportProgress }}</span>
									</div>
								</div>
								<div class="leading-8 font-bold text-base truncate">
									{{ report.name }}
								</div>
								<div>
									<div class="leading-6 truncate">
										<div class="inline-block w-20">课程名称:</div>
										<span class="card-description">{{ report.otherField.courseName }}</span>
									</div>
									<div class="leading-6 truncate">
										<div class="inline-block w-20">课程类型:</div>
										<span class="card-description">{{
											translationKey(report.otherField.courseType, dictionaryOption)
										}}</span>
									</div>
									<div class="leading-6 truncate">
										<div class="inline-block w-20">专业信息:</div>
										<span class="card-description">{{ report.majorData.label }}({{ report.majorData.value }})</span>
									</div>
									<div class="leading-6 truncate">
										<div class="inline-block w-20">创建时间:</div>
										<span class="card-description">
											<a-tooltip>
												<template #title>
													<div class="">计划开始时间: {{ $datetime.format(report.startTime as string, 'date') }}</div>
													<div class="">计划完成时间: {{ $datetime.format(report.endTime as string, 'date') }}</div>
												</template>
												{{ $datetime.format(report.createTime, 'date') }}
											</a-tooltip>
										</span>
									</div>
								</div>
							</div>
						</div>
						<template #actions>
							<div class="flex justify-end mr-4">
								<a-button type="link" size="small" @click="handleViewReport(report.id)"> 查看学习用书 </a-button>
							</div>
						</template>
					</a-card>
				</div>
			</template>
		</div>
	</a-card>
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
:deep(.ant-card-actions) {
	background-color: v-bind(cardActionBgColor) !important;
}
</style>
