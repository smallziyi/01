<template>
	<a-modal v-model:open="open" title="添加客户端" @cancel="handleClose" @ok="handleSubmit" :confirm-loading="loading">
		<a-form ref="form" :label-col="{ span: 4 }" :model="client" :rules="rules">
			<a-form-item label="名称:" name="clientName">
				<a-input v-model:value="client.clientName" placeholder="请输入" />
			</a-form-item>
			<a-form-item label="类型" name="type">
				<a-radio-group v-model:value="client.type">
					<a-radio :value="2">学校端</a-radio>
					<a-radio :value="3">教育局端</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="编码" name="clientCode">
				<a-input v-model:value="client.clientCode" placeholder="请输入">
					<template #suffix>
						<a-tooltip title="学校唯一编码，用于登录时拼接到账户前">
							<info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
						</a-tooltip>
					</template>
				</a-input>
			</a-form-item>
			<a-form-item label="地址" name="address">
				<a-cascader :options="address" v-model:value="client.address" placeholder="选择"></a-cascader>
			</a-form-item>
			<a-form-item label="联系人:" name="contactName">
				<a-input v-model:value="client.contactName" placeholder="请输入" />
			</a-form-item>
			<a-form-item label="联系电话" name="contactPhone">
				<a-input v-model:value="client.contactPhone" placeholder="请输入" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { initClient } from '@/view/cloud/client/config.ts';
import type { FormInstance, Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import { saveClient } from '@/axios';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { useTableConfig } from '@/hooks/useTableConfig.ts';
import { getAddressTree } from '@/axios/index.ts';
import recursionData from '@/utils/recursionData.ts';

const { loading } = useTableConfig();

const open = defineModel('open', { required: true, type: Boolean });
const emits = defineEmits(['success']);

const form = ref<FormInstance>();
const address = ref();
const rules: Record<string, Rule[]> = {
	clientName: [{ required: true, message: '请输入名称' }],
	type: [{ required: true, message: '请选择类型' }],
	address: [{ required: true, message: '请选择地址' }],
	contactName: [{ required: true, message: '请输入联系人' }],
	clientCode: [{ required: true, message: '请输入编码' }],
	contactPhone: [{ required: true, message: '请输入联系电话' }],
};
// const renderAddress = ({ labels }: { labels: string[] }) => {
// 	const result = labels.join('');
// 	client.value.address = result;
// 	return result;
// };

const client = ref(initClient());
const handleSubmit = () => {
	form
		.value!.validate()
		.then(() => {
			loading.value = true;
			saveClient(client.value)
				.then(() => {
					message.success('添加成功');
					handleClose();
					emits('success');
				})
				.finally(() => {
					loading.value = false;
				});
		})
		.catch(() => {
			message.warn('数据检验失败,请检查');
		});
};
const handleClose = () => {
	client.value = initClient();
	open.value = false;
	form.value!.resetFields();
};

onMounted(() => {
	getAddressTree().then((res) => {
		address.value = recursionData(res);
	});
});
</script>
