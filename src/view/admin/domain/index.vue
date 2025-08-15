<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb />
		</template>
		<a-form :model="selectParams">
			<template class="grid grid-cols-4 gap-4">
				<a-form-item label="名称" name="name">
					<a-input v-model:value="selectParams.name" allow-clear placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item label="包含专业" name="containMajor">
					<a-input v-model:value="selectParams.containMajor" allow-clear placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item label="专业类型" name="isMajorGroup">
					<a-select v-model:value="selectParams.isMajorGroup" allow-clear placeholder="请选择">
						<a-select-option :value="0">专业</a-select-option>
						<a-select-option :value="1">专业群</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="启用状态" name="disable">
					<a-select v-model:value="selectParams.disable" allow-clear placeholder="请选择">
						<a-select-option :value="0">启用</a-select-option>
						<a-select-option :value="1">停用</a-select-option>
					</a-select>
				</a-form-item>
			</template>
		</a-form>
		<div class="float-right">
			<a-space>
				<a-button @click="handleReset">重置</a-button>
				<a-button type="primary" @click="fetchData">查询</a-button>
			</a-space>
		</div>
	</a-card>
	<a-card style="height: calc(100vh - 262px)" :body-style="{ padding: '16px' }" :bordered="false">
		<template #title>
			<div class="card-title">专业列表</div>
		</template>
		<template #extra>
			<a-dropdown>
				<a-button type="link">
					<i class="bi bi-plus-circle mr-1"></i>
					新建专业
				</a-button>
				<template #overlay>
					<a-menu>
						<a-menu-item @click="handleCreate(false, 'create')">新建专业</a-menu-item>
						<a-menu-item @click="handleCreate(true, 'create')">新建专业群</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>
		</template>
		<div style="height: calc(100vh - 350px)" class="overflow-y-auto">
			<template v-if="dataSource.length > 0">
				<div ref="list" class="grid grid-cols-4 gap-4">
					<a-card v-for="domain in dataSource" :key="domain.id" :title="domain.name" size="small" hoverable>
						<template #extra>
							<a-badge :status="domain.disable ? 'error' : 'success'" />
							{{ domain.disable ? '停用' : '启用' }}
						</template>
						<div class="leading-8 truncate">
							<div class="inline-block w-20">类型:</div>
							<span class="card-description">{{ domain.isMajorGroup ? '专业群' : '专业' }}</span>
						</div>
						<div class="leading-8 truncate">
							<div class="inline-block w-20">包含专业:</div>
							<span class="card-description">{{ domain.majorCount }}个</span>
						</div>
						<div class="leading-8 truncate">
							<div class="text-wrap line-clamp-3">
								<div class="inline-block w-20">专业介绍:</div>
								<span class="card-description">{{ domain.description }}</span>
							</div>
						</div>
						<template #actions>
							<div class="float-right">
								<a-space>
									<a-button type="link" @click="handleShowInfo(domain as Domain)" size="small">查看</a-button>
									<a-button type="link" @click="handleEdit(domain as Domain)" size="small">编辑</a-button>
									<!-- <a-button type="link" @click="onEdit(domain.id)" size="small">编辑</a-button> -->
									<a-button type="link" @click="updateStatus(domain as Domain)" size="small">{{
										domain.disable ? '启用' : '停用'
									}}</a-button>
								</a-space>
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
	<domain-add
		v-if="openVisible"
		v-model:open="openVisible"
		v-model:create-group="createGroup"
		:domain="entity"
		:type="createType"
		@success="handleCreateSuccess"
	/>
	<domain-detail v-if="detailOpen" v-model:open="detailOpen" :domain-info="entity" />
</template>

<script lang="ts" setup>
import { Domain, DomainQueryParams, initDomain, initDomainQueryParams } from './config';
import { fetchDomainList, updateDomainDisable } from '@/axios';
import { message, Modal } from 'ant-design-vue';
import DomainAdd from '@/view/admin/domain/components/domain-add.vue';
import DomainDetail from '@/view/admin/domain/components/domain-detail.vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';

const dataSource = ref<Domain[]>([]);

const [list] = useAutoAnimate();
const detailOpen = ref<boolean>(false);

const entity = ref<Domain>(initDomain(true));
const handleShowInfo = (domainInfo: Domain) => {
	entity.value = domainInfo;
	detailOpen.value = true;
};
const createGroup = ref(false);
const createType = ref<'create' | 'edit' | 'view'>('create');
const handleCreate = (type: boolean, _createType: 'create' | 'edit' | 'view') => {
	createGroup.value = type;
	createType.value = _createType;
	openVisible.value = true;
};
const handleEdit = (domainInfo: Domain) => {
	createType.value = 'edit';
	entity.value = domainInfo;
	openVisible.value = true;
};

const handleCreateSuccess = () => {
	fetchData();
	openVisible.value = false;
};
const openVisible = ref(false);

const fetchData = () => {
	fetchDomainList(selectParams.value).then((res) => {
		dataSource.value = res.data;
	});
};

const updateStatus = (row: Domain) => {
	if (!row.disable) {
		Modal.confirm({
			title: '停用',
			content: '该操作将对已选专业（群）进行停用，停用后相关专业（群）将不可用，确定操作吗？',
			okText: '停用',
			cancelText: '取消',
			onOk() {
				updateDomainDisable(row.id).then(() => {
					message.success('停用成功！');
					fetchData();
				});
			},
			onCancel() {
				return;
			},
		});
	} else {
		updateDomainDisable(row.id).then(() => {
			message.success('启用成功！');
			fetchData();
		});
	}
};

const selectParams = ref<DomainQueryParams>(initDomainQueryParams());

const handleReset = () => {
	selectParams.value = initDomainQueryParams();
	fetchData();
};

onMounted(() => {
	fetchData();
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
