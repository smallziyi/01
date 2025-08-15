<script setup lang="ts">
import { ReportEditStatus, ReportMenuCourse } from '@/view/__report';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';
import useAxios from '@/axios';
import { message } from 'ant-design-vue';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});

const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const data = defineModel<ReportMenuCourse>('data', { required: true });
const save = defineModel<boolean>('save', { required: true });

const form = computed(() => data.value.tableFormData[2].data);
const totalTime = computed(() =>  data.value.tableFormData[0].data.totalTime);

const { reportInfo } = useReportInfo();
const axios = useAxios();
const handleSaveContent = () => {
	data.value.tableFormData[2].editedFlag = true;
	axios
		.put('/report/course/updateMenuCourseData', { ...data.value, tableFormData: [data.value.tableFormData[2]] })
		.then(() => {
			data.value.tableFormData[2].auditRecordData = null;
			message.success('保存成功');
		});
};
watch(
	() => save.value,
	() => {
		if (save.value) {
			handleSaveContent();
		}
	},
);
</script>

<template>
	<table class="w-full table-fixed">
		<tbody>
			<tr>
				<td colspan="12" class="table-title text-center">材料工具清单</td>
			</tr>
			<tr>
				<td colspan="3" class="table-title text-center">学习场名称</td>
				<td colspan="9" class="table-title text-center">{{ form.studyName }}</td>
			</tr>
			<tr>
				<td colspan="3" class="table-title text-center">学习情境名称</td>
				<td colspan="9" class="table-title text-center">{{ form.contextName }}</td>
			</tr>
			<tr>
				<td colspan="3" class="table-title text-center">学习任务名称</td>
				<td colspan="3" class="table-title text-center">{{ form.taskName }}</td>
				<td colspan="3" class="table-title text-center">学时</td>
				<td colspan="3" class="table-title text-center">{{ totalTime }}学时</td>
			</tr>
			<tr>
				<td class="table-title text-center font-mono">序号</td>
				<td colspan="2" class="table-title text-center">典型工作环节/学习步骤</td>
				<td class="table-title text-center">学时</td>
				<td colspan="2" class="table-title text-center">使用工具</td>
				<td colspan="2" class="table-title text-center">授课地点</td>
				<td colspan="2" class="table-title text-center">教学方式或方法</td>
				<td colspan="2" class="table-title text-center">备注</td>
			</tr>
			<template v-for="(item, index) in form.implementationPlanDetails">
				<tr class="group">
					<td class="text-center font-mono">
						{{ index + 1 }}
					</td>
					<td colspan="2">{{ item.stepName }}</td>
					<td class="text-center">{{ item.totalTime }}</td>
					<td colspan="2" class="text-center">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input
								v-model="item.useTool"
								class="outline-none bg-transparent w-full text-center"
								placeholder="使用工具"
							/>
						</template>
						<template v-else>{{ item.useTool }}</template>
					</td>
					<td colspan="2" class="text-center">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input
								v-model="item.place"
								class="outline-none bg-transparent w-full text-center"
								placeholder="授课地点"
							/>
						</template>
						<template v-else>{{ item.place }}</template>
					</td>
					<td colspan="2" class="text-center">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input
								v-model="item.teachingMethod"
								class="outline-none bg-transparent w-full text-center"
								placeholder="教学方式或方法"
							/>
						</template>
						<template v-else>{{ item.teachingMethod }}</template>
					</td>
					<td colspan="2">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<a-textarea
								v-model:value="item.notes"
								:bordered="false"
								:auto-size="true"
								class="outline-none bg-transparent w-full text-center"
								placeholder="备注"
							/>
						</template>
						<template v-else>{{ item.notes }}</template>
					</td>
				</tr>
			</template>
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
