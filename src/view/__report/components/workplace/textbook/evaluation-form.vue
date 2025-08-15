<script lang="ts" setup>
import {
	CheckFormData,
	defaultReportLooseLeafFormData,
	EvaluationFormData,
	ReportMenuLooseLeaf,
} from '@/view/__report';
import useAppTheme from '@/hooks/useAppTheme.ts';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import commonComment from '../components/common-comment.vue';

defineProps<{ type: 'edit' | 'audit' | 'preview'; reportStatus: number }>();
const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const tabsForm = inject<ReportMenuLooseLeaf>('tabsForm', defaultReportLooseLeafFormData);

const currentRecord = computed(() => {
	return tabsForm?.tableFormData[5].data as EvaluationFormData;
});
const handleAdd = () => {
	currentRecord.value.evaluateList.push({
		stageResult: '',
		evaluationDimension: '',
		groupSelfEvaluation: '',
		groupMutualEvaluation: '',
		teacherMutualEvaluation: '',
	});
};

onMounted(() => {
	if (!tabsForm.tableFormData[5].editedFlag) {
		const { studyName, contextName, taskName, workProcess } = tabsForm.tableFormData[4].data as CheckFormData;
		tabsForm.tableFormData[5].data = {
			...tabsForm.tableFormData[5].data,
			studyName,
			contextName,
			taskName,
			workProcess,
			evaluateList: [
				{
					stageResult: '',
					evaluationDimension: '',
					groupSelfEvaluation: '',
					groupMutualEvaluation: '',
					teacherMutualEvaluation: '',
				},
			],
		};
	}
});
</script>

<template>
	<commonComment key="evaluation" :type="type" :report-status="reportStatus">
		<table class="w-full table-fixed">
			<tbody>
				<tr>
					<td class="table-title" colspan="12">{{ tabsForm.name }}的评价单</td>
				</tr>
				<tr>
					<td class="table-title min-w-36" colspan="2">学习场名称</td>
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
									class="w-28"
									:precision="1"
									v-model:value="currentRecord.totalTime"
									:bordered="false"
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
					<td class="table-title" colspan="2">典型工作过程描述</td>
					<td class="table-title" colspan="10">{{ currentRecord.workProcess }}</td>
				</tr>
				<tr>
					<td class="table-title" colspan="4">阶段性成果</td>
					<td class="table-title" colspan="2">评价维度（对阶段性结果进行整体性评价的维度，不能少于3个维度）</td>
					<td class="table-title" colspan="2">学生/小组自评</td>
					<td class="table-title" colspan="2">学生/组间互评</td>
					<td class="table-title" colspan="2">教师互评</td>
				</tr>
				<tr v-for="(evaluate, index) in currentRecord.evaluateList">
					<td colspan="4" class="text-left">
						<a-textarea
							v-if="type === 'edit'"
							v-model:value="evaluate.stageResult"
							:bordered="false"
							:auto-size="true"
							placeholder="请输入"
						></a-textarea>
						<div v-else>{{ evaluate.stageResult }}</div>
					</td>
					<td colspan="2" class="text-left">
						<a-textarea
							v-if="type === 'edit'"
							v-model:value="evaluate.evaluationDimension"
							:bordered="false"
							:auto-size="true"
							placeholder="请输入"
						></a-textarea>
						<div v-else>{{ evaluate.evaluationDimension }}</div>
					</td>
					<td colspan="2">
						<a-textarea
							v-if="type === 'edit'"
							v-model:value="evaluate.groupSelfEvaluation"
							:bordered="false"
							:auto-size="true"
							disabled
						></a-textarea>
						<div v-else>{{ evaluate.groupSelfEvaluation }}</div>
					</td>
					<td colspan="2">
						<a-textarea
							v-if="type === 'edit'"
							v-model:value="evaluate.groupMutualEvaluation"
							:bordered="false"
							:auto-size="true"
							disabled
						></a-textarea>
						<div v-else>{{ evaluate.groupMutualEvaluation }}</div>
					</td>
					<td colspan="2">
						<div class="flex justify-between items-center">
							<a-textarea
								v-if="type === 'edit'"
								v-model:value="evaluate.teacherMutualEvaluation"
								:bordered="false"
								:auto-size="true"
								disabled
							></a-textarea>
							<div v-else>{{ evaluate.teacherMutualEvaluation }}</div>
							<a-button v-if="type === 'edit'" type="link" @click="currentRecord.evaluateList.splice(index, 1)">
								<template #icon><delete-red-svg></delete-red-svg></template>
							</a-button>
						</div>
					</td>
				</tr>
				<tr v-if="type === 'edit'">
					<td colspan="12">
						<a-button type="link" @click="handleAdd">
							<template #icon><add-blue-svg></add-blue-svg></template>
						</a-button>
					</td>
				</tr>
				<tr>
					<td class="table-title" colspan="2" rowspan="2">评价单的评分</td>
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
