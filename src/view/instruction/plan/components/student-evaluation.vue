<script setup lang="ts">
import useAxios from '@/axios';
import { AllStudentEvaluateTeachDto } from '@/view/instruction';

const props = defineProps<{ teachPlanId: string }>();

const visible = ref(false);

const axios = useAxios();

const handleClick = () => {
	visible.value = true;
	axios
		.get<AllStudentEvaluateTeachDto[]>('/teach/scene/getAllStudentEvaluateTeachData', {
			params: { teachPlanId: props.teachPlanId },
		})
		.then((res) => {
			data.value = res.data;
		});
};

const data = ref<AllStudentEvaluateTeachDto[]>([]);
const type = ref(1);
</script>

<template>
	<div @click="handleClick" class="cursor-pointer hover:text-[#0867FF]">学生评教</div>
	<a-drawer v-model:open="visible" title="学生评教详情" :close-icon="false" width="640px">
		<template #extra>
			<a-button type="text" @click="visible = false">
				<template #icon>
					<i class="bi bi-x-lg"></i>
				</template>
			</a-button>
		</template>
		<div class="space-y-4">
			<div>评价内容</div>
			<table class="w-full border border-[#b4d3ff]">
				<thead>
					<tr>
						<td class="border border-[#b4d3ff] text-center">序号</td>
						<td class="border border-[#b4d3ff] text-center">调查内容</td>
						<td class="border border-[#b4d3ff] text-center">评价得分</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in data">
						<td class="border border-[#b4d3ff] text-center">{{ index + 1 }}</td>
						<td class="border border-[#b4d3ff] text-center">
							{{ ['未知', '资讯单', '计划单', '决策单', '实施单', '检查单', '评价单'][item.tableType] }}
						</td>
						<td class="border border-[#b4d3ff] text-center"><a-rate :value="item.avgScore" allow-half disabled /></td>
					</tr>
				</tbody>
			</table>
			<div>调查内容改进建议</div>
			<a-radio-group size="small" button-style="solid" v-model:value="type">
				<a-radio-button :value="1">资讯单</a-radio-button>
				<a-radio-button :value="2">计划单</a-radio-button>
				<a-radio-button :value="3">决策单</a-radio-button>
				<a-radio-button :value="4">实施单</a-radio-button>
				<a-radio-button :value="5">检查单</a-radio-button>
				<a-radio-button :value="6">评价单</a-radio-button>
			</a-radio-group>
			<table class="w-full border border-[#b4d3ff]">
				<thead>
					<tr>
						<td class="border border-[#b4d3ff] text-center">序号</td>
						<td class="border border-[#b4d3ff] text-center">改进建议</td>
						<td class="border border-[#b4d3ff] text-center">评教时间</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in data.find((v) => v.tableType === type)?.studentEvaluateContentList || []">
						<td class="border border-[#b4d3ff] text-center">{{ index + 1 }}</td>
						<td class="border border-[#b4d3ff] text-center">{{ item.content }}</td>
						<td class="border border-[#b4d3ff] text-center">{{ item.createTime }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</a-drawer>
</template>

<style scoped></style>
