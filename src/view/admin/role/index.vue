<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">角色列表</div>
		</template>
		<a-table
			ref="roleTable"
			:columns="columns"
			:data-source="dataSource"
			:loading="loading"
			:pagination="false"
			row-key="id"
			size="small"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record }: TableRow<Role>">
				<template v-if="column.key === 'permissionArray'">
					{{ record.permissionArray.join('，') }}
				</template>
				<template v-if="column.key === 'disable'">
					<div v-if="record.isBasic">
						<a-badge status="processing" />
						内置
					</div>
					<div v-else>{{ record.disable ? '停用' : '启用' }}</div>
				</template>
				<template v-if="column.key === 'operation'">
					<a-space>
						<a-button class="px-0" type="link" @click="onDetail(record as Role)">查看</a-button>
						<a-button class="px-0" type="link" @click="onEdit(record as Role)">编辑</a-button>
					</a-space>
				</template>
			</template>
		</a-table>
	</a-card>

	<role-add
		v-if="drawerAddOpen"
		v-model="drawerAddOpen"
		:pageType="pageType"
		:is-cloud="false"
		:current-detail-info="currentDetailInfo"
		@save-success="refreshData"
	/>
	<role-detail v-if="drawerDetailOpen" v-model="drawerDetailOpen" :current-detail-info="currentDetailInfo" />
</template>

<script lang="ts" setup>
import RoleAdd from '@/view/cloud/role/components/role-add.vue';
import RoleDetail from '@/view/cloud/role/components/role-detail.vue';
import { columns, FetchRole, initRole, initRoleData, Role } from '@/view/cloud/role/config.ts';
import { fetchRoleList } from '@/axios';
import useCalcHeight from '@/hooks/useCalcHeight';
import { useTableConfig } from '@/hooks/useTableConfig.ts';
import useUserStore from '@/store/modules/useUserStore.ts';

const { calcHeight } = useCalcHeight(232);
const { loading } = useTableConfig();

defineOptions({
	name: 'RoleManager',
});
const queryParams = ref<FetchRole>(initRole());
const dataSource = ref<Role[]>([]);

const { user } = useUserStore();

const pageType = ref<string>('add');
const activeKey = ref<string>(user.value!.clientId);
const selectedRowKeys = ref<string[]>([]);
const drawerAddOpen = ref<boolean>(false);
const drawerDetailOpen = ref<boolean>(false);
const currentDetailInfo = ref<Role>(initRoleData());

// 获取列表数据
const fetchData = (clientId: string, reset?: boolean) => {
	if (reset) {
		queryParams.value = initRole();
	}
	queryParams.value.clientId = clientId;
	loading.value = true;
	fetchRoleList(queryParams.value)
		.then((res) => {
			dataSource.value = res;
		})
		.finally(() => {
			loading.value = false;
		});
};

const onEdit = (item: Role) => {
	pageType.value = 'edit';
	drawerAddOpen.value = true;
	currentDetailInfo.value = item;
};

const onDetail = (item: Role) => {
	drawerDetailOpen.value = true;
	currentDetailInfo.value = item;
};

const refreshData = () => {
	fetchData(activeKey.value);
	selectedRowKeys.value = [];
};

watch(
	activeKey,
	(value) => {
		fetchData(value);
	},
	{ immediate: true },
);
</script>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
