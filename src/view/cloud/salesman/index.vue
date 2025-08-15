<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">销售人员</div>
		</template>
		<template #extra>
			<a-button type="link" @click="addVisible = true">
				<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" /> 新增销售</div>
			</a-button>
		</template>
		<TransitionGroup name="list" tag="div">
			<div key="1" class="space-y-4" v-if="!detailVisible">
				<a-table
					:columns="columns"
					:loading="loading"
					row-key="id"
					:data-source="data"
					:pagination="pagination"
					@pageChange="handlePageChange"
					size="small"
					:scroll="{ y: calcHeight }"
				>
					<template #emptyText>
						<m-empty />
					</template>
					<template #bodyCell="{ column, record, index }: TableRow<Salesman>">
						<template v-if="column.key === 'serial-number'">
							{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
						</template>
						<template v-if="column.key === 'disable'">
							<a-badge :status="record.disable ? 'error' : 'success'" />{{ record.disable ? '禁用' : '正常' }}
						</template>
						<template v-if="column.key === 'type'">
							{{ ['一级代理商', '二级代理商', '三级代理商', '专职销售', '兼职销售', '其他'][record.type! - 1] }}
						</template>
						<template v-if="column.key === 'settleCycle'">
							{{ ['按次', '按月', '按季度', '按年'][record.settleCycle! - 1] }}
						</template>
						<template v-if="column.key === 'percentage'"> {{ record.percentage }}% </template>
						<template v-if="column.key === 'operation'">
							<a-space>
								<a>禁用</a>
								<a @click="showDetail(record as Salesman)">详情</a>
							</a-space>
						</template>
					</template>
				</a-table>
			</div>
			<div key="2" class="space-y-4" v-if="detailVisible">
				<a-card size="small" title="销售员详情">
					<template #extra>
						<a-button type="text" @click="detailVisible = false">返回</a-button>
					</template>
					<div class="flex text-nowrap">
						<div class="flex w-1/4">
							<div class="w-20">姓名</div>
							<div class="grow">{{ detailSalesman.salesmanName }}</div>
						</div>
						<div class="flex w-1/4">
							<div class="w-20">销售类型</div>
							<div class="grow">{{ SalesmanTypeOptions[detailSalesman.type! - 1].label }}</div>
						</div>
						<div class="flex w-1/4">
							<div class="w-20">联系电话</div>
							<div class="grow">{{ detailSalesman.contactPhone }}</div>
						</div>
						<div class="flex w-1/4">
							<div class="w-20">联系邮箱</div>
							<div class="grow">{{ detailSalesman.contactEmail }}</div>
						</div>
					</div>
				</a-card>
				<a-table :columns="contractColumns" row-key="id" :data-source="contractData" size="small">
					<template #emptyText>
						<m-empty />
					</template>
					<template #title><span class="font-bold">历史签约</span></template>
				</a-table>
			</div>
		</TransitionGroup>
		<salesman-add v-model:open="addVisible" @success="fetchData" />
	</a-card>
</template>

<script setup lang="ts">
import { fetchSalesmanList, getContractListBySalesmanId } from '@/axios';
import { columns, initSalesman, QuerySalesmanParams, Salesman, SalesmanTypeOptions } from './config.ts';
import { Contract } from '@/view/cloud/contract/config.ts';
import SalesmanAdd from '@/view/cloud/salesman/components/salesman-add.vue';
import { ColumnsType } from 'ant-design-vue/es/table/interface';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';
import { Icon } from '@iconify/vue';

const { pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(231);
const contractColumns: ColumnsType<Contract> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ dataIndex: 'contractNumber', key: 'contractNumber', title: '合同编号', ellipsis: true },
	{ dataIndex: 'clientName', key: 'clientName', title: '签约客户', ellipsis: true },
	{ dataIndex: 'contractName', key: 'contractName', title: '名称', ellipsis: true },
	{ dataIndex: 'totalPrice', key: 'totalPrice', title: '签约金额(元)', align: 'right', ellipsis: true },
	{ dataIndex: 'deployType', key: 'deployType', title: '部署方式', ellipsis: true },
	{ dataIndex: 'status', key: 'status', title: '状态', ellipsis: true },
	{ dataIndex: 'createTime', key: 'createTime', title: '创建时间', ellipsis: true },
];
const detailVisible = ref(false);
const detailSalesman = ref<Salesman>(initSalesman());
const contractData = ref<Contract[]>([]);
const showDetail = (row: Salesman) => {
	detailSalesman.value = row;
	getContractListBySalesmanId(row.id!).then((response) => {
		contractData.value = response.data;
	});
	detailVisible.value = true;
};

const queryParams = ref<QuerySalesmanParams>({ current: 1, pageSize: 10 });
const data = ref<Salesman[]>([]);
const loading = ref(false);
const handlePageChange = (e: { current: number }) => {
	queryParams.value.current = e.current;
	fetchData();
};
const fetchData = () => {
	loading.value = true;
	fetchSalesmanList(queryParams.value)
		.then((response) => {
			data.value = response.records;
			pagination.value.total = +response.totalRow;
			pagination.value.current = +response.pageNumber;
		})
		.finally(() => {
			loading.value = false;
		});
};

const addVisible = ref(false);

onMounted(() => {
	fetchData();
});
</script>

<style scoped>
.list-enter-active {
	transition: all 0.5s ease;
}
.list-enter-from {
	opacity: 0;
	transform: translateX(30px);
}
</style>
