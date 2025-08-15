<script setup lang="ts">
import ReportCard from '@/view/__report/components/card-list/report-card.vue';
import reportQuery from '@/view/__report/components/card-list/report-query.vue';
import { ReportField, QueryReportCardParams, REPORT_PAGE_TYPE, REPORT_TYPE } from '@/view/__report';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { fetchReportCardList } from '@/axios';

const [list] = useAutoAnimate();

const pageState = reactive<{
	openDrawer: boolean;
	drawerType: 'create' | 'edit' | 'copy';
	dataList: Array<ReportField>;
	activeId: string;
	showInfo: boolean;
	loading: boolean;
	params: QueryReportCardParams;
}>({
	openDrawer: false,
	drawerType: 'create',
	dataList: [],
	activeId: '',
	showInfo: false,
	loading: false,
	params: { reportType: REPORT_TYPE.STANDARD, pageType: REPORT_PAGE_TYPE.AUDIT },
});
const fetchData = () => {
	fetchReportCardList<ReportField>(pageState.params)
		.then((res) => {
			pageState.dataList = res;
			pageState.loading = false;
		})
		.finally(() => {
			pageState.loading = false;
		});
};
const research = () => {
	fetchData();
};

onMounted(async () => {
	fetchData();
});

const openCreateOrUpdate = ref(false);

const createReportState = reactive({ type: '', id: '' });
const handleCopyReport = (id: string) => {
	createReportState.id = id;
	createReportState.type = 'copy';
	openCreateOrUpdate.value = true;
};
const handleUpdateReport = (id: string) => {
	openCreateOrUpdate.value = true;
	createReportState.type = 'update';
	createReportState.id = id;
};
</script>

<template>
	<report-query :report-type="REPORT_TYPE.STANDARD" :params="pageState.params" @select="fetchData" />
	<a-card size="small" :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 301px)">
		<template #title>
			<div class="card-title">课程标准审核列表</div>
		</template>
		<div style="height: calc(100vh - 371px)" class="overflow-y-auto">
			<template v-if="pageState.dataList.length > 0">
				<div ref="list" class="card-layout">
					<report-card
						v-for="item in pageState.dataList"
						:report-type="REPORT_TYPE.STANDARD"
						page-type="audit"
						:report="item"
						:key="item.id"
						@copy="handleCopyReport"
						@update="handleUpdateReport(item.id)"
						@success="research"
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
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
