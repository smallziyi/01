<script setup lang="ts">
import { ReportMenuLooseLeaf } from '@/view/__report';
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
// @ts-ignore
import { Epoch, Snowyflake } from 'snowyflake';
import { message } from 'ant-design-vue';
import QuestionTable from './question-table.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useAxios, { addCourseQuestionList, getTableFormQuestion } from '@/axios';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const data = defineModel<ReportMenuLooseLeaf>('data', { required: true });
const save = defineModel<boolean>('save', { required: true });

const form = computed(() => {
	return data.value.tableFormData[2].data;
});

const learningPoint = computed(() => {
	return data.value.tableFormLearnPointsData.find((item) => item.tableId === tableId)?.sentencePartList!;
});

const tableId = data.value.tableFormData[2].tableId;

onMounted(() => {
	getTableFormQuestion({ tableId: tableId }).then((res) => {
		questions.value = res.data;
	});
});

const questions = ref<Array<ReportCourseQuestion>>([]);
const source = [form.value.studyName, form.value.contextName, form.value.taskName, data.value.name, '决策单'].join(
	' <i class="bi bi-arrow-right"></i> ',
);

const axios = useAxios();
const handleSaveContent = async () => {
	try {
		questions.value.forEach((question, index) => {
			if (!question.learnPointsCellId && !question.title.trim()) {
				throw new Error(`第${index + 1}题无题干`);
			}
			if (question.options.length < 4) {
				throw new Error(`第${index + 1}题,选项太少，请创建不少于四项可选项`);
			}
			question.options.forEach((option, optionIndex) => {
				if (!option.content.trim()) {
					throw new Error(`第${index + 1}题,选项${String.fromCharCode(65 + optionIndex)}无内容`);
				}
			});
			if (!question.learnPointsCellId && question.options.every((option) => !option.isCorrect)) {
				throw new Error(`第${index + 1}题,未设置正确答案`);
			}
			question.sort = index + 1;
			question.options.forEach((option, optionIndex) => (option.id = `${optionIndex + 1}`));
		});

		questions.value.forEach((question, index) => {
			const uniqueOptions = new Set(question.options.map((option) => option.content.trim()));
			if (uniqueOptions.size < question.options.length) {
				throw new Error(`第${index + 1}题选项内容重复`);
			}
		});
		data.value.tableFormData[2].editedFlag = true;
		await axios.put('/report/course/updateMenuCourseData', {
			...data.value,
			tableFormData: [data.value.tableFormData[2]],
			tableFormLearnPointsData: [
				{
					tableId: tableId,
					sentencePartList: learningPoint.value || [],
				},
			],
		});
		data.value.tableFormData[2].auditRecordData = null;
		addCourseQuestionList(tableId, questions.value).then((res) => {
			questions.value = res;
			message.success('保存成功');
		});
	} catch (error) {
		if (error instanceof Error) {
			message.error(error.message);
		} else {
			message.error('未知错误');
		}
	} finally {
		save.value = false;
	}
};

watch(
	() => save.value,
	() => {
		save.value && handleSaveContent();
	},
);

const handleUpdateLearningPoint = (id: string) => {
	const item = learningPoint.value.find((var1) => var1.learnPointsCellId === id);
	if (item) {
		item.sentencePartList = [{ isMark: false, text: item.sentencePartList.map((var1) => var1.text).join('') }];
	}
};
</script>

<template>
	<table class="w-full table-fixed">
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
				<td colspan="10" class="table-title text-left">{{ form.workProcess }}</td>
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
					<td colspan="2" class="text-left">{{ item.feasibility }}</td>
					<td colspan="2" class="text-left">{{ item.accuracy }}</td>
					<td colspan="2" class="text-left">{{ item.operational }}</td>
					<td colspan="2" class="text-left">{{ item.implementationDifficulty }}</td>
					<td colspan="2" class="text-left">{{ item.comprehensiveEvaluation }}</td>
				</tr>
			</template>
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
		</tbody>
	</table>
	<a-divider style="height: 12px; border-color: skyblue; margin: 32px 0">课堂测试</a-divider>
	<question-table
		:table-id="tableId"
		:source="source"
		:table-form-type="3"
		v-model:questions="questions"
		@update:learningPoint="handleUpdateLearningPoint"
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
