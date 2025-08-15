<script setup lang="ts">
import useAxios, { getUserInfoById } from '@/axios';
import { StudentEvaluateTeachData } from '@/view/instruction';
import { message } from 'ant-design-vue';
import useUserStore from '@/store/modules/useUserStore.ts';

const props = defineProps<{ teachPlanId: string; teacherId: string; teachSceneId: string }>();

const visible = ref(false);

const axios = useAxios();
const { user } = useUserStore();

onMounted(() => {
	axios
		.get<StudentEvaluateTeachData>('/teach/scene/getStudentEvaluateTeachData', {
			params: { teachPlanId: props.teachPlanId, userId: user.value!.id },
		})
		.then((res) => {
			updated.value = !!res.data;
			data.value = !!res.data
				? res.data
				: {
						studentId: user.value!.id,
						tableEvaluateData: [
							{ tableType: 1, score: 0, content: '', createTime: '' },
							{ tableType: 2, score: 0, content: '', createTime: '' },
							{ tableType: 3, score: 0, content: '', createTime: '' },
							{ tableType: 4, score: 0, content: '', createTime: '' },
							{ tableType: 5, score: 0, content: '', createTime: '' },
							{ tableType: 6, score: 0, content: '', createTime: '' },
						],
						createTime: '',
					};
		});
	getUserInfoById(props.teacherId).then((res) => {
		name.value = res.data.name;
	});
});

const data = ref<StudentEvaluateTeachData>();
const name = ref('');

const updated = ref(false);

const save = () => {
	if (!data.value) return;
	const date = new Date();
	data.value.createTime = date.toLocaleString();
	data.value.tableEvaluateData.forEach((item) => (item.createTime = date.toLocaleString()));
	axios
		.put('/scene/updateStudentEvaluateTeachData', {
			id: props.teachSceneId,
			teachPlanId: props.teachPlanId,
			studentEvaluateTeachDataList: [data.value],
		})
		.then(() => {
			updated.value = true;
			message.success('评教完成');
		});
};
</script>

<template>
	<div @click="visible = true" class="cursor-pointer hover:text-[#0867FF]">学生评教</div>
	<a-drawer v-model:open="visible" title="学生评教详情" :close-icon="false" width="800px">
		<template #extra>
			<a-button type="text" @click="visible = false">
				<template #icon>
					<i class="bi bi-x-lg"></i>
				</template>
			</a-button>
		</template>
		<div>评教内容</div>
		<table class="w-full border border-[#b4d3ff]">
			<tbody>
				<tr>
					<td colspan="2" rowspan="7" class="border border-[#b4d3ff]">调查项目</td>
					<td colspan="1" class="border border-[#b4d3ff] text-center">序号</td>
					<td colspan="2" class="border border-[#b4d3ff]">调查内容</td>
					<td colspan="2" class="border border-[#b4d3ff]">评价得分</td>
					<td colspan="3" class="border border-[#b4d3ff]">改进建议</td>
				</tr>
				<template v-if="data">
					<tr>
						<td colspan="1" class="border border-[#b4d3ff] text-center">1</td>
						<td colspan="2" class="border border-[#b4d3ff]">资讯单的教学水平</td>
						<td colspan="2" class="border border-[#b4d3ff]">
							<a-rate :disabled="updated" v-model:value="data.tableEvaluateData[0].score" allow-half />
						</td>
						<td colspan="3" class="border border-[#b4d3ff]">
							<input
								:disabled="updated"
								class="outline-none bg-transparent w-full px-2"
								v-model="data.tableEvaluateData[0].content"
								placeholder="此处输入建议"
							/>
						</td>
					</tr>
					<tr>
						<td colspan="1" class="border border-[#b4d3ff] text-center">2</td>
						<td colspan="2" class="border border-[#b4d3ff]">计划单的教学水平</td>
						<td colspan="2" class="border border-[#b4d3ff]">
							<a-rate :disabled="updated" v-model:value="data.tableEvaluateData[1].score" allow-half />
						</td>
						<td colspan="3" class="border border-[#b4d3ff]">
							<input
								:disabled="updated"
								class="outline-none bg-transparent w-full px-2"
								v-model="data.tableEvaluateData[1].content"
								placeholder="此处输入建议"
							/>
						</td>
					</tr>
					<tr>
						<td colspan="1" class="border border-[#b4d3ff] text-center">3</td>
						<td colspan="2" class="border border-[#b4d3ff]">决策单的教学水平</td>
						<td colspan="2" class="border border-[#b4d3ff]">
							<a-rate :disabled="updated" v-model:value="data.tableEvaluateData[2].score" allow-half />
						</td>
						<td colspan="3" class="border border-[#b4d3ff]">
							<input
								:disabled="updated"
								class="outline-none bg-transparent w-full px-2"
								v-model="data.tableEvaluateData[2].content"
								placeholder="此处输入建议"
							/>
						</td>
					</tr>
					<tr>
						<td colspan="1" class="border border-[#b4d3ff] text-center">4</td>
						<td colspan="2" class="border border-[#b4d3ff]">实施单的教学水平</td>
						<td colspan="2" class="border border-[#b4d3ff]">
							<a-rate :disabled="updated" v-model:value="data.tableEvaluateData[3].score" allow-half />
						</td>
						<td colspan="3" class="border border-[#b4d3ff]">
							<input
								:disabled="updated"
								class="outline-none bg-transparent w-full px-2"
								v-model="data.tableEvaluateData[3].content"
								placeholder="此处输入建议"
							/>
						</td>
					</tr>
					<tr>
						<td colspan="1" class="border border-[#b4d3ff] text-center">5</td>
						<td colspan="2" class="border border-[#b4d3ff]">检查单的教学水平</td>
						<td colspan="2" class="border border-[#b4d3ff]">
							<a-rate :disabled="updated" v-model:value="data.tableEvaluateData[4].score" allow-half />
						</td>
						<td colspan="3" class="border border-[#b4d3ff]">
							<input
								:disabled="updated"
								class="outline-none bg-transparent w-full px-2"
								v-model="data.tableEvaluateData[4].content"
								placeholder="此处输入建议"
							/>
						</td>
					</tr>
					<tr>
						<td colspan="1" class="border border-[#b4d3ff] text-center">6</td>
						<td colspan="2" class="border border-[#b4d3ff]">评价单的教学水平</td>
						<td colspan="2" class="border border-[#b4d3ff]">
							<a-rate :disabled="updated" v-model:value="data.tableEvaluateData[5].score" allow-half />
						</td>
						<td colspan="3" class="border border-[#b4d3ff]">
							<input
								:disabled="updated"
								class="outline-none bg-transparent w-full px-2"
								v-model="data.tableEvaluateData[5].content"
								placeholder="此处输入建议"
							/>
						</td>
					</tr>
					<tr>
						<td colspan="2" class="border border-[#b4d3ff] text-center">教师姓名</td>
						<td colspan="3" class="border border-[#b4d3ff] text-center">{{ name }}</td>
						<td colspan="2" class="border border-[#b4d3ff] text-center">评教时间</td>
						<td colspan="3" class="border border-[#b4d3ff] text-center">
							{{ !data.createTime ? '评教后自动生成' : new Date(data.createTime).toLocaleString() }}
						</td>
					</tr>
				</template>
			</tbody>
		</table>
		<template #footer v-if="!updated">
			<div class="flex justify-end">
				<a-button type="primary" @click="save">保存</a-button>
			</div>
		</template>
	</a-drawer>
</template>

<style scoped></style>
