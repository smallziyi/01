<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false">
		<a-form ref="form" :model="queryFormModel">
			<template class="grid grid-cols-4 gap-4">
				<a-form-item label="合同编号">
					<a-input v-model:value="queryFormModel.contractNumber" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item label="合同名称">
					<a-input v-model:value="queryFormModel.contractName" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item label="客户名称">
					<a-input v-model:value="queryFormModel.clientName" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item>
					<div class="text-right">
						<a-space>
							<a-button @click="reset">重置</a-button>
							<a-button type="primary" @click="search">查询</a-button>
						</a-space>
					</div>
				</a-form-item>
			</template>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 168px)">
		<template #title>
			<div class="card-title">合同列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="onCreate">
				<template #icon>
					<i class="bi bi-plus-circle mr-1"></i>
				</template>
				新增合同
			</a-button>
		</template>
		<a-table
			:columns="columns"
			:loading="loading"
			row-key="id"
			:data-source="tableData"
			:pagination="pagination"
			@change="handleTableChange"
			size="small"
			table-layout="auto"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<Contract>">
				<template v-if="column.key === 'serial-number'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'contractType'">
					<a-tag v-if="record.contractType === 1" color="green">正式合同</a-tag>
					<a-tag v-else color="orange">试用合同</a-tag>
				</template>
				<template v-if="column.key === 'status'">
					{{ ['未知', '预提交', '进行中', '即将到期', '已结束'][record.status] }}
				</template>
				<template v-if="column.key === 'deployType'">
					<a-tag :color="record.deployType === 1 ? '#108ee9' : '#87d068'">
						{{ ['未知', '私有化', '云平台'][record.deployType] }}
					</a-tag>
				</template>
				<template v-if="column.key === 'createTime'">
					{{ new Date(record.createTime).toLocaleDateString() }}
				</template>
				<template v-if="column.key === 'operation'">
					<a-button type="link" @click="onRead(record.id)">查看</a-button>
				</template>
			</template>
		</a-table>
	</a-card>
	<contract-add v-if="state.createOpen" v-model:open="state.createOpen" @success="reset" />
	<contract-detail v-if="state.readOpen" v-model:open="state.readOpen" :id="state.currentId" />
</template>

<script setup lang="ts">
import { fetchContractList } from '@/axios';
import { columns, Contract, initQueryContract, QueryContractParams } from './config.ts';
import useForm from '@/hooks/useForm.ts';
import usePage from '@/hooks/usePage.ts';
import ContractAdd from '@/view/cloud/contract/components/contract-add.vue';
import ContractDetail from '@/view/cloud/contract/components/contract-detail.vue';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(351);
const customFetchData = () => {
	loading.value = true;
	fetchContractList(queryParams.value)
		.then((response) => {
			tableData.value = response.records;
			pagination.value.total = +response.totalRow;
			pagination.value.current = +response.pageNumber;
		})
		.finally(() => {
			loading.value = false;
		});
};
const { search, reset, queryParams, queryFormModel, handleTableChange } = useForm<QueryContractParams>(
	initQueryContract,
	customFetchData,
);
const { state, onCreate, onRead } = usePage();
const form = ref();
const tableData = ref<Contract[]>([]);
</script>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
