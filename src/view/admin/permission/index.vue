<script setup lang="ts">
import { getDropPermissionType, getPermissionList } from '@/axios';
import { Permission } from '@/view/base/permission/config.ts';
import useCalcHeight from '@/hooks/useCalcHeight';

const { calcHeight } = useCalcHeight(232);

const activeTab = ref<number>(0);

const data = ref<Array<Permission>>([]);

const columns: TableColumns<any> = [
	{ key: 'serialNumber', title: '', width: 60 },
	{ key: 'name', title: '菜单名称', dataIndex: 'name' },
	{ key: 'code', title: '菜单代码', dataIndex: 'code' },
	{ key: 'iconFileUrl', title: '图标', dataIndex: 'iconFileUrl' },
];

const fetchData = () => {
	getPermissionList({ type: activeTab.value }).then((res) => {
		data.value = res.data;
	});
};

onMounted(() => {
	getDropPermissionType().then((res) => {
		tabsList.value = res;
		activeTab.value = tabsList.value[0].value as number;
	});
});

watch(activeTab, () => {
	fetchData();
});

const tabsList = ref<Option[]>([]);
</script>

<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">权限树结构</div>
		</template>
		<a-tabs v-model:activeKey="activeTab" tab-position="left" animated>
			<a-tab-pane v-for="tab in tabsList" style="height: calc(100vh - 192px)" :key="tab.value" :tab="tab.label">
				<a-table
					:columns="columns"
					:data-source="data"
					:pagination="false"
					bordered
					row-key="id"
					size="small"
					:scroll="{ y: calcHeight }"
				>
					<template #emptyText>
						<m-empty />
					</template>
					<template #bodyCell="{ column, record }: TableRow<Permission>">
						<template v-if="column.key === 'iconFileUrl' && record.iconFileUrl">
							<a-image :src="(record as Permission).iconFileUrl" width="28px" />
						</template>
					</template>
				</a-table>
			</a-tab-pane>
		</a-tabs>
	</a-card>
</template>
