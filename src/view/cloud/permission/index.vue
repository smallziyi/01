<script setup lang="ts">
import { initPermission, Permission } from '@/view/base/permission/config.ts';
import { FormInstance } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { UploadFile } from 'ant-design-vue/es/upload/interface';
import useCalcHeight from '@/hooks/useCalcHeight';
import {
	getPermissionList,
	getDropPermissionType,
	createPermission,
	updatePermissions,
	updatePermission,
} from '@/axios';
import { MenuInfo } from 'ant-design-vue/es/menu/src/interface';

const { calcHeight } = useCalcHeight(232);
const activeTab = ref<number>(1);

const data = ref<Array<Permission>>([]);

const columns: TableColumns<any> = [
	{ key: 'serialNumber', title: '', width: 60 },
	{ key: 'name', title: '菜单名称', dataIndex: 'name' },
	{ key: 'code', title: '菜单代码', dataIndex: 'code' },
	{ key: 'functionType', title: '菜单类型', dataIndex: 'functionType' },
	{ key: 'iconFileUrl', title: '图标', dataIndex: 'iconFileUrl' },
	{ key: 'defaultRoleCodes', title: '默认角色', dataIndex: 'defaultRoleCodes' },
	{ key: 'action', title: '操作' },
];

const fetchData = () => {
	getPermissionList({ type: activeTab.value }).then((res) => {
		data.value = res.data;
	});
};

onMounted(() => {
	getDropPermissionType().then((res) => {
		tabsList.value = res;
		activeTab.value = tabsList.value[0].value as number;
	});
});

watch(activeTab, () => {
	fetchData();
});

const handleAddMenu = (parentId: string) => {
	menu.value = initPermission(activeTab.value, parentId);
	visible.value = true;
};

const menu = ref<Partial<Permission>>({});
const visible = ref(false);
const menuInfo = ref();
const visibleEdit = ref(false);
const form = ref<FormInstance>();

const handleSubmit = () => {
	form.value
		?.validate()
		.then(() => {
			createPermission(menu.value).then(() => {
				message.success('添加成功');
				fetchData();
				visible.value = false;
			});
			visible.value = false;
		})
		.catch((err) => {
			message.warning(err.errorFields[0].errors[0]);
		});
};

const handleUpSort = (parentId: string, id: string) => {
	if (parentId === '0') {
		const index = data.value.findIndex((item) => item.id === id);
		if (index !== 0) {
			const temp = data.value[index];
			data.value[index] = data.value[index - 1];
			data.value[index - 1] = temp;
			for (let i = 0; i < data.value.length; i++) {
				data.value[i].sort = i + 1;
			}
			updateSort(data.value.map((item) => item));
		}
	} else {
		const parent = data.value.find((item) => item.id === parentId);
		if (parent) {
			const index = parent.children!.findIndex((item) => item.id === id);
			if (index !== 0) {
				const temp = parent.children![index];
				parent.children![index] = parent.children![index - 1];
				parent.children![index - 1] = temp;
			}
			for (let i = 0; i < parent.children!.length; i++) {
				parent.children![i].sort = i + 1;
			}
			updateSort(parent.children!.map((item) => item));
		}
	}
};
const handleDownSort = (parentId: string, id: string) => {
	if (parentId === '0') {
		const index = data.value.findIndex((item) => item.id === id);
		if (index !== data.value.length - 1) {
			const temp = data.value[index];
			data.value[index] = data.value[index + 1];
			data.value[index + 1] = temp;
			for (let i = 0; i < data.value.length; i++) {
				data.value[i].sort = i + 1;
			}
			updateSort(data.value.map((item) => item));
		}
	} else {
		const parent = data.value.find((item) => item.id === parentId);
		if (parent) {
			const index = parent.children!.findIndex((item) => item.id === id);
			if (index !== parent.children!.length - 1) {
				const temp = parent.children![index];
				parent.children![index] = parent.children![index + 1];
				parent.children![index + 1] = temp;
			}
			for (let i = 0; i < parent.children!.length; i++) {
				parent.children![i].sort = i + 1;
			}
			updateSort(parent.children!.map((item) => item));
		}
	}
};

