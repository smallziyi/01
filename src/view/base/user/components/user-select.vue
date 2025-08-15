<script setup lang="ts">
import { fetchSchoolUserList, fetchRoleDrop } from '@/axios';
import { PaginationProps } from 'ant-design-vue';
import type { RadioChangeEvent } from 'ant-design-vue/es/radio/interface';
import { Key } from 'ant-design-vue/es/table/interface';

const open = defineModel('open', { required: true, type: Boolean });
const props = defineProps<{
	clientId: string;
	disable: Array<string>;
	selected: Array<string>;
	selectRole?: Array<string>;
}>();

onMounted(() => {
	fetchRoleDrop(props.clientId, props.selectRole).then((res) => {
		roleList.value = res;
		selectParams.value.roleId = roleList.value[0].value as string;
		fetchUserList();
	});
});
const roleList = ref<Array<Option>>([]);

const selectParams = ref({
	roleId: '',
	clientId: props.clientId,
	name: '',
	number: '',
	phone: '',
	pageSize: 10,
	current: 1,
	disable: false,
});
const columns: TableColumns<User> = [
	{ key: 'index', title: '序号', width: 60 },
	{ key: 'name', dataIndex: 'name', title: '姓名' },
	{ key: 'number', dataIndex: 'number', title: '工号' },
	{ key: 'phone', dataIndex: 'phone', title: '手机号' },
	{ key: 'idCard', dataIndex: 'idCard', title: '身份证号' },
];
const data = ref<Array<User>>([]);
const pagination = ref<PaginationProps>({
	total: 0,
	current: 1,
	showSizeChanger: false,
	hideOnSinglePage: true,
	onChange(page, _pageSize) {
		selectParams.value.current = page;
		fetchUserList();
	},
});

const fetchUserList = () => {
	loading.value = true;
	fetchSchoolUserList(selectParams.value)
		.then((res) => {
			data.value = res.records;
			pagination.value.total = +res.totalRow;
			pagination.value.current = +res.pageNumber;
		})
		.finally(() => {
			loading.value = false;
		});
};

const handleRoleChange = (_e: RadioChangeEvent) => {
	selectParams.value.current = 1;
	fetchUserList();
};
const loading = ref(false);

const handleSelect = () => {
	selectParams.value.current = 1;
	fetchUserList();
};
const handleReset = () => {
	selectParams.value.name = '';
	selectParams.value.number = '';
	selectParams.value.phone = '';
	selectParams.value.current = 1;
	fetchUserList();
};

const state = reactive({
	selectedRowKeys: [] as Array<Key>,
	selectedRows: [] as Array<User>,
});
const onSelectChange = (selectedRowKeys: Key[], selectedRows: User[]) => {
	state.selectedRowKeys = [...new Set(selectedRowKeys)];
	// 根据 id 去重 selectedRows
	state.selectedRows = selectedRows.reduce<User[]>((acc, current) => {
		const x = acc.find((item) => item.id === current.id);
		if (!x) {
			return acc.concat([current]);
		} else {
			return acc;
		}
	}, []);
};

const emit = defineEmits(['select']);
const handleSubmit = () => {
	emit('select', {
		keys: state.selectedRowKeys.filter((item) => !props.disable.includes(item as string)),
		records: state.selectedRows.filter((item) => item && !props.disable.includes(item.id)),
	});
};
</script>

<template>
	<a-modal v-if="open" v-model:open="open" title="人员选择" width="800px" @ok="handleSubmit">
		<div class="space-y-4">
			<a-radio-group button-style="solid" v-model:value="selectParams.roleId" @change="handleRoleChange">
				<a-radio-button v-for="item in roleList" :value="item.value">{{ item.label }}</a-radio-button>
			</a-radio-group>
			<div class="flex justify-between">
				<a-space>
					<a-input class="w-40" v-model:value="selectParams.name" allow-clear placeholder="姓名"></a-input>
					<a-input class="w-40" v-model:value="selectParams.number" allow-clear placeholder="工号"></a-input>
					<a-input class="w-40" v-model:value="selectParams.phone" allow-clear placeholder="手机号"></a-input>
				</a-space>
				<a-space>
					<a-button @click="handleReset">重置</a-button>
					<a-button type="primary" @click="handleSelect">查询</a-button>
				</a-space>
			</div>
			<a-table
				bordered
				row-key="id"
				:loading="loading"
				size="small"
				:columns="columns"
				:data-source="data"
				:pagination="pagination"
				:filter-multiple="false"
				:row-selection="{
					selectedRowKeys: [...state.selectedRowKeys, ...selected],
					onChange: onSelectChange,
					getCheckboxProps: (record: User) => {
						return { disabled: disable.includes(record.id) || selected.includes(record.id) };
					},
					preserveSelectedRowKeys: true,
				}"
			>
				<template #emptyText>
					<m-empty size="small" />
				</template>
				<template #bodyCell="{ column, index }: TableRow<User>">
					<template v-if="column.key === 'index'">
						{{ (pagination.current! - 1) * 10 + index + 1 }}
					</template>
				</template>
				<template #summary>
					<a-table-summary>
						<a-table-summary-row>
							<a-table-summary-cell :col-span="6">
								<div class="leading-6">已选 {{ new Set([...state.selectedRowKeys, ...selected]).size }} 人</div>
							</a-table-summary-cell>
						</a-table-summary-row>
					</a-table-summary>
				</template>
			</a-table>
		</div>
	</a-modal>
</template>
