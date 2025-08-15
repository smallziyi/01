<script setup lang="ts">
import useRouterParams from '@/hooks/useRouterParams';
import { getPersonRanking, getTeamRanking } from '@/axios';
import pointsSvg from '@/assets/image/instruction/points.svg';
import goldSvg from '@/assets/image/instruction/gold.svg';
import silverSvg from '@/assets/image/instruction/sliver.svg';
import cuprumSvg from '@/assets/image/instruction/cuprum.svg';

const params = useRouterParams<{ teachPlanId: string }>();
const open = defineModel('open', { required: true, type: Boolean });

const personData = ref();
const teamData = ref();

onMounted(() => {
	getPersonRanking(params.teachPlanId).then((res) => {
		personData.value = res;
	});
	getTeamRanking(params.teachPlanId).then((res) => {
		teamData.value = res;
	});
});
</script>

<template>
	<a-modal v-model:open="open" :footer="null" width="800px">
		<template #title>
			<div class="flex">
				<points-svg></points-svg>
				<div class="ml-2 text-[#0091ff]">本节课积分排行详情</div>
			</div>
		</template>
		<div class="flex flex-col md:flex-row gap-4 p-2">
			<!-- 分组排行 -->
			<div class="w-[300px] bg-gradient-to-b from-[#ebf3fe] to-[#fff] rounded-lg shadow p-6">
				<h2 class="text-base font-semibold mb-2">分组排行</h2>
				<table class="w-full">
					<thead>
						<tr>
							<th class="text-[#999] font-normal w-[60px]">排名</th>
							<th class="text-[#999] font-normal w-[120px]">分组</th>
							<th class="text-[#999] font-normal">积分</th>
						</tr>
					</thead>
				</table>
				<div class="h-[330px] overflow-y-auto scrollbar-hide">
					<table class="w-full">
						<tbody>
							<tr v-for="(group, index) in teamData" :key="index">
								<td class="w-[60px]">
									<gold-svg v-if="index === 0"></gold-svg>
									<silver-svg v-else-if="index === 1"></silver-svg>
									<cuprum-svg v-else-if="index === 2"></cuprum-svg>
									<span v-else class="ml-[6px] font-bold text-center">{{ index + 1 }}</span>
								</td>
								<td class="w-[120px]">{{ group.teamName }}</td>
								<td class="font-bold">{{ group.totalScore }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- 学生排行 -->
			<div class="flex-1 bg-gradient-to-b from-[#fef4e4] to-[#fff] rounded-lg shadow p-6">
				<h2 class="text-base font-semibold mb-2">学生排行</h2>
				<table class="w-full">
					<thead>
						<tr>
							<th class="text-[#999] font-normal w-[60px]">排名</th>
							<th class="text-[#999] font-normal w-[120px]">学号</th>
							<th class="text-[#999] font-normal w-[100px]">姓名</th>
							<th class="text-[#999] font-normal">积分</th>
						</tr>
					</thead>
				</table>
				<div class="h-[330px] overflow-y-auto">
					<table class="w-full">
						<tbody>
							<tr v-for="(student, index) in personData" :key="student.id">
								<td class="w-[60px]">
									<gold-svg v-if="index === 0"></gold-svg>
									<silver-svg v-else-if="index === 1"></silver-svg>
									<cuprum-svg v-else-if="index === 2"></cuprum-svg>
									<span v-else class="ml-[6px] font-bold text-center">{{ index + 1 }}</span>
								</td>
								<td class="w-[120px]">{{ student.number }}</td>
								<td class="w-[100px] font-bold">{{ student.name }}</td>
								<td class="font-bold">{{ student.score }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</a-modal>
</template>

<style scoped>
table,
td {
	text-align: left;
	line-height: 32px;
	height: 28px;
	text-wrap: wrap;
}
</style>
