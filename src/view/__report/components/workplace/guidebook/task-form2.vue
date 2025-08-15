<script lang="ts" setup>
import { ReportMenuCourse } from '@/view/__report';
import FileOverview from '@/view/__report/components/workplace/file-overview.vue';
// @ts-ignore
import { Epoch, Snowyflake } from 'snowyflake';
import useAxios, { addCourseQuestionList } from '@/axios';
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { message } from 'ant-design-vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { getTableFormQuestion } from '@/axios';

const axios = useAxios();
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

const data = defineModel<ReportMenuCourse>('data', { required: true });
const save = defineModel<boolean>('save', { required: true });

watch(
	() => save.value,
	() => {
		if (save.value) {
			handleSaveContent();
		}
	},
);

const tableId = data.value.tableFormData[0].tableId;

const report = computed(() => {
	return data.value.tableFormData[0].data;
});

onMounted(() => {
	getTableFormQuestion({ tableId: tableId }).then((res) => {
		questions.value = res.data;
	});

	data.value.tableFormLearnPointsData = data.value.tableFormLearnPointsData.filter((item) => item.tableId === tableId);
	report.value.taskDescriptionList.forEach((var1) => {
		var1.workStepDetails.forEach((var2) => {
			if (!var2.taskContentId) {
				var2.taskContentId = snowyflake.nextId().toString();
				data.value.tableFormLearnPointsData[0].sentencePartList.push({
					learnPointsCellId: var2.taskContentId,
					sentencePartList: [{ isMark: false, text: var2.taskContent }],
				});
			}
		});
	});
});

// const getQuestionCell = (id: string) => {
// 	return (
// 		data.value.tableFormLearnPointsData
// 			?.find((item) => item.tableId === tableId)
// 			?.sentencePartList.find((item) => item.learnPointsCellId === id)?.sentencePartList || []
// 	);
// };

// const _source = [report.value.studyName, report.value.contextName, report.value.taskName, '任务单'].join(
// 	' <i class="bi bi-arrow-right"></i> ',
// );
// const handleUpdate = (result: Array<SentencePart>, id: string, source: Array<string>) => {
// 	const var1 = data.value.tableFormLearnPointsData[0].sentencePartList.find((item) => item.learnPointsCellId === id);
// 	var1!.sentencePartList = result;
// 	if (result.some((item) => item.isMark)) {
// 		if (questions.value.every((item) => item.learnPointsCellId !== id)) {
// 			questions.value.push({
// 				tableId: tableId,
// 				learnPointsCellId: id,
// 				type: QuestionType.SINGLE_CHOICE,
// 				source: _source,
// 				title: `在典型工作环节"${source[0]}"的具体步骤"${source[1]}"中：${result.map((var1) => (var1.isMark ? '____' : var1.text)).join('')}`,
// 				analysis: '',
// 				sort: 1,
// 				options: [
// 					{
// 						isCorrect: true,
// 						content: result
// 							.filter((var1) => var1.isMark)
// 							.map((var2) => var2.text)
// 							.join('、'),
// 						id: snowyflake.nextId(),
// 					},
// 					{ isCorrect: false, content: '', id: snowyflake.nextId() },
// 					{ isCorrect: false, content: '', id: snowyflake.nextId() },
// 					{ isCorrect: false, content: '', id: snowyflake.nextId() },
// 				],
// 			});
// 		} else {
// 			const question = questions.value.find((item) => item.learnPointsCellId === id);
// 			if (!question) return;
// 			question.title = `在典型工作环节"${source[0]}"的具体步骤"${source[1]}"中：${result.map((var1) => (var1.isMark ? '____' : var1.text)).join('')}`;
// 			question.options[0].content = result
// 				.filter((var1) => var1.isMark)
// 				.map((var2) => var2.text)
// 				.join('、');
// 		}
// 	} else {
// 		questions.value = questions.value.filter((item) => item.learnPointsCellId !== id);
// 	}
// };

const questions = ref<Array<ReportCourseQuestion>>([]);

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
		data.value.tableFormData[0].editedFlag = true;
		await axios.put('/report/course/updateMenuCourseData', {
			...data.value,
			tableFormData: [data.value.tableFormData[0]],
		});
		data.value.tableFormData[0].auditRecordData = null;
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

// const handleDeleteQuestion = (id: string) => {
// 	const var1 = data.value.tableFormLearnPointsData
// 		.find((item) => item.tableId === tableId)
// 		?.sentencePartList.find((item) => item.learnPointsCellId === id);
// 	if (var1) {
// 		var1.sentencePartList = [{ isMark: false, text: var1.sentencePartList.map((item) => item.text).join('') }];
// 	}
// };
</script>

