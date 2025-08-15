<script setup lang="ts">
import {
	QuestionOptions,
	QuestionType,
	ReportCourseQuestion,
} from '@/view/__report/components/workplace/__course/type.ts';
import { ReportEditStatus } from '@/view/__report';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';

import { message, Modal } from 'ant-design-vue';
import useHomework from '@/view/instruction/guidebook/workplace/useHomework.ts';
import useRouterParams from '@/hooks/useRouterParams.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});

const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const questions = defineModel<Array<ReportCourseQuestion>>('questions', { required: true });
const emits = defineEmits(['update:learningPoint']);

const props = defineProps<{ tableId: string; source: string; tableFormType: 1 | 2 | 3 | 4 | 5 | 6 }>();

const { reportInfo } = useReportInfo();

const setCorrectAnswer = (item: ReportCourseQuestion, option: QuestionOptions) => {
	item.options = [option, ...item.options.filter((item) => item !== option)];
	item.options.forEach((v, i) => {
		v.id = +i + 1 + '';
		v.isCorrect = i === 0;
	});
};

const handleDeleteOption = (question: ReportCourseQuestion, option: QuestionOptions) => {
	question.options.splice(question.options.indexOf(option), 1);
	question.options.forEach((option, i) => {
		option.id = +i + 1 + '';
	});
};

const handleDeleteQuestion = (item: ReportCourseQuestion) => {
	const deleteQuestion = () => {
		if (item.learnPointsCellId) {
			questions.value = questions.value.filter((q) => q !== item);
			emits('update:learningPoint', item.learnPointsCellId);
		} else {
			const index = questions.value.findIndex((q) => q === item);
			questions.value.splice(index, 1);
		}
	};

	if (questionIds.value.includes(item.id!)) {
		Modal.confirm({
			title: '删除确认',
			content: '该题已设置为课后练习题，是否删除？',
			onOk: () => {
				removeHomeWork(item);
				deleteQuestion();
			}
		});
	} else {
		deleteQuestion();
	}
};
const handleAddQuestion = () => {
	questions.value.push({
		tableId: props.tableId,
		learnPointsCellId: '',
		source: props.source,
		title: '',
		type: QuestionType.SINGLE_CHOICE,
		options: [
			{ isCorrect: false, content: '', id: '1' },
			{ isCorrect: false, content: '', id: '2' },
			{ isCorrect: false, content: '', id: '3' },
			{ isCorrect: false, content: '', id: '4' },
		],
		analysis: '',
		sort: questions.value.length + 1,
		tableFormType: props.tableFormType,
	});
};

const params = useRouterParams<{ reportId: string; type: 'edit' | 'audit' | 'preview' }>();
const { homeworks, saveHomework } = useHomework();
const questionIds = computed(() => homeworks.value.map((item) => item.id));
const addHomeWork = (item: ReportCourseQuestion) => {
	if (!item.id) {
		message.warn('该题尚未保存，请保存后重试');
		return;
	}
	if (!item.source.trim()) {
		message.warn('该题没有来源，完善后添加');
		return;
	}
	if (!item.title.trim()) {
		message.warn('该题没有题目，完善后添加');
		return;
	}
	if (item.options.length < 4) {
		message.warn('该题选项不足四项，完善后添加');
		return;
	}
	if (item.options.some((option) => !option.content.trim())) {
		message.warn('该题存在无内容的选项，完善后添加');
		return;
	}
	if (new Set(item.options.map((v) => v.content.trim())).size < item.options.length) {
		message.warn('该题选项重复，修改后添加');
		return;
	}
	if (item.options.every((option) => !option.isCorrect)) {
		message.warn('该题未设置正确答案，完善后添加');
	}
	homeworks.value.push(item);
	saveHomework.value = true;
};
const removeHomeWork = (item: ReportCourseQuestion) => {
	const findIndex = homeworks.value.findIndex((v) => v.id === item.id);
	homeworks.value.splice(findIndex, 1);
	saveHomework.value = true;
};
</script>

