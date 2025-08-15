<template>
	<a-drawer height="100%" title="企业树结构" placement="top" :open="open" @close="onClose" class="z-20">
		<template #extra>
			<a-space>
				<a-radio-group v-model:value="arrangement">
					<a-radio-button value="horizontal">水平</a-radio-button>
					<a-radio-button value="vertical">垂直</a-radio-button>
				</a-radio-group>
				<a-button type="primary" @click="exportImg">导出图片</a-button>
				<a-button v-if="type === 'edit' && isImport" type="primary" @click="uploadExcel">导入Excel文件</a-button>
				<input ref="uploadInput" class="hidden" type="file" accept=".xlsx, .xls" @input="handleFileSelect" />
			</a-space>
		</template>
		<template v-if="loading">
			<div class="w-full h-screen flex justify-center items-center"><a-spin /></div>
		</template>
		<template v-else>
			<div v-if="arrangement === 'vertical'" class="flex relative">
				<tree-chart
					class="w-48 absolute left-0"
					:tree-data="categoriseData"
					type="categories"
					:arrangement="arrangement"
					id="categories-tree"
				/>
				<tree-chart
					v-if="data.length > 0"
					ref="dataTree"
					class="flex-1 tree-vertical"
					:tree-data="data"
					type="data"
					:arrangement="arrangement"
					id="data-tree-full"
				/>
			</div>
			<div v-else>
				<a-affix :offset-top="65">
					<div class="bg-color w-full">
						<tree-chart :tree-data="categoriseData" type="categories" :arrangement="arrangement" id="categories-tree" />
					</div>
				</a-affix>
				<tree-chart
					v-if="data.length > 0"
					ref="dataTree"
					:tree-data="data"
					class="tree-horizontal"
					type="data"
					:arrangement="arrangement"
					id="data-tree-full"
				/>
			</div>
		</template>
	</a-drawer>
</template>
<script setup lang="ts">
import TreeChart from '@/view/__report/components/structure-tree/tree-chart.vue';
import downloadUrl from '@/utils/downloadUrl.ts';
import * as XLSX from 'xlsx';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { AddTreeStructuresParams } from '@/view/__report';
import { message } from 'ant-design-vue';
import security from '@/utils/security.ts';
import { addTreeStructures, getTreeStructures } from '@/axios';

type TreeData = {
	name: string;
	children?: TreeData[];
};
interface Node {
	name: string;
	id: string;
	parentId: string;
	type: string;
	children?: Node[];
}
type RowData = {
	产业: string;
	行业: string;
	企业技术水平: string;
	典型企业: string;
	典型职业: string;
	典型岗位: string;
	典型职业角色: string;
	典型行动场: string;
	典型工作情境: string;
	典型工作任务: string;
	典型工作环节: string;
};

const router = useRouter();
let query = security.base64Decode<{ reportId: string; type: number }>(router.currentRoute.value.query.v! as string);
const props = defineProps<{
	reportName?: string;
	relationReportId?: string;
	type: 'edit' | 'view';
}>();
const loading = ref<boolean>(false);
const isImport = ref<boolean>(false);
const reportId = computed(() => {
	return query.reportId || '';
});
const uploadInput = ref<HTMLInputElement>();
function buildTree(data: RowData[]): TreeData[] {
	const tree: TreeData[] = [];

	const root: TreeData = { name: 'Root', children: [] };

	const addToTree = (node: TreeData, path: string[], value: string) => {
		if (path.length === 0) {
			node.children?.push({ name: value });
			return;
		}

		const currentLevel = path.shift()!;
		const existingNode = node.children?.find((child) => child.name === currentLevel);

		if (existingNode) {
			addToTree(existingNode, path, value);
		} else {
			const newNode: TreeData = { name: currentLevel, children: [] };
			node.children?.push(newNode);
			addToTree(newNode, path, value);
		}
	};

	data.forEach((item) => {
		const path = [
			item['产业'],
			item['行业'],
			item['企业技术水平'],
			item['典型企业'],
			item['典型职业'],
			item['典型岗位'],
			item['典型职业角色'],
			item['典型行动场'],
			item['典型工作情境'],
			item['典型工作任务'],
		];

		addToTree(root, path, item['典型工作环节']);
	});

	if (root.children) {
		tree.push(root);
	}

	return tree;
}

