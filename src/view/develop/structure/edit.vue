<script setup lang="ts">
import CreateOrUpdateOrCopy from '@/view/__report/components/card-list/report-create-or-update-or-copy.vue';
import ReportCard from '@/view/__report/components/card-list/report-card.vue';
import reportQuery from '@/view/__report/components/card-list/report-query.vue';
import { message } from 'ant-design-vue';
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
	params: { reportType: REPORT_TYPE.STRUCTURE, pageType: REPORT_PAGE_TYPE.EDIT },
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

onMounted(async () => {
	fetchData();
});
// const onExport = () => {
// 	message.success('敬请期待！');
// };

const openCreateOrUpdate = ref(false);

const createReportState = reactive<{ type: 'create' | 'update' | 'copy'; id: string }>({ type: 'create', id: '' });
const handleCopyReport = (id: string) => {
	createReportState.id = id;
	createReportState.type = 'copy';
	openCreateOrUpdate.value = true;
};
const handleCreateReport = () => {
	createReportState.type = 'create';
	openCreateOrUpdate.value = true;
};
const handleCreateOrUpdateSuccess = () => {
	openCreateOrUpdate.value = false;
	fetchData();
	switch (createReportState.type) {
		case 'create':
			message.success('新建成功');
			break;
		case 'update':
			message.success('修改成功');
			break;
		case 'copy':
			message.success('复制成功');
			break;
		default:
			message.success('操作成功');
	}
};
const handleUpdateReport = (id: string) => {
	openCreateOrUpdate.value = true;
	createReportState.type = 'update';
	createReportState.id = id;
};
</script>

<template>
	<report-query :report-type="REPORT_TYPE.STRUCTURE" :params="pageState.params" @select="fetchData" />
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small" style="min-height: calc(100vh - 301px)">
		<template #title>
			<div class="card-title">课程结构列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="handleCreateReport"><i class="bi bi-plus-circle mr-1" />新建</a-button>
			<!-- <a-button type="link" @click="onExport"><i class="bi bi-cloud-arrow-down mr-1" />导出数据</a-button> -->
		</template>
		<div style="height: calc(100vh - 371px)" class="overflow-y-auto">
			<template v-if="pageState.dataList.length > 0">
				<div ref="list" class="card-layout">
					<report-card
						v-for="item in pageState.dataList"
						:key="item.id"
						:report-type="REPORT_TYPE.STRUCTURE"
						page-type="edit"
						:report="item"
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
	<create-or-update-or-copy
		v-if="openCreateOrUpdate"
		v-model:open="openCreateOrUpdate"
		:type="createReportState.type"
		:id="createReportState.id"
		:report-type="REPORT_TYPE.STRUCTURE"
		@success="handleCreateOrUpdateSuccess"
	/>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
