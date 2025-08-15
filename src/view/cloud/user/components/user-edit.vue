<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">编辑</div>
				<div>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">基本信息</div>
		<a-form ref="formRef" class="mt-5" :model="formParams" :label-col="{ span: 8 }">
			<div class="grid grid-cols-2 gap-4">
				<a-form-item label="所属角色" name="roleIds" :rules="[{ required: true, message: '请输入' }]">
					<a-select v-model:value="formParams.roleIds" placeholder="请选择" mode="multiple" :options="roleArray" />
				</a-form-item>
				<a-form-item label="工号/学号" name="number" :rules="[{ required: true, message: '请输入' }]">
					<a-input v-model:value="formParams.number" placeholder="请输入" />
				</a-form-item>
				<a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入' }]">
					<a-input v-model:value="formParams.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item label="性别" name="gender" :rules="[{ required: true, message: '请选择' }]">
					<a-radio-group v-model:value="formParams.gender" name="genderGroup">
						<a-radio :value="1">男</a-radio>
						<a-radio :value="0">女</a-radio>
					</a-radio-group>
				</a-form-item>
				<!--				<a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入' }]">-->
				<a-form-item label="手机号" name="phone">
					<a-input v-model:value="formParams.phone" placeholder="请输入" />
				</a-form-item>
				<a-form-item label="出生日期" name="birthday" :rules="[{ required: true, message: '请选择' }]">
					<a-date-picker class="w-full" v-model:value="formParams.birthday" placeholder="请选择" />
				</a-form-item>
				<!--				<a-form-item label="地址" name="formatAddress" :rules="[{ required: true, message: '请选择' }]">-->
				<a-form-item label="地址" name="formatAddress">
					<a-cascader
						:options="address"
						:display-render="renderAddress"
						v-model:value="formParams.formatAddress"
						placeholder="请输入"
					/>
				</a-form-item>
				<a-form-item label="身份证号" name="idCard" :rules="[{ required: true, message: '请输入' }]">
					<a-input v-model:value="formParams.idCard" placeholder="请输入" />
				</a-form-item>
				<a-form-item label="邮箱地址" name="email">
					<!--				<a-form-item label="邮箱地址" name="email" :rules="[{ required: true, message: '请输入' }]">-->
					<a-input v-model:value="formParams.email" placeholder="请输入" />
				</a-form-item>
			</div>
		</a-form>
		<template #footer>
			<div class="text-right my-8">
				<a-button class="mr-5" @click="onCancel">取消</a-button>
				<a-button class="mr-5" type="primary" @click="onSave">保存</a-button>
			</div>
		</template>
	</a-drawer>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import address from '@/config/address.ts';
import { initUser } from '@/view/base/user/schoolUser.ts';
import useSelectOptions from '@/hooks/useSelectOptions.ts';
import dayjs from 'dayjs';
import useAppTheme from '@/hooks/useAppTheme.ts';
import CloseSvg from '@/assets/icons/close.svg';
import { updateUser } from '@/axios';

const { token } = useAppTheme();

const open = defineModel({ type: Boolean });
const emits = defineEmits(['saveSuccess']);
const props = defineProps<{
	clientId: string;
	currentDetailInfo: User;
}>();
const formParams = ref<User>(initUser('admin'));
const formRef = ref();
const roleArray = useSelectOptions('role', props.clientId);

const onCancel = () => {
	open.value = false;
};
const onSave = () => {
	formRef.value.validate().then(() => {
		const params = {
			...formParams.value,
			clientId: props.clientId,
		};
		updateUser(params).then(() => {
			message.success('保存成功！');
			open.value = false;
			emits('saveSuccess');
		});
	});
};

const renderAddress = ({ labels }: { labels: string[] }) => {
	const results = labels.join('');
	formParams.value.address = results;
	return results;
};

onMounted(() => {
	const { id, roleList, number, name, gender, phone, address, idCard, email, birthday } = props.currentDetailInfo;
	Object.assign(formParams.value, {
		id,
		roleIds: roleList.map((item) => item.id),
		number,
		name,
		gender,
		phone,
		birthday: birthday ? dayjs(new Date(birthday).toDateString()) : '',
		formatAddress: address,
		idCard,
		email,
	});
});
</script>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
