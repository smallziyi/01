<script lang="ts" setup>
import ReportCard from '@/view/__report/components/card-list/report-card.vue';
import reportQuery from '@/view/__report/components/card-list/report-query.vue';
import { QueryReportCardParams, REPORT_PAGE_TYPE, REPORT_TYPE, ReportField } from '@/view/__report';
import { fetchReportCardList } from '@/axios';

const pageState = reactive<{
	openDrawer: boolean;
	drawerType: 'create' | 'edit' | 'copy';
	dataList: Array<ReportField>;
	activeId: string;
	showInfo: boolean;
	loading: boolean;
	params: QueryReportCardParams;
	dictionaryOption: DictionaryOption;
}>({
	openDrawer: false,
	drawerType: 'create',
	dataList: [],
	activeId: '',
	showInfo: false,
	loading: false,
	params: { reportType: REPORT_TYPE.TEXTBOOK, pageType: REPORT_PAGE_TYPE.AUDIT },
	dictionaryOption: {},
});
const fetchData = () => {
	pageState.loading = true;
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
const openCreateOrUpdate = ref(false);
const createReportState = reactive<{ type: 'create' | 'update' | 'copy'; id: string }>({ type: 'create', id: '' });
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
onMounted(async () => {
	fetchData();
});
</script>

<template>
	<report-query :params="pageState.params" :report-type="REPORT_TYPE.TEXTBOOK" @select="fetchData" />
	<a-card class="overflow-hidden" size="small" style="min-height: calc(100vh - 301px)">
		<template #title>
			<div class="card-title">活页教材审核列表</div>
		</template>
		<div class="overflow-y-auto" style="height: calc(100vh - 371px)">
			<template v-if="pageState.loading">
				<div class="w-full text-center leading-10">
					<a-spin />
				</div>
			</template>
			<template v-else>
				<div v-if="pageState.dataList.length > 0" class="card-layout">
					<report-card
						v-for="item in pageState.dataList"
						:key="item.id"
						:report-type="REPORT_TYPE.TEXTBOOK"
						:report="item"
						page-type="audit"
						@copy="handleCopyReport"
						@success="research"
						@update="handleUpdateReport(item.id)"
					/>
				</div>
				<m-empty v-else></m-empty>
			</template>
		</div>
	</a-card>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
