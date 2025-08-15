<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">行业列表</div>
		</template>
		<a-table
			row-key="id"
			size="small"
			:data-source="data"
			table-layout="fixed"
			:columns="columns"
			:pagination="pagination"
			@change="handleTableChange"
			:loading="loading"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
		</a-table>
	</a-card>
</template>

<script setup lang="ts">
import { fetchIndustryList } from '@/axios';
import { columns, Industry, queryParams } from './config.ts';
import { TablePaginationConfig } from 'ant-design-vue';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { calcHeight } = useCalcHeight(271);

const { loading, pagination } = useTableConfig();

const data = ref<Industry[]>([]);
const handleTableChange = (_pagination: TablePaginationConfig) => {
	queryParams.value.current = _pagination.current!;
	queryParams.value.pageSize = _pagination.pageSize!;
	fetchData();
};
// const updateStatus = (record: Industry) => {
// 	const entity = JSON.parse(JSON.stringify(record)) as Industry;
// 	entity.disable = !entity.disable;
// 	update(entity).then(() => {
// 		message.success('修改成功');
// 		fetchData();
// 	});
// };
const fetchData = () => {
	loading.value = true;
	fetchIndustryList(queryParams.value)
		.then((res) => {
			data.value = res.records;
			pagination.value.total = +res.totalRow;
			pagination.value.current = +queryParams.value.current;
			pagination.value.pageSize = +queryParams.value.pageSize;
		})
		.finally(() => {
			loading.value = false;
		});
};

onMounted(() => {
	fetchData();
});
</script>
