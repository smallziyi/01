<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
	<div class="flex flex-col justify-normal items-center">
		<img alt="页面不存在" src="@/assets/image/other/not-found.png" />
		<div class="my-5 text-lg">抱歉，您访问的页面不存在。</div>
		<a-button type="primary" @click="router.back()">返回上一级</a-button>
	</div>
</template>