const updateSort = (items: Array<Permission>) => {
	updatePermissions(items);
};

const token = sessionStorage.getItem('jwt');

const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>, record: Permission) => {
	if (info.fileList.length > 0 && info.fileList[0].xhr) {
		const file = JSON.parse(info.fileList[0].xhr.response) as IFile;
		updatePermission({ ...record, iconId: file.id }).then(() => {
			record.iconId = file.id;
			record.iconFileUrl = file.url;
			message.success('上传成功');
		});
		fetchData();
	}
};
const tabsList = ref<Option[]>([]);

const handleUpdatePermission = (record: Permission, menu: MenuInfo) => {
	updatePermission({ ...record, functionType: menu.key as 1 | 2 | 3 }).then(() => {
		record.functionType = menu.key as 1 | 2 | 3;
	});
};

const handleOpenEdit = (record: any) => {
	menuInfo.value = { ...record };
	const { name, code, functionType, sort } = menuInfo.value;
	menu.value = {
		name,
		code,
		functionType,
		sort,
	};
	visibleEdit.value = true;
};

const handleEdit = () => {
	const params = { ...menuInfo.value, ...menu.value };
	updatePermission(params).then(() => {
		visibleEdit.value = false;
		message.success('编辑成功');
		fetchData();
	});
};

const handleChangeDefaultRoleCodes = (record: Permission) => {
	updatePermission(record).then(() => {
		message.success('保存成功');
	});
};
</script>

