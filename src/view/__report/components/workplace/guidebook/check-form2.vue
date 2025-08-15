<script setup lang="ts">
import { ReportMenuLooseLeaf, SentencePart } from '@/view/__report';
// @ts-ignore
import { Epoch, Snowyflake } from 'snowyflake';
import CreateQuestion from './create-question.vue';
import { QuestionType, ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { message } from 'ant-design-vue';
import useAxios, { addCourseQuestionList } from '@/axios';
import QuestionTable from './question-table.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { getTableFormQuestion } from '@/axios';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const snowyflake = new Snowyflake({
	workerId: 1n,
	epoch: Epoch.Twitter, // BigInt timestamp
});

const data = defineModel<ReportMenuLooseLeaf>('data', { required: true });
const save = defineModel<boolean>('save', { required: true });

onMounted(() => {
	getTableFormQuestion({ tableId: tableId }).then((res) => {
		questions.value = res.data;
	});

	data.value.tableFormData[4].data.checkList.forEach((item) => {
		if (!item.taskContentId) {
			item.taskContentId = snowyflake.nextId().toString();
			learningPoint.value.push({
				learnPointsCellId: item.taskContentId,
				sentencePartList: [{ isMark: false, text: item.standard }],
			});
		}
	});
});

const tableId = data.value.tableFormData[4].tableId;
const form = computed(() => {
	return data.value.tableFormData[4].data;
});
const learningPoint = computed(() => {
	return data.value.tableFormLearnPointsData.find((item) => item.tableId === tableId)?.sentencePartList!;
});

const source = [form.value.studyName, form.value.contextName, form.value.taskName, data.value.name, '检查单'].join(
	' <i class="bi bi-arrow-right"></i> ',
);

const handleUpdate = (result: Array<SentencePart>, id: string, name: string) => {
	const var1 = learningPoint.value.find((item) => item.learnPointsCellId === id);
	var1!.sentencePartList = result;
	if (result.some((item) => item.isMark)) {
		if (questions.value.every((item) => item.learnPointsCellId !== id)) {
			questions.value.push({
				tableId: tableId,
				learnPointsCellId: id,
				type: QuestionType.SINGLE_CHOICE,
				source: source,
				title: `在检查项目"${name}"中：${result.map((var1) => (var1.isMark ? '____' : var1.text)).join('')}`,
				analysis: '',
				sort: 1,
				options: [
					{
						isCorrect: true,
						content: result
							.filter((var1) => var1.isMark)
							.map((var2) => var2.text)
							.join('、'),
						id: snowyflake.nextId(),
					},
					{ isCorrect: false, content: '', id: snowyflake.nextId() },
					{ isCorrect: false, content: '', id: snowyflake.nextId() },
					{ isCorrect: false, content: '', id: snowyflake.nextId() },
				],
				tableFormType: 5,
			});
		} else {
			const question = questions.value.find((item) => item.learnPointsCellId === id);
			if (!question) return;
			question.title = `在检查项目"${name}"中：${result.map((var1) => (var1.isMark ? '____' : var1.text)).join('')}`;
			question.options[0].content = result
				.filter((var1) => var1.isMark)
				.map((var2) => var2.text)
				.join('、');
		}
	} else {
		questions.value = questions.value.filter((item) => item.learnPointsCellId !== id);
	}
};

const questions = ref<Array<ReportCourseQuestion>>([]);

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
		data.value.tableFormData[4].editedFlag = true;
		await axios.put('/report/course/updateMenuCourseData', {
			...data.value,
			tableFormData: [data.value.tableFormData[4]],
			tableFormLearnPointsData: [{ sentencePartList: learningPoint.value, tableId: tableId }],
		});
		data.value.tableFormData[4].auditRecordData = null;
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
				<td colspan="12" class="table-title">{{ data.name }}的检查单</td>
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
				<td class="table-title">序号</td>
				<td colspan="2" class="table-title">检查项目</td>
				<td colspan="5" class="table-title">检查标准</td>
				<td colspan="2" class="table-title">学生/小组自查</td>
				<td colspan="2" class="table-title">学生/小组互查</td>
			</tr>
			<template v-for="(item, index) in form.checkList">
				<tr>
					<td class="table-title">{{ index + 1 }}</td>
					<td colspan="2" class="table-title">{{ item.checkItem }}</td>
					<td colspan="5" class="text-left">
						<create-question
							:data="
								learningPoint.find((var1) => var1.learnPointsCellId === item.taskContentId)?.sentencePartList || []
							"
							@update="
								(result: Array<SentencePart>) => {
									handleUpdate(result, item.taskContentId, item.checkItem);
								}
							"
						/>
					</td>
					<td colspan="2"></td>
					<td colspan="2"></td>
				</tr>
			</template>
			<tr>
				<td rowspan="2" colspan="2" class="table-title">检查单的评分</td>
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
		:table-form-type="5"
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
