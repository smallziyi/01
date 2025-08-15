<script lang="ts" setup>
import { College, initQueryCollegeParams, QueryCollegeParam } from '@/view/admin/college/config.ts';
import CollegeAdd from '@/view/admin/college/components/college-add.vue';
import { message, Modal } from 'ant-design-vue';
import { fetchCollegeList, updateCollegeDisable } from '@/axios';
import CollegeDetail from '@/view/admin/college/components/college-detail.vue';
import { getDomainsOptionsByCollegeId } from '@/axios';
import { disabledList } from '@/view/admin/department/config.ts';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import MBreadcrumb from '@/components/m-breadcrumb.vue';

const openCreate = ref(false);
const [list] = useAutoAnimate();
const queryParams = ref<QueryCollegeParam>(initQueryCollegeParams());
const dataSource = ref<College[]>([]);

const handleCreateSuccess = () => {
	openCreate.value = false;
	fetchData();
	message.success('保存成功! ');
};
const updateStatus = (row: College) => {
	if (!row.disable) {
		Modal.confirm({
			title: '停用',
			content: '该操作将对已选院系进行停用，停用后相关院系将不可用，确定操作吗？',
			okText: '停用',
			cancelText: '取消',
			onOk() {
				updateCollegeDisable(row.id).then(() => {
					message.success('停用成功！');
					fetchData();
				});
			},
			onCancel() {
				return;
			},
		});
	} else {
		updateCollegeDisable(row.id).then(() => {
			message.success('启用成功！');
			fetchData();
		});
	}
};

const fetchData = (reset?: boolean) => {
	if (reset) {
		queryParams.value = initQueryCollegeParams();
	}
	fetchCollegeList(queryParams.value).then((res) => {
		dataSource.value = res;
	});
};
const onAdd = () => {
	pageType.value = 'add';
	openCreate.value = true;
};
// const onExport = () => {
// 	message.warn('敬请期待！');
// };
function onEdit(record: College) {
	pageType.value = 'edit';
	college.value = { ...record };
	openCreate.value = true;
}

// function onDelete() {
// 	message.warning('敬请期待！');
// }
onMounted(() => {
	fetchData();
	getDomainsOptionsByCollegeId().then((res) => {
		domainOptions.value = res;
	});
});

const openDetail = ref(false);
const college = ref<College>();
const onDetail = (record: College) => {
	college.value = record;
	openDetail.value = true;
};
const search = () => {
	fetchData();
};
const domainOptions = ref<Option[]>([]);
const pageType = ref<'add' | 'edit'>('add');
</script>

<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb />
		</template>
		<a-form ref="formRef" :model="queryParams">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item name="name" label="院系名称">
					<a-input v-model:value="queryParams.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="domainId" label="关联专业">
					<a-select v-model:value="queryParams.domainId" placeholder="请选择" :options="domainOptions" />
				</a-form-item>
				<a-form-item name="disable" label="启用状态">
					<a-select v-model:value="queryParams.disable" placeholder="请选择" :options="disabledList" />
				</a-form-item>
				<div class="text-right">
					<a-space>
						<a-button @click="fetchData(true)"> 重置 </a-button>
						<a-button type="primary" @click="search"> 查询 </a-button>
					</a-space>
				</div>
			</div>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 206px)">
		<template #title>
			<div class="card-title">院系列表</div>
		</template>
		<template #extra>
			<a-space>
				<!-- <a @click="onExport"><i class="bi bi-cloud-arrow-down mr-1" />导出数据</a> -->
				<a @click="onAdd">
					<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" />新增院系</div>
				</a>
			</a-space>
		</template>
		<div style="height: calc(100vh - 294px)" class="overflow-y-auto">
			<template v-if="dataSource.length > 0">
				<div ref="list" class="grid grid-cols-4 gap-4">
					<a-card size="small" v-for="college in dataSource" :key="college.id" :title="college.name" hoverable>
						<template #extra>
							<a-badge v-if="college.disable" status="error" text="停用" />
							<a-badge v-else status="success" text="启用" />
						</template>
						<div class="leading-8 truncate">
							<div class="inline-block w-20">负责人员:</div>
							<span class="card-description">{{ college.leaderName }}</span>
						</div>
						<div class="leading-8 truncate">
							<div class="inline-block w-20">专业数量:</div>
							<span class="card-description">{{ college.domainData.length }}个</span>
						</div>
						<div class="leading-8 truncate">
							<div class="text-wrap line-clamp-3">
								<div class="inline-block w-20">院系简介:</div>
								<span class="card-description">{{ college.description }}</span>
							</div>
						</div>
						<template #actions>
							<div class="flex justify-end mr-4">
								<a-button type="link" size="small" @click="onDetail(college)">查看</a-button>
								<a-button type="link" @click="onEdit(college)" size="small">编辑</a-button>
								<a-button type="link" size="small" @click="updateStatus(college)">
									{{ college.disable ? '启用' : '停用' }}
								</a-button>
								<!-- <a-button type="link" danger @click="onDelete" size="small">删除</a-button> -->
							</div>
						</template>
					</a-card>
				</div>
			</template>
			<template v-else>
				<m-empty></m-empty>
			</template>
		</div>
	</a-card>

	<college-add
		v-model:open="openCreate"
		v-if="openCreate"
		:pageType="pageType"
		:college="college!"
		@success="handleCreateSuccess"
	/>
	<college-detail v-model:open="openDetail" v-if="openDetail" :college="college!" />
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}

:deep(.ant-card) {
	display: flex;
	flex-direction: column;
}
:deep(.ant-card-body) {
	flex: 1;
}
</style>