<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">权限树结构</div>
		</template>
		<template #extra>
			<a-button @click="handleAddMenu('0')" type="link"><i class="bi bi-plus-circle mr-1"></i>添加一级菜单</a-button>
		</template>
		<a-tabs v-if="tabsList.length > 0" v-model:activeKey="activeTab" animated tab-position="left">
			<a-tab-pane v-for="tab in tabsList" style="height: calc(100vh - 192px)" :key="tab.value" :tab="tab.label">
				<a-table
					:columns="columns"
					:data-source="data"
					:pagination="false"
					bordered
					row-key="id"
					size="small"
					:scroll="{ y: calcHeight }"
				>
					<template #emptyText>
						<m-empty />
					</template>
					<template #bodyCell="{ column, record }: TableRow<Permission>">
						<template v-if="column.key === 'functionType'">
							<span>{{ ['未知', '功能类别', '功能组', '功能'][record.functionType] }}</span>
						</template>
						<template v-if="column.key === 'iconFileUrl'">
							<div v-if="record.iconFileUrl" class="flex items-center">
								<a-image :src="(record as Permission).iconFileUrl" width="28px" />
								<!-- v-if="record.parentId === '0'" -->
								<a-upload
									:action="`${$config.file}/upload`"
									:headers="{ authorization: token ?? '' }"
									:show-upload-list="false"
									accept=".png,.jpg,.jpeg,.svg,.bmp,.webp"
									@change="
										(e) => {
											handleFileChange(e, record as Permission);
										}
									"
								>
									<a-button type="link"><i class="bi bi-plus-circle mr-1"></i>替换</a-button>
								</a-upload>
							</div>

							<div v-else>
								<a-upload
									:action="`${$config.file}/upload`"
									:headers="{ authorization: token ?? '' }"
									:show-upload-list="false"
									accept=".png,.jpg,.jpeg,.svg,.bmp,.webp"
									@change="
										(e) => {
											handleFileChange(e, record as Permission);
										}
									"
								>
									<a-button type="link"><i class="bi bi-plus-circle mr-1"></i>上传</a-button>
								</a-upload>
							</div>
						</template>
						<template v-if="column.key === 'defaultRoleCodes'">
							<div class="flex items-center">
								<a-select
									v-model:value="record.defaultRoleCodes"
									mode="multiple"
									placeholder="请选择角色"
									class="w-full"
								>
									<a-select-option value="leader">领导</a-select-option>
									<a-select-option value="company">企业人员</a-select-option>
									<a-select-option value="teacher">教师</a-select-option>
									<a-select-option value="student">学生</a-select-option>
								</a-select>
								<a-button @click="handleChangeDefaultRoleCodes(record as Permission)">保存</a-button>
							</div>
						</template>
						<template v-if="column.key === 'action'">
							<a-button type="text" shape="circle" @click="handleUpSort(record.parentId, record.id)">
								<template #icon><i class="bi bi-chevron-bar-up"></i></template>
							</a-button>
							<a-button type="text" shape="circle" @click="handleDownSort(record.parentId, record.id)">
								<template #icon><i class="bi bi-chevron-bar-down"></i></template>
							</a-button>
							<a-button type="link" @click="handleAddMenu(record.id)">添加子菜单</a-button>
							<a-button type="link" @click="handleOpenEdit(record)">编辑</a-button>
							<a-dropdown>
								<a-button type="link">设置为</a-button>
								<template #overlay>
									<a-menu
										@click="
											(key) => {
												handleUpdatePermission(record as Permission, key);
											}
										"
									>
										<a-menu-item :key="1">功能类别</a-menu-item>
										<a-menu-item :key="2">功能组</a-menu-item>
										<a-menu-item :key="3">功能</a-menu-item>
									</a-menu>
								</template>
							</a-dropdown>
						</template>
					</template>
				</a-table>
			</a-tab-pane>
		</a-tabs>
	</a-card>
	<!-- 新增菜单 -->
	<a-modal v-if="visible" v-model:open="visible" @ok="handleSubmit">
		<template #title>
			<div v-if="menu!.parentId === '0'">添加一级菜单</div>
			<div v-else>添加菜单</div>
		</template>
		<a-form :model="menu" ref="form">
			<a-form-item label="名称" name="name" :rules="{ required: true, message: '请输入名称' }">
				<a-input v-model:value="menu.name"></a-input>
			</a-form-item>
			<a-form-item label="代码" name="code" :rules="{ required: true, message: '请输入代码' }">
				<a-input v-model:value="menu.code"></a-input>
			</a-form-item>
			<a-form-item label="类型" name="functionType" :rules="{ required: true, message: '请输入代码' }">
				<a-select v-model:value="menu.functionType">
					<a-select-option :value="1">功能类别</a-select-option>
					<a-select-option :value="2">功能组</a-select-option>
					<a-select-option :value="3">功能</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="排序" name="sort" required>
				<a-input-number v-model:value="menu.sort" :min="0"></a-input-number>
			</a-form-item>
			<a-form-item label="默认角色" name="defaultRoleCodes">
				<a-select v-model:value="menu.defaultRoleCodes" mode="multiple" placeholder="请选择角色" class="w-full">
					<a-select-option value="leader">领导</a-select-option>
					<a-select-option value="company">企业人员</a-select-option>
					<a-select-option value="teacher">教师</a-select-option>
					<a-select-option value="student">学生</a-select-option>
				</a-select>
			</a-form-item>
		</a-form>
	</a-modal>
	<!-- 编辑菜单 -->
	<a-modal v-if="visibleEdit" v-model:open="visibleEdit" title="编辑菜单" @ok="handleEdit">
		<a-form :model="menu" ref="form">
			<a-form-item label="名称" name="name" :rules="{ required: true, message: '请输入名称' }">
				<a-input v-model:value="menu.name"></a-input>
			</a-form-item>
			<a-form-item label="代码" name="code" :rules="{ required: true, message: '请输入代码' }">
				<a-input v-model:value="menu.code"></a-input>
			</a-form-item>
			<a-form-item label="类型" name="functionType" :rules="{ required: true, message: '请输入代码' }">
				<a-select v-model:value="menu.functionType">
					<a-select-option :value="1">功能类别</a-select-option>
					<a-select-option :value="2">功能组</a-select-option>
					<a-select-option :value="3">功能</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="排序" name="sort" required>
				<a-input-number v-model:value="menu.sort" :min="0"></a-input-number>
			</a-form-item>
			<a-form-item label="默认角色" name="defaultRoleCodes">
				<a-select v-model:value="menu.defaultRoleCodes" mode="multiple" placeholder="请选择角色" class="w-full">
					<a-select-option value="leader">领导</a-select-option>
					<a-select-option value="company">企业人员</a-select-option>
					<a-select-option value="teacher">教师</a-select-option>
					<a-select-option value="student">学生</a-select-option>
				</a-select>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
