<script lang="ts" setup>
import { CheckFormData, defaultReportLooseLeafFormData, ImplementFormData, ReportMenuLooseLeaf } from '@/view/__report';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import _ from 'lodash';
import useAppTheme from '@/hooks/useAppTheme.ts';
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
let originDescriptionLength = ref<number>(0);

const currentRecord = computed(() => {
	return tabsForm?.tableFormData[4].data as CheckFormData;
});

const handleAdd = () => {
	currentRecord.value.checkList.push({
		checkItem: '',
		standard: '',
		studentSelfCheck: '',
		studentMutualCheck: '',
		taskContentId: '',
		taskNameId: '',
	});
};

onMounted(() => {
	if (!tabsForm.tableFormData[4].editedFlag) {
		const { studyName, contextName, taskName, workProcess, stepDescriptionList } = tabsForm.tableFormData[3]
			.data as ImplementFormData;
		tabsForm.tableFormData[4].data = {
			...tabsForm.tableFormData[4].data,
			studyName,
			contextName,
			taskName,
			workProcess,
			checkList: _.cloneDeep(
				stepDescriptionList.map((item) => ({
					checkItem: item.taskName,
					standard: item.taskContent,
					studentSelfCheck: '',
					studentMutualCheck: '',
					taskContentId: '',
					taskNameId: '',
				})),
			) || [
				{
					checkItem: '',
					standard: '',
					studentSelfCheck: '',
					studentMutualCheck: '',
				},
			],
		};
	}
	originDescriptionLength.value = currentRecord.value.checkList.length;
});
</script>

<template>
	<commonComment key="check" :type="type" :report-status="reportStatus">
		<table class="w-full table-fixed">
			<tbody>
				<tr>
					<td class="table-title" colspan="12">{{ tabsForm.name }}的检查单</td>
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
					<td class="table-title" colspan="4">{{ currentRecord.studyName }}</td>
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
					<td class="table-title">序号</td>
					<td class="table-title" colspan="2">检查项目（即具体步骤或行动方向的检查）</td>
					<td class="table-title" colspan="3">检查标准（即目标值、保障措施）</td>
					<td class="table-title" colspan="3">学生/小组自查</td>
					<td class="table-title" colspan="3">学生/小组互查</td>
				</tr>
				<tr v-for="(check, index) in currentRecord.checkList">
					<td class="table-title">{{ index + 1 }}</td>
					<td class="table-title" colspan="2">
						<template v-if="index < originDescriptionLength">
							<div class="whitespace-pre-wrap break-words">{{check.checkItem }}</div>
						</template>
						<template v-else>
							<a-textarea
								v-model:value="check.checkItem"
								:bordered="false"
								:auto-size="true"
								placeholder="请输入"
							></a-textarea>
						</template>
					</td>
					<td colspan="3" class="text-left">
						<a-textarea
							v-if="type === 'edit'"
							v-model:value="check.standard"
							:bordered="false"
							:auto-size="true"
							placeholder="请输入"
						></a-textarea>
						<div v-else>
							<div class="whitespace-pre-wrap break-words">{{check.standard }}</div>
						</div>
					</td>
					<td colspan="3">
						<a-textarea
							v-model:value="check.studentSelfCheck"
							:bordered="false"
							:auto-size="true"
							disabled
						></a-textarea>
					</td>
					<td colspan="3">
						<div class="flex justify-between items-center">
							<a-textarea
								v-model:value="check.studentMutualCheck"
								:bordered="false"
								:auto-size="true"
								disabled
							></a-textarea>
							<a-button
								v-if="index >= originDescriptionLength"
								type="link"
								@click="currentRecord.checkList.splice(index, 1)"
							>
								<template #icon>
									<delete-red-svg></delete-red-svg>
								</template>
							</a-button>
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
					<td class="table-title" colspan="2" rowspan="2">检查单的评分</td>
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
