<script setup lang="ts">
import { TreeNode } from '@/utils/tree.ts';
import { StructureData } from '@/view/__report';
import { Modal } from 'ant-design-vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import AddSquareSvg from '@/assets/icons/add-square.svg';
import DeleteSquareSvg from '@/assets/icons/delete-square.svg';
import CopySvg from '@/assets/icons/copy.svg';

// @ts-ignore
import { Snowyflake, Epoch } from 'snowyflake';
import { getMenuCourseTree } from '@/axios';

const snowyflake = new Snowyflake({
	workerId: 1n,
	epoch: Epoch.Twitter, // BigInt timestamp
});

const { appTheme } = useAppTheme();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
// const borderColor = computed(() => {
// 	return appTheme.value === 'white' ? '#b4d3ff' : '#626E9F';
// });

const data = ref<Array<StructureData>>([]);
const placeholderText = (index: number) => {
	switch (index) {
		case 0:
			return '具体任务';
		case 1:
			return '工作方法';
		case 2:
			return '工作对象';
		case 3:
			return '使用工具';
		case 4:
			return '职业伦理道德要求';
		case 5:
			return '工作形式';
		case 6:
			return '技术要求';
		case 7:
			return '工作成果';
		default:
			return '职业要求';
	}
};
const props = defineProps<{
	reportId: string;
}>();
const resetData = () => {
	data.value = [];
};
defineExpose({
	data,
	resetData,
});

// 结构转换
const processStudyStep = (nodes: StructureData[]): StructureData[] => {
	return nodes.map((node) => {
		const newNode: StructureData = { ...node };
		// 如果对象的 type 是 "studyStep" 并且有 occupationQuality
		if (newNode.type === 'studyStep' && newNode.occupationQuality) {
			const occupationQualityData: any = newNode.occupationQuality as any;
			newNode.children = occupationQualityData.map((occ: any) => {
				return {
					id: snowyflake.nextId().toString(),
					parentId: newNode.id,
					name: '',
					sort: 1,
					level: 4,
					type: 'studyOccupationQuality',
					occupationQuality: occ,
					children: [],
				};
			});
			newNode.occupationQuality = undefined;
		}
		// 递归处理子节点并返回新节点
		if (newNode.children) {
			newNode.children = processStudyStep(newNode.children);
		}
		return newNode;
	});
};

onMounted(() => {
	// 获取数据
	getMenuCourseTree(props.reportId).then((res) => {
		if (res && res.length > 0) {
			// @ts-ignore
			const a = processStudyStep(res);
			data.value = a;
		}
	});
});

const initData = (type: 'studyContext' | 'studyTask' | 'studyStep' | 'studyOccupationQuality', parentId?: string) => {
	const studyContextData: StructureData = {
		id: snowyflake.nextId().toString(),
		parentId: '0',
		name: '',
		sort: 1,
		type: 'studyContext',
		level: 1,
		children: [],
	};
	const studyTaskData: StructureData = {
		id: snowyflake.nextId().toString(),
		parentId: type === 'studyContext' ? parentId || studyContextData.id : studyContextData.id,
		name: '',
		sort: 1,
		type: 'studyTask',
		level: 2,
		children: [],
	};
	const studyStepData: StructureData = {
		id: snowyflake.nextId().toString(),
		parentId: type === 'studyTask' ? parentId || studyTaskData.id : studyTaskData.id,
		name: '',
		sort: 1,
		level: 3,
		type: 'studyStep',
		children: [],
	};
	const studyOccupationQualityData: StructureData = {
		id: snowyflake.nextId().toString(),
		parentId: type === 'studyStep' ? parentId || studyStepData.id : studyStepData.id,
		name: '',
		sort: 1,
		level: 4,
		type: 'studyOccupationQuality',
		occupationQuality: {
			task: '',
			workMethod: '',
			workObject: '',
			tool: '',
			ethics: '',
			workOrganization: '',
			targetValue: '',
			product: '',
		},
		children: [],
	};
	studyStepData.children.push(studyOccupationQualityData);
	studyTaskData.children.push(studyStepData);
	studyContextData.children.push(studyTaskData);
	switch (type) {
		case 'studyContext':
			return studyTaskData;
		case 'studyTask':
			return studyStepData;
		case 'studyStep':
			return studyOccupationQualityData;
		default:
			return studyContextData;
	}
};

