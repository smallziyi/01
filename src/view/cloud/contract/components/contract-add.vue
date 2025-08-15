<template>
	<a-modal v-model:open="open" title="新增合同" destroy-on-close @close="handleClose" @ok="handleSubmit">
		<a-form ref="form" v-model:model="contract" label-align="left" :label-col="{ span: 6 }">
			<a-form-item name="contractName" label="合同名称" :rules="[{ required: true, message: '请输入合同名称' }]">
				<a-input v-model:value="contract.contractName" placeholder="请输入"></a-input>
			</a-form-item>
			<a-form-item name="clientId" label="签约客户" :rules="[{ required: true, message: '请选择签约客户' }]">
				<a-select v-model:value="contract.clientId" :options="clientOptions" placeholder="请选择"></a-select>
			</a-form-item>
			<a-form-item name="contractType" label="签约类型" :rules="[{ required: true, message: '请选择签约类型' }]">
				<a-radio-group v-model:value="contract.contractType">
					<a-radio :value="1">正式签约</a-radio>
					<a-radio :value="2">试用</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item name="startTime" label="合同生效日期" :rules="[{ required: true, message: '请选择生效日期' }]">
				<a-date-picker
					:show-time="{ format: 'HH:mm' }"
					format="YYYY-MM-DD HH:mm"
					v-model:value="contract.startTime"
					class="w-full"
					placeholder="请选择"
				></a-date-picker>
			</a-form-item>
			<a-form-item name="endTime" label="合同终止日期" :rules="[{ required: true, message: '请选择终止日期' }]">
				<a-date-picker
					:show-time="{ format: 'HH:mm' }"
					format="YYYY-MM-DD HH:mm"
					v-model:value="contract.endTime"
					class="w-full"
					placeholder="请选择"
				></a-date-picker>
			</a-form-item>
			<a-form-item name="deployType" label="部署方式" :rules="[{ required: true, message: '请选择部署方式' }]">
				<a-radio-group v-model:value="contract.deployType">
					<a-radio :value="1">私有化</a-radio>
					<a-radio :value="2">云平台</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item name="salesmanId" label="销售人员" :rules="[{ required: true, message: '请选择销售人员' }]">
				<a-select v-model:value="contract.salesmanId" :options="salesmanOptions"></a-select>
			</a-form-item>
			<a-form-item name="totalPrice" label="签约金额" :rules="[{ required: true, message: '请输入签约金额' }]">
				<a-input-number class="w-36" v-model:value="contract.totalPrice" :controls="false">
					<template #addonBefore>¥</template>
					<template #addonAfter>元</template>
				</a-input-number>
			</a-form-item>
			<a-form-item name="discounts" label="优惠金额" :rules="[{ required: true, message: '请输入优惠金额' }]">
				<a-input-number class="w-36" v-model:value="contract.discounts" :controls="false">
					<template #addonBefore>¥</template>
					<template #addonAfter>元</template>
				</a-input-number>
			</a-form-item>
			<a-form-item name="settleType" label="提成方式" :rules="[{ required: true, message: '请选择提成方式' }]">
				<a-radio-group v-model:value="contract.settleType">
					<a-radio :value="1">比例提成</a-radio>
					<a-radio :value="2">固定金额</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item
				label="合同文件"
				name="fileId"
				:rules="contract.contractType === 1 ? [{ required: true, message: '请上传合同文件' }] : []"
			>
				<a-upload
					v-model:file-list="fileList"
					:action="`${$config.file}/upload`"
					:headers="{ authorization: auth ?? '' }"
					:show-upload-list="true"
					accept=".png,.jpg,.jpeg"
					@change="handleFileChange"
				>
					<a-button v-if="fileList.length < 1" type="link">上传凭证</a-button>
				</a-upload>
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script setup lang="ts">
import { Contract, initContract } from '@/view/cloud/contract/config.ts';
import { getAllClientOptions, createContract } from '@/axios';
import { getSalesmanOptions } from '@/axios';
import { FormInstance } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { UploadFile } from 'ant-design-vue/es/upload/interface';

const open = defineModel('open', { required: true, type: Boolean });
const emit = defineEmits(['success']);

const contract = ref<Contract>(initContract());

const form = ref<FormInstance>();
const handleSubmit = () => {
	form.value
		?.validate()
		.then(() => {
			// contract.value.startTime = dayjs(contract.value.startTime).toISOString();
			// contract.value.endTime = dayjs(contract.value.endTime).toISOString();
			createContract(contract.value).then(() => {
				open.value = false;
				emit('success');
			});
		})
		.catch((error) => {
			message.error(error.errorFields[0].errors[0]);
		});
};

const handleClose = () => {
	open.value = false;
};

const clientOptions = ref<Option[]>([]);
const salesmanOptions = ref<Option[]>([]);
onMounted(() => {
	getAllClientOptions().then((res) => {
		clientOptions.value = res;
	});
	getSalesmanOptions().then((res) => {
		salesmanOptions.value = res;
	});
});

const auth = sessionStorage.getItem('jwt');
const fileList = ref([]);
const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
	if (info.fileList.length > 0 && info.fileList[0].xhr) {
		const file = JSON.parse(info.fileList[0].xhr.response) as IFile;
		contract.value.fileId = file.id;
	} else {
		contract.value.fileId = '';
	}
};
</script>
