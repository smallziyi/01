<script lang="ts">
import useAppTheme from '@/hooks/useAppTheme.ts';

export default {
	name: 'MEmpty',
	props: {
		size: {
			type: String,
			required: false,
			default: 'large',
		},
	},
	setup() {
		const { appTheme } = useAppTheme();
		return {
			appTheme,
		};
	},
};
</script>
<template>
	<div class="flex flex-col justify-center items-center h-full">
		<template v-if="appTheme === 'white'">
			<img v-if="size === 'large'" src="@/assets/image/other/empty-light.png" alt="空状态" />
			<img v-else src="@/assets/image/other/empty-light-small.png" alt="空状态" />
		</template>
		<template v-else>
			<img v-if="size === 'large'" src="@/assets/image/other/empty-dark.png" alt="空状态" />
			<img v-else alt="空状态" class="ml-12" src="@/assets/image/other/empty-dark-small.png" />
		</template>
	</div>
</template>
