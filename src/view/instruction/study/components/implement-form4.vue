<script lang="ts" setup>
import { ReportMenuLooseLeaf } from '@/view/__report';

import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { getTableFormQuestion } from '@/axios';
import answerQuestionTable from './answer-question-table.vue';
import ShowQuestion from './show-question.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const props = defineProps<{
	data: ReportMenuLooseLeaf;
	questionFlag: boolean;
	isPreviewFlag: boolean;
}>();

const tableId = props.data.tableFormData[3].tableId;

const form = computed(() => {
	return props.data.tableFormData[3].data;
});
const learningPoint = computed(() => {
	return props.data.tableFormLearnPointsData.find((item) => item.tableId === tableId)?.sentencePartList!;
});

const questions = ref<Array<ReportCourseQuestion>>([]);

onMounted(() => {
	getTableFormQuestion({ tableId: props.data.tableFormData[3].tableId, studyFlag: true }).then((res) => {
		questions.value = res.data;
	});
});
</script>

<template>
	<table class="w-full table-fixed">
		<tbody>
			<tr>
				<td colspan="12" class="table-title">{{ data.name }}的实施单</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title">学习场名称</td>
				<td colspan="10" class="table-title">{{ form.studyName }}</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title">学习情境名称</td>
				<td colspan="10" class="table-title">{{ form.contextName }}</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title">学习任务名称</td>
				<td colspan="4" class="table-title">{{ form.taskName }}</td>
				<td colspan="2" class="table-title">学时</td>
				<td colspan="4" class="table-title">{{ form.totalTime }}学时</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title">典型工作过程描述</td>
				<td colspan="10" class="table-title text-left">{{ form.workProcess }}</td>
			</tr>

			<tr>
				<td colspan="2" class="table-title">序号</td>
				<td colspan="2" class="table-title">实施的具体步骤</td>
				<td colspan="8" class="table-title">注意事项</td>
			</tr>

			<template v-for="(item, index) in form.stepDescriptionList">
				<tr>
					<td colspan="2" class="table-title">{{ index + 1 }}</td>
					<td colspan="2" class="table-title">{{ item.taskName }}</td>
					<td colspan="8" class="text-left">
						<show-question
							:question-flag="questionFlag"
							:question="
								learningPoint.find((var1) => var1.learnPointsCellId === item.taskContentId)?.sentencePartList || []
							"
						/>
					</td>
				</tr>
			</template>

			<tr>
				<td rowspan="2" colspan="2" class="table-title">实施单的评分</td>
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
			<!-- <tr>
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
			</tr> -->
		</tbody>
	</table>
	<answer-question-table
		v-if="isPreviewFlag || questionFlag"
		:table-form-type="4"
		:question-flag="isPreviewFlag || questionFlag"
		:table-id="tableId"
		:questions="questions"
	/>
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
