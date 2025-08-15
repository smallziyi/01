<script lang="ts" setup>
import { ReportMenuLooseLeaf } from '@/view/__report';

import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import ShowQuestionTable from '@/view/instruction/workbook/overview/components/show-question-table.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { getTableFormQuestion } from '@/axios';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const props = defineProps<{ data: ReportMenuLooseLeaf }>();

const form = computed(() => {
	return props.data.tableFormData[2].data;
});

const questions = ref<Array<ReportCourseQuestion>>([]);

onMounted(() => {
	getTableFormQuestion({ tableId: props.data.tableFormData[2].tableId, studyFlag: true }).then((res) => {
		questions.value = res.data;
	});
});
</script>

<template>
	<template v-if="$props.data.tableFormData[2].showFlag">
		<table class="w-full">
			<tbody>
				<tr>
					<td colspan="12" class="table-title">{{ data.name }}的决策单</td>
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
					<td colspan="10" class="table-title">{{ form.workProcess }}</td>
				</tr>
				<tr>
					<td colspan="12" class="table-title">计划对比</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">序号</td>
					<td colspan="2" class="table-title">计划的可行性</td>
					<td colspan="2" class="table-title">计划的准确性</td>
					<td colspan="2" class="table-title">计划的可操作性</td>
					<td colspan="2" class="table-title">计划的实施难度</td>
					<td colspan="2" class="table-title">综合评价</td>
				</tr>
				<template v-for="(item, index) in form.planContrastList">
					<tr>
						<td colspan="2">{{ index + 1 }}</td>
						<td colspan="2">{{ item.feasibility }}</td>
						<td colspan="2">{{ item.accuracy }}</td>
						<td colspan="2">{{ item.operational }}</td>
						<td colspan="2">{{ item.implementationDifficulty }}</td>
						<td colspan="2">{{ item.comprehensiveEvaluation }}</td>
					</tr>

					<tr>
						<td rowspan="2" colspan="2" class="table-title">决策单的评分</td>
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
				</template>
			</tbody>
		</table>
		<a-divider dashed style="border-color: red">题目</a-divider>
		<show-question-table :questions="questions" />
	</template>
	<m-empty v-else />
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
