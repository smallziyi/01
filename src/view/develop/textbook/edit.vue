<script lang="ts" setup>
import CreateOrUpdateOrCopy from '@/view/__report/components/card-list/report-create-or-update-or-copy.vue';
import ReportCard from '@/view/__report/components/card-list/report-card.vue';
import reportQuery from '@/view/__report/components/card-list/report-query.vue';
import { message } from 'ant-design-vue';
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
}>({
	openDrawer: false,
	drawerType: 'create',
	dataList: [],
	activeId: '',
	showInfo: false,
	loading: false,
	params: { reportType: REPORT_TYPE.TEXTBOOK, pageType: REPORT_PAGE_TYPE.EDIT },
});
const fetchData = () => {
	fetchReportCardList<ReportField>(pageState.params)
		.then((res) => {
			pageState.dataList = res;
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
	<report-query :params="pageState.params" :report-type="REPORT_TYPE.TEXTBOOK" @select="fetchData" />
	<a-card class="overflow-hidden" size="small" style="min-height: calc(100vh - 301px)">
		<template #title>
			<div class="card-title">活页教材列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="handleCreateReport"><i class="bi bi-plus-circle mr-1" />新建</a-button>
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
						:report="item"
						:report-type="REPORT_TYPE.TEXTBOOK"
						page-type="edit"
						@copy="handleCopyReport"
						@success="research"
						@update="handleUpdateReport(item.id)"
					/>
				</div>
				<m-empty v-else></m-empty>
			</template>
		</div>
	</a-card>
	<create-or-update-or-copy
		v-if="openCreateOrUpdate"
		:id="createReportState.id"
		v-model:open="openCreateOrUpdate"
		:report-type="REPORT_TYPE.TEXTBOOK"
		:type="createReportState.type"
		@success="handleCreateOrUpdateSuccess"
	/>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
