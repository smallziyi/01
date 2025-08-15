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

const data = defineModel<ReportMenuCourse>('data', { required: true });

const form = computed(() => data.value.tableFormData[1].data);
</script>

<template>
	<table class="w-full">
		<tbody>
			<tr class="table-title">
				<td colspan="12">材料工具清单</td>
			</tr>
			<tr class="table-title">
				<td colspan="3">学习场名称</td>
				<td colspan="9">{{ form.studyName }}</td>
			</tr>
			<tr class="table-title">
				<td colspan="3">学习情境名称</td>
				<td colspan="9">{{ form.contextName }}</td>
			</tr>
			<tr class="table-title">
				<td colspan="3">学习任务名称</td>
				<td colspan="3">{{ form.taskName }}</td>
				<td colspan="3">学时</td>
				<td colspan="3">{{ form.totalTime }}</td>
			</tr>
			<tr>
				<td class="table-title font-mono">序号</td>
				<td colspan="2" class="table-title">名称</td>
				<td colspan="2" class="table-title">作用</td>
				<td colspan="2" class="table-title">数量</td>
				<td colspan="2" class="table-title">型号</td>
				<td colspan="2" class="table-title">使用量</td>
				<td class="table-title">使用者</td>
			</tr>
			<template v-for="(item, index) in form.materialToolsDetails">
				<tr class="group">
					<td class="font-mono">{{ index + 1 }}</td>
					<td colspan="2">{{ item.name }}</td>
					<td colspan="2">{{ item.function }}</td>
					<td colspan="2">{{ item.number }}</td>
					<td colspan="2">{{ item.model }}</td>
					<td colspan="2">{{ item.used }}</td>
					<td>{{ item.user }}</td>
				</tr>
			</template>
		</tbody>
	</table>
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
