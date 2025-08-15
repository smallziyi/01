<script setup lang="ts">
import useRouterParams from '@/hooks/useRouterParams.ts';
import { getAnswerRecord } from '@/axios';
import useAxios from '@/axios';
import { Answer } from '@/view/instruction';
import { message } from 'ant-design-vue';
import studentAnswer from '../../components/student-answer.vue';
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';

const props = defineProps<{
	tableId: string;
	questions: Array<ReportCourseQuestion>;
}>();
const params = useRouterParams<{ teachPlanId: string }>();
const open = ref(false);
const axios = useAxios();
interface TeamAnswer {
	teamId: string;
	teamLeaderId: string;
	teamName: string;
	teamTotalScore: number;
	teamSort: number;
	studentAnswerTableData: StudentAnswer[];
}
interface StudentAnswer {
	studentId: string;
	studentName: string;
	totalScore: number;
	correctRate: string;
	answerData: { questionId: string; correctFlag: boolean }[];
}

const data = ref<TeamAnswer[]>([]);

function fetchData() {
	axios
		.get<
			TeamAnswer[]
		>('/teach/scene/getTeamAnswerProgressData', { params: { teachPlanId: params.teachPlanId, tableId: props.tableId, answerTableType: 2 } })
		.then((res) => {
			data.value = res.data;
			console.log(res.data);
		});
}

function refresh() {
	fetchData();
}

const answerDataList = ref<Answer[]>([]);

const handleView = (userId: string) => {
	getAnswerRecord({
		teachPlanId: params.teachPlanId,
		userId: userId,
		tableId: props.tableId,
		answerTableType: 2,
	}).then((res) => {
		if (res) {
			answerDataList.value = res.answerDataList;

			open.value = true;
		} else {
			message.info('没有答题记录');
		}
	});
};

defineExpose({ refresh });

onMounted(() => {
	fetchData();
});
</script>

<template>
	<a-divider class="my-2">答题情况</a-divider>
	<table class="w-full border border-[#b4d3ff]">
		<thead>
			<tr>
				<td colspan="6" class="border border-[#b4d3ff] text-center">分组情况</td>
				<td colspan="8" class="border border-[#b4d3ff] text-center">课堂测评题</td>
			</tr>
			<tr>
				<td colspan="1" class="border border-[#b4d3ff] text-center w-20">小组排名</td>
				<td colspan="2" class="border border-[#b4d3ff] text-center">小组名称</td>
				<td class="border border-[#b4d3ff] text-center w-20">小组得分</td>
				<td colspan="2" class="border border-[#b4d3ff] text-center w-20">小组成员</td>
				<td colspan="1" class="border border-[#b4d3ff] text-center w-20">组内排名</td>
				<td colspan="4" class="border border-[#b4d3ff] text-center">答题情况</td>
				<td colspan="1" class="border border-[#b4d3ff] text-center w-20">得分</td>
				<td colspan="1" class="border border-[#b4d3ff] text-center w-20">正确率</td>
				<td class="border border-[#b4d3ff] text-center font-mono">操作</td>
			</tr>
		</thead>
		<tbody>
			<template v-for="(team, v) in data">
				<tr>
					<td :rowspan="team.studentAnswerTableData.length" class="border border-[#b4d3ff] text-center font-mono">
						{{ v + 1 }}
					</td>
					<td :rowspan="team.studentAnswerTableData.length" colspan="2" class="border border-[#b4d3ff] text-center">
						{{ team.teamName }}
					</td>
					<td class="border border-[#b4d3ff] text-center font-mono" :rowspan="team.studentAnswerTableData.length">
						{{ team.teamTotalScore }}
					</td>
					<td colspan="2" class="border border-[#b4d3ff] text-center w-20">
						{{ team.studentAnswerTableData[0].studentName }}
					</td>
					<td class="border border-[#b4d3ff] text-center font-mono">{{ 1 }}</td>
					<td colspan="4" class="border border-[#b4d3ff] text-center font-mono">
						<div class="flex gap-2">
							<div
								v-for="(v, i) in team.studentAnswerTableData[0].answerData"
								class="text-white size-6 leading-6 text-center rounded font-mono select-none"
								:class="v.correctFlag === null ? 'bg-gray-500' : v.correctFlag ? 'bg-green-500' : 'bg-orange-500'"
							>
								{{ i + 1 }}
							</div>
						</div>
					</td>
					<td class="border border-[#b4d3ff] text-center font-mono">{{ team.studentAnswerTableData[0].totalScore }}</td>
					<td class="border border-[#b4d3ff] text-center font-mono">{{ team.studentAnswerTableData[0].correctRate }}</td>
					<td class="border border-[#b4d3ff] text-center font-mono">
						<a-button type="link" @click="handleView(team.studentAnswerTableData[0].studentId)">查看</a-button>
					</td>
				</tr>
				<template v-for="(student, index) in team.studentAnswerTableData">
					<tr v-if="index !== 0">
						<td colspan="2" class="border border-[#b4d3ff] text-center w-20">{{ student.studentName }}</td>
						<td class="border border-[#b4d3ff] text-center font-mono">{{ index + 1 }}</td>
						<td colspan="4" class="border border-[#b4d3ff] text-center">
							<div class="flex gap-2 w-full">
								<div
									v-for="(v, i) in student.answerData"
									class="text-white size-6 leading-6 text-center rounded font-mono select-none"
									:class="v.correctFlag === null ? 'bg-gray-500' : v.correctFlag ? 'bg-green-500' : 'bg-orange-500'"
								>
									{{ i + 1 }}
								</div>
							</div>
						</td>
						<td class="border border-[#b4d3ff] text-center font-mono">{{ student.totalScore }}</td>
						<td class="border border-[#b4d3ff] text-center font-mono">{{ student.correctRate }}</td>
						<td class="border border-[#b4d3ff] text-center font-mono">
							<a-button type="link" @click="handleView(student.studentId)">查看</a-button>
						</td>
					</tr>
				</template>
			</template>
		</tbody>
	</table>
	<a-modal v-if="open" v-model:open="open" title="学生答题情况" width="700px" :footer="false">
		<div class="h-[500px] overflow-y-scroll">
			<student-answer :questions="questions" :answer-data-list="answerDataList"></student-answer>
		</div>
	</a-modal>
</template>

<style scoped></style>
