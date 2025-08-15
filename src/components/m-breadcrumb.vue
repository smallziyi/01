<script setup lang="ts">
const route = useRoute();
const breadcrumbList = route.matched.map((item) => item.meta.title);
</script>

<template>
	<a-breadcrumb>
		<a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbList" :key="index" class="font-normal"
			>{{ breadcrumb }}
		</a-breadcrumb-item>
	</a-breadcrumb>
</template>
