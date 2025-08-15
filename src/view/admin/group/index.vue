<template>
	<a-card size="small" :body-style="{ padding: '16px' }" :bordered="false">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<div class="grid grid-cols-4 gap-4">
			<a-form-item name="collegeId" label="所属院系">
				<a-select v-model:value="queryParams.collegeId" placeholder="请输入" :options="filterOptions.collegeOptions" />
			</a-form-item>
			<a-form-item name="domainId" label="所属专业">
				<a-select v-model:value="queryParams.domainId" placeholder="请选择" :options="filterOptions.majorOptions" />
			</a-form-item>
			<a-form-item name="name" label="班级名称">
				<a-input v-model:value="queryParams.name" placeholder="请输入" />
			</a-form-item>
			<a-form-item name="disable" label="启用状态">
				<a-select v-model:value="queryParams.disable" placeholder="请选择" :options="disabledList" />
			</a-form-item>
		</div>
		<div class="float-right">
			<a-space>
				<a-button type="default" @click="fetchData(true)">重置</a-button>
				<a-button type="primary" @click="search">查询</a-button>
			</a-space>
		</div>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="height: calc(100vh - 262px)">
		<template #title>
			<div class="card-title">班级列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="openCreate = true"><i class="bi bi-plus-circle mr-1"></i>添加班级</a-button>
		</template>
		<a-table
			:columns="columns"
			:data-source="data"
			:loading="loading"
			:pagination="pagination"
			size="small"
			:scroll="{ y: calcHeight }"
		>
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<Group>">
				<template v-if="column.key === 'serial-number'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'year'"> {{ record.year }}级</template>
				<template v-if="column.key === 'grade'">
					{{ gradeList.find((item) => item.value === record.grade)?.label ?? '' }}
				</template>
				<template v-if="column.key === 'teacherCount'"> {{ record.teacherCount }}人</template>
				<template v-if="column.key === 'studentCount'"> {{ record.studentCount }}人</template>
				<template v-if="column.key === 'disable'">
					<a-badge :status="record.disable ? 'error' : 'success'" />
					{{ record.disable ? '停用' : '启用' }}
				</template>
				<template v-if="column.key === 'operation'">
					<a-space>
						<a-button class="px-0" type="link" @click="handleShowDetail(record as Group)">查看</a-button>
						<a-button class="px-0" type="link" @click="updateDisable(record as Group)"
							>{{ record.disable ? '启用' : '停用' }}
						</a-button>
						<a-button class="px-0" danger type="link" @click="handleDeleteGroup(record.id)">删除</a-button>
					</a-space>
				</template>
			</template>
		</a-table>
	</a-card>

	<group-add v-model:open="openCreate" v-if="openCreate" @success="handleCreateSuccess" />
	<group-detail v-if="openDetail" v-model:open="openDetail" :group="row!" />
</template>

<script setup lang="ts">
import GroupAdd from '@/view/admin/group/components/group-add.vue';
import { message, Modal } from 'ant-design-vue';
import { columns, gradeList, Group, initQueryGroupParams } from './config';
import { batchUpdateGroupDisable, deleteGroupById, fetchGroupList, getCollegeOptions } from '@/axios';
import GroupDetail from '@/view/admin/group/components/group-detail.vue';
import { disabledList } from '@/view/admin/research/config.ts';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import MBreadcrumb from '@/components/m-breadcrumb.vue';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { calcHeight } = useCalcHeight(433);
const openDetail = ref(false);
const row = ref<Group>();
const handleShowDetail = (record: Group) => {
	row.value = record;
	openDetail.value = true;
};

const openCreate = ref(false);
const handleCreateSuccess = () => {
	openCreate.value = false;
	openCreate.value = false;
	message.success('添加成功');
	search();
};

const queryParams = ref(initQueryGroupParams());

const handleDeleteGroup = (id: string) => {
	Modal.confirm({
		title() {
			return '危险操作！';
		},
		content() {
			return '删除班级后无法恢复，请确认！';
		},
		onOk() {
			deleteGroupById(id).then(() => {
				fetchData();
				message.success('删除成功');
			});
		},
	});
};

const data = ref<Group[]>([]);
const fetchData = (reset?: boolean) => {
	if (reset) {
		queryParams.value = initQueryGroupParams();
	}
	loading.value = true;
	fetchGroupList(queryParams.value)
		.then((res) => {
			data.value = res.records;
		})
		.finally(() => {
			loading.value = false;
		});
};

const filterOptions = reactive<{ collegeOptions: Option[]; majorOptions: Option[] }>({
	collegeOptions: [],
	majorOptions: [],
});

const updateDisable = (record: Group) => {
	if (!record.disable) {
		Modal.confirm({
			title: '停用',
			content: '该操作将对已选部门进行停用，停用后相关部门将不可用，确定操作吗？',
			okText: '停用',
			cancelText: '取消',
			onOk() {
				const params = {
					groupIds: [record.id],
					disable: true,
				};
				batchUpdateGroupDisable(params).then(() => {
					message.success('停用成功！');
					fetchData();
				});
			},
			onCancel() {
				return;
			},
		});
	} else {
		const params = {
			groupIds: [record.id],
			disable: false,
		};
		batchUpdateGroupDisable(params).then(() => {
			message.success('启用成功！');
			fetchData();
		});
	}
};

// const onExport = () => {
// 	message.warn('敬请期待！');
// };

const search = () => {
	queryParams.value.current = 1;
	fetchData();
};
onMounted(() => {
	fetchData();
	getCollegeOptions().then((res) => {
		filterOptions.collegeOptions = res;
	});
});

const { loading, pagination } = useTableConfig();
</script>