const countLeafNodes = (node: TreeNode): number => {
	if (!node.children || node.children.length === 0) {
		node.leafCount = 0;
	} else {
		let leafCount = 0;
		for (let child of node.children) {
			leafCount += countLeafNodes(child);
		}
		if (node.children.every((child: TreeNode) => !child.children || child.children.length === 0)) {
			leafCount += node.children.length;
		}
		node.leafCount = leafCount;
	}
	return node.leafCount;
};

function findObjectById(array: StructureData[], targetId: string): StructureData | null {
	for (let i = 0; i < array.length; i++) {
		const element = array[i];
		if (element.id === targetId) {
			return element;
		}
		if (element.children && element.children.length > 0) {
			const result = findObjectById(element.children, targetId);
			if (result) {
				return result;
			}
		}
	}
	return null; // 如果没有找到则返回null
}

const initTableData = () => {
	const newData = initData('studyOccupationQuality');
	data.value.push(newData);
};
const handleAdd = (item: StructureData) => {
	const newData = initData(item.type, item.id);
	item.children.push(newData);
};

const handleDelete = (item: StructureData) => {
	Modal.confirm({
		title: '删除确认',
		content: '删除后数据将无法恢复，确定要删除吗？',
		onOk: () => {
			if (item.type === 'studyContext') {
				data.value = data.value.filter((data) => data.id !== item.id);
			} else {
				const findObj = findObjectById(data.value, item.parentId);
				if (findObj?.children) {
					findObj.children = findObj?.children.filter((data) => data.id !== item.id);
				}
			}
		},
	});
};

const deepCloneWithNewIds = (node: StructureData): StructureData => {
	// 创建新对象并分配新ID
	const newNode: StructureData = {
		...node,
		id: snowyflake.nextId().toString(),
		// 深拷贝 occupationQuality 对象
		occupationQuality: node.occupationQuality ? { ...node.occupationQuality } : undefined
	};

	// 如果有子节点，递归处理
	if (newNode.children && newNode.children.length > 0) {
		newNode.children = newNode.children.map((child) => {
			const clonedChild = deepCloneWithNewIds(child);
			// 更新子节点的parentId为新节点的id
			clonedChild.parentId = newNode.id;
			return clonedChild;
		});
	}
	return newNode;
};

const handleCopy = (item: StructureData) => {
	const clonedItem = deepCloneWithNewIds(item);
	data.value.push(clonedItem);
	console.log(data.value);
	
};

const handleCopy1 = (item: StructureData) => {
	const a = data.value.find((i) => i.id === item.parentId);
	if (a) {
		const clonedItem = deepCloneWithNewIds(item);
		a.children.push(clonedItem);
		console.log(data.value);
	}
};

const handleCopy2 = (parentId: string, item: StructureData) => {
	const a = data.value.find((i) => i.id === parentId);
	if (a) {
		const clonedItem = deepCloneWithNewIds(item);
		a.children[0].children.push(clonedItem);
		console.log(data.value);
	}
};
const handleCopy3 = (parentId: string, item: StructureData) => {
	const a = data.value.findIndex((i) => i.id === parentId);
	const b = data.value[a].children.findIndex((i) => i.id === item.parentId);
	if (b !== -1) {
		const clonedItem = deepCloneWithNewIds(item);
		data.value[a].children[b].children.push(clonedItem);
		console.log(data.value);
	}
};
</script>

