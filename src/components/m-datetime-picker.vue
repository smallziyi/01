<script setup lang="ts">
import { Dayjs } from 'dayjs';

const startDateTime = defineModel<Dayjs | undefined>('startDateTime', { required: true });
const endDateTime = defineModel<Dayjs | undefined>('endDateTime', { required: true });
</script>

<template>
	<a-range-picker
		:value="startDateTime && endDateTime ? [startDateTime, endDateTime] : undefined"
		@update:value="
			(dates) => {
				if (dates && dates.length > 0) {
					startDateTime = dates[0] as Dayjs;
					endDateTime = dates[1] as Dayjs;
				} else {
					startDateTime = undefined;
					endDateTime = undefined;
				}
			}
		"
		show-time
	/>
</template>

<style scoped></style>
