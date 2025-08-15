<template>
	<a-modal v-model:open="open" title="添加用户" @ok="handleSubmit" destroy-on-close>
		<a-form ref="form" v-model:model="user" :label-col="{ span: 4 }">
			<a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
				<a-input v-model:value="user.name" placeholder="请输入" />
			</a-form-item>
			<a-form-item label="性别" name="gender" :rules="[{ required: true, message: '请选择性别' }]">
				<a-radio-group v-model:value="user.gender" name="genderGroup">
					<a-radio :value="1">男</a-radio>
					<a-radio :value="0">女</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="出生日期" name="birthday" :rules="[{ required: true, message: '请选择出生日期' }]">
				<a-date-picker v-model:value="user.birthday" />
			</a-form-item>
			<a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入手机号' }]">
				<a-input v-model:value="user.phone" placeholder="请输入" />
			</a-form-item>
			<a-form-item
				:rules="[
					{ required: true, message: '请输入邮箱' },
					{ pattern: regexConfig.email, message: '邮箱格式不正确', trigger: 'blur' },
				]"
				label="邮箱"
				name="email"
			>
				<a-input v-model:value="user.email" placeholder="请输入" />
			</a-form-item>
			<a-form-item
				:rules="[
					{ required: true, message: '请输入身份证号', trigger: 'change' },
					{ pattern: regexConfig.idCard, message: '身份证号格式不正确', trigger: 'blur' },
				]"
				label="身份证号"
				name="idCard"
			>
				<a-input v-model:value="user.idCard" placeholder="请输入" />
			</a-form-item>
			<a-form-item label="编号" name="number" :rules="[{ required: true, message: '请输入编号' }]">
				<a-input v-model:value="user.number" placeholder="请输入" />
			</a-form-item>
			<a-form-item :rules="[{ required: true, message: '请选择地址' }]" label="现住址" name="formatAddress">
				<a-cascader
					v-model:value="user.formatAddress"
					:display-render="renderAddress"
					:options="address"
					placeholder="请选择"
				/>
			</a-form-item>
			<a-form-item :rules="[{ required: true, message: '请输入籍贯' }]" label="籍贯" name="formatAddress">
				<a-input v-model:value="user.nativePlace" placeholder="请输入"></a-input>
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script setup lang="ts">
import { addSchoolUser } from '@/axios';
import { initUser } from '@/view/base/user/schoolUser.ts';
import address from '@/config/address.ts';
import { FormInstance } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import { regexConfig } from '@/config/regex.ts';

const emit = defineEmits(['success']);
const open = defineModel('open', { type: Boolean, default: false, required: true });

const props = defineProps<{ roleCode: string }>();

const user = ref<User>(initUser(props.roleCode));

const form = ref<FormInstance>();
const handleSubmit = () => {
	form.value
		?.validate()
		.then(() => {
			addSchoolUser(user.value).then(() => {
				open.value = false;
				emit('success');
			});
		})
		.catch((err) => {
			message.error(err.errorFields[0].errors[0]);
		});
};

const renderAddress = ({ labels }: { labels: string[] }) => {
	const results = labels.join('');
	user.value.address = results;
	return results;
};
</script>
