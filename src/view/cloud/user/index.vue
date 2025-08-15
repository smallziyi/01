<template>
	<a-card :bodyStyle="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form ref="formRef" :model="queryParams">
			<template class="grid grid-cols-4 gap-4">
				<a-form-item name="id" label="用户名称">
					<a-input v-model:value="queryParams.name" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item name="roleId" label="角色名称">
					<a-select v-model:value="queryParams.roleId" :options="roleNameOptions" allow-clear placeholder="请选择" />
				</a-form-item>
				<a-form-item name="number" label="工号/学号">
					<a-input v-model:value="queryParams.number" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item name="disable" label="启用状态">
					<a-select v-model:value="queryParams.disable" placeholder="请选择" :options="disabledList" allow-clear />
				</a-form-item>
			</template>
		</a-form>
		<div class="float-right">
			<a-space>
				<a-button @click="fetchData(activeKey, true)">重置</a-button>
				<a-button type="primary" @click="search">查询</a-button>
			</a-space>
		</div>
	</a-card>
	<a-card :bodyStyle="{ padding: '16px' }" :bordered="false" style="height: calc(100vh - 262px)">
		<a-tabs v-model:activeKey="activeKey" style="height: calc(100vh - 294px)" tab-position="left" size="small">
			<a-tab-pane v-for="client in allClientList" :key="client.value" :tab="client.label">
				<a-table
					ref="roleTable"
					size="small"
					:columns="columns"
					:data-source="dataSource"
					:pagination="pagination"
					:loading="loading"
					@change="handleTableChange"
					row-key="id"
					:scroll="{ y: calcHeight }"
				>
					<template #emptyText>
						<m-empty />
					</template>
					<template #bodyCell="{ column, record, index }: TableRow<User>">
						<template v-if="column.key === 'serial-number'">
							{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
						</template>
						<template v-if="column.key === 'roles'">
							<span>{{ record.roleNameArray }}</span>
						</template>
						<template v-if="column.key === 'birthday'">
							{{ record.birthday ? new Date().getFullYear() - new Date(record.birthday).getFullYear() : '' }}
						</template>
						<template v-if="column.key === 'gender'">
							<span>{{ record.gender === 0 ? '女' : record.gender === 1 ? '男' : '' }}</span>
						</template>
						<template v-if="column.key === 'disable'">
							<div v-if="record.disable"><a-badge status="error" />停用</div>
							<div v-else><a-badge status="success" />启用</div>
						</template>
						<template v-if="column.key === 'operation'">
							<a-button type="link" @click="onDetail(record as User)">查看</a-button>
						</template>
					</template>
				</a-table>
			</a-tab-pane>
		</a-tabs>
	</a-card>
	<user-detail v-if="drawerDetailOpen" v-model="drawerDetailOpen" :current-detail-info="currentDetailInfo" />
</template>

<script lang="ts" setup>
import { columns, disabledList, initUserQuery, UserQueryParams } from './config.ts';
import { type TablePaginationConfig } from 'ant-design-vue';
import { initUser } from '@/view/base/user/schoolUser.ts';
import UserDetail from './components/user-detail.vue';
import useClient from '@/hooks/useClient.ts';
import useCalcHeight from '@/hooks/useCalcHeight';
import MBreadcrumb from '@/components/m-breadcrumb.vue';
import { useTableConfig } from '@/hooks/useTableConfig.ts';
import { fetchUserDrop, fetchUserList } from '@/axios';

const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(332);

const { allClientList } = useClient('user');

const queryParams = ref<UserQueryParams>(initUserQuery());
const dataSource = ref<User[]>([]);

const activeKey = ref<string>('1');
const drawerDetailOpen = ref<boolean>(false);
const currentDetailInfo = ref<User>(initUser('admin'));
const roleNameOptions = ref<Option[]>([]);
// 获取列表数据
const fetchData = (clientId: string, reset?: boolean) => {
	if (reset) {
		queryParams.value = initUserQuery();
	}
	queryParams.value.clientId = clientId;
	loading.value = true;
	fetchUserList(queryParams.value)
		.then((res) => {
			const { pageNumber, totalRow, records } = res;
			pagination.value.current = +pageNumber;
			pagination.value.total = +totalRow;
			dataSource.value = records;
		})
		.finally(() => {
			loading.value = false;
		});
};

// 获取角色名称下拉
const fetchUserDropList = (clientId: string) => {
	fetchUserDrop(clientId).then((res) => {
		roleNameOptions.value = res;
	});
};

const onDetail = (item: User) => {
	drawerDetailOpen.value = true;
	currentDetailInfo.value = item;
};

// 查询
const search = () => {
	queryParams.value.current = 1;
	fetchData(activeKey.value);
};

const handleTableChange = (_pagination: TablePaginationConfig) => {
	queryParams.value.current = _pagination.current!;
	queryParams.value.pageSize = _pagination.pageSize!;
	fetchData(activeKey.value);
};

watch(
	activeKey,
	(value) => {
		fetchData(value);
		fetchUserDropList(value);
	},
	{ immediate: true },
);
</script>
