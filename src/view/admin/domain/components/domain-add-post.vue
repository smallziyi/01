<template>
	<a-table
		size="small"
		:columns="columns"
		:data-source="tableData"
		:pagination="false"
		bordered
		row-key="uuid"
		:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
		table-layout="fixed"
	>
		<template #emptyText>
			<m-empty size="small" />
		</template>
		<template #title>
			<div class="flex justify-between">
				<div class="leading-8"><a-badge status="processing" />绑定岗位</div>
				<a-button v-if="selectedRowKeys.length === 0" type="link" @click="tableData.push(initDomainPost())">
					<i class="bi bi-plus-circle mr-1"></i>添加一项
				</a-button>
				<a-button v-else danger type="text" @click="handleRemoveSelect">
					<template #icon><i class="bi bi-trash3 text-base"></i></template>
				</a-button>
			</div>
		</template>
		<template #bodyCell="{ column, record }: TableRow<DomainPost>">
			<template v-if="column.key === 'selectPost'">
				<a-cascader
					v-model:value="record.data"
					:options="options"
					class="w-full"
					:allow-clear="false"
					:show-search="{ filter }"
					@change="
						(_e, p) => {
							handleChange(p as Post[], record as DomainPost);
						}
					"
				/>
			</template>
		</template>
	</a-table>
</template>

<script setup lang="ts">
import { getPostTree } from '@/axios';
import { DomainPost, initDomainPost } from '@/view/admin/domain/config.ts';
import { Post } from '@/view/base/code/post/config.ts';
import { Key } from 'ant-design-vue/es/table/interface';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import _ from 'lodash';

const columns = reactive([{ key: 'selectPost', title: '关联岗位' }]);
const props = defineProps<{
	pageType: 'create' | 'edit' | 'view';
	dataInfo: DomainPost[][];
}>();

const emit = defineEmits(['update']);
const filter: ShowSearchType['filter'] = (inputValue, path) => {
	return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};
let finalData: any = [];
const tableData = ref<DomainPost[]>([]);
const selectedRowKeys = ref<Key[]>([]);
const onSelectChange = (_selectedRowKeys: Key[], _selectedRows: DomainPost[]) => {
	selectedRowKeys.value = _selectedRowKeys;
};
const handleRemoveSelect = () => {
	tableData.value = tableData.value.filter((item) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	finalData = finalData.filter((item: DomainPost) => {
		return !selectedRowKeys.value.includes(item.uuid);
	});
	selectedRowKeys.value = [];
	const finalDataList = finalData.map((item: DomainPost) => item.data);
	emit('update', finalDataList);
};

const handleChange = (p: Post[], record: DomainPost) => {
	let templateVar = _.cloneDeep(record);
	templateVar.data = [];
	if (p) {
		for (let i = 0; i < p.length; i++) {
			const post = {
				code: p[i].code,
				id: p[i].id,
				parentCode: p[i].parentCode,
				name: p[i].name,
				data: [],
				description: p[i].description,
				uuid: '',
			};
			templateVar.data.push(post);
		}
		finalData.push(templateVar);
		const finalDataList = finalData.map((item: DomainPost) => item.data);
		emit('update', finalDataList);
	} else {
		templateVar.data = [];
		record.data = [];
	}
};

const options = ref<Post[]>([]);
onMounted(() => {
	getPostTree().then((res) => {
		options.value = res;
		if (props.pageType === 'edit') {
			props.dataInfo.forEach((item) => {
				const initData = initDomainPost();
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
