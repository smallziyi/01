<template>
	<!-- <a-card>
		<a-form ref="formRef" :model="queryParams">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item name="parentCode" label="上级编码">
					<a-input v-model:value="queryParams.parentCode" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="code" label="当前编码">
					<a-input v-model:value="queryParams.code" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="name" label="职业名称">
					<a-input v-model:value="queryParams.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="disable" label="启用状态">
					<a-select v-model:value="queryParams.disable" placeholder="请选择">
						<a-select-option v-for="i in disabledList" :key="i.value" :value="i.value">{{ i.label }}</a-select-option>
					</a-select>
				</a-form-item>
			</div>
			<div class="float-right mt-4">
				<a-space>
					<a-button @click="fetchData(true)">重置</a-button>
					<a-button type="primary" @click="search">查询</a-button>
				</a-space>
			</div>
		</a-form>
	</a-card> -->
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">职业编码</div>
		</template>
		<a-table
			:data-source="dataSource"
			:columns="columns"
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
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'disable'">
					<span>
						{{ record.disable ? '停用' : '启用' }}
					</span>
				</template>
				<template v-if="column.key === 'action'">
					<span>
						<a v-if="record.disable" @click="handleChange(record as ResponseOccupationItem)">
							{{ record.disable ? '启用' : '停用' }}
						</a>
					</span>
				</template>
			</template>
		</a-table>
	</a-card>
</template>
<script lang="ts" setup>
import { useTableConfig } from '@/hooks/useTableConfig.ts';

defineOptions({
	name: 'occupationManager',
});
import { columns, initOccupation, QueryOccupationParams, ResponseOccupationItem } from './config';
import { changeStartStatus, getOccupationList } from './script';
import type { TablePaginationConfig } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import useCalcHeight from '@/hooks/useCalcHeight.ts';

const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(271);

onMounted(() => {
	fetchData();
});

const queryParams = ref<QueryOccupationParams>(initOccupation());

const dataSource = ref<ResponseOccupationItem[]>([]);

// 获取列表数据
const fetchData = (reset?: boolean) => {
	if (reset) {
		queryParams.value = initOccupation();
	}
	loading.value = true;
	getOccupationList(queryParams.value)
		.then((response) => {
			const { records, totalRow, pageNumber } = response.data;
			pagination.value.current = +pageNumber;
			pagination.value.total = +totalRow;
			dataSource.value = records;
		})
		.finally(() => {
			loading.value = false;
		});
};
// 更新数据状态
const handleChange = async (row: ResponseOccupationItem) => {
	changeStartStatus(row.id).then(() => {
		message.success('状态更新成功!');
		fetchData();
	});
};
const handleTableChange = (_pagination: TablePaginationConfig) => {
	queryParams.value.current = _pagination.current!;
	queryParams.value.pageSize = _pagination.pageSize!;
	fetchData();
};
</script>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
