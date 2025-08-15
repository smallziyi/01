<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">岗位列表</div>
		</template>
		<div style="height: calc(100vh - 192px)">
			<a-table
				:columns="columns"
				:pagination="false"
				:data-source="data"
				size="small"
				row-key="id"
				:loading="loading"
				:scroll="{ y: calcHeight }"
			>
				<template #emptyText>
					<m-empty />
				</template>
			</a-table>
		</div>
	</a-card>
</template>

<script lang="ts" setup>
import { useTableConfig } from '@/hooks/useTableConfig.ts';

defineOptions({
	name: 'PostList',
});
import { columns, Position } from './config.ts';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { getPostTree } from '@/axios';

const { loading } = useTableConfig();

const { calcHeight } = useCalcHeight(231);
const data = ref<Position[]>([]);

const fetchData = () => {
	loading.value = true;
	getPostTree()
		.then((res) => {
			data.value = res;
		})
		.finally(() => {
			loading.value = false;
		});
};

onMounted(() => {
	fetchData();
});
</script>