<template>
	<table style="table-layout: auto" class="w-full">
		<tbody>
			<tr>
				<td class="w-20 table-title text-center">序号</td>
				<td colspan="2" class="table-title text-center">题目信息</td>
			</tr>
			<template v-if="!questions.length">
				<tr>
					<td colspan="5">
						<m-empty size="small" />
					</td>
				</tr>
			</template>
			<template v-for="(item, index) in questions">
				<tr>
					<td
						:rowspan="reportInfo.pageType === 'edit' ? 4 : 3 + (item.analysis.trim() ? 1 : 0)"
						class="text-center font-mono table-title"
					>
						{{ index + 1 }}<br />
					</td>
					<td class="table-title w-40 text-left">题目出处</td>
					<td class="font-mono table-title text-left">
						<span v-html="item.source"></span>
					</td>
				</tr>
				<tr>
					<td class="table-title">
						<div class="flex justify-between">
							<div>题目</div>
							<template v-if="params.type === 'edit' && ReportEditStatus.includes(reportInfo.reportStatus)">
								<div class="flex justify-center items-center">
									<a-tooltip v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
										<a-button
											class="flex justify-center items-center"
											danger
											type="link"
											@click="handleDeleteQuestion(item)"
										>
											<template #icon>
												<delete-red-svg></delete-red-svg>
											</template>
										</a-button>
										<template #title>删除此题</template>
									</a-tooltip>
									<a-tooltip v-if="!questionIds.includes(item.id!)">
										<a-button type="link" class="flex justify-center items-center" @click="addHomeWork(item)">
											<template #icon>
												<add-blue-svg></add-blue-svg>
											</template>
										</a-button>
										<template #title>设置为课后练习题</template>
									</a-tooltip>
									<a-tooltip v-if="questionIds.includes(item.id!)">
										<a-button danger type="link" @click="removeHomeWork(item)">
											<template #icon><i class="bi bi-dash-circle"></i></template>
										</a-button>
										<template #title>从课后练习中删除</template>
									</a-tooltip>
								</div>
							</template>
						</div>
					</td>
					<td class="text-left">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus) && !item.learnPointsCellId">
							<a-textarea v-model:value="item.title" placeholder="此处输入题目" :bordered="false" :auto-size="true" />
						</template>
						<template v-else>{{ item.title }}</template>
					</td>
				</tr>
				<tr>
					<td colspan="2" v-auto-animate>
						<div
							v-for="(option, oIndex) in item.options"
							class="flex justify-between rounded p-1 group hover:bg-slate-50 w-full"
						>
							<div class="flex">
								<div>
									<a-radio :checked="option.isCorrect"></a-radio>
									<span class="font-mono">{{ String.fromCharCode(65 + oIndex) }}.&nbsp;</span>
								</div>
								<div v-if="params.type === 'edit' && ReportEditStatus.includes(reportInfo.reportStatus)">
									<template v-if="option.isCorrect && !!item.learnPointsCellId">
										<span class="ml-3">{{ option.content }}</span>
									</template>
									<a-textarea
										v-else
										class="w-[400px] outline-none"
										v-model:value="option.content"
										:bordered="false"
										:auto-size="true"
										placeholder="此处输入选项内容"
									/>
								</div>
								<template v-else>{{ option.content }}</template>
							</div>
							<a-space
								class="group-hover:opacity-100 opacity-0"
								v-if="params.type === 'edit' && ReportEditStatus.includes(reportInfo.reportStatus)"
							>
								<a-button
									v-if="!item.learnPointsCellId && !option.isCorrect"
									size="small"
									type="link"
									@click="setCorrectAnswer(item, option)"
								>
									设置为正确答案
								</a-button>
								<a-button
									v-if="!item.learnPointsCellId || (item.learnPointsCellId && !option.isCorrect)"
									size="small"
									type="link"
									danger
									@click="handleDeleteOption(item, option)"
								>
									删除
								</a-button>
							</a-space>
						</div>
						<a-button
							v-if="params.type === 'edit' && ReportEditStatus.includes(reportInfo.reportStatus)"
							block
							size="small"
							type="dashed"
							@click="item.options.push({ isCorrect: false, content: '', id: item.options.length + 1 + '' })"
						>
							<i class="bi bi-plus-lg mr-1"></i>
							添加选项
						</a-button>
					</td>
				</tr>
				<tr v-if="params.type === 'edit' || item.analysis.trim()">
					<td colspan="2">
						<div class="flex">
							<span class="w-10">解析:</span>
							<a-textarea
								v-model:value="item.analysis"
								placeholder="此处输入题目解析"
								:auto-size="true"
								:bordered="false"
							/>
						</div>
					</td>
				</tr>
			</template>
			<tr v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
				<td colspan="3">
					<a-button class="flex justify-center items-center py-4" type="link" block @click="handleAddQuestion">
						<template #icon>
							<add-blue-svg></add-blue-svg>
						</template>
						新增题目
					</a-button>
				</td>
			</tr>
		</tbody>
	</table>
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
