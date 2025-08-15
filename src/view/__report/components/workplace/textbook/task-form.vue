<script lang="ts" setup>
import { ReportMenuCourse, AuditRecordData } from '@/view/__report';
import { PlusOutlined } from '@ant-design/icons-vue';
import { uploadFile } from '@/axios/file.aip.ts';
import FileOverview from '@/view/__report/components/workplace/file-overview.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import taskComment from '../components/task-comment.vue';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});

const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const currentRecord = computed(() => {
	return props.data.tableFormData[0].data;
});

let originDescriptionLength = ref<number>(0);
let originRequirementLength = ref<number>(0);

const props = defineProps<{
	data: ReportMenuCourse;
	dataLength: number;
	type: 'edit' | 'audit' | 'preview';
	reportStatus: number;
}>();

const emits = defineEmits(['update', 'approved']);

const descriptionRowSpan = computed(() => {
	return currentRecord.value.taskDescriptionList.reduce((total, item) => total + item.workStepDetails.length, 0);
});

const stepRequirementRowSpan = computed(() => {
	return currentRecord.value.requirementList.reduce((total, item) => total + item.workStepDetails.length, 0);
});

const allDescriptionRowSpan = computed(() => {
	return 3 + descriptionRowSpan.value + +(props.type === 'edit');
});

const allStepRequirementRowSpan = computed(() => {
	return 3 + stepRequirementRowSpan.value + +(props.type === 'edit');
});

const inputFile = ref<HTMLInputElement>();
const uploadFlag = ref(false);
const handleInputFile = () => {
	if (inputFile.value?.files) {
		Object.keys(inputFile.value.files).forEach((key) => {
			uploadFile(inputFile.value?.files?.item(+key)!).then((res) => {
				if (type.value === 0) {
					currentRecord.value.referenceResourceList.push({
						fileId: res.data.id,
						fileName: res.data.originalFileName,
						fileUrl: res.data.url,
					});
				} else if (type.value === 1) {
					currentRecord.value.taskDescriptionList[index.value].files.push({
						fileId: res.data.id,
						fileName: res.data.originalFileName,
						fileUrl: res.data.url,
					});
				} else if (type.value === 2) {
					currentRecord.value.requirementList[index.value].files.push({
						fileId: res.data.id,
						fileName: res.data.originalFileName,
						fileUrl: res.data.url,
					});
				}
			});
		});
		uploadFlag.value = false;
	}
};

const type = ref<number>(0);
const index = ref<number>(-1);
const handleUploadResource = (_type: 0 | 1 | 2, _index: number) => {
	type.value = _type;
	index.value = _index;
	uploadFlag.value = true;
	setTimeout(() => {
		inputFile.value?.click();
	}, 0);
};
const handleApproved = (record: AuditRecordData | null) => {
	props.data.tableFormData[0].auditRecordData = record;
};
onMounted(() => {
	originDescriptionLength.value = currentRecord.value.taskDescriptionList.length;
	originRequirementLength.value = currentRecord.value.requirementList.length;
});
</script>

