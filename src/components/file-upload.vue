<script lang="ts" setup>
import { uploadFile } from '@/axios/file.aip.ts';

defineProps<{ accept?: Array<string>; multiple?: boolean }>();

const process = defineModel<Map<string, { process: number; status: 'error' | 'pending' | 'success' }>>(
	'uploadProcess',
	{
		required: true,
		default: () => new Map<string, { process: number; status: 'error' | 'pending' | 'success' }>(),
	},
);

defineExpose({
	upload,
});

const emits = defineEmits(['uploaded']);

const inputFile = ref<HTMLInputElement>();

function upload() {
	inputFile.value?.click();
}

const handleFileInput = (_e: Event) => {
	if (inputFile.value?.files) {
		const files: Array<File> = [];
		Object.keys(inputFile.value.files).forEach((key) => {
			files.push(inputFile.value?.files![+key] as File);
		});
		inputFile.value.files = null;
		files.forEach(async (item) => {
			process.value.set(item.name, { process: 0, status: 'pending' });
			uploadFile(item, (event) => {
				process.value.get(item.name)!.process = +event.progress!.toFixed(2);
			})
				.then((res) => {
					process.value.get(item.name)!.status = 'success';
					process.value.get(item.name)!.process = 1;
					emits('uploaded', res.data);
				})
				.catch(() => {
					process.value.get(item.name)!.status = 'error';
				});
		});
	}
};
</script>

<template>
	<input
		ref="inputFile"
		:accept="$props.accept && $props.accept.join(',')"
		:multiple="$props.multiple"
		class="hidden"
		type="file"
		@input="handleFileInput"
	/>
	<div>
		<slot />
	</div>
</template>

<style scoped></style>
