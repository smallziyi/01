<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form :model="queryFormModel">
			<template class="grid grid-cols-4 gap-x-4">
				<a-form-item label="职务名称">
					<a-input v-model:value="queryFormModel.name" placeholder="请输入" allow-clear />
				</a-form-item>
				<a-form-item label="职务类型">
					<a-select v-model:value="queryFormModel.type" :options="PostTypeOptions" allow-clear placeholder="请选择" />
				</a-form-item>
				<a-form-item label="启用状态">
					<a-select v-model:value="queryFormModel.disable" :options="disableOptions" allow-clear placeholder="请选择" />
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
			<div class="card-title">职务列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="onCreate">
				<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" />新增</div>
			</a-button>
		</template>
		<a-table
			size="small"
			:loading="loading"
			row-key="id"
			:columns="columns"
			:data-source="tableData"
			:pagination="pagination"
			@change="handleTableChange"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<Post>">
				<template v-if="column.key === 'serial-number'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'type'"> {{ ['未知', '部门职务', '教研室职务'][record.type] }} </template>
				<template v-if="column.key === 'disable'">
					<div v-if="!record.disable"><a-badge status="success" />启用</div>
					<div v-else><a-badge status="error" />停用</div>
				</template>
				<template v-if="column.key === 'operation'">
					<a-button class="px-0" type="link" @click="updateStatus(record.id)">
						{{ record.disable ? '启用' : '停用' }}
					</a-button>
				</template>
			</template>
		</a-table>
	</a-card>
	<post-add v-if="state.createOpen" v-model:open="state.createOpen" @success="reset" />
	<post-edit v-if="state.updateOpen" v-model:open="state.updateOpen" @success="reset" />
</template>

<script setup lang="ts">
import { columns, disableOptions, initPostQuery, Post, PostTypeOptions, QueryPostParams } from './config.ts';
import { fetchPostData, updatePostDisable } from '@/axios';
import useForm from '@/hooks/useForm.ts';
import usePage from '@/hooks/usePage.ts';
import { message } from 'ant-design-vue';
import PostAdd from '@/view/admin/post/components/post-add.vue';
import PostEdit from '@/view/admin/post/components/post-edit.vue';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { loading, pagination } = useTableConfig();
const { calcHeight } = useCalcHeight(388);
const tableData = ref<Post[]>([]);
const customFetchData = () => {
	loading.value = true;
	fetchPostData(queryParams.value)
		.then((res) => {
			tableData.value = res.records;
			pagination.value.total = +res.totalRow;
			pagination.value.current = +res.pageNumber;
		})
		.finally(() => {
			loading.value = false;
		});
};
const { queryParams, queryFormModel, reset, search, handleTableChange } = useForm<QueryPostParams>(
	initPostQuery,
	customFetchData,
);
const { state, onCreate } = usePage();

const updateStatus = (id: string) => {
	updatePostDisable(id).then(() => {
		message.success('操作成功');
		reset();
	});
};
</script>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
