<script setup lang="ts">
import { fetchTemplateFileVersion, getTemplateMenuTree, updateReportMenuStatus } from '@/axios';
import { UpdateTemplateDisable } from '../config';
import downloadBatch from '@/utils/downloadBatch.ts';
import CloseSvg from '@/assets/icons/close.svg';
import { message } from 'ant-design-vue';

defineOptions({
	name: 'ViewMenu',
});

interface NestedItem {
	id: string;
	label: string;
	fileId?: string;
	fileTemplateName?: string;
	version?: string;
	children?: NestedItem[];
}
interface CheckedKeys {
	checked: string[]; // 已完全选中的节点 key 数组
	halfChecked: string[]; // 半选状态的节点 key 数组
}

const open = defineModel({ type: Boolean });
const checkedKeys = ref<CheckedKeys>({
	checked: [],
	halfChecked: [],
});
const fileIds = ref<string[]>([]);
const props = defineProps<{
	type: number;
	fileTemplateId?: string;
}>();

const versionMenu = ref<number>(1);
const menuTree = ref([]);

function transformIdsToValues<T extends NestedItem | NestedItem[]>(data: T): any {
	if (Array.isArray(data)) {
		return data.map(transformIdsToValues);
	} else {
		const { id, label, children, fileTemplateName, fileId, version } = data;
		let bind = '';
		if (fileTemplateName && version) {
			bind = `${fileTemplateName} V${version}`;
			if (fileId) fileIds.value.push(fileId);
		}
		return {
			key: id,
			title: label,
			bind,
			...(children ? { children: transformIdsToValues(children) } : {}),
		};
	}
}

const menuOptions = ref<Option[]>([]);
// 获取嵌套id
function getEnabledIds(items: any) {
	return items.reduce((ids: any, item: any) => {
		if (!item.disable) ids.push(item.id);
		if (item.children) ids.push(...getEnabledIds(item.children));
		return ids;
	}, []);
}
watch(
	() => versionMenu.value,
	(val) => {
		if (val) {
			const params = {
				menuVersion: val,
				reportType: props.type,
				fileTemplateId: props.fileTemplateId,
			};
			getTemplateMenuTree(params).then((res) => {
				checkedKeys.value.checked = getEnabledIds(res);
				menuTree.value = transformIdsToValues(res);
				generateList(menuTree.value);
			});
		}
	},
	{ immediate: true },
);

onMounted(() => {
	fetchTemplateFileVersion(props.type).then((res) => {
		menuOptions.value = res.data.map((item) => {
			return {
				label: `V${item}`,
				value: item,
			};
		});
	});
});

const dataList = [];
const generateList = (data: any) => {
	for (let i = 0; i < data.length; i++) {
		const node = data[i];
		const key = node.key;
		dataList.push({
			key,
			title: key,
		});
		if (node.children) {
			generateList(node.children);
		}
	}
};

// 根据key获取父节点
const getParentByKey = (key: any, tree: any): any => {
	for (const node of tree) {
		if (node.children) {
			const found = node.children.find((child: any) => child.key === key);
			if (found) return node;
			else if (getParentByKey(key, node.children)) return getParentByKey(key, node.children);
		}
	}
	return null;
};

const expandedKeys = ref();
const searchValue = ref('');
const autoExpandParent = ref(true);
const onExpand = (keys: any) => {
	expandedKeys.value = keys;
	autoExpandParent.value = false;
};
watch(searchValue, (value) => {
	const expanded = new Set<string>();

	// 递归函数，用于收集匹配项及其所有父级的key
	const collectMatchingParents = (node: any, keyword: any) => {
		if (node.title.includes(keyword)) {
			let currentNode = node;
			while (currentNode) {
				expanded.add(currentNode.key);
				currentNode = getParentByKey(currentNode.key, menuTree.value);
			}
		}
		if (node.children) {
			node.children.forEach((child: any) => collectMatchingParents(child, keyword));
		}
	};
	// 遍历树数据，收集所有匹配的节点及其父节点的key
	menuTree.value.forEach((node) => collectMatchingParents(node, value));
	// 更新展开状态
	expandedKeys.value = Array.from(expanded);
	autoExpandParent.value = true;
});
const handleSave = () => {
	const params: UpdateTemplateDisable = {
		reportType: props.type,
		enableMenuIds: [...checkedKeys.value.checked],
	};
	updateReportMenuStatus(params).then(() => {
		message.success('保存成功！');
	});
};
</script>

<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看菜单</div>
				<a-space>
					<a-button type="link" @click="downloadBatch([...new Set(fileIds)])">批量下载模板</a-button>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</a-space>
			</div>
		</template>
		<a-form layout="vertical">
			<a-form-item label="菜单版本">
				<a-space>
					<a-radio-group v-model:value="versionMenu" :options="menuOptions" />
				</a-space>
			</a-form-item>
			<a-form-item label="绑定菜单树结构">
				<a-input-search v-model:value="searchValue" class="mb-2" placeholder="请输入关键字进行搜索" />
				<a-tree
					v-if="menuTree.length > 0"
					v-model:checkedKeys="checkedKeys"
					:expanded-keys="expandedKeys"
					:auto-expand-parent="autoExpandParent"
					:tree-data="menuTree"
					checkable
					check-strictly
					default-expand-all
					@expand="onExpand"
				>
					<template #title="{ title, bind }">
						<span v-if="title.indexOf(searchValue) > -1">
							{{ title.substring(0, title.indexOf(searchValue)) }}
							<span class="text-red-500">{{ searchValue }}</span>
							{{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
						</span>
						<span v-else>
							{{ title }}
						</span>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<span class="text-green-500">{{ bind }}</span>
					</template>
				</a-tree>
			</a-form-item>
		</a-form>
		<template #footer>
			<div class="float-right">
				<a-button style="margin-right: 8px" @click="open = false">取消</a-button>
				<a-button type="primary" @click="handleSave">保存</a-button>
			</div>
		</template>
	</a-drawer>
</template>

<style scoped></style>
