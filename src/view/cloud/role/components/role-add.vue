<template>
	<a-drawer v-model:open="open" width="864" :closable="false" @close="onCancel">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">
					{{ pageType === 'add' ? '新增' : '编辑' }}
				</div>
				<div>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">基本信息</div>
		<a-form ref="formRef" class="mt-5" :model="formParams" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
			<template class="grid grid-cols-2">
				<a-form-item label="角色名称" name="name">
					<a-input v-model:value="formParams.role.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item></a-form-item>
				<a-form-item
					:label-col="{ span: 3 }"
					:wrapper-col="{ span: 21 }"
					class="col-span-full"
					label="角色描述"
					name="description"
				>
					<a-textarea
						v-model:value="formParams.role.description"
						:auto-size="{ minRows: 2 }"
						placeholder="请输入"
					></a-textarea>
				</a-form-item>
			</template>
		</a-form>
		<a-divider />
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">功能选择</div>

		<div class="overflow-auto" style="height: calc(100vh - 380px); margin-left: 20px">
			<a-tree
				v-if="treeData.length > 0"
				v-model:checkedKeys="checkedKeys"
				checkable
				:disabled="isCloud"
				default-expand-all
				:tree-data="treeData"
				@check="handleCheck"
			>
			</a-tree>
		</div>

		<template #footer>
			<div class="text-right my-8">
				<a-button class="mr-5" @click="onCancel">取消</a-button>
				<a-button class="mr-5" type="primary" @click="onSave">保存</a-button>
			</div>
		</template>
	</a-drawer>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import CloseSvg from '@/assets/icons/close.svg';
import { CreateRole, initCreateRole, Role } from '../config.ts';
import { CheckInfo } from 'ant-design-vue/es/vc-tree/props';
import { MappedNode } from '@/utils/mapTree.ts';
import { getPermissionList, saveRole } from '@/axios';

const { token } = useAppTheme();
const open = defineModel({ type: Boolean });
const emits = defineEmits(['saveSuccess']);
const props = defineProps<{
	pageType: string;
	isCloud: boolean;
	currentDetailInfo: Role;
}>();
interface TreeNode {
	key: string;
	title: string;
	children?: TreeNode[];
}

interface SourceNode {
	id: string;
	name: string;
	children?: SourceNode[];
}

function transformToTreeNode(source: SourceNode[]): TreeNode[] {
	return source.map((node) => ({
		key: node.id,
		title: node.name,
		children: node.children ? transformToTreeNode(node.children) : undefined,
	}));
}
const formParams = ref<CreateRole>(initCreateRole());
const treeData = ref<TreeNode[]>([]);

const checkedKeys = ref<Array<Key>>([]);

const onCancel = () => {
	open.value = false;
};
const onSave = () => {
	formParams.value.permissionIds = [...checkedKeys.value, ...parentKeys.value];
	saveRole(formParams.value).then(() => {
		message.success('保存成功！');
		open.value = false;
		emits('saveSuccess');
	});
};

const fetchDict = () => {
	getPermissionList({}).then((res) => {
		treeData.value = transformToTreeNode(res.data);
		if (props.pageType === 'edit') {
			const { clientId, description, id, name, permissionList, disable } = props.currentDetailInfo;
			Object.assign(formParams.value.role, { clientId, description, id, name, disable: disable ? 1 : 0 });
			permissionList.forEach((item) => {
				if (isParentPermission(item.id)) {
					parentKeys.value.push(item.id);
				} else {
					checkedKeys.value.push(item.id);
				}
			});
		}
	});
};

onMounted(() => {
	fetchDict();
});

const parentKeys = ref<Array<Key>>([]);

const handleCheck = (checked: Array<Key> | { checked: Key[]; halfChecked: Key[] }, e: CheckInfo) => {
	if (e.node.parent) {
		if (e.node.parent.children?.some((item) => (checked as Array<Key>).includes(item.key))) {
			if (!parentKeys.value.includes(e.node.parent.key)) {
				parentKeys.value.push(e.node.parent.key);
			}
		} else {
			parentKeys.value = parentKeys.value.filter((item) => item !== e.node.parent?.key);
		}
	} else {
		if (e.checked) {
			if (!parentKeys.value.includes(e.node.key)) {
				parentKeys.value.push(e.node.key);
			}
		} else {
			parentKeys.value = parentKeys.value.filter((item) => item !== e.node.key);
		}
	}
};

const isParentPermission = (id: string): boolean => {
	const findNode = (nodes: MappedNode[]): boolean => {
		for (let node of nodes) {
			if (node.key === id) {
				return !!node.children && node.children.length > 0;
			}
			if (node.children) {
				const foundInChildren = findNode(node.children);
				if (foundInChildren) {
					return true;
				}
			}
		}
		return false;
	};

	return findNode(treeData.value);
};
</script>