<template>
	<table class="w-full table-fixed">
		<tbody>
			<tr>
				<td colspan="14" class="table-title text-center">{{ report.taskName }}</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title text-center">学习场名称</td>
				<td colspan="12" class="table-title text-center">{{ report.studyName }}</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title text-center">学习情境名称</td>
				<td colspan="12" class="table-title text-center">{{ report.contextName }}</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title text-center">学习任务名称</td>
				<td colspan="5" class="table-title text-center">{{ report.taskName }}</td>
				<td colspan="2" class="table-title text-center">学时</td>
				<td colspan="5" class="table-title text-center">{{ report.totalTime }}学时</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title text-center">典型工作过程描述</td>
				<td colspan="12" class="table-title text-center">{{ report.workProcess }}</td>
			</tr>
			<tr>
				<td colspan="2" class="table-title text-center">学习目标</td>
				<td colspan="12" class="table-title">
					<div v-for="item in report.learnGoalList" class="mb-4">
						<div v-for="v in item">{{ v }}</div>
					</div>
				</td>
			</tr>
			<tr>
				<td
					:rowspan="3 + report.taskDescriptionList.reduce((total, item) => total + item.workStepDetails.length, 0)"
					colspan="2"
					class="table-title text-center"
				>
					典型工作环节描述
				</td>
				<td colspan="10" class="table-title text-center">典型工作环节的具体内容</td>
				<td colspan="2" rowspan="3" class="table-title text-center">配套资源</td>
			</tr>
			<tr>
				<td colspan="3" class="table-title text-center">典型工作环节</td>
				<td colspan="7" class="table-title text-center">具体步骤内容</td>
			</tr>
			<tr>
				<td class="table-title text-center">序号</td>
				<td colspan="2" class="table-title text-center">典型工作环节名称</td>
				<td class="table-title text-center">序号</td>
				<td colspan="2" class="table-title text-center">具体步骤名称（行动方向）</td>
				<td colspan="4" class="table-title text-center">
					具体步骤内容（即工作方法、工作对象、使用工具、劳动组织或工作形式、工作要求、工作成果等）
				</td>
			</tr>
			<template v-for="(step, index) in report.taskDescriptionList">
				<tr>
					<td :rowspan="step.workStepDetails.length" class="table-title text-center">{{ index + 1 }}</td>
					<td :rowspan="step.workStepDetails.length" colspan="2" class="table-title text-center">
						<div class="whitespace-pre-wrap break-words">{{ step.stepName }}</div>
					</td>
					<td class="table-title text-center">{{ index + 1 }}.1</td>
					<td colspan="2" class="table-title text-center">
						<div class="whitespace-pre-wrap break-words">{{ step.workStepDetails[0].taskName }}</div>
					</td>
					<td colspan="4">
						<div class="whitespace-pre-wrap break-words">{{step.workStepDetails[0].taskContent }}</div>
					</td>
					<td :rowspan="step.workStepDetails.length" colspan="2">
						<div class="font-mono flex flex-wrap">
							<file-overview v-for="item in step.files" :file="item"></file-overview>
						</div>
					</td>
				</tr>
				<template v-for="(item, index1) in step.workStepDetails">
					<tr v-if="index1 !== 0">
						<td class="table-title text-center">{{ index + 1 }}.{{ index1 + 1 }}</td>
						<td colspan="2" class="table-title text-center">
							<div class="whitespace-pre-wrap break-words">{{ item.taskName }}</div>
						</td>
						<td colspan="4">
							<div class="whitespace-pre-wrap break-words">{{item.taskContent }}</div>
							<!-- <create-question
							:data="getQuestionCell(item.taskContentId)"
							@update="
								(result: Array<SentencePart>) => {
									handleUpdate(result, item.taskContentId, [step.stepName, item.taskName]);
								}
							"
						/> -->
						</td>
					</tr>
				</template>
			</template>
			<tr>
				<td colspan="2" rowspan="2" class="table-title text-center">参考资料</td>
				<td class="table-title text-center">参考资料名称</td>
				<td colspan="11">
					<div v-for="(item, index) in report.referenceResourceNameList">
						<span class="font-mono">{{ index + 1 }}.</span>{{ item }}
					</div>
				</td>
			</tr>
			<tr>
				<td class="table-title text-center">参考资源</td>
				<td colspan="11">
					<div class="font-mono flex">
						<file-overview v-for="item in report.referenceResourceList" :file="item"></file-overview>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<!-- <a-divider style="height: 12px; border-color: skyblue; margin: 32px 0">课堂测试</a-divider>
	<question-table
		:table-id="tableId"
		:source="_source"
		v-model:questions="questions"
		@update:learning-point="handleDeleteQuestion"
	/> -->
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
