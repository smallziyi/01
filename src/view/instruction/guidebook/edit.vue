<script setup lang="ts">
import CreateOrUpdateOrCopy from '@/view/__report/components/card-list/report-create-or-update-or-copy.vue';
import ReportCard from '@/view/__report/components/card-list/report-card.vue';
import ReportQuery from '@/view/__report/components/card-list/report-query.vue';
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
	params: QueryReportCardParams;
}>({
	openDrawer: false,
	drawerType: 'create',
	dataList: [],
	activeId: '',
	showInfo: false,
	params: { reportType: REPORT_TYPE.GUIDEBOOK, pageType: REPORT_PAGE_TYPE.EDIT },
});
const fetchData = () => {
	fetchReportCardList<ReportField>(pageState.params).then((res) => {
		pageState.dataList = res;
	});
};
const research = () => {
	fetchData();
};

onMounted(async () => {
	fetchData();
});

const openCreateOrUpdate = ref(false);

const createReportState = reactive<{ type: 'create' | 'copy' | 'update'; id: string }>({ type: 'create', id: '' });
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
			queryList.value?.fetchQueryList();
			break;
		case 'update':
			message.success('修改成功');
			queryList.value?.fetchQueryList();
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

const queryList = ref();
</script>

<template>
	<report-query ref="queryList" :params="pageState.params" :report-type="REPORT_TYPE.SURVEY" @select="fetchData" />
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small" style="min-height: calc(100vh - 253px)">
		<template #title>
			<div class="card-title">教学用书列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="handleCreateReport"><i class="bi bi-plus-circle mr-1" />新建</a-button>
		</template>
		<div class="overflow-y-scroll" style="height: calc(100vh - 323px)">
			<template v-if="pageState.dataList.length > 0">
				<div ref="list" class="card-layout">
					<report-card
						v-for="item in pageState.dataList"
						:key="item.id"
						:report="item"
						:report-type="REPORT_TYPE.GUIDEBOOK"
						page-type="edit"
						@copy="handleCopyReport"
						@success="research"
						@update="handleUpdateReport(item.id)"
					/>
				</div>
			</template>
			<template v-else>
				<m-empty />
			</template>
		</div>
	</a-card>
	<create-or-update-or-copy
		v-if="openCreateOrUpdate"
		:id="createReportState.id"
		v-model:open="openCreateOrUpdate"
		:report-type="REPORT_TYPE.GUIDEBOOK"
		:type="createReportState.type"
		@success="handleCreateOrUpdateSuccess"
	/>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
