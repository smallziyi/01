<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form ref="formRef" :model="queryParams">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item name="name" label="教研组织名称">
					<a-input v-model:value="queryParams.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="parentId" label="上级教研组织">
					<a-select v-model:value="queryParams.parentId" placeholder="请选择" :options="parentInfoList" />
				</a-form-item>
				<a-form-item name="disable" label="启用状态">
					<a-select v-model:value="queryParams.disable" placeholder="请选择" :options="disabledList" />
				</a-form-item>
				<div class="text-right">
					<a-space>
						<a-button @click="fetchData(true)">重置</a-button>
						<a-button type="primary" @click="search">查询</a-button>
					</a-space>
				</div>
			</div>
		</a-form>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 206px)">
		<template #title>
			<div class="card-title">教研室列表</div>
		</template>
		<template #extra>
			<a-space>
				<!-- <a @click="onExport"><i class="bi bi-cloud-arrow-down mr-1" />导出数据</a> -->
				<a @click="onAdd">
					<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" />新增教研室</div>
				</a>
			</a-space>
		</template>
		<div style="height: calc(100vh - 294px)" class="overflow-y-auto">
			<template v-if="dataSource.length > 0">
				<div ref="list" class="grid grid-cols-4 gap-4">
					<a-card v-for="item in dataSource" :key="item.id" :title="item.name" size="small">
						<template #extra>
							<a-badge v-if="item.disable" status="error" text="停用" />
							<a-badge v-else status="success" text="启用" />
						</template>
						<div class="leading-8 truncate">
							<div class="inline-block w-28">上级教研团队:</div>
							<span class="card-description">{{ item.parentName }}</span>
						</div>
						<div class="leading-8 truncate">
							<div class="inline-block w-28">教研团队成员:</div>
							<span class="card-description">{{ item.memberCount || 0 }}人</span>
						</div>
						<div class="leading-8 truncate">
							<div class="text-wrap line-clamp-3">
								<div class="inline-block w-28">教研组织描述:</div>
								<span class="card-description">{{ item.description }}</span>
							</div>
						</div>
						<template #actions>
							<div class="flex justify-end">
								<div class="flex">
									<a-button type="link" @click="onDetail(item.id)" size="small">查看</a-button>
									<a-button type="link" @click="onEdit(item.id)" size="small">编辑</a-button>
									<a-button v-if="item.disable" type="link" @click="changeDisable(item)" size="small"> 启用 </a-button>
									<a-button v-else type="link" @click="changeDisable(item)" size="small"> 停用 </a-button>
									<!-- <a-button type="link" danger @click="onDelete" size="small">删除</a-button> -->
								</div>
							</div>
						</template>
					</a-card>
				</div>
			</template>
			<template v-else>
				<m-empty />
			</template>
		</div>
	</a-card>
	<research-add
		v-if="drawerAddOpen"
		v-model:open="drawerAddOpen"
		:page-type="pageType"
		:research-id="researchId"
		:parent-info-list="parentInfoList"
		@fetch-list="fetchList"
	/>
	<research-detail v-if="drawerDetailOpen" v-model="drawerDetailOpen" :research-id="researchId" />
</template>

<script lang="ts" setup>
defineOptions({
	name: 'ResearchManager',
});
import { disabledList, FetchResearchParams, initResearchParams, ResearchListItem } from './config';
import { fetchResearchList, getResearchDropOptions, updateResearchDisable } from '@/axios';
import ResearchAdd from './components/research-add.vue';
import ResearchDetail from './components/research-detail.vue';
import { message, Modal } from 'ant-design-vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';

const queryParams = ref<FetchResearchParams>(initResearchParams());
const dataSource = ref<ResearchListItem[]>([]);
const [list] = useAutoAnimate();
const parentInfoList = ref<Option[]>([]);
const researchId = ref<string>('');
// 获取列表数据
const fetchData = (reset?: boolean) => {
	if (reset) {
		queryParams.value = initResearchParams();
	}
	fetchResearchList(queryParams.value).then((res) => {
		dataSource.value = res.data;
	});
};

// 获取列表数据
const fetchParentResearch = () => {
	getResearchDropOptions().then((res) => {
		parentInfoList.value = res.data;
	});
};

// function onExport() {
// 	message.warning('暂未支持该功能');
// }
const pageType = ref<string>('add');
const drawerAddOpen = ref<boolean>(false);
function onAdd() {
	researchId.value = '';
	pageType.value = 'add';
	drawerAddOpen.value = true;
}

function onEdit(id: string) {
	pageType.value = 'edit';
	drawerAddOpen.value = true;
	researchId.value = id;
}

function onDetail(id: string) {
	drawerDetailOpen.value = true;
	researchId.value = id;
}

// function onDelete() {
// 	message.warning('暂未支持该功能');
// }

const drawerDetailOpen = ref<boolean>(false);

// 更新数据状态
const changeDisable = async (row: ResearchListItem) => {
	if (!row.disable) {
		Modal.confirm({
			title: '停用',
			content: '该操作将对已选部门进行停用，停用后相关部门将不可用，确定操作吗？',
			okText: '停用',
			cancelText: '取消',
			onOk() {
				updateResearchDisable(row.id).then(() => {
					message.success('停用成功！');
					fetchData();
				});
			},
			onCancel() {
				return;
			},
		});
	} else {
		updateResearchDisable(row.id).then(() => {
			message.success('启用成功！');
			fetchData();
		});
	}
};

// 查询
const search = () => {
	fetchData();
};

function fetchList() {
	fetchData();
	fetchParentResearch();
}

onMounted(() => {
	fetchList();
});
</script>
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
