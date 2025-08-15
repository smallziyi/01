<script lang="ts" setup>
import getFileType from '@/utils/getFileType.ts';
import VueOfficeDocx from '@vue-office/docx';
import VueOfficeExcel from '@vue-office/excel';
import VueOfficePdf from '@vue-office/pdf';
import '@vue-office/docx/lib/index.css';
import '@vue-office/excel/lib/index.css';

const props = defineProps<{ file: { fileId: string; fileName: string; fileUrl: string }; showDelete?: boolean }>();
const emit = defineEmits(['delete']);
const open = ref(false);
const fileType = computed(() => {
	return getFileType(props.file.fileName);
});
</script>

<template>
	<div class="cursor-pointer hover:text-blue-400 group" @click="open = true">
		<a-flex vertical align="center" class="relative">
			<img v-if="fileType === 'image'" width="60" src="@/assets/image/file-type/image.png" alt="" />
			<img v-else-if="fileType === 'video'" width="60" src="@/assets/image/file-type/video.png" alt="" />
			<img v-else-if="fileType === 'audio'" width="60" src="@/assets/image/file-type/audio.png" alt="" />
			<img v-else-if="fileType === 'word'" width="60" src="@/assets/image/file-type/word.png" alt="" />
			<img v-else-if="fileType === 'excel'" width="60" src="@/assets/image/file-type/xlsx.png" alt="" />
			<img v-else-if="fileType === 'pdf'" width="61" src="@/assets/image/file-type/pdf.png" alt="" />
			<div class="w-24 truncate">
				<a-tooltip placement="left">
					<template #title>{{ file.fileName }}</template>
					{{ file.fileName }}
				</a-tooltip>
			</div>
			<a-button
				v-if="$props.showDelete"
				class="absolute -top-2 left-2 opacity-0 group-hover:opacity-100"
				danger
				shape="circle"
				type="primary"
				@click.stop="emit('delete')"
			>
				<template #icon>
					<i class="bi bi-trash3"></i>
				</template>
			</a-button>
		</a-flex>
	</div>
	<a-modal v-if="fileType === 'image'" v-model:open="open" :footer="false" title="图片预览">
		<img :src="file.fileUrl" alt="" class="w-full" />
	</a-modal>
	<a-modal v-if="fileType === 'video'" v-model:open="open" :footer="false" class="w-[800px]" title="视频预览">
		<video class="w-full rounded" controls>
			<source :src="file.fileUrl" />
		</video>
	</a-modal>
	<a-modal v-if="fileType === 'audio'" v-model:open="open" :footer="false" title="音频预览">
		<audio class="mx-auto" controls>
			<source :src="file.fileUrl" />
		</audio>
	</a-modal>
	<a-modal v-if="fileType === 'word'" v-model:open="open" :footer="false" title="文档预览" width="25cm">
		<vue-office-docx :src="file.fileUrl" class="h-[80vh]" />
	</a-modal>
	<a-modal v-if="fileType === 'excel'" v-model:open="open" :footer="false" title="表格预览" width="25cm">
		<vue-office-excel :src="file.fileUrl" class="h-[80vh]" />
	</a-modal>
	<a-modal v-if="fileType === 'pdf'" v-model:open="open" :footer="false" title="PDF预览" width="25cm">
		<vue-office-pdf :src="file.fileUrl" class="h-[80vh]" />
	</a-modal>
</template>

<style scoped></style>
