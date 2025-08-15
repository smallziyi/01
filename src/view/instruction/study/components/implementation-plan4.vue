<script setup lang="ts">
import { ReportMenuCourse } from '@/view/__report';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const props = defineProps<{ data: ReportMenuCourse }>();

const form = computed(() => props.data.tableFormData[2].data);
</script>

<template>
	<template v-if="$props.data.tableFormData[2].showFlag">
		<table class="w-full">
			<tbody>
				<tr>
					<td colspan="12" class="table-title">材料工具清单</td>
				</tr>
				<tr>
					<td colspan="3" class="table-title">学习场名称</td>
					<td colspan="9" class="table-title">{{ form.studyName }}</td>
				</tr>
				<tr>
					<td colspan="3" class="table-title">学习情境名称</td>
					<td colspan="9" class="table-title">{{ form.contextName }}</td>
				</tr>
				<tr>
					<td colspan="3" class="table-title">学习任务名称</td>
					<td colspan="3" class="table-title">{{ form.taskName }}</td>
					<td colspan="3" class="table-title">学时</td>
					<td colspan="3" class="table-title">{{ form.totalTime }}</td>
				</tr>
				<tr>
					<td class="table-title font-mono">序号</td>
					<td colspan="2" class="table-title">典型工作环节/学习步骤</td>
					<td colspan="2" class="table-title">学时</td>
					<td colspan="2" class="table-title">使用工具</td>
					<td colspan="2" class="table-title">授课地点</td>
					<td colspan="2" class="table-title">教学方式或方法</td>
					<td class="table-title">备注</td>
				</tr>
				<template v-for="(item, index) in form.implementationPlanDetails">
					<tr class="group">
						<td class="text-center font-mono">{{ index + 1 }}</td>
						<td colspan="2" class="text-center">{{ item.stepName }}</td>
						<td colspan="2" class="text-center">{{ item.totalTime }}</td>
						<td colspan="2" class="text-center">{{ item.useTool }}</td>
						<td colspan="2" class="text-center">{{ item.place }}</td>
						<td colspan="2" class="text-center">{{ item.teachingMethod }}</td>
						<td>{{ item.notes }}</td>
					</tr>
				</template>
			</tbody>
		</table>
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
