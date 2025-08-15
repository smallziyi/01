<script lang="ts" setup>
import {
	defaultReportLooseLeafFormData,
	defaultTaskFormData,
	InformationFormData,
	ReportMenuLooseLeaf,
	TaskForm,
} from '@/view/__report';
import { uploadFile } from '@/axios/file.aip.ts';
import { PlusOutlined } from '@ant-design/icons-vue';
import FileOverview from '@/view/__report/components/workplace/file-overview.vue';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import _ from 'lodash';
import useAppTheme from '@/hooks/useAppTheme.ts';
import commonComment from '../components/common-comment.vue';

const props = defineProps<{ type: 'edit' | 'audit' | 'preview'; reportStatus: number }>();
const emits = defineEmits(['approved']);
const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const taskForm = inject<TaskForm>('taskForm', defaultTaskFormData);
const tabsForm = inject<ReportMenuLooseLeaf>('tabsForm', defaultReportLooseLeafFormData);

const stepIndex = +tabsForm.sort;
const currentRecord = computed(() => {
	return tabsForm?.tableFormData[0].data as InformationFormData;
});
let originDescriptionLength = ref<number>(0);
let originRequirementLength = ref<number>(0);

const descriptionRowSpan = computed(() => {
	return currentRecord.value.stepDescriptionList?.length + 1 + (props.type === 'edit' ? 1 : 0);
});

const stepRequirementRowSpan = computed(() => {
	return currentRecord.value.stepRequirementList?.workStepDetails.length + 3 + (props.type === 'edit' ? 1 : 0);
});

const searchInformationRowSoan = computed(() => {
	return currentRecord.value.searchInformationMethod.length + (props.type === 'edit' ? 1 : 0);
});

onMounted(() => {
	if (!tabsForm.tableFormData[0].editedFlag) {
		const {
			taskDescriptionList,
			studyName,
			requirementList,
			contextName,
			taskName,
			workProcess,
			referenceResourceList,
		} = taskForm;
		tabsForm.tableFormData[0].data = {
			...tabsForm.tableFormData[0].data,
			studyName,
			contextName,
			taskName,
			workProcess,
			referenceResourceList,
			stepDescriptionList: _.cloneDeep(taskDescriptionList[stepIndex - 1].workStepDetails),
			stepRequirementList: _.cloneDeep(requirementList[stepIndex - 1]),
			searchInformationMethod: [''],
		};
	}
	originDescriptionLength.value = currentRecord.value.stepDescriptionList.length;
	originRequirementLength.value = currentRecord.value.stepRequirementList.workStepDetails.length;
});