function excelToJson(file: File): Promise<any> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e: any) => {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, { type: 'array' });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const json = XLSX.utils.sheet_to_json(worksheet, { raw: true });
			resolve(json);
		};
		reader.readAsArrayBuffer(file);
	});
}

const open = defineModel({ type: Boolean });
const arrangement = ref<string>('horizontal');
const categoriseData = ref<TreeData[]>([
	{
		name: '报告名称',
		children: [
			{
				name: '产业',
				children: [
					{
						name: '行业',
						children: [
							{
								name: '企业技术水平',
								children: [
									{
										name: '典型企业',
										children: [
											{
												name: '典型职业',
												children: [
													{
														name: '典型岗位',
														children: [
															{
																name: '典型职业角色',
																children: [
																	{
																		name: '典型行动场',
																		children: [
																			{
																				name: '典型工作情境',
																				children: [
																					{
																						name: '典型工作任务',
																						children: [
																							{
																								name: '典型工作环节',
																							},
																						],
																					},
																				],
																			},
																		],
																	},
																],
															},
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
]);
const data = ref<TreeData[]>([]);
const dataTree = ref();
const onClose = () => {
	open.value = false;
};

const typeList = [
	'topIndustry',
	'industry',
	'companyTechnicalLevel',
	'company',
	'occupation',
	'position',
	'occupationRole',
	'psychomotor',
	'workContext',
	'workTask',
	'workStage',
];
function addIdsAndTypes(node: any, parentUUID: any, level = 0) {
	const newNode = { ...node };
	newNode.id = uuid(); // 生成UUID
	newNode.parentId = parentUUID;
	newNode.type = typeList[level]; // 设置type

	if (newNode.children) {
		newNode.children = newNode.children.map((child: any) => addIdsAndTypes(child, newNode.id, level + 1));
	}
	return newNode;
}

function flattenNestedNodes(nodes: Node[]): Node[] {
	const flatNodes: Node[] = [];
	function _flatten(node: Node) {
		flatNodes.push({ ...node, children: undefined }); // 复制并移除children属性
		if (node.children && node.children.length > 0) {
			for (const child of node.children) {
				_flatten(child);
			}
		}
	}
	for (const node of nodes) {
		_flatten(node);
	}

	return flatNodes;
}
const uploadExcel = () => {
	uploadInput.value?.click();
};
const handleFileSelect = async () => {
	const file = uploadInput.value?.files![0] as File;
	// 将 表格结构转换成 json
	const json = await excelToJson(file);
	// 将 json 结构转成树结构
	const res = buildTree(json);
	res[0].name = props.reportName || '报告名称';
	// 为每层节点添加 id parentId type
	const result = res[0]?.children?.map((child: any) => addIdsAndTypes(child, 0)) as Node[];
	// 打平数组
	const nodeList = flattenNestedNodes(result);
	const addParams: AddTreeStructuresParams = {
		reportId: reportId.value,
		structureDataList: nodeList,
	};
	data.value.length = 0;
	addTreeStructures(addParams).then(() => {
		data.value = [...res];
		message.success('导入成功！');
	});
};

const exportImg = () => {
	const myChart = dataTree.value.myChart;
	// 获取图表的 base64 编码
	const imgData = myChart.getDataURL({
		type: 'png',
		pixelRatio: 2,
		backgroundColor: '#fff',
	});
	const now = dayjs();
	const reportName = '结构树';
	const nowData = now.format('YYYY/MM/DD/ HH:mm:ss');
	const imageName = `${reportName}${nowData}.png`;
	downloadUrl(imgData, imageName);
};

const getStructure = async () => {
	loading.value = true;
	getTreeStructures(reportId.value)
		.then((res) => {
			if (res.data && res.data.length > 0) {
				data.value = [...res.data];
				if (props.relationReportId) {
					isImport.value = false;
				} else {
					isImport.value = true;
				}
			} else {
				isImport.value = true;
				message.success('请导入结构树');
			}
		})
		.finally(() => {
			loading.value = false;
		});
};

onMounted(() => {
	getStructure();
});
</script>
<style scoped>
.tree-horizontal {
	height: 640px;
	min-height: 8000px;
}
.tree-vertical {
	height: 1500px;
	min-width: 12000px;
}
.bg-color {
	background-color: rgb(254, 254, 254);
}
</style>