<template>
	<div class="overflow-y-auto" style="height: calc(100vh - 150px)">
		<table class="w-full table-fixed">
			<caption class="font-bold">
				职业要求概览总表
			</caption>
			<tbody>
				<tr :style="{ 'background-color': `${cardBgColor}` }">
					<td rowspan="5">学习情境</td>
					<td rowspan="5">学习性工作任务</td>
					<td rowspan="5">典型工作环节</td>
					<td colspan="8">职业要求 / 职业标准的表达方式</td>
				</tr>
				<tr :style="{ 'background-color': `${cardBgColor}` }">
					<td>具体任务(具体步骤 N = 7 ± 2)</td>
					<td>工作方法</td>
					<td>工作对象</td>
					<td>使用工具</td>
					<td>职业伦理道德要求</td>
					<td>劳动组织或工作形式</td>
					<td>工作要求</td>
					<td>工作成果</td>
				</tr>
				<tr :style="{ 'background-color': `${cardBgColor}` }">
					<td>行为</td>
					<td colspan="5">条件</td>
					<td>标准</td>
					<td>结果</td>
				</tr>
				<tr :style="{ 'background-color': `${cardBgColor}` }">
					<td colspan="8">工作过程系统化课程开发范式所要求的表达方式</td>
				</tr>
				<tr :style="{ 'background-color': `${cardBgColor}` }">
					<td>行动方向(7 ± 2)</td>
					<td colspan="5">保障措施</td>
					<td>目标值</td>
					<td>(产品)</td>
				</tr>
				<template v-for="item in data">
					<tr>
						<td :rowspan="countLeafNodes(item)">
							<div class="flex flex-col items-center">
								<a-textarea
									v-model:value="item.name"
									placeholder="学习情境"
									:auto-size="true"
									:bordered="false"
								></a-textarea>
								<div class="w-full flex justify-around items-center">
									<a-button
										v-if="data.length > 1"
										size="small"
										class="flex justify-center items-center"
										type="link"
										danger
										@click="handleDelete(item)"
									>
										<template #icon>
											<delete-square-svg></delete-square-svg>
										</template>
									</a-button>
									<a-button size="small" type="link" class="flex justify-center items-center" @click="handleCopy(item)">
										<template #icon>
											<copy-svg></copy-svg>
										</template>
									</a-button>
									<a-button size="small" type="link" class="flex justify-center items-center" @click="handleAdd(item)">
										<template #icon>
											<add-square-svg></add-square-svg>
										</template>
									</a-button>
								</div>
							</div>
						</td>
						<td :rowspan="countLeafNodes(item.children[0])">
							<div class="flex flex-col items-center">
								<a-textarea
									v-model:value="item.children[0].name"
									placeholder="学习性工作任务"
									:auto-size="true"
									:bordered="false"
								></a-textarea>
								<div class="w-full flex justify-around items-center">
									<a-button
										size="small"
										class="flex justify-center items-center"
										v-if="item.children.length > 1"
										type="link"
										danger
										@click="handleDelete(item.children[0])"
									>
										<template #icon>
											<delete-square-svg></delete-square-svg>
										</template>
									</a-button>
									<a-button
										size="small"
										type="link"
										class="flex justify-center items-center"
										@click="handleCopy1(item.children[0])"
									>
										<template #icon>
											<copy-svg></copy-svg>
										</template>
									</a-button>
									<a-button
										size="small"
										type="link"
										class="flex justify-center items-center"
										@click="handleAdd(item.children[0])"
									>
										<template #icon>
											<add-square-svg></add-square-svg>
										</template>
									</a-button>
								</div>
							</div>
						</td>
						<td :rowspan="item.children[0].children[0].children.length">
							<div class="flex flex-col items-center">
								<a-textarea
									v-model:value="item.children[0].children[0].name"
									placeholder="典型工作环节"
									:auto-size="true"
									:bordered="false"
								></a-textarea>
								<div class="w-full flex justify-around items-center">
									<a-button
										size="small"
										class="flex justify-center items-center"
										v-if="item.children[0].children.length > 1"
										danger
										type="link"
										@click="handleDelete(item.children[0].children[0])"
									>
										<template #icon>
											<delete-square-svg></delete-square-svg>
										</template>
									</a-button>
									<a-button
										size="small"
										type="link"
										class="flex justify-center items-center"
										@click="handleCopy2(item.children[0].parentId, item.children[0].children[0])"
										><template #icon> <copy-svg></copy-svg> </template
									></a-button>
									<a-button
										size="small"
										type="link"
										class="flex justify-center items-center"
										@click="handleAdd(item.children[0].children[0])"
									>
										<template #icon>
											<add-square-svg></add-square-svg>
										</template>
									</a-button>
								</div>
							</div>
						</td>
						<template v-for="(_value, key, index) in item.children[0].children[0].children[0].occupationQuality">
							<td>
								<div class="flex items-center">
									<a-textarea
										v-model:value="item.children[0].children[0].children[0].occupationQuality![key]"
										:placeholder="placeholderText(index)"
										:auto-size="true"
										:bordered="false"
									></a-textarea>
									<a-button
										class="ml-1"
										v-if="index === 7 && item.children[0].children[0].children.length > 1"
										type="link"
										danger
										@click="handleDelete(item.children[0].children[0].children[0])"
									>
										<template #icon>
											<delete-square-svg></delete-square-svg>
										</template>
									</a-button>
								</div>
							</td>
						</template>
					</tr>
					<template v-for="(var1, index1) in item.children[0].children[0].children">
						<tr v-if="index1 !== 0">
							<td v-for="(_value1, value1Key, value1Index) in var1.occupationQuality">
								<div class="flex items-center">
									<a-textarea
										v-model:value="var1.occupationQuality![value1Key]"
										:placeholder="placeholderText(value1Index)"
										:auto-size="true"
										:bordered="false"
									></a-textarea>
									<a-button
										class="ml-1"
										v-if="value1Index === 7 && item.children[0].children[0].children.length > 1"
										type="link"
										danger
										@click="handleDelete(var1)"
									>
										<template #icon>
											<delete-square-svg></delete-square-svg>
										</template>
									</a-button>
								</div>
							</td>
						</tr>
					</template>
					<template v-for="(var2, index2) in item.children[0].children">
						<template v-if="index2 !== 0">
							<tr>
								<td :rowspan="var2.children.length">
									<div class="flex flex-col items-center">
										<a-textarea
											v-model:value="var2.name"
											placeholder="典型工作环节"
											:auto-size="true"
											:bordered="false"
										></a-textarea>
										<div class="w-full flex justify-around items-center">
											<a-button
												v-if="item.children[0].children.length > 1"
												size="small"
												class="flex justify-center items-center"
												type="link"
												danger
												@click="handleDelete(var2)"
											>
												<template #icon>
													<delete-square-svg></delete-square-svg>
												</template>
											</a-button>
											<a-button
												size="small"
												type="link"
												class="flex justify-center items-center"
												@click="handleCopy2(item.children[0].parentId, var2)"
												><template #icon> <copy-svg></copy-svg> </template
											></a-button>
											<a-button
												size="small"
												type="link"
												class="flex justify-center items-center"
												@click="handleAdd(var2)"
											>
												<template #icon>
													<add-square-svg></add-square-svg>
												</template>
											</a-button>
										</div>
									</div>
								</td>
								<td v-for="(_value2, value2Key, value2Index) in var2.children[0].occupationQuality">
									<div class="flex items-center">
										<a-textarea
											v-model:value="var2.children[0].occupationQuality![value2Key]"
											:placeholder="placeholderText(value2Index)"
											:auto-size="true"
											:bordered="false"
										></a-textarea>
										<a-button
											class="ml-1"
											v-if="value2Index === 7 && var2.children.length > 1"
											type="link"
											danger
											@click="handleDelete(var2.children[0])"
										>
											<template #icon>
												<delete-square-svg></delete-square-svg>
											</template>
										</a-button>
									</div>
								</td>
							</tr>
							<template v-for="(var3, index3) in var2.children">
								<tr v-if="index3 !== 0">
									<td v-for="(_item, itemKey, itemIndex) in var3.occupationQuality">
										<div class="flex items-center">
											<a-textarea
												v-model:value="var3.occupationQuality![itemKey]"
												:placeholder="placeholderText(itemIndex)"
												:auto-size="true"
												:bordered="false"
											></a-textarea>
											<a-button
												class="ml-1"
												v-if="itemIndex === 7 && var2.children.length > 1"
												type="link"
												danger
												@click="handleDelete(var3)"
											>
												<template #icon>
													<delete-square-svg></delete-square-svg>
												</template>
											</a-button>
										</div>
									</td>
								</tr>
							</template>
						</template>
					</template>
					<template v-for="(var4, index4) in item.children">
						<template v-if="index4 !== 0">
							<tr>
								<td :rowspan="countLeafNodes(var4)">
									<div class="flex flex-col items-center">
										<a-textarea
											v-model:value="var4.name"
											placeholder="学习性工作任务"
											:auto-size="true"
											:bordered="false"
										></a-textarea>
										<div class="w-full flex justify-around items-center">
											<a-button
												v-if="item.children.length > 1"
												size="small"
												class="flex justify-center items-center"
												type="link"
												danger
												@click="handleDelete(var4)"
											>
												<template #icon>
													<delete-square-svg></delete-square-svg>
												</template>
											</a-button>
											<a-button
												size="small"
												type="link"
												class="flex justify-center items-center"
												@click="handleCopy1(var4)"
												><template #icon> <copy-svg></copy-svg> </template
											></a-button>
											<a-button
												size="small"
												type="link"
												class="flex justify-center items-center"
												@click="handleAdd(var4)"
											>
												<template #icon>
													<add-square-svg></add-square-svg>
												</template>
											</a-button>
										</div>
									</div>
								</td>
								<td :rowspan="var4.children[0].children.length">
									<div class="flex flex-col items-center">
										<a-textarea
											v-model:value="var4.children[0].name"
											placeholder="典型工作环节"
											:auto-size="true"
											:bordered="false"
										></a-textarea>
										<div class="w-full flex justify-around items-center">
											<a-button
												v-if="var4.children.length > 1"
												size="small"
												class="flex justify-center items-center"
												danger
												type="link"
												@click="handleDelete(var4.children[0])"
											>
												<template #icon>
													<delete-square-svg></delete-square-svg>
												</template>
											</a-button>
											<a-button
												size="small"
												type="link"
												class="flex justify-center items-center"
												@click="handleCopy3(item.children[0].parentId, var4.children[0])"
												><template #icon> <copy-svg></copy-svg> </template
											></a-button>
											<a-button
												size="small"
												type="link"
												class="flex justify-center items-center"
												@click="handleAdd(var4.children[0])"
											>
												<template #icon>
													<add-square-svg></add-square-svg>
												</template>
											</a-button>
										</div>
									</div>
								</td>
								<td v-for="(_value, valueKey, valueIndex) in var4.children[0].children[0].occupationQuality">
									<div class="flex items-center">
										<a-textarea
											v-model:value="var4.children[0].children[0].occupationQuality![valueKey]"
											:placeholder="placeholderText(valueIndex)"
											:auto-size="true"
											:bordered="false"
										></a-textarea>
										<a-button
											class="ml-1"
											v-if="valueIndex === 7 && var4.children[0].children.length > 1"
											type="link"
											danger
											@click="handleDelete(var4.children[0].children[0])"
										>
											<template #icon>
												<delete-square-svg></delete-square-svg>
											</template>
										</a-button>
									</div>
								</td>
							</tr>
							<template v-for="(var5, index5) in var4.children[0].children">
								<template v-if="index5 !== 0">
									<tr>
										<td v-for="(_value, valueKey, valueIndex) in var5.occupationQuality">
											<div class="flex items-center">
												<a-textarea
													v-model:value="var5.occupationQuality![valueKey]"
													:placeholder="placeholderText(valueIndex)"
													:auto-size="true"
													:bordered="false"
												></a-textarea>
												<a-button
													class="ml-1"
													v-if="valueIndex === 7 && var4.children[0].children.length > 1"
													type="link"
													@click="handleDelete(var5)"
												>
													<template #icon>
														<delete-square-svg></delete-square-svg>
													</template>
												</a-button>
											</div>
										</td>
									</tr>
								</template>
							</template>
							<template v-for="(var6, index6) in var4.children">
								<template v-if="index6 !== 0">
									<tr>
										<td :rowspan="countLeafNodes(var6)">
											<div class="flex flex-col items-center">
												<a-textarea
													v-model:value="var6.name"
													placeholder="典型工作环节"
													:auto-size="true"
													:bordered="false"
												></a-textarea>
												<div class="w-full flex justify-around items-center">
													<a-button
														v-if="var4.children.length > 1"
														size="small"
														class="flex justify-center items-center"
														type="link"
														danger
														@click="handleDelete(var6)"
													>
														<template #icon>
															<delete-square-svg></delete-square-svg>
														</template>
													</a-button>
													<a-button
														size="small"
														type="link"
														class="flex justify-center items-center"
														@click="handleCopy3(var4.parentId, var6)"
														><template #icon> <copy-svg></copy-svg> </template
													></a-button>
													<a-button
														size="small"
														type="link"
														class="flex justify-center items-center"
														@click="handleAdd(var6)"
													>
														<template #icon>
															<add-square-svg></add-square-svg>
														</template>
													</a-button>
												</div>
											</div>
										</td>
										<td v-for="(_value, valueKey, valueIndex) in var6.children[0].occupationQuality">
											<div class="flex items-center">
												<a-textarea
													v-model:value="var6.children[0].occupationQuality![valueKey]"
													:placeholder="placeholderText(valueIndex)"
													:auto-size="true"
													:bordered="false"
												></a-textarea>
												<a-button
													class="ml-1"
													v-if="valueIndex === 7 && var6.children.length > 1"
													type="link"
													@click="handleDelete(var6.children[0])"
												>
													<template #icon>
														<delete-square-svg></delete-square-svg>
													</template>
												</a-button>
											</div>
										</td>
									</tr>
									<template v-for="(var7, index7) in var6.children">
										<template v-if="index7 !== 0">
											<tr>
												<td v-for="(_value, valueKey, valueIndex) in var7.occupationQuality">
													<div class="flex items-center">
														<a-textarea
															v-model:value="var7.occupationQuality![valueKey]"
															:placeholder="placeholderText(valueIndex)"
															:auto-size="true"
															:bordered="false"
														></a-textarea>
														<a-button
															class="ml-1"
															v-if="valueIndex === 7 && var6.children.length > 1"
															type="link"
															@click="handleDelete(var7)"
														>
															<template #icon>
																<delete-square-svg></delete-square-svg>
															</template>
														</a-button>
													</div>
												</td>
											</tr>
										</template>
									</template>
								</template>
							</template>
						</template>
					</template>
				</template>
				<tr>
					<td colspan="11">
						<div class="flex items-center justify-center">
							<a-button type="link" @click="initTableData">
								<template #icon>
									<add-square-svg></add-square-svg>
								</template>
							</a-button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
table,
td {
	border-collapse: collapse;
	border: 1px solid #b4d3ff;
	line-height: 32px;
	height: 32px;
	padding: 5px 8px;
	text-align: center;
}
</style>
