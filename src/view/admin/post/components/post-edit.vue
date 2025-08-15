<script setup lang="ts">
import { initPost, Post, PostTypeOptions } from '../config.ts';
import { updatePost } from '@/axios';
import { message } from 'ant-design-vue';

const formRef = ref();
const open = defineModel('open', { required: true, type: Boolean });
const post = ref<Post>(initPost());
const emits = defineEmits(['success']);
const handleUpdate = () => {
	formRef.value.validate().then(() => {
		updatePost(post.value).then(() => {
			message.success('保存成功! ');
			emits('success');
			open.value = false;
		});
	});
};
</script>
<template>
	<a-modal v-model:open="open" title="修改职务" @ok="handleUpdate">
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
