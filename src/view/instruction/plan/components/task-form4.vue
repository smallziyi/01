<script setup lang="ts">
import { ReportMenuCourse } from '@/view/__report';
import FileOverview from '@/view/__report/components/workplace/file-overview.vue';
// import showAnswer from './show-answer.vue';
// import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
// import useAxios from '@/axios';
// import courseTest from '../../components/course-test.vue';

import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const props = defineProps<{
	data: ReportMenuCourse;
}>();

// const axios = useAxios();
// onMounted(() => {
// 	axios
// 		.get<
// 			Array<ReportCourseQuestion>
// 		>('/report/course/getTableCourseQuestionList', { params: { tableId: props.data.tableFormData[0].tableId, studyFlag: false } })
// 		.then((res) => {
// 			questions.value = res.data;
// 		});
// });

const report = props.data.tableFormData[0].data;
// const tableId = props.data.tableFormData[0].tableId;

// const questionData = props.data.tableFormLearnPointsData.find(
// 	(item) => item.tableId === props.data.tableFormData[0].tableId,
// );

// const questions = ref<Array<ReportCourseQuestion>>([]);
</script>

<template>
	<template v-if="$props.data.tableFormData[1].showFlag">
		<table class="table-fixed w-full">
			<tbody>
				<tr>
					<td colspan="14" class="table-title">{{ report.taskName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title table-title">学习场名称</td>
					<td colspan="12" class="table-title">{{ report.studyName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习情境名称</td>
					<td colspan="12" class="table-title">{{ report.contextName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习任务名称</td>
					<td colspan="5" class="table-title">{{ report.taskName }}</td>
					<td colspan="2" class="table-title">学时</td>
					<td colspan="5" class="table-title">{{ report.totalTime }}学时</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">典型工作过程描述</td>
					<td colspan="12" class="table-title text-left">{{ report.workProcess }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习目标</td>
					<td colspan="12" class="table-title text-left">
						<div v-for="item in report.learnGoalList" class="mb-4">
							<div v-for="v in item">{{ v }}</div>
						</div>
					</td>
				</tr>
				<tr>
					<td
						:rowspan="3 + report.taskDescriptionList.reduce((total, item) => total + item.workStepDetails.length, 0)"
						colspan="2"
						class="table-title"
					>
						典型工作环节描述
					</td>
					<td colspan="10" class="table-title">典型工作环节的具体内容</td>
					<td colspan="2" rowspan="3" class="table-title">配套资源</td>
				</tr>
				<tr>
					<td colspan="3" class="table-title">典型工作环节</td>
					<td colspan="7" class="table-title">具体步骤内容</td>
				</tr>
				<tr>
					<td class="table-title w-20">序号</td>
					<td colspan="2" class="table-title w-40">典型工作环节名称</td>
					<td class="table-title w-20">序号</td>
					<td colspan="2" class="table-title w-52">具体步骤名称（行动方向）</td>
					<td colspan="4" class="table-title">
						具体步骤内容（即工作方法、工作对象、使用工具、劳动组织或工作形式、工作要求、工作成果等）
					</td>
				</tr>
				<template v-for="(step, index) in report.taskDescriptionList">
					<tr>
						<td :rowspan="step.workStepDetails.length" class="table-title font-mono">{{ index + 1 }}</td>
						<td :rowspan="step.workStepDetails.length" colspan="2" class="table-title">
							{{ step.stepName }}
						</td>
						<td class="table-title font-mono">{{ index + 1 }}.1</td>
						<td colspan="2" class="table-title">
							{{ step.workStepDetails[0].taskName }}
						</td>
						<td colspan="4">
							{{ step.workStepDetails[0].taskContent }}
							<!-- <show-answer
								:question="
									questionData?.sentencePartList.find(
										(var1) => var1.learnPointsCellId === step.workStepDetails[0].taskContentId,
									)?.sentencePartList || []
								"
							/> -->
						</td>
						<td :rowspan="step.workStepDetails.length" colspan="2">
							<div class="font-mono flex flex-col flex-wrap">
								<file-overview :file="item" v-for="item in step.files"></file-overview>
							</div>
						</td>
					</tr>
					<template v-for="(item, index1) in step.workStepDetails">
						<tr v-if="index1 !== 0">
							<td class="table-title font-mono">{{ index + 1 }}.{{ index1 + 1 }}</td>
							<td colspan="2" class="table-title">
								{{ item.taskName }}
							</td>
							<td colspan="4">
								{{ item.taskContent }}
								<!-- <show-answer
									:question="
										questionData?.sentencePartList.find((var1) => var1.learnPointsCellId === item.taskContentId)
											?.sentencePartList || []
									"
								/> -->
							</td>
						</tr>
					</template>
				</template>
				<tr>
					<td colspan="2" rowspan="2" class="table-title">参考资料</td>
					<td class="table-title">参考资料名称</td>
					<td colspan="11" class="text-left">
						<div v-for="(item, index) in report.referenceResourceNameList">
							<span class="font-mono">{{ index + 1 }}.&nbsp;</span>{{ item }}
						</div>
					</td>
				</tr>
				<tr>
					<td class="table-title">参考资源</td>
					<td colspan="11">
						<div class="font-mono flex">
							<file-overview :file="item" v-for="item in report.referenceResourceList"></file-overview>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</template>
	<m-empty v-else />
	<!-- <course-test :table-id="tableId" :questions="questions"></course-test> -->
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
