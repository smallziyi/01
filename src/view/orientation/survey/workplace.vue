<script setup lang="ts">
import ReportWorkplaceCard from '@/view/__report/components/card-list/report-workplace-card.vue';
import ReportProcess from '@/view/__report/components/workplace/report-process.vue';
import ReportAction from '@/view/__report/components/workplace/report-action.vue';
import { REPORT_TYPE, ReportField } from '@/view/__report';
import useRouterParams from '@/hooks/useRouterParams.ts';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';
import { useRouter } from 'vue-router';
import { getReportInfo } from '@/axios';

const router = useRouter();
const params = useRouterParams<{ reportId: string; type: 'edit' | 'audit' }>();
const report = ref<ReportField>();
const loading = ref(true);
const title = computed(() => {
	return `${report.value?.name}: ${report.value?.domainData.label}`;
});
onMounted(() => {
	fetchReport();
});

const fetchReport = () => {
	getReportInfo<ReportField>(params.reportId)
		.then((res) => {
			report.value = res;
			setReportInfo({
				reportId: res.id,
				reportType: res.reportType,
				reportSubmitter: res.submitUserId,
				reportStatus: res.status,
				reportAuditType: res.auditingType!,
				reportScore: res.score || 0,
				userAuditFlag: res.userAuditFlag!,
				pageType: params.type,
			});
		})
		.finally(() => {
			loading.value = false;
		});
};
const reportUser = computed(() => {
	return {
		editor: report.value?.reportEditorData.map((item) => item.userId) || [],
		auditor: report.value?.reportAuditorData.map((item) => item.userId) || [],
	};
});

const { setReportInfo } = useReportInfo();
</script>

<template>
	<div v-if="loading" class="flex justify-center items-center h-full">
		<a-spin tip="加载中..." />
	</div>
	<template v-else>
		<a-card size="small" :bordered="false">
			<template #title>
				<div class="card-title">{{ title }}</div>
			</template>
			<template #extra>
				<a-button type="link" @click="router.back()">&lt;返回列表页</a-button>
			</template>
			<div class="flex gap-4">
				<report-workplace-card :report-type="REPORT_TYPE.SURVEY" :report="report!" />
				<report-process class="grow" :report="report!" />
			</div>
		</a-card>
		<report-action v-model:report-user="reportUser" @update="fetchReport" />
	</template>
</template>
