<template>
	<a-modal v-model:open="open" title="添加缴费" destroy-on-close @close="handleClose" @ok="handleSubmit">
		<a-form ref="form" :model="expense" label-align="left" :label-col="{ span: 6 }">
			<a-form-item label="缴费金额" name="payment" :rules="[{ required: true, message: '请输入缴费金额' }]">
				<a-input-number :min="1" :controls="false" v-model:value="expense.payment">
					<template #addonBefore>¥</template>
					<template #addonAfter>元</template>
				</a-input-number>
			</a-form-item>
			<a-form-item label="缴费凭证" name="fileId" :rules="[{ required: true, message: '请上传缴费凭证' }]">
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
import { Expense, initExpense } from '@/view/cloud/expense/config.ts';
import { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { saveExpense } from '@/axios';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { UploadFile } from 'ant-design-vue/es/upload/interface';

const open = defineModel('open', { required: true, type: Boolean });
const emit = defineEmits(['success']);
const props = defineProps<{ contractId: string }>();

const expense = ref<Expense>(initExpense(props.contractId));
const form = ref<FormInstance>();

const handleSubmit = () => {
	if (expense.value.payment <= 0) {
		message.warning('缴费金额必须大于0元');
		return;
	}
	form.value
		?.validate()
		.then(() => {
			saveExpense(expense.value).then(() => {
				open.value = false;
				emit('success');
			});
		})
		.catch((err) => {
			message.error(err.errorFields[0].errors[0]);
		});
};
const handleClose = () => {
	open.value = false;
};

const auth = sessionStorage.getItem('jwt');
const fileList = ref([]);
const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
	if (info.fileList.length > 0 && info.fileList[0].xhr) {
		const file = JSON.parse(info.fileList[0].xhr.response) as IFile;
		expense.value.fileId = file.id;
	} else {
		expense.value.fileId = '';
	}
};
</script>
