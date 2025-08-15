<script setup lang="ts">
defineProps<{ question: Array<{ isMark: boolean; text: string }> }>();
</script>

<template>
	<span v-for="item in $props.question" :class="{ 'text-blue-400': item.isMark }">
		{{ item.isMark ? '________' : item.text }}
	</span>
</template>

<style scoped></style>
