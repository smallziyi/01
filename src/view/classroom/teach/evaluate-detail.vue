<script lang="ts" setup>
import CloseSvg from '@/assets/icons/close.svg';
import { TeacherEvaluate } from '@/view/classroom/type';
import { getAllStudentEvaluateTeachData } from '@/axios';

const props = defineProps<{
	teachPlanId: string;
}>();
const open = defineModel('open', { required: true, type: Boolean });
const desc = ref<string[]>(['极差', '差', '一般', '好', '极好']);
const data = ref<TeacherEvaluate>();
const activeKey = ref<number>(1);
onMounted(() => {
	getAllStudentEvaluateTeachData(props.teachPlanId).then((res) => {
		data.value = res;
	});
});
</script>

<template>
	<a-drawer v-model:open="open" :close-icon="false" width="864px">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">学生评教</div>
				<div>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div class="drawer-title">评教内容</div>
		<table class="table-fixed w-full">
			<tbody>
				<tr>
					<td colspan="2" class="table-title">学习场</td>
					<td colspan="7">{{ data?.studyName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习情境</td>
					<td colspan="7">{{ data?.contextName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习任务</td>
					<td colspan="7">{{ data?.taskName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">典型工作过程描述</td>
					<td colspan="7">{{ data?.workProcess }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">典型工作环节</td>
					<td colspan="3">xxx</td>
					<td colspan="2" class="table-title">学时</td>
					<td colspan="2">{{ data?.totalTime }}</td>
				</tr>
				<tr>
					<td colspan="2" rowspan="7" class="table-title">调查项目</td>
					<td class="table-title">序号</td>
					<td colspan="2" class="table-title">调查内容</td>
					<td colspan="4" class="table-title">评价得分</td>
				</tr>
				<tr v-for="(item, index) in data?.studentEvaluateTeachDtos" :key="index">
					<td class="table-title">{{ index + 1 }}</td>
					<td class="table-title" colspan="2">
						{{ ['资讯', '计划', '决策', '实施', '检查', '评价'][index] }}单的教学水平
					</td>
					<td colspan="4">
						<a-rate v-model:value="item.avgScore" :tooltips="desc" disabled allow-half />
						<span class="ml-8">{{ item.avgScore }}</span>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="drawer-title mt-8">调查内容的改进建议</div>
		<a-tabs v-model:activeKey="activeKey">
			<a-tab-pane
				v-for="(item, index) in data?.studentEvaluateTeachDtos"
				:key="index + 1"
				:tab="['资讯单', '计划单', '决策单', '实施单', '检查单', '评价单'][index]"
			>
				<table class="w-full table-fixed">
					<tbody>
						<tr>
							<td class="table-title">序号</td>
							<td colspan="5" class="table-title">改进建议</td>
							<td colspan="3" class="table-title">评教时间</td>
						</tr>
						<tr v-for="(i, index) in item.studentEvaluateContentList">
							<td>{{ index + 1 }}</td>
							<td colspan="5">{{ i.content }}</td>
							<td colspan="3">{{ $datetime.format(i.createTime, 'full') }}</td>
						</tr>
					</tbody>
				</table>
			</a-tab-pane>
		</a-tabs>
	</a-drawer>
</template>

<style scoped>
table,
td {
	text-align: center;
	border-collapse: collapse;
	border: 1px solid #b4d3ff;
	line-height: 32px;
	padding: 0 8px;
	text-wrap: wrap;
}
.table-title {
	background-color: #EBF3FF;
}
</style>
