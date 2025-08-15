<script setup lang="ts">
import { bandWord, deleteTemplateFile, fetchTemplateFileList } from '@/axios';
import { columns, initQueryTemplateFile, initTemplateFile, QueryTemplateFile, TemplateFile } from './config';
import TemplateAdd from '@/view/template/components/template-add.vue';
import $datetime from '@/utils/datetime.ts';
import useForm from '@/hooks/useForm.ts';
import BindMenu from '@/view/template/components/bind-menu.vue';
import ViewMenu from '@/view/template/components/view-menu.vue';
import { message, Modal } from 'ant-design-vue';
import { REPORT_TYPE } from '@/view/__report';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(388);
const type = ref<number>(REPORT_TYPE.STANDARD);
const open = ref<boolean>(false);
const currentFileId = ref<string>('');
const bindOpen = ref<boolean>(false);
const viewOpen = ref<boolean>(false);
const pageType = ref<string>('add');
const createTime = ref<[string, string]>(['', '']);
const data = ref<TemplateFile[]>([]);
const templateFileItem = ref<TemplateFile>(initTemplateFile(type.value));

const customFetchData = () => {
	loading.value = true;
	const params = {
		...queryParams.value,
		startTime: createTime.value[0] ? $datetime.dateStartTime(createTime.value[0]) : undefined,
		endTime: createTime.value[1] ? $datetime.dateEndTime(createTime.value[1]) : undefined,
	};
	fetchTemplateFileList(params)
		.then((res) => {
			const { records, pageNumber, totalRow } = res.data;
			data.value = records;
			pagination.value.current = +pageNumber;
			pagination.value.total = +totalRow;
		})
		.finally(() => {
			loading.value = false;
		});
};

const { search, reset, queryParams, queryFormModel, handleTableChange } = useForm<QueryTemplateFile>(
	initQueryTemplateFile(type.value),
	customFetchData,
);

const onReset = () => {
	createTime.value = ['', ''];
	reset();
};
const onAdd = () => {
	open.value = true;
	templateFileItem.value = initTemplateFile(type.value);
};

const onEdit = (dataItem: TemplateFile) => {
	pageType.value = 'edit';
	open.value = true;
	templateFileItem.value = dataItem;
};

const onBind = (id: string) => {
	bindOpen.value = true;
	currentFileId.value = id;
};

const onUnBind = (id: string) => {
	Modal.confirm({
		title: '解绑确认',
		content: '该操作将解除该模板下所有绑定的目录，是否确认？',
		onOk() {
			const params = {
				fileTemplateId: id,
				menuIdList: [],
			};
			bandWord(params).then(() => {
				message.success('解绑成功');
				search();
			});
		},
		onCancel() {
			return;
		},
	});
};

const onAllView = () => {
	currentFileId.value = '';
	viewOpen.value = true;
};
const onView = (id: string) => {
	viewOpen.value = true;
	currentFileId.value = id;
};
const onDelete = (id: string) => {
	Modal.confirm({
		title: '删除确认',
		content: '该操作将删除该模板，是否确认？',
		onOk() {
			deleteTemplateFile(id).then(() => {
				message.success('删除成功');
				onReset();
			});
		},
		onCancel() {
			return;
		},
	});
};
</script>

<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form :model="queryFormModel">
			<template class="grid grid-cols-4 gap-x-4">
				<a-form-item name="name" label="模板名称">
					<a-input v-model:value="queryFormModel.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="version" label="版本号">
					<a-input v-model:value="queryFormModel.version" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="name" label="日期">
					<a-range-picker class="w-full" v-model:value="createTime" picker="date" />
				</a-form-item>
				<a-form-item>
					<a-space class="float-right">
						<a-button @click="onReset">重置</a-button>
						<a-button type="primary" @click="search">查询</a-button>
					</a-space>
				</a-form-item>
			</template>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="height: calc(100vh - 206px)">
		<template #title>
			<div class="card-title">课程标准模板列表</div>
		</template>
		<template #extra>
			<div>
				<a-button type="link" @click="onAllView">查看完整绑定情况</a-button>
				<a-button type="link" @click="onAdd"><i class="bi bi-plus-circle mr-1"></i>新增模板文件</a-button>
			</div>
		</template>
		<a-table
			size="small"
			:columns="columns"
			:data-source="data"
			:pagination="pagination"
			@change="handleTableChange"
			:loading="loading"
			row-key="id"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record }: TableRow<TemplateFile>">
				<template v-if="column.key === 'serial-number'">
					{{
						(pagination.current! - 1) * pagination.pageSize! +
						data.findIndex((item: TemplateFile) => item.id === record.id) +
						1
					}}
				</template>
				<template v-if="column.key === 'version'"> V{{ record.version }} </template>
				<template v-if="column.key === 'createTime'">
					{{ $datetime.format(record.createTime, 'date') }}
				</template>
				<template v-if="column.key === 'url'">
					<a-button type="link" class="px-0" @click="$download(record.fileId)">{{ record.fileName }}</a-button>
				</template>
				<template v-if="column.key === 'operation'">
					<a-space>
						<a @click="onView(record.id)">查看</a>
						<a @click="onEdit(record as TemplateFile)">编辑</a>
						<a @click="onBind(record.id)">绑定菜单</a>
						<a v-if="!record.deleteFlag" @click="onUnBind(record.id)">解绑菜单</a>
						<a v-else class="text-red-500" @click="onDelete(record.id)">删除</a>
					</a-space>
				</template>
			</template>
		</a-table>
	</a-card>
	<template-add
		v-if="open"
		:page-type="pageType"
		v-model="open"
		@success="onReset"
		:type="type"
		:template-file-item="templateFileItem"
	/>
	<bind-menu
		v-if="bindOpen"
		v-model="bindOpen"
		:type="type"
		:file-template-id="currentFileId"
		@bind-success="onReset"
	/>
	<view-menu v-if="viewOpen" v-model="viewOpen" :type="type" :file-template-id="currentFileId" />
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
