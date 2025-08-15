<template>
	<a-table
		row-key="uuid"
		size="small"
		bordered
		table-layout="fixed"
		:pagination="false"
		:columns="columns"
		:data-source="tableData"
		:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
	>
		<template #emptyText>
			<m-empty size="small" />
		</template>
		<template #title>
			<div class="flex justify-between">
				<div class="leading-8"><a-badge status="processing" />绑定行业</div>
				<a-button v-if="selectedRowKeys.length === 0" type="link" @click="tableData.push(initDomainIndustry())">
					<i class="bi bi-plus-circle mr-1"></i>添加一项
				</a-button>
				<a-button v-else type="text" danger @click="handleRemoveSelect">
					<template #icon><i class="bi bi-trash3 text-base"></i></template>
				</a-button>
			</div>
		</template>
		<template #bodyCell="{ column, record }: TableRow<DomainIndustry>">
			<template v-if="column.key === 'selectIndustry'">
				<a-cascader
					v-model:value="record.data"
					:options="options"
					class="w-full"
					:allow-clear="false"
					:show-search="{ filter }"
					@change="
						(_e, p) => {
							handleChange(p as Industry[], record as DomainIndustry);
						}
					"
				/>
			</template>
		</template>
	</a-table>
</template>

<script setup lang="ts">
import { getIndustryTree } from '@/axios';
import { Industry } from '@/view/base/code/industry/config.ts';
import { DomainIndustry, initDomainIndustry } from '@/view/admin/domain/config.ts';
import { Key } from 'ant-design-vue/es/_util/type';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import _ from 'lodash';

const emit = defineEmits(['update']);
const columns = reactive<TableColumns<DomainIndustry>>([{ key: 'selectIndustry', title: '关联行业' }]);
const props = defineProps<{
	pageType: 'create' | 'edit' | 'view';
	dataInfo: DomainIndustry[][];
}>();
const filter: ShowSearchType['filter'] = (inputValue, path) => {
	return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};
const tableData = ref<DomainIndustry[]>([]);
let finalData: any = [];
const selectedRowKeys = ref<Key[]>([]);
const onSelectChange = (_selectedRowKeys: Key[], _selectedRows: DomainIndustry[]) => {
	selectedRowKeys.value = _selectedRowKeys;
};
const handleRemoveSelect = () => {
	tableData.value = tableData.value.filter((item) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	finalData = finalData.filter((item: DomainIndustry) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	selectedRowKeys.value = [];
	const finalDataList = finalData.map((item: DomainIndustry) => item.data);
	emit('update', finalDataList);
};

const handleChange = (p: Industry[], record: DomainIndustry) => {
	let templateVar = _.cloneDeep(record);
	templateVar.data = [];
	if (p) {
		for (let i = 0; i < p.length; i++) {
			const industry = {
				code: p[i].code,
				id: p[i].id,
				parentCode: p[i].parentCode,
				name: p[i].name,
				data: [],
				description: p[i].description,
				uuid: '',
			};
			templateVar.data.push(industry);
		}
		finalData.push(templateVar);
		const finalDataList = finalData.map((item: DomainIndustry) => item.data);
		emit('update', finalDataList);
	} else {
		templateVar.data = [];
		record.data = [];
	}
};

const options = ref<Industry[]>([]);

onMounted(() => {
	getIndustryTree().then((res) => {
		options.value = res.data;
		if (props.pageType === 'edit') {
			props.dataInfo.forEach((item) => {
				const initData = initDomainIndustry();
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
