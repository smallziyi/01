<script setup lang="ts">
import { Domain } from '@/view/admin/domain/config.ts';
import { fetchDomainList } from '@/axios';

const open = defineModel('open', { required: true, type: Boolean, default: false });
const emit = defineEmits(['change']);
const props = defineProps<{ selected: string[] }>();

const columns: TableColumns<Domain> = [
	{ key: 'name', dataIndex: 'name', title: '专业(群)名称', ellipsis: true },
	{ key: 'name1', title: '专业大类', ellipsis: true },
	{ key: 'name2', title: '专业类', ellipsis: true },
	{ key: 'name3', title: '专业名称', ellipsis: true },
	{ key: 'code', title: '专业代码', width: 80 },
];

const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<Domain[]>([]);

const onSelectChange = (_selectedRowKeys: Key[], _selectedRows: Domain[]) => {
	selectedRowKeys.value = _selectedRowKeys;
	selectedRows.value = _selectedRows;
};

const handleSubmit = () => {
	emit('change', selectedRows.value);
};

const data = ref<Domain[]>([]);
onMounted(() => {
	fetchDomainList({ disable: 0 }).then((res) => {
		data.value = res.data.filter((item) => {
			return !props.selected.includes(item.id);
		});
	});
});
</script>

<template>
	<a-modal destroy-on-close v-model:open="open" title="选择专业" :width="800" @ok="handleSubmit">
		<a-table
			size="small"
			:columns="columns"
			bordered
			:data-source="data"
			:pagination="false"
			table-layout="fixed"
			row-key="id"
			:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record }: TableRow<Domain>">
				<template v-if="column.key === 'name1'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[1].name }}</div>
					</div>
				</template>
				<template v-if="column.key === 'name2'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[2].name }}</div>
					</div>
				</template>
				<template v-if="column.key === 'name3'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[3].name }}</div>
					</div>
				</template>
				<template v-if="column.key === 'code'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[3].code }}</div>
					</div>
				</template>
			</template>
		</a-table>
	</a-modal>
</template>
