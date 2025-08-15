<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">缴费列表</div>
		</template>
		<a-table
			:columns="columns"
			:loading="loading"
			row-key="id"
			:data-source="data"
			:pagination="pagination"
			size="small"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<Expense>">
				<template v-if="column.key === 'serial-number'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'refund'">
					<div>{{ record.refund ? '已退费' : '正常' }}</div>
				</template>
				<template v-if="column.key === 'createTime'">
					{{ dayjs(record.createTime).format('YYYY/MM/DD HH:mm:ss') }}
				</template>
			</template>
		</a-table>
	</a-card>
</template>

<script setup lang="ts">
import { columns, Expense, QueryExpenseParams } from './config.ts';
import { fetchExpenseList } from '@/axios';
import dayjs from 'dayjs';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(231);

const data = ref<Expense[]>([]);

const queryParams = ref<QueryExpenseParams>({ current: 1, pageSize: 10 });
const fetchData = () => {
	fetchExpenseList(queryParams.value).then((response) => {
		data.value = response.records;
		pagination.value.total = +response.totalRow;
		pagination.value.current = +response.pageNumber;
	});
};

onMounted(() => {
	fetchData();
});
</script>
