<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb />
		</template>
		<a-form ref="formRef" :model="queryParams">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item name="name" label="部门名称">
					<a-input v-model:value="queryParams.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="parentId" label="上级部门">
					<a-select v-model:value="queryParams.parentId" placeholder="请选择" :options="parentInfoList" />
				</a-form-item>
				<a-form-item name="leaderName" label="部门负责人">
					<a-input v-model:value="queryParams.leaderName" placeholder="请输入" />
				</a-form-item>
				<a-form-item name="disable" label="启用状态">
					<a-select v-model:value="queryParams.disable" placeholder="请选择" :options="disabledList" />
				</a-form-item>
			</div>
		</a-form>
		<div class="float-right">
			<a-space>
				<a-button @click="fetchData(true)">重置</a-button>
				<a-button type="primary" @click="search">查询</a-button>
			</a-space>
		</div>
	</a-card>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" style="height: calc(100vh - 262px)">
		<template #title>
			<div class="card-title">部门列表</div>
		</template>
		<template #extra>
			<a-space>
				<!-- <a @click="onExport"><i class="bi bi-cloud-arrow-down mr-1" />导出数据</a> -->
				<a-button type="link" @click="onAdd"><i class="bi bi-plus-circle mr-1" />新增部门</a-button>
			</a-space>
		</template>
		<div style="height: calc(100vh - 350px)" class="overflow-y-auto">
			<template v-if="dataSource.length > 0">
				<div ref="list" class="grid grid-cols-4 gap-4">
					<a-card v-for="item in dataSource" :key="item.id" :title="item.name" hoverable size="small">
						<template #extra>
							<a-badge v-if="item.disable" status="error" text="停用" />
							<a-badge v-else status="success" text="启用" />
						</template>
						<div class="leading-8 truncate">
							<div class="inline-block w-20">上级部门:</div>
							<span class="card-description">{{ item.parentName }}</span>
						</div>
						<div class="leading-8 truncate">
							<div class="inline-block w-20">负责人员:</div>
							<span class="card-description">{{ item.leaderName }}</span>
						</div>
						<div class="leading-8 truncate">
							<div class="inline-block w-20">成员数量:</div>
							<span class="card-description">{{ item.memberCount || 0 }}人</span>
						</div>
						<div class="leading-8 truncate">
							<div class="text-wrap line-clamp-3">
								<div class="inline-block w-20">部门描述:</div>
								<span class="card-description">{{ item.description }}</span>
							</div>
						</div>
						<template #actions>
							<div class="justify-end">
								<div class="flex justify-end self-end">
									<div class="flex">
										<a-button type="link" @click="onDetail(item.id)" size="small">查看</a-button>
										<a-button type="link" @click="onEdit(item.id)" size="small">编辑</a-button>
										<a-button v-if="item.disable" type="link" @click="changeDisable(item)" size="small">启用</a-button>
										<a-button v-else type="link" @click="changeDisable(item)" size="small">停用</a-button>
										<!-- <a-button type="link" danger @click="onDelete" size="small">删除</a-button> -->
									</div>
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
	<department-add
		v-if="drawerAddOpen"
		v-model="drawerAddOpen"
		:page-type="pageType"
		:department-id="departmentId"
		:parent-info-list="parentInfoList"
		@fetch-list="fetchList"
	/>
	<department-detail v-if="drawerDetailOpen" v-model="drawerDetailOpen" :department-id="departmentId" />
</template>

<script lang="ts" setup>
import MBreadcrumb from '@/components/m-breadcrumb.vue';

defineOptions({
	name: 'DepartmentManager',
});
import { disabledList, initDepartment, QueryDepartmentParam, ResponseDepartmentItem } from './config';
import { changeStartStatus, getDepartmentList, getParentDepartment } from '@/axios';
import DepartmentAdd from './components/department-add.vue';
import DepartmentDetail from './components/department-detail.vue';
import { message, Modal } from 'ant-design-vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';

const [list] = useAutoAnimate();
const queryParams = ref<QueryDepartmentParam>(initDepartment());
const dataSource = ref<ResponseDepartmentItem[]>([]);
const parentInfoList = ref<Option[]>([]);
const departmentId = ref<string>('');
// 获取列表数据
const fetchData = (reset?: boolean) => {
	if (reset) {
		queryParams.value = initDepartment();
	}
	getDepartmentList(queryParams.value).then((res) => {
		dataSource.value = res.data;
	});
};
// 获取列表数据
const getParentDepartmentData = () => {
	getParentDepartment().then((res) => {
		parentInfoList.value = res.data;
	});
};

// function onExport() {
// 	message.warning('暂未支持该功能');
// }
const pageType = ref<string>('add');
const drawerAddOpen = ref<boolean>(false);
function onAdd() {
	departmentId.value = '';
	pageType.value = 'add';
	drawerAddOpen.value = true;
}

function onEdit(id: string) {
	pageType.value = 'edit';
	departmentId.value = id;
	drawerAddOpen.value = true;
}

function onDetail(id: string) {
	departmentId.value = id;
	drawerDetailOpen.value = true;
}

const drawerDetailOpen = ref<boolean>(false);

// 更新数据状态
const changeDisable = async (row: ResponseDepartmentItem) => {
	if (!row.disable) {
		Modal.confirm({
			title: '停用',
			content: '该操作将对已选部门进行停用，停用后相关部门将不可用，确定操作吗？',
			okText: '停用',
			cancelText: '取消',
			onOk() {
				changeStartStatus(row.id).then(() => {
					message.success('停用成功！');
					fetchData();
					getParentDepartmentData();
				});
			},
			onCancel() {
				return;
			},
		});
	} else {
		changeStartStatus(row.id).then(() => {
			message.success('启用成功！');
			fetchData();
			getParentDepartmentData();
		});
	}
};

// 查询
const search = () => {
	fetchData();
};

function fetchList() {
	fetchData();
	getParentDepartmentData();
}

onMounted(() => {
	fetchList();
});
</script>
<style scoped>
:deep(.ant-card) {
	display: flex;
	flex-direction: column;
}
:deep(.ant-card-body) {
	flex: 1;
}
</style>
