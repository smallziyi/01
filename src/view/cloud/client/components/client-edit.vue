<template>
	<a-modal v-model:open="open" title="设置管理员用户" @cancel="handleClose" @ok="handleSubmit">
		<a-form :model="client" ref="form" :label-col="{ span: 5 }" :rules="rules" label-align="left">
			<a-form-item label="管理员账号:" name="authAccount">
				<a-input v-model:value="client.authAccount" placeholder="请输入" />
			</a-form-item>
			<a-form-item label="初始密码" name="password">
				<div class="flex items-center justify-between">
					<a-input-password
						v-model:value="client.password"
						:class="type === 'edit' && 'w-[80%]'"
						:disabled="type === 'edit'"
						placeholder="请输入"
					/>
					<a-form-item-rest v-if="type === 'edit'">
						<a-checkbox v-model:checked="checked">重置</a-checkbox>
					</a-form-item-rest>
				</div>
			</a-form-item>
			<a-form-item label="姓名" name="name">
				<a-input v-model:value="client.name" placeholder="请输入" />
			</a-form-item>
			<a-form-item label="联系方式:" name="phone">
				<a-input v-model:value="client.phone" placeholder="请输入" />
			</a-form-item>
			<a-form-item label="邮箱地址" name="email">
				<a-input v-model:value="client.email" placeholder="请输入" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Rule, FormInstance } from 'ant-design-vue/es/form';
import { initClient } from '../config';
import { setClient, getClientDetail } from '@/axios';
import { message } from 'ant-design-vue';
import { regexConfig } from '@/config/regex';

const open = defineModel('open', { required: true, type: Boolean });
const props = defineProps<{
	clientId: string;
	type: 'edit' | 'add';
}>();
const emits = defineEmits(['success']);
const form = ref<FormInstance>();
const checked = ref<boolean>(false);
const validatorPass = (_rule: Rule, value: string) => {
	if (props.type === 'edit' || regexConfig.password.test(value)) {
		return Promise.resolve();
	} else {
		return Promise.reject('密码长度6~18位，密码必须包含字母和数字。');
	}
};
const rules: Record<string, Rule[]> = {
	authAccount: [
		{ required: true, message: '请输入管理员账户' },
		{ pattern: regexConfig.authAccount, message: '请输大小写字母、数字', trigger: 'blur' },
	],
	password: [
		{ required: true, message: '请输入密码' },
		{ validator: validatorPass, trigger: 'blur' },
	],
	name: [{ required: true, message: '请输入真实姓名' }],
	phone: [
		{ required: true, message: '请输入手机号' },
		{ pattern: regexConfig.phoneNumber, message: '请输入正确手机号', trigger: 'blur' },
	],
	email: [
		{ required: true, message: '请输入邮箱地址' },
		{ pattern: regexConfig.email, message: '请输入正确邮箱地址', trigger: 'blur' },
	],
};

const client = ref(initClient());

const handleSubmit = () => {
	form
		.value!.validate()
		.then(() => {
			client.value.clientId = props.clientId;
			if (props.type === 'edit') {
				client.value.password = checked.value ? 'admin123' : undefined;
			}
			setClient(client.value).then(() => {
				message.success('设置成功');
				handleClose();
				emits('success');
			});
		})
		.catch(() => {
			message.warn('数据检验失败,请检查');
		});
};
const handleClose = () => {
	open.value = false;
	form.value!.resetFields();
};
onMounted(() => {
	if (props.type === 'edit') {
		getClientDetail(props.clientId).then((res) => {
			client.value = res;
			client.value.password = '******';
		});
	}
});
</script>
