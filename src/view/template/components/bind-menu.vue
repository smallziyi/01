<script setup lang="ts">
import { bandWord, fetchTemplateFileVersion, getTemplateMenuTree } from '@/axios';
import downloadBatch from '@/utils/downloadBatch.ts';
import { message, Modal } from 'ant-design-vue';
import CloseSvg from '@/assets/icons/close.svg';

defineOptions({
	name: 'BindMenu',
});
interface NestedItem {
	id: string;
	label: string;
	fileId?: string;
	fileTemplateName?: string;
	version?: string;
	children?: NestedItem[];
}

interface NodeCheckedKeys {
	checked: string[];
	halfChecked: string[];
}

const open = defineModel({ type: Boolean });
const emit = defineEmits(['bindSuccess']);
const checkedKeys = ref<NodeCheckedKeys>({
	checked: [],
	halfChecked: [],
});
const checkedIds = ref<string[]>([]);
const menuFileIds = ref<Record<string, string>>({});
const fileIds = computed(() => {
	return checkedKeys.value.checked.map((key) => menuFileIds.value[key]).filter((value) => value !== undefined);
});
const props = defineProps<{
	type: number;
	fileTemplateId: string;
}>();

const versionMenu = ref<number>(1);

const menuTree = ref([]);
const params = reactive<{ fileTemplateId: string; menuIdList: string[] }>({
	fileTemplateId: '',
	menuIdList: [],
});
function transformIdsToValues<T extends NestedItem | NestedItem[]>(data: T): any {
	if (Array.isArray(data)) {
		return data.map(transformIdsToValues);
	} else {
		const { id, fileId, label, children, fileTemplateName, version } = data;
		let bind = '';
		if (fileId && fileTemplateName && version) {
			bind = `${fileTemplateName} V${version}`;
			checkedIds.value.push(id);
			menuFileIds.value[id] = fileId;
		}
		return {
			key: id,
			title: label,
			bind,
			...(children ? { children: transformIdsToValues(children) } : {}),
		};
	}
}
function haveSameElements(arr1: string[], arr2: string[]) {
	return arr1.some((element) => arr2.includes(element));
}

const checkBind = () => {
	if (haveSameElements(checkedKeys.value.checked, checkedIds.value)) {
		Modal.confirm({
			title: '绑定确认',
			content: '已选菜单中存在之前已经绑定过的菜单，绑定后将覆盖之前模板，是否继续绑定？',
			onOk() {
				handleOk();
			},
			onCancel() {
				return;
			},
		});
	} else {
		handleOk();
	}
};

const handleOk = () => {
	params.menuIdList = checkedKeys.value.checked;
	bandWord(params).then(() => {
		message.success('绑定成功');
		emit('bindSuccess');
		open.value = false;
	});
};
const menuOptions = ref<Option[]>([]);
watch(
	() => versionMenu.value,
	(val) => {
		if (val) {
			getTemplateMenuTree({ menuVersion: val, reportType: props.type }).then((res) => {
				menuTree.value = transformIdsToValues(res);
				generateList(menuTree.value);
			});
		}
	},
	{ immediate: true },
);

onMounted(() => {
	params.fileTemplateId = props.fileTemplateId;
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
</script>

<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">绑定菜单</div>
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
					checkable
					checkStrictly
					:expanded-keys="expandedKeys"
					:auto-expand-parent="autoExpandParent"
					:tree-data="menuTree"
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
				<a-button class="mr-2" @click="open = false">取消</a-button>
				<a-button type="primary" @click="checkBind">确定</a-button>
			</div>
		</template>
	</a-drawer>
</template>

<style scoped></style>
