<template>
	<a-modal v-model:open="open" @close="handleClose" title="添加销售员" @cancel="handleCancel" @ok="handleSubmit">
		<a-form :rules="rules" :model="salesman" ref="form">
			<a-form-item name="salesmanName" label="销售姓名">
				<a-input v-model:value="salesman.salesmanName" />
			</a-form-item>
			<a-form-item name="contactPhone" label="联系电话">
				<a-input v-model:value="salesman.contactPhone" />
			</a-form-item>
			<a-form-item name="contactEmail" label="联系邮箱">
				<a-input v-model:value="salesman.contactEmail" />
			</a-form-item>
			<a-form-item name="idCard" label="身份证号">
				<a-input v-model:value="salesman.idCard" />
			</a-form-item>
			<a-form-item name="type" label="销售类型">
				<a-select :options="SalesmanTypeOptions" v-model:value="salesman.type" />
			</a-form-item>
			<a-form-item name="percentage" label="提成比例">
				<a-input-number
					v-model:value="salesman.percentage"
					:min="0"
					:max="100"
					:formatter="(value: string | number, _info: any) => `${value}%`"
					:parser="(value: string) => value.replace('%', '')"
				/>
			</a-form-item>
			<a-form-item name="settleCycle" label="结算周期">
				<a-select :options="SettleCycleOptions" v-model:value="salesman.settleCycle" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script lang="ts" setup>
import { initSalesman, Salesman, SalesmanTypeOptions, SettleCycleOptions } from '@/view/cloud/salesman/config.ts';
import { FormInstance, Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import { saveSalesman } from '@/axios';

const open = defineModel('open', { required: true, type: Boolean });
const emits = defineEmits(['success']);

const salesman = ref<Salesman>(initSalesman());

const handleClose = () => {
	open.value = false;
	form.value?.resetFields();
};

const form = ref<FormInstance>();
const rules: Partial<Record<keyof Salesman, Rule[]>> = {
	salesmanName: [{ required: true, message: '请输入销售员姓名' }],
	contactPhone: [{ required: true, message: '请输入销售员电话' }],
	contactEmail: [
		{ required: true, message: '请输入销售员邮箱' },
		{ type: 'email', message: '请输入正确的邮箱格式' },
	],
	idCard: [{ required: true, message: '请输入销售员身份证号码' }],
	percentage: [{ required: true, message: '请输入销售员提成比例' }],
	type: [{ required: true, message: '请选择销售员类型' }],
	settleCycle: [{ required: true, message: '请选择结算周期' }],
};
const handleCancel = () => {
	form.value?.resetFields();
};
const handleSubmit = () => {
	form.value
		?.validate()
		.then(() => {
			saveSalesman(salesman.value).then(() => {
				message.success('添加成功');
				emits('success');
				open.value = false;
			});
		})
		.catch((error: FormError) => {
			message.error(error.errorFields[0].errors[0]);
		});
};
</script>
