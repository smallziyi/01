<template>
	<a-table
		size="small"
		table-layout="fixed"
		:pagination="false"
		row-key="uuid"
		bordered
		:data-source="tableData"
		:columns="columns"
		:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
	>
		<template #emptyText>
			<m-empty size="small" />
		</template>
		<template #title>
			<div class="flex justify-between">
				<div class="leading-8"><a-badge status="processing" />绑定证书</div>
				<a-button v-if="selectedRowKeys.length === 0" type="link" @click="tableData.push(initDomainCertificate())">
					<i class="bi bi-plus-circle mr-1"></i>添加一项
				</a-button>
				<a-button v-else danger type="text" @click="handleRemoveSelect">
					<template #icon><i class="bi bi-trash3 text-base"></i></template>
				</a-button>
			</div>
		</template>
		<template #bodyCell="{ column, record }: TableRow<DomainCertificate>">
			<template v-if="column.key === 'selectCertificate'">
				<a-select
					v-model:value="record.id"
					class="w-full"
					show-search
					:filter-option="filterOption"
					:options="option"
					@select="
						(value: RawValueType | LabelInValueType, _option: DefaultOptionType) => {
							handleSelect(value as string, record as DomainCertificate);
						}
					"
				/>
			</template>
			<template v-if="column.key === 'type'">
				<span v-if="(record as DomainCertificate).type === 1">职业资格证书</span>
				<span v-if="(record as DomainCertificate).type === 2">职业技能等级证书</span>
			</template>
		</template>
	</a-table>
</template>

<script setup lang="ts">
import { getCertificateList } from '@/axios';
import { Certificate } from '@/view/base/code/certificate/config.ts';
import { DomainCertificate, DomainPost, initDomainCertificate } from '@/view/admin/domain/config.ts';
import { Key } from 'ant-design-vue/es/table/interface';
import { DefaultOptionType } from 'ant-design-vue/es/vc-cascader';
import { LabelInValueType, RawValueType } from 'ant-design-vue/es/vc-select/Select';

const emit = defineEmits(['update']);
const props = defineProps<{
	pageType: 'create' | 'edit' | 'view';
	dataInfo: DomainCertificate[];
}>();
const tableData = ref<DomainCertificate[]>([]);
const columns = ref<TableColumns<DomainCertificate>>([
	{ key: 'selectCertificate', title: '关联证书', width: 160 },
	{ key: 'type', dataIndex: 'type', title: '证书类型' },
	{ key: 'description', dataIndex: 'description', title: '描述' },
]);
const handleRemoveSelect = () => {
	tableData.value = tableData.value.filter((item) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	selectedRowKeys.value = [];
	emit('update', tableData.value);
};
watch(tableData.value, (val) => {
	emit('update', val);
});

const selectedRowKeys = ref<Key[]>([]);
const onSelectChange = (_selectedRowKeys: Key[], _selectedRows: DomainPost[]) => {
	selectedRowKeys.value = _selectedRowKeys;
};

const handleSelect = (value: string, record: DomainCertificate) => {
	record.id = value;
	const index = allList.value.findIndex((item) => {
		return item.id === value;
	});
	record.name = allList.value[index].name;
	record.type = allList.value[index].type;
	record.description = allList.value[index].description;
};
const filterOption = (input: string, _option: any) => {
	const index = option.value.findIndex((item) => {
		return item.value === _option.value;
	});
	return option.value[index].label.includes(input);
};
const allList = ref<Certificate[]>([]);
const option = ref<Option[]>([]);
onMounted(() => {
	getCertificateList().then((res) => {
		allList.value = res;
		res.forEach((item) => {
			if (!item.disable) {
				option.value.push({
					value: item.id,
					label: item.name,
				});
			}
		});
		if (props.pageType === 'edit') {
			props.dataInfo.forEach((item) => {
				const initData = initDomainCertificate();
				const id = option.value.find((i) => i.label === item.name)?.value;
				item.id = id as string;
				Object.assign(initData, item);
				tableData.value.push(initData);
			});
		}
	});
});
</script>
