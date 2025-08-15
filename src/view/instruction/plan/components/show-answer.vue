<script setup lang="ts">
defineProps<{ question: Array<{ isMark: boolean; text: string }> }>();
</script>

<template>
	<span v-for="item in $props.question">
		<a-typography-text :type="item.isMark ? 'danger' : undefined" :underline="item.isMark">
			&nbsp;&nbsp;{{ item.text }}&nbsp;&nbsp;
		</a-typography-text>
	</span>
</template>

<style scoped></style>
