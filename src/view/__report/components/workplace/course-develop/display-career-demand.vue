<script setup lang="ts">
// import useAppTheme from '@/hooks/useAppTheme.ts';

// const { appTheme } = useAppTheme();
// const borderColor = computed(() => {
// 	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
// });
defineProps<{
	occupationQualityInfo: {
		task: string;
		workMethod: string;
		workObject: string;
		tool: string;
		ethics: string;
		workOrganization: string;
		targetValue: string;
		product: string;
	}[];
}>();
</script>
<template>
	<table class="w-full">
		<tbody>
			<tr>
				<td colspan="8" class="table-title">职业要求 / 职业标准的表达方式</td>
			</tr>
			<tr>
				<td class="table-title">具体任务(具体步骤 N = 7 ± 2)</td>
				<td class="table-title">工作方法</td>
				<td class="table-title">工作对象</td>
				<td class="table-title">使用工具</td>
				<td class="table-title">职业伦理道德要求</td>
				<td class="table-title">劳动组织或工作形式</td>
				<td class="table-title">工作要求</td>
				<td class="table-title">工作成果</td>
			</tr>
			<tr>
				<td class="table-title">行为</td>
				<td colspan="5" class="table-title">条件</td>
				<td class="table-title">标准</td>
				<td class="table-title">结果</td>
			</tr>
			<tr>
				<td colspan="8" class="table-title">工作过程系统化课程开发范式所要求的表达方式</td>
			</tr>
			<tr>
				<td class="table-title">行动方向(7 ± 2)</td>
				<td colspan="5" class="table-title">保障措施</td>
				<td class="table-title">目标值</td>
				<td class="table-title">(产品)</td>
			</tr>
			<tr v-for="(occupationQuality, index) in occupationQualityInfo" :key="index">
				<td>{{ occupationQuality.task }}</td>
				<td>{{ occupationQuality.workMethod }}</td>
				<td>{{ occupationQuality.workObject }}</td>
				<td>{{ occupationQuality.tool }}</td>
				<td>{{ occupationQuality.ethics }}</td>
				<td>{{ occupationQuality.workOrganization }}</td>
				<td>{{ occupationQuality.targetValue }}</td>
				<td>{{ occupationQuality.product }}</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped>
table,
td,
th {
	border-collapse: collapse;
	border: 1px solid #b4d3ff;
	line-height: 32px;
	height: 32px;
	padding: 0 8px;
	text-align: center;
}
.table-title {
	background-color: #d9e8ff
	;
}
</style>
