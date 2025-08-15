<script setup lang="ts">
defineProps<{
	students: Array<{ userId: string; name: string; number: string; gender: string; avatarUrl: string }>;
	signInList: Array<string>;
}>();
</script>

<template>
	<div class="grid grid-cols-4 gap-4">
		<div v-for="student in students" :key="student.userId" class="flex gap-2 bg-blue-200 rounded p-2">
			<div class="size-12 overflow-hidden rounded-full">
				<img :src="student.avatarUrl" alt="" />
			</div>
			<div class="leading-6 font-mono">
				<div>{{ student.name }}</div>
				<div>{{ student.number }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
