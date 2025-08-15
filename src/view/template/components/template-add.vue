<script setup lang="ts">
import { createTemplateFile } from '@/axios';
import { initTemplateFile, TemplateFile } from '@/view/template/config.ts';
import { message } from 'ant-design-vue';
import { uploadFile } from '@/axios/file.aip.ts';

defineOptions({
	name: 'TemplateAdd',
});
const open = defineModel({ type: Boolean });
const emit = defineEmits(['success']);
const props = defineProps<{
	pageType: string;
	type: number;
	templateFileItem: TemplateFile;
}>();
const title = computed(() => {
	return props.pageType === 'add' ? '新增' : '编辑';
});
const formModel = reactive<TemplateFile>(initTemplateFile(props.type));
const uploadInput = ref<HTMLInputElement>();

const onCancel = () => {
	open.value = false;
};
const onOk = () => {
	createTemplateFile(formModel).then(() => {
		message.success('新增成功！');
		emit('success');
		open.value = false;
	});
};

const onInputFile = () => {
	uploadFile(uploadInput.value?.files![0]!).then((res) => {
		const { id, fileName, url } = res.data;
		formModel.fileId = id;
		formModel.fileName = fileName;
		formModel.url = url;
	});
};

onMounted(() => {
	if (props.pageType === 'edit') {
		Object.assign(formModel, props.templateFileItem);
	}
});
</script>

<template>
	<a-modal v-model:open="open" :title="title" @cancel="onCancel" @ok="onOk">
		<a-form :model="formModel" :label-col="{ span: 4 }">
			<a-form-item label="模板名称">
				<a-input v-model:value="formModel.name" />
			</a-form-item>
			<a-form-item label="版本">
				<a-input-number v-model:value="formModel.version" prefix="V" min="1" :precision="0" />
			</a-form-item>
			<a-form-item label="模板文件">
				<input type="file" ref="uploadInput" accept=".xlsx" @input="onInputFile" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<style scoped></style>
