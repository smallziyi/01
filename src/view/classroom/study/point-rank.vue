<script setup lang="ts">
import useRouterParams from '@/hooks/useRouterParams';
import { getStudentActivityRecord } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';
import pointsSvg from '@/assets/image/instruction/points.svg';
import dayjs from 'dayjs';

const { user } = useUserStore();
const params = useRouterParams<{ teachPlanId: string }>();
const open = defineModel('open', { required: true, type: Boolean });

const activeEvent = ref();

onMounted(() => {
	getStudentActivityRecord(params.teachPlanId, user.value!.id).then((res) => {
		activeEvent.value = res.map((item: any) => {
			return {
				event: item.event,
				time: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
				score: item.score,
			};
		});
	});
});
</script>

<template>
	<a-modal v-model:open="open" :footer="null" width="380px">
		<template #title>
			<div class="flex">
				<points-svg></points-svg>
				<div class="ml-2 text-[#0091ff]">本节课积分排行详情</div>
			</div>
		</template>
		<div class="bg-gradient-to-b from-[#ebf3fe] to-[#fff] rounded-lg h-[360px] overflow-y-scroll">
			<a-list :data-source="activeEvent">
				<template #renderItem="{ item }">
					<a-list-item>
						<a-list-item-meta :description="item.time">
							<template #title>
								<div class="font-bold">{{ item.event }}</div>
							</template>
						</a-list-item-meta>
						<div class="font-bold">+{{ item.score }}</div>
					</a-list-item>
				</template>
			</a-list>
		</div>
	</a-modal>
</template>

<style scoped>
table,
td {
	text-align: center;
	border-collapse: collapse;
	border: 1px solid #999;
	line-height: 32px;
	padding: 0 8px;
	text-wrap: wrap;
}
.table-title {
	background-color: #b4d3ff;
}
</style>
