<script setup lang="ts">
import { fetchSchoolUserList, updateDisable } from '@/axios';
import { columns, initUserTypeQuery, UserTypeQuery } from '@/view/base/user/schoolUser.ts';
import { message } from 'ant-design-vue';
import useForm from '@/hooks/useForm.ts';
import usePage from '@/hooks/usePage.ts';
import UserAdd from '@/view/base/user/components/user-add.vue';
import UserAddBatch from '@/view/base/user/components/user-add-batch.vue';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import MBreadcrumb from '@/components/m-breadcrumb.vue';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { loading, pagination } = useTableConfig();
const { calcHeight } = useCalcHeight(388);

const data = ref<Array<User>>([]);
const customFetchData = () => {
	loading.value = true;
	fetchSchoolUserList(queryParams.value)
		.then((res) => {
			data.value = res.records;
			pagination.value.total = +res.totalRow;
			pagination.value.current = +res.pageNumber;
		})
		.finally(() => {
			loading.value = false;
		});
};
const { queryParams, queryFormModel, reset, search, handleTableChange } = useForm<UserTypeQuery>(
	initUserTypeQuery('company'),
	customFetchData,
);
const { state, onCreate } = usePage();
const handleUpdateDisable = (record: User) => {
	updateDisable({ userIds: [record.id], disable: !record.disable }).then(() => {
		record.disable = !record.disable;
		message.success('操作成功');
	});
};
</script>

<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form :model="queryFormModel">
			<template class="grid grid-cols-4 gap-x-4">
				<a-form-item label="姓名">
					<a-input v-model:value="queryFormModel.name" placeholder="请输入" allow-clear></a-input>
				</a-form-item>
				<a-form-item label="编号">
					<a-input v-model:value="queryFormModel.number" placeholder="请输入" allow-clear></a-input>
				</a-form-item>
				<a-form-item label="手机号">
					<a-input v-model:value="queryFormModel.phone" placeholder="请输入" allow-clear></a-input>
				</a-form-item>
				<a-form-item>
					<a-space class="float-right">
						<a-button @click="reset">重置</a-button>
						<a-button type="primary" @click="search">查询</a-button>
					</a-space>
				</a-form-item>
			</template>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 206px)">
		<template #title>
			<div class="card-title">企业人员列表</div>
		</template>
		<template #extra>
			<user-add-batch user-type="company" @success="reset"></user-add-batch>
			<a-button type="link" @click="onCreate">
				<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" />新增</div>
			</a-button>
		</template>
		<a-table
			size="small"
			:columns="columns"
			:pagination="pagination"
			:data-source="data"
			:loading="loading"
			@change="handleTableChange"
			table-layout="auto"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<User>">
				<template v-if="column.key === 'index'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'birthday'">
					{{ record.birthday ? new Date().getFullYear() - new Date(record.birthday).getFullYear() : '' }}
				</template>
				<template v-if="column.key === 'gender'">{{ record.gender === 0 ? '女' : record.gender === 1 ? '男' : '' }}</template>
				<template v-if="column.key === 'disable'">
					<div v-if="record.disable"><a-badge status="error" />停用</div>
					<div v-else><a-badge status="success" />启用</div>
				</template>
				<template v-if="column.key === 'operation'">
					<a-button v-if="!record.disable" type="link" @click="handleUpdateDisable(record as User)">停用</a-button>
					<a-button type="link" v-else @click="handleUpdateDisable(record as User)">启用</a-button>
				</template>
			</template>
		</a-table>
	</a-card>
	<user-add v-if="state.createOpen" role-code="company" v-model:open="state.createOpen" @success="reset" />
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
