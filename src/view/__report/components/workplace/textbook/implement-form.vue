<script lang="ts" setup>
import { defaultReportLooseLeafFormData, ImplementFormData, PlanFormData, ReportMenuLooseLeaf } from '@/view/__report';
import _ from 'lodash';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
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

const currentRecord = computed(() => {
	return tabsForm?.tableFormData[3].data as ImplementFormData;
});

const handleAdd = () => {
	currentRecord.value.stepDescriptionList.push({
		taskName: '',
		taskContent: '',
		taskContentId: '',
		taskNameId: '',
	});
};
const originDescriptionLength = ref<number>(0);

onMounted(() => {
	if (!tabsForm.tableFormData[3].editedFlag) {
		const { studyName, contextName, taskName, workProcess, stepDescriptionList } = tabsForm.tableFormData[1]
			.data as PlanFormData;
		tabsForm.tableFormData[3].data = {
			...tabsForm.tableFormData[3].data,
			studyName,
			contextName,
			taskName,
			workProcess,
			stepDescriptionList: _.cloneDeep(stepDescriptionList) || [''],
		};
	}
	originDescriptionLength.value = currentRecord.value.stepDescriptionList.length;
});
</script>

<template>
	<commonComment key="information" :type="type" :report-status="reportStatus">
		<table class="w-full table-fixed">
			<tbody>
				<tr>
					<td class="table-title" colspan="12">{{ tabsForm.name }}的实施单</td>
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
					<td class="table-title" colspan="2">序号</td>
					<td class="table-title" colspan="3">实施的集体步骤（即行动方向）</td>
					<td class="table-title" colspan="7">注意事项（即目标值、保障措施）</td>
				</tr>
				<tr v-for="(implement, index) in currentRecord.stepDescriptionList">
					<td class="table-title" colspan="2">{{ index + 1 }}</td>
					<td class="table-title" colspan="3">
						<template v-if="index < originDescriptionLength">
							<div class="whitespace-pre-wrap break-words">{{implement.taskName }}</div>
						</template>
						<template v-else>
							<a-textarea
								v-model:value="implement.taskName"
								:bordered="false"
								:auto-size="true"
								placeholder="请输入"
							></a-textarea>
						</template>
					</td>
					<td colspan="7" class="text-left">
						<div>
							<template v-if="type === 'edit'">
								<div class="flex justify-between">
									<a-textarea
										v-model:value="implement.taskContent"
										:bordered="false"
										:auto-size="true"
										placeholder="请输入"
									></a-textarea>
									<a-button
										v-if="index >= originDescriptionLength"
										type="link"
										@click="currentRecord.stepDescriptionList.splice(index, 1)"
									>
										<template #icon>
											<delete-red-svg></delete-red-svg>
										</template>
									</a-button>
								</div>
							</template>
							<div v-else>
								<div class="whitespace-pre-wrap break-words">{{implement.taskContent }}</div>
							</div>
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
					<td class="table-title" colspan="2" rowspan="2">实施单的评分</td>
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
