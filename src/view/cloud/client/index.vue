<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false">
		<a-form :model="queryFormModel">
			<template class="grid grid-cols-4 gap-4">
				<a-form-item label="客户端名称">
					<a-input v-model:value="queryFormModel.clientName" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item label="客户端类型">
					<a-select
						v-model:value="queryFormModel.type"
						placeholder="客户端类型"
						allow-clear
						:options="ClientTypeOptions"
					/>
				</a-form-item>
				<a-form-item></a-form-item>
				<a-form-item class="text-right">
					<a-space>
						<a-button @click="reset">重置</a-button>
						<a-button type="primary" @click="search">查询</a-button>
					</a-space>
				</a-form-item>
			</template>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 168px)">
		<template #title>
			<div class="card-title">客户端列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="onCreate"><i class="bi bi-plus-circle mr-1"></i>新增客户端</a-button>
		</template>
		<a-table
			:columns="columns"
			:data-source="tableData"
			:pagination="pagination"
			@change="handleTableChange"
			:loading="loading"
			row-key="id"
			size="small"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<Client>">
				<template v-if="column.key === 'serial-number'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'type'">
					<a-tag v-if="record.type === 2" color="blue">学校端</a-tag>
					<a-tag v-if="record.type === 3" color="green">教育局端</a-tag>
				</template>
				<template v-if="column.key === 'createTime'">
					{{ $datetime.format(record.createTime, 'full') }}
				</template>
				<template v-if="column.key === 'operation'">
					<a-space>
						<a-button v-if="record.adminUserId" class="px-0" type="link" @click="assignAuthority(record.id)"
							>权限分配
						</a-button>
						<a-button v-if="record.adminUserId" class="px-0" type="link" @click="handleSetClient(record.id, 'edit')"
							>编辑管理员
						</a-button>
						<a-button v-else type="link" class="px-0" @click="handleSetClient(record.id, 'add')">设置管理员</a-button>
					</a-space>
				</template>
			</template>
		</a-table>
	</a-card>
	<client-add v-if="state.createOpen" v-model:open="state.createOpen" @success="reset" />
	<client-edit
		v-if="manager.open"
		v-model:open="manager.open"
		:client-id="manager.currentClientId"
		:type="manager.type"
		@success="reset"
	/>
	<client-assign
		v-if="manager.assignOpen"
		v-model:open="manager.assignOpen"
		:client-id="manager.currentClientId"
		@success="reset"
	/>
</template>

<script setup lang="ts">
import { Client, ClientTypeOptions, columns, initQueryParams, QueryClientParams } from '@/view/cloud/client/config.ts';
import { fetchClientList } from '@/axios';
import useForm from '@/hooks/useForm.ts';
import usePage from '@/hooks/usePage.ts';
import ClientAdd from '@/view/cloud/client/components/client-add.vue';
import ClientEdit from '@/view/cloud/client/components/client-edit.vue';
import ClientAssign from '@/view/cloud/client/components/client-assign.vue';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(351);
const customFetchData = () => {
	loading.value = true;
	fetchClientList(queryParams.value)
		.then((response) => {
			pagination.value.current = +response.pageNumber;
			pagination.value.total = +response.totalRow;
			tableData.value = response.records;
		})
		.finally(() => {
			loading.value = false;
		});
};
const { search, reset, queryParams, queryFormModel, handleTableChange } = useForm<QueryClientParams>(
	initQueryParams,
	customFetchData,
);
const { state, onCreate } = usePage();
const tableData = ref<Client[]>([]);
const manager = reactive<{
	open: boolean;
	assignOpen: boolean;
	currentClientId: string;
	type: 'add' | 'edit';
}>({
	open: false,
	assignOpen: false,
	currentClientId: '',
	type: 'add',
});
const handleSetClient = (clientId: string, type: 'edit' | 'add') => {
	manager.type = type;
	manager.currentClientId = clientId;
	manager.open = true;
};
const assignAuthority = (clientId: string) => {
	manager.currentClientId = clientId;
	manager.assignOpen = true;
};
</script>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
