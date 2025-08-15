<script setup lang="ts">
defineProps<{
	question: Array<{ isMark: boolean; text: string }>;
	questionFlag: boolean;
}>();
</script>

<template>
	<span v-for="item in $props.question" :class="{ 'text-blue-400': item.isMark && questionFlag }">
		<template v-if="questionFlag">
			{{ item.isMark ? '________' : item.text }}
		</template>
		<template v-else>
			{{ item.text }}
		</template>
	</span>
</template>

<style scoped></style>
