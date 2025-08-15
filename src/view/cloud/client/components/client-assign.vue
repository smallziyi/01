<script setup lang="ts">
import { getClientPermission, queryClientMenuTree, updateClientPermission } from '@/axios';
import { mapData, MappedNode } from '@/utils/mapTree.ts';
import { message } from 'ant-design-vue';
import { CheckInfo } from 'ant-design-vue/es/vc-tree/props';

const props = defineProps<{
	clientId: string;
}>();
const open = defineModel('open', { required: true, type: Boolean });
const emits = defineEmits(['success']);
const loading = ref<boolean>(false);
const treeData = ref<MappedNode[]>([]);
const checkedKeys = ref<Array<Key>>([]);
const handleOk = () => {
	loading.value = true;
	updateClientPermission(props.clientId, [...checkedKeys.value, ...parentKeys.value])
		.then(() => {
			emits('success');
			message.success('分配成功! ');
			open.value = false;
		})
		.finally(() => {
			loading.value = false;
		});
};

onMounted(() => {
	queryClientMenuTree(props.clientId).then((res) => {
		treeData.value = mapData(res);
		getClientPermission(props.clientId).then((res) => {
			res.forEach((item) => {
				if (isParentPermission(item)) {
					parentKeys.value.push(item);
				} else {
					checkedKeys.value.push(item);
				}
			});
		});
	});
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
<template>
	<a-modal
		v-model:open="open"
		:body-style="{ height: '500px', overflow: 'auto' }"
		:confirm-loading="loading"
		title="权限分配"
		@ok="handleOk"
	>
		<a-tree
			v-if="treeData.length > 0"
			v-model:checkedKeys="checkedKeys"
			checkable
			default-expand-all
			:tree-data="treeData"
			@check="handleCheck"
		>
		</a-tree>
	</a-modal>
</template>