<template>
	<div style="height: calc(100vh - 286px)" class="overflow-y-auto">
		<taskComment
			:type="props.type"
			:report-status="reportStatus"
			:task-form="data"
			:data-length="dataLength"
			@update="emits('update')"
			@approved="handleApproved"
		>
			<table class="w-full table-fixed">
				<tbody>
					<tr>
						<td class="table-title text-center" colspan="14">{{ data.name }}的任务单</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="2">学习场名称</td>
						<td class="table-title text-center" colspan="12">
							{{ currentRecord.studyName }}
						</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="2">学习情境名称</td>
						<td class="table-title text-center" colspan="12">
							{{ currentRecord.contextName }}
						</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="2">学习任务名称</td>
						<td class="table-title" colspan="5">{{ currentRecord.taskName }}</td>
						<td class="table-title text-center" colspan="2">学时</td>
						<td class="table-title text-center" colspan="5">{{ currentRecord.totalTime }}学时</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="2">典型工作过程描述</td>
						<td class="table-title" colspan="12">
							{{ currentRecord.workProcess }}
						</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="2">学习目标</td>
						<td class="table-title" colspan="12">
							<div v-for="item in currentRecord.learnGoalList" class="mb-4">
								<div v-for="v in item">{{ v }}</div>
							</div>
						</td>
					</tr>
					<tr>
						<td :rowspan="allDescriptionRowSpan" class="table-title text-center" colspan="2">典型工作环节描述</td>
						<td class="table-title text-center" colspan="10">典型工作环节的具体内容</td>
						<td class="table-title text-center" colspan="2" rowspan="3">配套资源</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="3">典型工作环节</td>
						<td class="table-title text-center" colspan="7">具体步骤内容</td>
					</tr>
					<tr>
						<td class="table-title text-center">序号</td>
						<td class="table-title text-center" colspan="2">典型工作环节名称</td>
						<td class="table-title text-center">序号</td>
						<td class="table-title text-center" colspan="2">具体步骤名称（行动方向）</td>
						<td class="table-title text-center" colspan="4">
							具体步骤内容（即工作方法、工作对象、使用工具、劳动组织或工作形式、工作要求、工作成果等）
						</td>
					</tr>

					<template v-for="(step, index) in currentRecord.taskDescriptionList">
						<tr>
							<td :rowspan="step.workStepDetails.length" class="table-title text-center">{{ index + 1 }}</td>
							<td :rowspan="step.workStepDetails.length" class="table-title" colspan="2">
								<template v-if="index < originDescriptionLength">
									<div class="whitespace-pre-wrap break-words">{{step.stepName }}</div>
								</template>
								<template v-else>
									<div class="flex flex-col justify-center items-center">
										<div class="flex">
											<a-textarea
												v-model:value="step.stepName"
												:auto-size="true"
												:bordered="false"
												placeholder="请输入"
											></a-textarea>
											<a-button type="link" @click="currentRecord.taskDescriptionList.splice(index, 1)">
												<template #icon><delete-red-svg></delete-red-svg></template>
											</a-button>
										</div>
										<a-button
											type="link"
											@click="
												step.workStepDetails.push({ taskName: '', taskContent: '', taskNameId: '', taskContentId: '' })
											"
										>
											<template #icon><add-blue-svg></add-blue-svg></template>
										</a-button>
									</div>
								</template>
							</td>
							<td class="text-center table-title">{{ index + 1 }}.1</td>
							<td class="table-title" colspan="2">
								<template v-if="index < originDescriptionLength">
									<div class="whitespace-pre-wrap break-words">{{step.workStepDetails[0].taskName }}</div>
								</template>
								<template v-else>
									<a-textarea
										v-model:value="step.workStepDetails[0].taskName"
										:auto-size="true"
										:bordered="false"
										placeholder="请输入"
									></a-textarea>
								</template>
							</td>
							<td colspan="4">
								<template v-if="$props.type === 'edit'">
									<a-textarea
										v-model:value="step.workStepDetails[0].taskContent"
										:auto-size="true"
										:bordered="false"
										placeholder="请输入"
									/>
								</template>
								<template v-else>
									<div class="whitespace-pre-wrap break-words">{{step.workStepDetails[0].taskContent }}</div>
								</template>
							</td>
							<td :rowspan="step.workStepDetails.length" colspan="2">
								<a-flex vertical justify="center" align="center" v-auto-animate>
									<div v-for="(item, index) in step.files">
										<file-overview :file="item" @delete="step.files.splice(index, 1)"></file-overview>
									</div>
									<template v-if="$props.type === 'edit'">
										<a-button type="link" @click="handleUploadResource(1, index)">
											<template #icon><add-blue-svg></add-blue-svg></template>
										</a-button>
									</template>
								</a-flex>
							</td>
						</tr>
						<template v-for="(item, index1) in step.workStepDetails">
							<tr v-if="index1 !== 0">
								<td class="text-center table-title">{{ index + 1 }}.{{ index1 + 1 }}</td>
								<td class="table-title" colspan="2">
									<template v-if="index < originDescriptionLength">
										<div class="whitespace-pre-wrap break-words">{{ item.taskName }}</div>
									</template>
									<template v-else>
										<a-textarea
											v-model:value="item.taskName"
											:auto-size="true"
											:bordered="false"
											placeholder="请输入"
										></a-textarea>
									</template>
								</td>
								<td colspan="4">
									<template v-if="$props.type === 'edit'">
										<div class="flex items-center">
											<a-textarea
												v-model:value="item.taskContent"
												:auto-size="true"
												:bordered="false"
												placeholder="请输入"
											/>
											<a-button
												v-if="index >= originDescriptionLength"
												type="link"
												@click="step.workStepDetails.splice(1, index1)"
											>
												<template #icon><delete-red-svg></delete-red-svg></template>
											</a-button>
										</div>
									</template>
									<template v-else>
										<div class="whitespace-pre-wrap break-words">{{item.taskContent }}</div>
									</template>
								</td>
							</tr>
						</template>
					</template>
					<tr v-if="$props.type === 'edit'">
						<td colspan="12" class="text-center">
							<a-button
								type="link"
								@click="
									currentRecord.taskDescriptionList.push({
										stepName: '',
										workStepDetails: [{ taskContent: '', taskName: '', taskNameId: '', taskContentId: '' }],
										files: [],
									})
								"
							>
								<template #icon><add-blue-svg></add-blue-svg></template>
							</a-button>
						</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="2">学时安排</td>
						<td class="table-title">资讯</td>
						<td class="table-title">{{ currentRecord.timeArrange['1'] }}学时</td>
						<td class="table-title">计划</td>
						<td class="table-title">{{ currentRecord.timeArrange['2'] }}学时</td>
						<td class="table-title">决策</td>
						<td class="table-title">{{ currentRecord.timeArrange['3'] }}学时</td>
						<td class="table-title">实施</td>
						<td class="table-title">{{ currentRecord.timeArrange['4'] }}学时</td>
						<td class="table-title">检查</td>
						<td class="table-title">{{ currentRecord.timeArrange['5'] }}学时</td>
						<td class="table-title">评价</td>
						<td class="table-title">{{ currentRecord.timeArrange['6'] }}学时</td>
					</tr>

					<tr>
						<td :rowspan="allStepRequirementRowSpan" class="table-title text-center" colspan="2">对学生的要求</td>
						<td class="table-title text-center" colspan="10">典型工作环节的具体要求</td>
						<td class="table-title text-center" colspan="2" rowspan="3">配套资源</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="3">典型工作环节</td>
						<td class="table-title text-center" colspan="7">具体步骤要求</td>
					</tr>
					<tr>
						<td class="table-title text-center">序号</td>
						<td class="table-title text-center" colspan="2">典型工作环节名称</td>
						<td class="table-title text-center">序号</td>
						<td class="table-title text-center" colspan="2">具体步骤名称（行动方向）</td>
						<td class="table-title text-center" colspan="4">具体步骤的职业伦理道德要求</td>
					</tr>
					<template v-for="(step, index) in currentRecord.requirementList">
						<tr>
							<td :rowspan="step.workStepDetails.length" class="text-center table-title">{{ index + 1 }}</td>
							<td :rowspan="step.workStepDetails.length" class="table-title" colspan="2">
								<template v-if="index < originRequirementLength">
									{{ step.stepName }}
								</template>
								<template v-else>
									<div class="flex flex-col justify-center items-center">
										<div class="flex">
											<a-textarea
												v-model:value="step.stepName"
												:auto-size="true"
												:bordered="false"
												placeholder="请输入"
											></a-textarea>
											<a-button type="link" @click="currentRecord.requirementList.splice(index, 1)">
												<template #icon><delete-red-svg></delete-red-svg></template>
											</a-button>
										</div>
										<a-button
											type="link"
											@click="
												step.workStepDetails.push({ taskName: '', taskContent: '', taskNameId: '', taskContentId: '' })
											"
										>
											<template #icon><add-blue-svg></add-blue-svg></template>
										</a-button>
									</div>
								</template>
							</td>
							<td class="text-center table-title">{{ index + 1 }}.1</td>
							<td class="table-title" colspan="2">
								<template v-if="index >= originRequirementLength">
									<a-textarea
										v-model:value="step.workStepDetails[0].taskName"
										:auto-size="true"
										:bordered="false"
										placeholder="请输入"
									></a-textarea>
								</template>
								<template v-else>
									{{ step.workStepDetails[0].taskName }}
								</template>
							</td>
							<td colspan="4">
								<template v-if="$props.type === 'edit'">
									<a-textarea
										v-model:value="step.workStepDetails[0].taskContent"
										:auto-size="true"
										:bordered="false"
										placeholder="请输入"
									/>
								</template>
								<template v-else>
									<div class="whitespace-pre-wrap break-words">{{step.workStepDetails[0].taskContent }}</div>
								</template>
							</td>
							<td :rowspan="step.workStepDetails.length" colspan="2">
								<a-flex vertical justify="center" align="center" v-auto-animate>
									<div v-for="(item, index) in step.files">
										<file-overview :file="item" @delete="step.files.splice(index, 1)"></file-overview>
									</div>
									<template v-if="$props.type === 'edit'">
										<a-button type="link" @click="handleUploadResource(2, index)">
											<template #icon><add-blue-svg></add-blue-svg></template>
										</a-button>
									</template>
								</a-flex>
							</td>
						</tr>
						<template v-for="(item, index1) in step.workStepDetails">
							<tr v-if="index1 !== 0">
								<td class="text-center table-title">{{ index + 1 }}.{{ index1 + 1 }}</td>
								<td class="table-title" colspan="2">
									<template v-if="index >= originRequirementLength">
										<a-textarea
											v-model:value="item.taskName"
											:auto-size="true"
											:bordered="false"
											placeholder="请输入"
										></a-textarea>
									</template>
									<template v-else>
										{{ item.taskName }}
									</template>
								</td>
								<td colspan="4">
									<template v-if="$props.type === 'edit'">
										<div class="flex">
											<a-textarea
												v-model:value="item.taskContent"
												:auto-size="true"
												:bordered="false"
												placeholder="请输入"
											/>
											<a-button
												v-if="index >= originRequirementLength"
												type="link"
												@click="step.workStepDetails.splice(index1, 1)"
											>
												<template #icon><delete-red-svg></delete-red-svg></template>
											</a-button>
										</div>
									</template>
									<template v-else>
										<div class="whitespace-pre-wrap break-words">{{ item.taskContent }}</div>
									</template>
								</td>
							</tr>
						</template>
					</template>
					<tr v-if="$props.type === 'edit'">
						<td colspan="12" class="text-center">
							<a-button
								type="link"
								@click="
									currentRecord.requirementList.push({
										stepName: '',
										workStepDetails: [{ taskContent: '', taskName: '', taskNameId: '', taskContentId: '' }],
										files: [],
									})
								"
							>
								<template #icon>
									<add-blue-svg></add-blue-svg>
								</template>
							</a-button>
						</td>
					</tr>
					<tr>
						<td class="table-title text-center" colspan="2" rowspan="2">参考资料</td>
						<td class="text-center table-title">参考资料名称</td>
						<td colspan="11" v-auto-animate>
							<div
								v-for="(item, index) in currentRecord.referenceResourceNameList"
								class="flex rounded group"
								:class="$props.type === 'edit' ? 'hover:bg-black/5' : ''"
							>
								<template v-if="$props.type === 'edit'">
									<a-input
										v-model:value="currentRecord.referenceResourceNameList[index]"
										:bordered="false"
										placeholder="在此处输入参考资料名称"
									>
										<template #prefix>
											<span class="font-mono">{{ index + 1 }}.</span>
										</template>
									</a-input>
									<a-button
										class="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
										danger
										type="link"
										@click="currentRecord.referenceResourceNameList.splice(index, 1)"
									>
										<template #icon>
											<i class="bi bi-trash3"></i>
										</template>
									</a-button>
								</template>
								<template v-else>
									<span class="font-mono">{{ index + 1 }}.</span>
									<span>{{ item }}</span>
								</template>
							</div>
							<template v-if="$props.type === 'edit'">
								<a-button type="link" @click="currentRecord.referenceResourceNameList.push('')"> 添加一项</a-button>
							</template>
						</td>
					</tr>
					<tr>
						<td class="text-center table-title">参考资源</td>
						<td colspan="11">
							<div class="py-2">
								<a-flex wrap="wrap" gap="middle" v-auto-animate>
									<file-overview
										v-for="(item, index) in currentRecord.referenceResourceList"
										:file="item"
										@delete="currentRecord.referenceResourceList.splice(index, 1)"
									></file-overview>
									<template v-if="$props.type === 'edit'">
										<a-button class="w-[60px] h-[60px]" type="dashed" @click="handleUploadResource(0, -1)">
											<template #icon>
												<div class="flex flex-col justify-center items-center">
													<PlusOutlined />
													添加
												</div>
											</template>
										</a-button>
									</template>
								</a-flex>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</taskComment>
	</div>
	<input v-if="uploadFlag" ref="inputFile" class="hidden" multiple type="file" @input="handleInputFile" />
</template>

<style scoped>
table,
td {
	border-collapse: collapse;
	border: 1px solid v-bind(borderColor);
	line-height: 32px;
	padding: 0 8px;
	text-wrap: wrap;
}
.table-title {
	background-color: v-bind(cardDisableColor);
}
</style>
