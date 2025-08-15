<script lang="ts" setup>
import holidayWorkdaySchedule from './holiday-workday-schedule.vue';
import facultyMemberSchedule from './faculty-member-schedule.vue';
import studentSchedule from './student-schedule.vue';

const activeKey = ref('1');
</script>

<template>
	<a-tabs v-model:activeKey="activeKey" type="card">
		<a-tab-pane key="1" tab="节假日/工作日设置">
			<holiday-workday-schedule></holiday-workday-schedule>
		</a-tab-pane>
		<a-tab-pane key="2" tab="教职工作息时间设置">
			<faculty-member-schedule></faculty-member-schedule>
		</a-tab-pane>
		<a-tab-pane key="3" tab="学生作息时间设置">
			<student-schedule></student-schedule>
		</a-tab-pane>
	</a-tabs>
</template>
