<script setup lang="ts">
import CalendarCard from './calendar-card.vue';
import dayjs from 'dayjs';
import useHoliday from '@/view/__report/components/workplace/calendar/useHoliday.ts';
import useVacation from '@/view/__report/components/workplace/calendar/useVacation.ts';
import useAxios, { getCalendar } from '@/axios';
import useRouterParams from '@/hooks/useRouterParams.ts';
import { message, Modal } from 'ant-design-vue';

const year = dayjs().year();

const { generate } = useHoliday();
const { vacations } = useVacation();
const params = useRouterParams<{ reportId: string; type: 'edit' | 'audit' | 'preview' }>();

const axios = useAxios();

onMounted(() => {
	getCalendar(params.reportId).then((res) => {
		vacations.value = res;
	});
	generate(year);
});

const handleDeleteSetting = () => {
	Modal.confirm({
		title: '确认您的操作',
		content: '该操作将清除已设置的内容，无法恢复，请确认',
		onOk() {
			axios.delete(`/resource/calendar/${params.reportId}`).then(() => {
				message.success('已重置');
				vacations.value = [];
			});
		},
	});
};
</script>

<template>
	<div class="oi space-y-4">
		<div class="flex justify-between px-4" v-if="params.type === 'edit'">
			<a-button @click="handleDeleteSetting" danger>重置</a-button>
		</div>
		<div class="grid grid-cols-3 gap-4 px-4">
			<calendar-card v-for="month in 12" :year="year" :month="month" />
		</div>
	</div>
</template>

<style scoped>
.oi {
	max-height: calc(100vh - 208px);
	overflow-y: scroll;
}
</style>
