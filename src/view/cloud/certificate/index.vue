<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">资格证书列表</div>
		</template>
		<a-table
			row-key="id"
			:columns="columns"
			:data-source="data"
			size="small"
			:pagination="pagination"
			@change="handleTableChange"
			:loading="loading"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record }: TableRow<Certificate>">
				<template v-if="column.key === 'type'">
					<div v-if="record.type === 1">职业资格证书</div>
					<div v-if="record.type === 2">职业技能等级证书</div>
				</template>
				<template v-if="column.key === 'disable'">
					<a-badge :status="!record.disable ? 'success' : 'error'" />
					{{ record.disable ? '禁用' : '启用' }}
				</template>
				<template v-if="column.key === 'operation'">
					<a @click="updateDisable(record.id)">
						<span :class="record.disable ? 'text-blue-400' : 'text-orange-400'">
							{{ record.disable ? '启用' : '禁用' }}
						</span>
					</a>
				</template>
			</template>
		</a-table>
	</a-card>
</template>

<script lang="ts" setup>
import { useTableConfig } from '@/hooks/useTableConfig.ts';

defineOptions({
	name: 'CertificateList',
});
import { columns, queryCertificateParams } from './config.ts';
import { fetchCertificateList, updateCertificateStatus } from '@/axios';
import { message, TablePaginationConfig } from 'ant-design-vue';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { Certificate } from '@/view/base/code/certificate/config.ts';

const { loading, pagination } = useTableConfig();
const { calcHeight } = useCalcHeight(271);
const data = ref<Certificate[]>([]);

const handleTableChange = (_pagination: TablePaginationConfig) => {
	queryCertificateParams.value.current = _pagination.current!;
	queryCertificateParams.value.pageSize = _pagination.pageSize!;
	fetchData();
};

const fetchData = () => {
	loading.value = true;
	fetchCertificateList(queryCertificateParams.value)
		.then((res) => {
			data.value = res.records;
			pagination.value.current = +res.pageNumber;
			pagination.value.pageSize = +res.pageSize;
			pagination.value.total = +res.totalRow;
		})
		.finally(() => {
			loading.value = false;
		});
};

const updateDisable = (id: string) => {
	updateCertificateStatus(id).then(() => {
		fetchData();
		message.success('修改成功');
	});
};

onMounted(() => {
	fetchData();
});
</script>
