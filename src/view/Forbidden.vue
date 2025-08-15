<script lang="ts" setup>
import { useRouter } from 'vue-router';
import forbidSvg from '@/assets/image/other/forbid.svg';

const router = useRouter();
</script>
<template>
	<div class="flex flex-col justify-normal items-center">
		<forbid-svg></forbid-svg>
		<a-button type="primary" @click="router.back()">返回上一级</a-button>
	</div>
</template>
