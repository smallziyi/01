<template>
	<a-table
		size="small"
		:pagination="false"
		table-layout="fixed"
		:columns="columns"
		:data-source="tableData"
		bordered
		row-key="uuid"
		:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
	>
		<template #emptyText>
			<m-empty size="small" />
		</template>
		<template #title>
			<div class="flex justify-between">
				<div class="leading-8"><a-badge status="processing" />绑定职业</div>
				<a-button v-if="selectedRowKeys.length === 0" type="link" @click="tableData.push(initDomainOccupation())">
					<i class="bi bi-plus-circle mr-1"></i>添加一项
				</a-button>
				<a-button v-else danger type="text" @click="handleRemoveSelect">
					<template #icon><i class="bi bi-trash3 text-base"></i></template>
				</a-button>
			</div>
		</template>
		<template #bodyCell="{ column, record }: TableRow<DomainOccupation>">
			<template v-if="column.key === 'selectOccupation'">
				<a-cascader
					v-model:value="record.data"
					:options="options"
					class="w-full"
					:allow-clear="false"
					:show-search="{ filter }"
					@change="
						(_e, p) => {
							handleChange(p as Occupation[], record as DomainOccupation);
						}
					"
				/>
			</template>
		</template>
	</a-table>
</template>

<script setup lang="ts">
import { Occupation } from '@/view/base/code/occupation/config.ts';
import { DomainOccupation, initDomainOccupation } from '@/view/admin/domain/config.ts';
import { Key } from 'ant-design-vue/es/table/interface';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import _ from 'lodash';
import { getOccupationList } from '@/axios';

const emit = defineEmits(['update']);
const props = defineProps<{
	pageType: 'create' | 'edit' | 'view';
	dataInfo: DomainOccupation[][];
}>();
const columns = ref<TableColumns<DomainOccupation>>([{ key: 'selectOccupation', title: '关联职业' }]);
const tableData = ref<DomainOccupation[]>([]);
let finalData: any = [];
const filter: ShowSearchType['filter'] = (inputValue, path) => {
	return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};
const selectedRowKeys = ref<Key[]>([]);
const onSelectChange = (_selectedRowKeys: Key[], _selectedRows: DomainOccupation[]) => {
	selectedRowKeys.value = _selectedRowKeys;
};
const handleRemoveSelect = () => {
	tableData.value = tableData.value.filter((item) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	finalData = finalData.filter((item: DomainOccupation) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	selectedRowKeys.value = [];
	const finalDataList = finalData.map((item: DomainOccupation) => item.data);
	emit('update', finalDataList);
};

const handleChange = (p: Occupation[], record: DomainOccupation) => {
	let templateVar = _.cloneDeep(record);
	templateVar.data = [];
	if (p) {
		for (let i = 0; i < p.length; i++) {
			const occupation = {
				id: p[i].id,
				code: p[i].code,
				parentCode: p[i].parentCode,
				name: p[i].name,
				description: p[i].description,
				data: [],
				uuid: '',
			};
			templateVar.data.push(occupation);
		}
		finalData.push(templateVar);
		const finalDataList = finalData.map((item: DomainOccupation) => item.data);
		emit('update', finalDataList);
	} else {
		templateVar.data = [];
		record.data = [];
	}
};
const options = ref<Occupation[]>([]);

onMounted(() => {
	getOccupationList().then((res) => {
		options.value = res;
		if (props.pageType === 'edit') {
			props.dataInfo.forEach((item) => {
				const initData = initDomainOccupation();
				initData.data = item.map((item) => item.code) as any;
				tableData.value.push(initData);
				const initData2 = _.cloneDeep(initData);
				initData2.data = [];
				initData2.data = item;
				finalData.push(initData2);
			});
		}
	});
});
</script>
