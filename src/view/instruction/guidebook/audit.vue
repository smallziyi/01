<script setup lang="ts">
import reportQuery from '@/view/__report/components/card-list/report-query.vue';
import { ReportField, QueryReportCardParams, REPORT_PAGE_TYPE, REPORT_TYPE } from '@/view/__report';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import ReportCard from '@/view/__report/components/card-list/report-card.vue';
import ReportCardDetail from '@/view/__report/components/card-list/report-card-detail.vue';
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
	params: { reportType: REPORT_TYPE.GUIDEBOOK, pageType: REPORT_PAGE_TYPE.AUDIT },
});
const fetchData = () => {
	fetchReportCardList<ReportField>(pageState.params).then((res) => {
		pageState.dataList = res;
	});
};

onMounted(() => {
	fetchData();
});

const activeReportId = ref('');
const openInfo = ref(false);
</script>

<template>
	<report-query :params="pageState.params" :report-type="REPORT_TYPE.GUIDEBOOK" @select="fetchData" />
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small" style="min-height: calc(100vh - 253px)">
		<template #title>
			<div class="card-title">教学用书审核列表</div>
		</template>
		<div class="overflow-y-scroll" style="height: calc(100vh - 323px)">
			<template v-if="pageState.dataList.length > 0">
				<div ref="list" class="card-layout">
					<report-card
						v-for="item in pageState.dataList"
						:key="item.id"
						:report="item"
						:report-type="REPORT_TYPE.GUIDEBOOK"
						page-type="audit"
					>
					</report-card>
				</div>
			</template>
			<m-empty v-else></m-empty>
		</div>
	</a-card>
	<report-card-detail
		v-if="openInfo"
		:report-id="activeReportId"
		:report-type="REPORT_TYPE.GUIDEBOOK"
		v-model:open="openInfo"
	/>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
