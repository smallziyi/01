<script lang="ts" setup>
import { DecisionFormData, defaultReportLooseLeafFormData, PlanFormData, ReportMenuLooseLeaf } from '@/view/__report';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import useAppTheme from '@/hooks/useAppTheme.ts';
import commonComment from '../components/common-comment.vue';

defineProps<{ type: 'edit' | 'audit' | 'preview'; reportStatus: number }>();
const emits = defineEmits(['approved']);
const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});
const tabsForm = inject<ReportMenuLooseLeaf>('tabsForm', defaultReportLooseLeafFormData);
const currentRecord = computed(() => {
	return tabsForm?.tableFormData[2].data as DecisionFormData;
});

const handleAdd = () => {
	currentRecord.value.planContrastList.push({
		feasibility: '',
		accuracy: '',
		operational: '',
		implementationDifficulty: '',
		comprehensiveEvaluation: '',
	});
};

onMounted(() => {
	if (!tabsForm.tableFormData[2].editedFlag) {
		const { studyName, contextName, taskName, workProcess } = tabsForm.tableFormData[1].data as PlanFormData;
		tabsForm.tableFormData[2].data = {
			...tabsForm.tableFormData[2].data,
			studyName,
			contextName,
			taskName,
			workProcess,
			planContrastList: [
				{
					feasibility: '',
					accuracy: '',
					operational: '',
					implementationDifficulty: '',
					comprehensiveEvaluation: '',
				},
			],
		};
	}
});
</script>

<template>
	<commonComment
		key="decision"
		:type="type"
		:report-status="reportStatus"
		@approved="(record) => emits('approved', record)"
	>
		<table class="w-full table-fixed">
			<tbody>
				<tr>
					<td class="table-title" colspan="12">{{ tabsForm.name }}的决策单</td>
				</tr>
				<tr>
					<td class="table-title" colspan="2">学习场名称</td>
					<td class="table-title" colspan="10">{{ currentRecord.studyName }}</td>
				</tr>
				<tr>
					<td class="table-title" colspan="2">学习情境名称</td>
					<td class="table-title" colspan="10">{{ currentRecord.contextName }}</td>
				</tr>
				<tr>
					<td class="table-title" colspan="2">学习任务名称</td>
					<td class="table-title" colspan="4">{{ currentRecord.taskName }}</td>
					<td class="table-title" colspan="2">学时</td>
					<td class="table-title" colspan="4">
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
							<template v-else>{{ currentRecord.totalTime }}</template>
							<div>学时</div>
						</div>
					</td>
				</tr>
				<tr>
					<td class="table-title" colspan="2">典型工作过程描述</td>
					<td class="table-title" colspan="10">{{ currentRecord.workProcess }}</td>
				</tr>
				<tr>
					<td class="table-title" colspan="12">
						<a-flex justify="center" vertical>
							<div>计划对比</div>
							<div>
								（请从计划的可行性、准确性、可操作性、实施难度、友好性、经济性、环保等维度进行对比以下各个计划）
							</div>
						</a-flex>
					</td>
				</tr>
				<tr>
					<td class="table-title" colspan="2">序号</td>
					<td class="table-title" colspan="2">计划的可行性</td>
					<td class="table-title" colspan="2">计划的准确性</td>
					<td class="table-title" colspan="2">计划的可操作性</td>
					<td class="table-title" colspan="2">计划的实施难度</td>
					<td class="table-title" colspan="2">综合评价（从上述各维度对每个计划进行综合评价）</td>
				</tr>
				<tr v-for="(planContrast, index) in currentRecord.planContrastList">
					<td colspan="2">{{ index + 1 }}</td>
					<td colspan="2" class="text-left">
						<template v-if="type === 'edit'">
							<a-textarea
								v-model:value="planContrast.feasibility"
								:auto-size="true"
								:bordered="false"
								placeholder="请输入"
							></a-textarea>
						</template>
						<template v-else>
							{{ planContrast.feasibility }}
						</template>
					</td>
					<td colspan="2" class="text-left">
						<template v-if="type === 'edit'">
							<a-textarea
								v-model:value="planContrast.accuracy"
								:auto-size="true"
								:bordered="false"
								placeholder="请输入"
							></a-textarea>
						</template>
						<template v-else>{{ planContrast.accuracy }}</template>
					</td>
					<td colspan="2" class="text-left">
						<template v-if="type === 'edit'">
							<a-textarea
								v-model:value="planContrast.operational"
								:auto-size="true"
								:bordered="false"
								placeholder="请输入"
							></a-textarea>
						</template>
						<template v-else>{{ planContrast.operational }}</template>
					</td>
					<td colspan="2" class="text-left">
						<template v-if="type === 'edit'">
							<a-textarea
								v-model:value="planContrast.implementationDifficulty"
								:auto-size="true"
								:bordered="false"
								placeholder="请输入"
							></a-textarea>
						</template>
						<template v-else>{{ planContrast.implementationDifficulty }}</template>
					</td>
					<td colspan="2" class="text-left">
						<div class="flex justify-between">
							<template v-if="type === 'edit'">
								<a-textarea
									v-model:value="planContrast.comprehensiveEvaluation"
									:auto-size="true"
									:bordered="false"
									placeholder="请输入"
								></a-textarea>
								<a-button v-if="index > 0" type="link" @click="currentRecord.planContrastList.splice(index, 1)">
									<template #icon>
										<delete-red-svg></delete-red-svg>
									</template>
								</a-button>
							</template>
							<template v-else>
								{{ planContrast.comprehensiveEvaluation }}
							</template>
						</div>
					</td>
				</tr>
				<tr v-if="type === 'edit'">
					<td colspan="12">
						<a-button type="link" @click="handleAdd">
							<template #icon>
								<add-blue-svg></add-blue-svg>
							</template>
						</a-button>
					</td>
				</tr>
				<tr>
					<td class="table-title" colspan="2" rowspan="2">决策单的评分</td>
					<td class="table-title" colspan="2">班级</td>
					<td colspan="2"></td>
					<td colspan="2">第____组</td>
					<td class="table-title" colspan="2">组长签字</td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td class="table-title" colspan="2">教师签字</td>
					<td colspan="2"></td>
					<td class="table-title" colspan="2">日期</td>
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
