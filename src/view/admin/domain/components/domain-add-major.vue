<template>
	<a-table
		row-key="uuid"
		:pagination="false"
		size="small"
		bordered
		:columns="columns"
		:data-source="tableData"
		:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
		table-layout="fixed"
	>
		<template #emptyText>
			<m-empty size="small" />
		</template>
		<template #title>
			<div class="flex justify-between">
				<div class="leading-8"><a-badge status="processing" />绑定专业</div>
				<a-button
					v-if="selectedRowKeys.length === 0"
					type="link"
					@click="tableData.push(initDomainMajor())"
					:disabled="!group && tableData.length === 1"
				>
					<i class="bi bi-plus-circle mr-1"></i>添加一项
				</a-button>
				<a-button v-else type="text" danger @click="handleRemoveSelect">
					<template #icon><i class="bi bi-trash3 text-base"></i></template>
				</a-button>
			</div>
		</template>
		<template #bodyCell="{ column, record }: TableRow<DomainMajor>">
			<template v-if="column.key === 'majorSelect'">
				<a-cascader
					v-model:value="record.data"
					:options="options"
					:allow-clear="false"
					:show-search="{ filter }"
					class="w-full"
					@change="
						(_e, p) => {
							handleChange(p as Major[], record as DomainMajor);
						}
					"
				/>
			</template>
			<template v-if="column.key === 'target'">
				<a-input v-model:value="record.target" class="w-full" />
			</template>
		</template>
	</a-table>
</template>

<script lang="ts" setup>
import { getMajorList } from '@/axios';
import { Major } from '@/view/base/code/major/config.ts';
import { DomainMajor, initDomainMajor } from '@/view/admin/domain/config.ts';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import { Key } from 'ant-design-vue/es/_util/type';
import _ from 'lodash';

const props = defineProps<{
	pageType: 'create' | 'edit' | 'view';
	majorData: DomainMajor[][];
}>();
const emit = defineEmits(['update']);

const group = defineModel('group', { required: true, type: Boolean });

const tableData = ref<DomainMajor[]>([]);
const columns = reactive<TableColumns<DomainMajor>>([
	{ title: '关联专业', key: 'majorSelect' },
	{ title: '专业培养方向', key: 'target', width: 200 },
]);

const options = ref<Major[]>([]);
const filter: ShowSearchType['filter'] = (inputValue, path) => {
	return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};
let stopWatchEffect: any;
let finalData: any = [];
const handleChange = (p: Major[], record: DomainMajor) => {
	let templateVar = _.cloneDeep(record);
	templateVar.data = [];
	if (p) {
		for (let i = 0; i < p.length; i++) {
			const major = {
				code: p[i].code,
				id: p[i].id,
				parentCode: p[i].parentCode,
				name: p[i].name,
				data: [],
				isMain: false,
				target: '',
				uuid: '',
			};
			templateVar.data.push(major);
		}
		finalData.push(templateVar);
	} else {
		templateVar.data = [];
		record.data = [];
	}
};

const selectedRowKeys = ref<Key[]>([]);
const onSelectChange = (_selectedRowKeys: Key[], _selectedRows: DomainMajor[]) => {
	selectedRowKeys.value = _selectedRowKeys;
};
const handleRemoveSelect = () => {
	tableData.value = tableData.value.filter((item) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	finalData = finalData.filter((item: any) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	selectedRowKeys.value = [];
};

const startWatching = () => {
	stopWatchEffect = watchEffect(() => {
		tableData.value.map((item, index) => {
			if (item.target) {
				if (item.target.trim()) {
					finalData[index].data[3].target = item.target;
					const data = finalData.map((item: DomainMajor) => item.data || []);
					emit('update', data);
				}
			}
		});
	});
};

const stopWatching = () => {
	if (stopWatchEffect) {
		stopWatchEffect();
	}
};

onMounted(() => {
	getMajorList().then((res) => {
		options.value = res.data;
		if (props.pageType === 'edit') {
			stopWatching();
			props.majorData.forEach((item) => {
				const initData = initDomainMajor();
				initData.data = item.map((i) => i.code) as any;
				initData.target = item[3].target;
				tableData.value.push(initData);
				const initData2 = _.cloneDeep(initData);
				initData2.data = [];
				initData2.data = item;
				finalData.push(initData2);
			});
			startWatching();
		} else {
			startWatching();
		}
	});
});
</script>
