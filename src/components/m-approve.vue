<script setup lang="ts">
defineProps<{
	approver: string;
	approveTime: string;
}>();
</script>
<template>
	<div class="relative">
		<div class="absolute top-3 right-3">
			<img src="/images/report/approved.png" />
			<!-- <div class="text-[#999] -rotate-[28deg] text-xs text-center my-1">审核人:{{ approver }}</div>
			<div class="text-[#999] -rotate-[28deg] text-xs text-center">审核时间:{{ $datetime.format(approveTime) }}</div> -->
		</div>
	</div>
</template>
