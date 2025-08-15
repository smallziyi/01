<script lang="ts" setup>
import { ReportMenuLooseLeaf } from '@/view/__report';

import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { getTableFormQuestion } from '@/axios';
import ShowQuestionTable from '@/view/instruction/workbook/overview/components/show-question-table.vue';
import ShowQuestion from '@/view/instruction/workbook/overview/components/show-question.vue';
import FileOverview from '@/view/__report/components/workplace/file-overview.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const props = defineProps<{ data: ReportMenuLooseLeaf }>();

const tableId = props.data.tableFormData[0].tableId;
const form = computed(() => {
	return props.data.tableFormData[0].data;
});
const learningPoint = computed(() => {
	return props.data.tableFormLearnPointsData.find((item) => item.tableId === tableId)?.sentencePartList!;
});

const questions = ref<Array<ReportCourseQuestion>>([]);

onMounted(() => {
	getTableFormQuestion({ tableId: props.data.tableFormData[0].tableId, studyFlag: true }).then((res) => {
		questions.value = res.data;
	});
});
</script>

<template>
	<template v-if="$props.data.tableFormData[0].showFlag">
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
					<td :rowspan="form.searchInformationMethod.length || 1" colspan="2" class="table-title">搜集资讯的方式</td>
					<td colspan="10" class="table-title text-left">
						{{ form.searchInformationMethod[0] }}
					</td>
				</tr>
				<template v-for="(item, index) in form.searchInformationMethod">
					<tr v-if="index !== 0">
						<td colspan="10" class="table-title text-left">{{ item }}</td>
					</tr>
				</template>
				<tr>
					<td colspan="2" :rowspan="1 + form.stepDescriptionList.length" class="table-title">资讯描述</td>
					<td class="table-title">序号</td>
					<td colspan="2" class="table-title">具体步骤名称</td>
					<td colspan="7" class="table-title">具体步骤内容</td>
				</tr>

				<tr v-if="form.stepDescriptionList.length">
					<td class="table-title">1</td>
					<td colspan="2" class="table-title">{{ form.stepDescriptionList[0].taskName }}</td>
					<td colspan="7" class="text-left">
						<show-question
							:question="
								learningPoint.find((var1) => var1.learnPointsCellId === form.stepDescriptionList[0].taskContentId)
									?.sentencePartList || []
							"
						/>
					</td>
				</tr>

				<template v-for="(item, index) in form.stepDescriptionList">
					<tr v-if="index !== 0">
						<td class="table-title">{{ index + 1 }}</td>
						<td colspan="2" class="table-title">{{ item.taskName }}</td>
						<td colspan="7" class="text-left">
							<show-question
								:question="
									learningPoint.find((var1) => var1.learnPointsCellId === item.taskContentId)?.sentencePartList || []
								"
							/>
						</td>
					</tr>
				</template>

				<tr>
					<td colspan="2" :rowspan="2 + (form.stepRequirementList?.workStepDetails?.length || 0)" class="table-title">
						对学生的要求
					</td>
					<td colspan="8" class="table-title">具体内容</td>
					<td colspan="2" rowspan="2" class="table-title">配套资源</td>
				</tr>
				<tr>
					<td class="table-title">序号</td>
					<td colspan="2" class="table-title">具体步骤名称</td>
					<td colspan="5" class="table-title">具体步骤的职业伦理道德要求</td>
				</tr>

				<template v-if="form.stepRequirementList && form.stepRequirementList.workStepDetails.length">
					<tr>
						<td class="table-title">1</td>
						<td colspan="2" class="table-title">{{ form.stepRequirementList.workStepDetails[0].taskName }}</td>
						<td colspan="5" class="text-left">{{ form.stepRequirementList.workStepDetails[0].taskContent }}</td>
						<td :rowspan="form.stepRequirementList.workStepDetails.length" colspan="2">
							<div class="font-mono flex flex-col flex-wrap">
								<file-overview :file="item" v-for="item in form.stepRequirementList.files" />
							</div>
						</td>
					</tr>

					<template v-for="(item, index) in form.stepRequirementList.workStepDetails">
						<tr v-if="index !== 0">
							<td class="table-title">{{ index + 1 }}</td>
							<td colspan="2" class="table-title">{{ item.taskName }}</td>
							<td colspan="5" class="text-left">{{ item.taskContent }}</td>
						</tr>
					</template>
				</template>

				<tr>
					<td rowspan="2" colspan="2" class="table-title">参考资料</td>
					<td class="table-title">参考资料名称</td>
					<td colspan="9" class="text-left">
						<template v-for="(item, index) in form.referenceResourceNameList">
							<div>{{ index + 1 }}. {{ item }}</div>
						</template>
					</td>
				</tr>
				<tr>
					<td class="table-title">参考资源</td>
					<td colspan="9">
						<div class="font-mono flex">
							<file-overview :file="item" v-for="item in form.referenceResourceList"></file-overview>
						</div>
					</td>
				</tr>

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
