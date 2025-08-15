<script setup lang="ts">
import ReportCard from '@/view/__report/components/card-list/report-card.vue';
import reportQuery from '@/view/__report/components/card-list/report-query.vue';
import calendarManage from './components/calendar-manage.vue';
import { message } from 'ant-design-vue';
import { QueryReportCardParams, REPORT_PAGE_TYPE, REPORT_TYPE, ReportField } from '@/view/__report';
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
	params: { reportType: REPORT_TYPE.CALENDAR, pageType: REPORT_PAGE_TYPE.EDIT },
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
	<report-query :report-type="REPORT_TYPE.CALENDAR" :params="pageState.params" @select="fetchData" />
	<a-card size="small" :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 253px)">
		<template #title>
			<div class="card-title">校历列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="handleCreateReport"><i class="bi bi-plus-circle mr-1" />新建</a-button>
		</template>
		<div style="height: calc(100vh - 323px)" class="overflow-y-auto">
			<template v-if="pageState.dataList.length > 0">
				<div ref="list" class="card-layout">
					<report-card
						v-for="item in pageState.dataList"
						:report-type="REPORT_TYPE.CALENDAR"
						page-type="edit"
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
	<calendar-manage
		v-if="openCreateOrUpdate"
		v-model:open="openCreateOrUpdate"
		:type="createReportState.type"
		:id="createReportState.id"
		:report-type="REPORT_TYPE.CALENDAR"
		@success="handleCreateOrUpdateSuccess"
	/>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
