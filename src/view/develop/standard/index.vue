<script setup lang="ts">
import ReportStatusStatistic from '@/view/__report/components/dashboard/report-status-statistic.vue';
import mergeMonthType from '@/view/__report/components/dashboard/merge-month-type.vue';
import { REPORT_TYPE } from '@/view/__report';
</script>

<template>
	<report-status-statistic :report-type="REPORT_TYPE.STANDARD" />
	<a-card :body-style="{ padding: '22px 32px' }" :bordered="false" style="min-height: calc(100vh - 88px)">
		<merge-month-type dom-id="standard_container" :report-type="REPORT_TYPE.STANDARD" />
	</a-card>
</template>
