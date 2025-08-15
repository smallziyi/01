<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form ref="formRef" :model="queryFormModel">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item name="id" label="用户名称">
					<a-input v-model:value="queryFormModel.name" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item name="roleId" label="角色名称">
					<a-select v-model:value="queryFormModel.roleId" :options="roleNameOptions" allow-clear placeholder="请选择" />
				</a-form-item>
				<a-form-item name="number" label="工号/学号">
					<a-input v-model:value="queryFormModel.number" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item name="disable" label="启用状态">
					<a-select v-model:value="queryFormModel.disable" placeholder="请选择" :options="disabledList" allow-clear />
				</a-form-item>
			</div>
		</a-form>
		<div class="float-right">
			<a-space>
				<a-button @click="reset">重置</a-button>
				<a-button type="primary" @click="search">查询</a-button>
			</a-space>
		</div>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="height: calc(100vh - 261px)" size="small">
		<template #title>
			<div class="card-title">用户列表</div>
		</template>
		<template #extra>
			<div class="flex items-center">
				<a-button
					type="link"
					@click="batchUpdateDisable(selectedRowKeys, false, true)"
					:disabled="batchDisableButton"
					class="flex items-center"
				>
					<template #icon>
						<enable-svg class="mr-1" />
					</template>
					批量启用
				</a-button>
				<a-button
					type="link"
					@click="batchUpdateDisable(selectedRowKeys, true, true)"
					:disabled="batchDisableButton"
					class="flex items-center"
				>
					<template #icon>
						<disable-svg class="mr-1" />
					</template>
					批量停用
				</a-button>
				<a-button type="link" @click="onAdd">
					<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" />新增用户</div>
				</a-button>
			</div>
		</template>
		<a-table
			ref="roleTable"
			size="small"
			:columns="columns"
			:data-source="dataSource"
			:pagination="pagination"
			:loading="loading"
			@change="handleTableChange"
			:row-selection="{ selectedRowKeys, onChange: onSelectChange }"
			row-key="id"
			:scroll="{ y: calcHeight }"
		>
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
					<a-space>
						<a-button class="px-0" type="link" @click="onDetail(record as User)">查看</a-button>
						<a-button class="px-0" type="link" @click="onEdit(record as User)">编辑</a-button>
						<a-button
							v-if="!record.roleNameArray.includes('学校后台管理员')"
							class="px-0"
							type="link"
							@click="batchUpdateDisable([record.id], !record.disable, false)"
						>
							{{ record.disable ? '启用' : '停用' }}
						</a-button>
					</a-space>
				</template>
			</template>
			<template #emptyText>
				<m-empty />
			</template>
		</a-table>
	</a-card>
	<user-add v-if="drawerAddOpen" v-model="drawerAddOpen" :client-id="user!.clientId" @save-success="refreshData" />
	<user-edit
		v-if="drawerEditOpen"
		v-model="drawerEditOpen"
		:client-id="user!.clientId"
		:current-detail-info="currentDetailInfo"
		@save-success="refreshData"
	/>
	<user-detail v-if="drawerDetailOpen" v-model="drawerDetailOpen" :current-detail-info="currentDetailInfo" />
</template>

<script lang="ts" setup>
import { columns, disabledList, initUserQuery, UserQueryParams } from '@/view/cloud/user/config.ts';
import { fetchUserDrop, fetchUserList, updateDisable } from '@/axios';
import { message, Modal } from 'ant-design-vue';
import DisableSvg from '@/assets/icons/disable.svg';
import EnableSvg from '@/assets/icons/enable.svg';
import { initUser } from '@/view/base/user/schoolUser.ts';
import useForm from '@/hooks/useForm.ts';
import UserAdd from '@/view/cloud/user/components/user-add.vue';
import UserEdit from '@/view/cloud/user/components/user-edit.vue';
import UserDetail from '@/view/cloud/user/components/user-detail.vue';
import MEmpty from '@/components/m-empty.vue';
import useCalcHeight from '@/hooks/useCalcHeight';
import MBreadcrumb from '@/components/m-breadcrumb.vue';
import { useTableConfig } from '@/hooks/useTableConfig.ts';
import useUserStore from '@/store/modules/useUserStore.ts';
import { Icon } from '@iconify/vue';
const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(412);
const { user } = useUserStore();
// 获取列表数据
const customFetchData = () => {
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
const { queryParams, queryFormModel, reset, search, handleTableChange } = useForm<UserQueryParams>(
	initUserQuery(),
	customFetchData,
);
const dataSource = ref<User[]>([]);

const selectedRowKeys = ref<string[]>([]);
const selectedRows = ref<User[]>([]);
const drawerAddOpen = ref<boolean>(false);
const drawerEditOpen = ref<boolean>(false);
const drawerDetailOpen = ref<boolean>(false);
const currentDetailInfo = ref<User>(initUser('admin'));
const roleNameOptions = ref<Option[]>([]);

const batchDisableButton = computed(() => {
	return selectedRowKeys.value.length === 0;
});

// 获取角色名称下拉
const fetchUserDropList = (clientId: string) => {
	fetchUserDrop(clientId).then((res) => {
		roleNameOptions.value = res;
	});
};

// 复选框选择
const onSelectChange = (value: Key[], selectRows: User[]) => {
	selectedRowKeys.value = value as string[];
	selectedRows.value = selectRows;
};

const onAdd = () => {
	currentDetailInfo.value = initUser('admin');
	drawerAddOpen.value = true;
};

const onEdit = (item: User) => {
	currentDetailInfo.value = item;
	drawerEditOpen.value = true;
};

const onDetail = (item: User) => {
	currentDetailInfo.value = item;
	drawerDetailOpen.value = true;
};

// 更新启用状态
const batchUpdateDisable = async (userIds: string[], disable: boolean, isBatch: boolean) => {
	if (disable) {
		Modal.confirm({
			title: '停用',
			content: `该操作将对已选用户进行${isBatch ? '批量' : ''}停用，停用后相关用户将不可用，确定操作吗？`,
			okText: '停用',
			cancelText: '取消',
			onOk() {
				updateDisable({ userIds, disable }).then(() => {
					message.success(`${isBatch ? '批量' : ''}停用成功！`);
					refreshData();
				});
			},
			onCancel() {
				return;
			},
		});
	} else {
		updateDisable({ userIds, disable }).then(() => {
			message.success(`${isBatch ? '批量' : ''}启用成功！`);
			refreshData();
		});
	}
};

const refreshData = () => {
	reset();
	selectedRowKeys.value = [];
};
onMounted(() => {
	fetchUserDropList(user.value!.clientId);
});
</script>
