<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">专业编码列表</div>
		</template>
		<a-tabs v-if="tabsList.length > 0" v-model:activeKey="activeKey" tab-position="left" animated>
			<a-tab-pane v-for="tab in tabsList" style="height: calc(100vh - 192px)" :key="tab.value" :tab="tab.label">
				<a-table
					:data-source="dataSource[activeKey]"
					:columns="columns"
					:loding="loading"
					row-key="code"
					size="small"
					:scroll="{ y: calcHeight }"
				>
					<template #emptyText>
						<m-empty />
					</template>
					<!-- <template #bodyCell="{ column, record }">
						<template v-if="column.key === 'disable'">
							<a-badge :status="record.disabled ? 'error' : 'success'" />{{ record.disable ? '停用' : '启用' }}
						</template>
						<template v-if="column.key === 'action'">
							<span>
								<a v-if="record.disable" @click="handleChange(record as Major)">启用</a>
								<a v-else @click="handleChange(record as Major)">停用</a>
							</span>
						</template>
					</template> -->
				</a-table>
			</a-tab-pane>
		</a-tabs>
	</a-card>
</template>
<script lang="ts" setup>
import { columns } from './config';

const { loading } = useTableConfig();

import { Major } from '@/view/base/code/major/config.ts';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';
import { getMajorList } from '@/axios';

const { calcHeight } = useCalcHeight(271);

defineOptions({
	name: 'MajorManager',
});

onMounted(() => {
	fetchData();
});

const activeKey = ref<'A' | 'B' | 'C'>('A');
const tabsList = ref<Option[]>([
	{ label: '中等职业教育专业', value: 'A' },
	{ label: '高等职业教育专科专业', value: 'B' },
	{ label: '高等职业教育本科专业', value: 'C' },
]);

const dataSource = ref<{ A: Major[]; B: Major[]; C: Major[] }>({ A: [], B: [], C: [] });

// 获取列表数据
const fetchData = () => {
	loading.value = true;
	getMajorList()
		.then((response) => {
			response.data.map((item) => {
				if (item.code === 'A') {
					dataSource.value.A = item.children;
				} else if (item.code === 'B') {
					dataSource.value.B = item.children;
				} else if (item.code === 'C') {
					dataSource.value.C = item.children;
				}
			});
		})
		.finally(() => {
			loading.value = false;
		});
};
</script>
<style scoped></style>