const uploadType = ref<number>(0);
const inputFile = ref<HTMLInputElement>();
const uploadFlag = ref(false);
const handleUploadResource = (type: 0 | 1) => {
	uploadType.value = type;
	uploadFlag.value = true;
	setTimeout(() => {
		inputFile.value?.click();
	}, 0);
};
const handleInputFile = () => {
	if (inputFile.value?.files) {
		Object.keys(inputFile.value.files).forEach((key) => {
			uploadFile(inputFile.value?.files?.item(+key)!).then((res) => {
				if (uploadType.value === 0) {
					currentRecord.value.referenceResourceList.push({
						fileId: res.data.id,
						fileName: res.data.originalFileName,
						fileUrl: res.data.url,
					});
				} else if (uploadType.value === 1) {
					currentRecord.value.stepRequirementList.files.push({
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
</script>

<template>
	<commonComment :type="type" :report-status="reportStatus" @approved="(record) => emits('approved', record)">
		<table class="w-full table-fixed">
			<tbody>
				<tr>
					<td colspan="12" class="table-title">{{ tabsForm.name }}的资讯单</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习场名称</td>
					<td colspan="10" class="table-title">{{ taskForm.studyName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习情境名称</td>
					<td colspan="10" class="table-title">{{ currentRecord.contextName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习任务名称</td>
					<td colspan="4" class="table-title">{{ currentRecord.taskName }}</td>
					<td colspan="2" class="table-title">学时</td>
					<td colspan="4" class="table-title">
						<div class="flex justify-center">
							<template v-if="type === 'edit'">
								<a-input-number
									v-model:value="currentRecord.totalTime"
									:bordered="false"
									:precision="1"
									class="w-28"
									placeholder="请输入"
								></a-input-number>
							</template>
							<template v-else>
								{{ currentRecord.totalTime }}
							</template>
							<div>学时</div>
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">典型工作过程描述</td>
					<td colspan="10" class="table-title">{{ currentRecord.workProcess }}</td>
				</tr>
				<tr>
					<td :rowspan="searchInformationRowSoan" colspan="2" class="table-title">搜集资讯的方式</td>
					<td colspan="10" class="text-left">
						<template v-if="type === 'edit'">
							<a-textarea
								v-model:value="currentRecord.searchInformationMethod[0]"
								:auto-size="true"
								:bordered="false"
								placeholder="请输入"
							></a-textarea>
						</template>
						<template v-else>
							<div class="whitespace-pre-wrap break-words">{{currentRecord.searchInformationMethod[0] }}</div>
						</template>
					</td>
				</tr>
				<template v-for="(searchInformation, index) in currentRecord.searchInformationMethod">
					<tr v-if="index !== 0">
						<td colspan="10" class="text-left">
							<div class="flex justify-between">
								<template v-if="type === 'edit'">
									<a-textarea
										v-model:value="currentRecord.searchInformationMethod[index]"
										:auto-size="true"
										:bordered="false"
										placeholder="请输入"
									></a-textarea>
									<a-button type="link" @click="currentRecord.searchInformationMethod.splice(index, 1)">
										<template #icon>
											<delete-red-svg></delete-red-svg>
										</template>
									</a-button>
								</template>
								<template v-else>
									<div class="whitespace-pre-wrap break-words">{{searchInformation }}</div>
								</template>
							</div>
						</td>
					</tr>
				</template>
				<tr v-if="type === 'edit'">
					<td colspan="10">
						<a-button type="link" @click="currentRecord.searchInformationMethod.push('')">
							<template #icon>
								<add-blue-svg></add-blue-svg>
							</template>
						</a-button>
					</td>
				</tr>
				<tr>
					<td :rowspan="descriptionRowSpan" colspan="2" class="table-title">资讯描述</td>
					<td class="table-title">序号</td>
					<td colspan="2" class="table-title">具体步骤名称（行动方向）</td>
					<td colspan="7" class="table-title">
						具体步骤内容（即工作方法、工作对象、使用工具、劳动组织或工作形式、工作要求、工作成果等）
					</td>
				</tr>
				<tr v-for="(stepDescription, index) in currentRecord.stepDescriptionList">
					<td class="table-title">{{ stepIndex }}.{{ index + 1 }}</td>
					<td class="table-title" colspan="2">
						<div v-if="index < originDescriptionLength">
							<div class="whitespace-pre-wrap break-words">{{ stepDescription.taskName }}</div>
						</div>
						<div v-else>
							<template v-if="type === 'edit'">
								<a-textarea
									v-model:value="stepDescription.taskName"
									:auto-size="true"
									:bordered="false"
									placeholder="请输入"
								></a-textarea>
							</template>
							<template v-else>
								<div class="whitespace-pre-wrap break-words">{{stepDescription.taskName }}</div>
							</template>
						</div>
					</td>
					<td colspan="7" class="text-left">
						<div>
							<template v-if="type === 'edit'">
								<div class="flex justify-between">
									<a-textarea
										v-model:value="stepDescription.taskContent"
										:auto-size="true"
										:bordered="false"
										placeholder="请输入"
									></a-textarea>
									<a-button
										v-if="index >= originDescriptionLength"
										type="link"
										@click="currentRecord.stepDescriptionList.splice(index, 1)"
									>
										<template #icon>
											<delete-red-svg></delete-red-svg>
										</template>
									</a-button>
								</div>
							</template>
							<template v-else>
								<div class="whitespace-pre-wrap break-words">{{ stepDescription.taskContent }}</div>
							</template>
						</div>
					</td>
				</tr>
				<tr v-if="type === 'edit'">
					<td colspan="10">
						<a-button
							type="link"
							@click="
								currentRecord.stepDescriptionList.push({
									taskName: '',
									taskContent: '',
									taskNameId: '',
									taskContentId: '',
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
					<td :rowspan="stepRequirementRowSpan" colspan="2" class="table-title">
						对学生的要求（特指搜集资讯时需要注意的伦理道德要求；即信息搜集传播等涉及到的保密工作）
					</td>
					<td class="table-title">说明</td>
					<td colspan="9" class="table-title">请根据搜集资讯的伦理道德要求进行修改</td>
				</tr>
				<tr>
					<td class="table-title" colspan="8">具体内容</td>
					<td class="table-title" rowspan="2" colspan="2">配套资源</td>
				</tr>
				<tr>
					<td class="table-title">序号</td>
					<td class="table-title" colspan="2">具体步骤名称（行动方向）</td>
					<td class="table-title" colspan="5">具体步骤的职业伦理道德要求</td>
				</tr>
				<tr v-for="(stepRequirement, index) in currentRecord.stepRequirementList?.workStepDetails">
					<td class="table-title">{{ stepIndex }}.{{ index + 1 }}</td>
					<td colspan="2" class="table-title">
						<template v-if="index < originRequirementLength">
							<div class="whitespace-pre-wrap break-words">{{stepRequirement.taskName }}</div>
						</template>
						<template v-else>
							<template v-if="type === 'edit'">
								<a-textarea
									v-model:value="stepRequirement.taskName"
									:auto-size="true"
									:bordered="false"
									placeholder="请输入"
								></a-textarea>
							</template>
							<template v-else>
								<div class="whitespace-pre-wrap break-words">{{ stepRequirement.taskName }}</div>
							</template>
						</template>
					</td>
					<td colspan="5" class="text-left">
						<div>
							<template v-if="type === 'edit'">
								<div class="flex justify-between">
								<a-textarea
									v-model:value="stepRequirement.taskContent"
									:auto-size="true"
									:bordered="false"
									placeholder="请输入"
								></a-textarea>
								<a-button
									v-if="index >= originRequirementLength"
									type="link"
									@click="currentRecord.stepRequirementList.workStepDetails.splice(index, 1)"
								>
									<template #icon>
										<delete-red-svg></delete-red-svg>
									</template>
								</a-button>
							</div>
							</template>
							<template v-else>
								<div class="whitespace-pre-wrap break-words">{{ stepRequirement.taskContent }}</div>
							</template>
						</div>
					</td>
					<td v-if="index === 0" colspan="2" :rowspan="stepRequirementRowSpan - 3">
						<a-flex vertical justify="center" align="center">
							<div v-for="item in currentRecord.stepRequirementList.files">
								<file-overview :file="item"></file-overview>
							</div>
							<template v-if="$props.type === 'edit'">
								<a-button type="link" @click="handleUploadResource(1)">
									<template #icon><add-blue-svg></add-blue-svg></template>
								</a-button>
							</template>
						</a-flex>
					</td>
				</tr>
				<tr v-if="type === 'edit'">
					<td colspan="8">
						<a-button
							type="link"
							@click="() => currentRecord.stepRequirementList?.workStepDetails.push({ taskName: '', taskContent: '' })"
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
					<td colspan="9">
						<div
							v-for="(item, index) in currentRecord.referenceResourceNameList"
							class="flex hover:bg-black/5 rounded group"
						>
							<template v-if="type === 'edit'">
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
							<template v-else>{{ item }}</template>
						</div>
						<template v-if="type === 'edit'">
							<a-button type="link" @click="currentRecord.referenceResourceNameList.push('')"> 添加一项</a-button>
						</template>
					</td>
				</tr>
				<tr>
					<td class="text-center table-title">参考资源</td>
					<td colspan="9">
						<div class="py-2">
							<a-flex wrap="wrap" gap="middle">
								<file-overview v-for="item in currentRecord.referenceResourceList" :file="item"></file-overview>
								<template v-if="$props.type === 'edit'">
									<a-button class="w-[60px] h-[60px]" type="dashed" @click="handleUploadResource(0)">
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
				<tr>
					<td rowspan="2" colspan="2" class="table-title">资讯单的评分</td>
					<td colspan="2" class="table-title">班级</td>
					<td colspan="2"></td>
					<td colspan="2">第____组</td>
					<td colspan="2" class="table-title">组长签字</td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">教师签字</td>
					<td colspan="2"></td>
					<td colspan="2" class="table-title">日期</td>
					<td colspan="4"></td>
				</tr>
				<tr>
					<td colspan="2"></td>
					<td colspan="10">
						<div class="text-left">评语:</div>
						<div class="text-left">
							系统根据评分会自动生成评语，允许二次修改。<br />
							1.5分（优秀），很棒！请继续保持，不要骄傲；<br />
							2.4分（良好），请继续保持，在____方面需要加强；<br />
							3.3分（及格），在____方面有所欠缺，请努力提高；<br />
							4.小于3分（不及格），请根据系统推送的学习资料，抓紧时间全方位提升，不要气馁。
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</commonComment>
	<input v-if="uploadFlag" ref="inputFile" class="hidden" multiple type="file" @input="handleInputFile" />
</template>

<style scoped>
table,
td {
	text-align: center;
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
