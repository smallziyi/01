<script setup lang="ts">
import { initPost, Post, PostTypeOptions } from '../config.ts';
import { createPost } from '@/axios';
import { FormInstance, message } from 'ant-design-vue';

const formRef = useTemplateRef<FormInstance>('formRef');
const post = ref<Post>(initPost());
const emits = defineEmits(['success']);
const open = defineModel('open', { required: true, type: Boolean });
const handleCreate = () => {
	formRef.value!.validate().then(() => {
		createPost(post.value).then(() => {
			message.success('新增成功! ');
			emits('success');
			open.value = false;
		});
	});
};
</script>

<template>
	<a-modal v-model:open="open" title="新增职务" @ok="handleCreate">
		<a-form ref="formRef" :model="post" :label-col="{ span: 4 }">
			<a-form-item
				:rules="[{ required: true, message: '请输入职务名称', trigger: 'change' }]"
				label="职务名称"
				name="name"
			>
				<a-input v-model:value="post.name" placeholder="请输入" />
			</a-form-item>
			<a-form-item
				:rules="[{ required: true, message: '请选择职务类型', trigger: 'change' }]"
				label="职务类型"
				name="type"
			>
				<a-select :options="PostTypeOptions" v-model:value="post.type" placeholder="请选择" />
			</a-form-item>
			<a-form-item
				:rules="[{ required: true, message: '请输入职务描述', trigger: 'change' }]"
				label="职务描述"
				name="description"
			>
				<a-textarea v-model:value="post.description" placeholder="请输入" :auto-size="{ minRows: 2 }" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>
