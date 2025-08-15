<template>
	<a-table :columns="columns" :data-source="data" size="small" :pagination="false">
		<template #emptyText>
			<m-empty />
		</template>
		<template #title>
			<div class="flex justify-between">
				<div class="leading-8">历史缴费</div>
				<a-button @click="addExpenseVisible = true">添加缴费</a-button>
			</div>
		</template>
		<template #bodyCell="{ column, record, index }: TableRow<Expense>">
			<template v-if="column.key === 'serial-number'">
				{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
			</template>
			<template v-if="column.key === 'fileName'">
				<a-button type="link" class="">{{ record.fileName }}</a-button>
			</template>
			<template v-if="column.key === 'createTime'">
				{{ new Date(record.createTime).toLocaleString() }}
			</template>
		</template>
	</a-table>
	<expense-add
		v-if="addExpenseVisible"
		:contract-id="contractId"
		v-model:open="addExpenseVisible"
		@success="handleAddExpenseSuccess"
	/>
</template>

<script setup lang="ts">
import { Expense } from '@/view/cloud/expense/config.ts';
import { getExpenseByContractId } from '@/axios';
import ExpenseAdd from '@/view/cloud/expense/components/expense-add.vue';
import { message } from 'ant-design-vue';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { pagination } = useTableConfig();

const props = defineProps<{ contractId: string }>();
const emit = defineEmits(['update']);

const columns: TableColumns<Expense> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'payment', dataIndex: 'payment', title: '缴费金额(元)', align: 'right' },
	{ key: 'fileName', dataIndex: 'fileName', title: '收款凭证' },
	{ key: 'createUser', dataIndex: 'createUser', title: '操作员' },
	{ key: 'createTime', dataIndex: 'createTime', title: '缴费时间' },
];

const data = ref<Expense[]>([]);

const fetchData = () => {
	getExpenseByContractId(props.contractId).then((res) => {
		data.value = res.data;
	});
};

const addExpenseVisible = ref(false);
const handleAddExpenseSuccess = () => {
	message.success('缴费成功');
	getExpenseByContractId(props.contractId!).then((response) => {
		data.value = response.data;
	});
	emit('update');
};
onMounted(() => {
	fetchData();
});
</script>
