<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看</div>
				<div>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div class="drawer-title">基本信息</div>
		<a-descriptions :column="2" small="size">
			<a-descriptions-item label="合同编号">{{ contract.contractName }}</a-descriptions-item>
			<a-descriptions-item label="合同名称">{{ contract.contractNumber }}</a-descriptions-item>
			<a-descriptions-item label="生效日期">{{ $datetime.format(contract.startTime, 'full') }}</a-descriptions-item>
			<a-descriptions-item label="结束日期">{{ $datetime.format(contract.endTime, 'full') }}</a-descriptions-item>
			<a-descriptions-item label="签约金额">{{ contract.totalPrice }}</a-descriptions-item>
			<a-descriptions-item label="优惠金额">{{ contract.discounts }}</a-descriptions-item>
			<a-descriptions-item label="已支付金额">{{ contract.payment }}</a-descriptions-item>
		</a-descriptions>
		<div class="drawer-title mt-8">缴费记录</div>
		<expense-contract :contract-id="props.id" @update="fetchData" />
	</a-drawer>
</template>
<script setup lang="ts">
import { Contract, initContract } from '@/view/cloud/contract/config.ts';
import { getContractById } from '@/axios';
import ExpenseContract from '@/view/cloud/expense/components/expense-contract.vue';

const contract = ref<Contract>(initContract());

const open = defineModel('open', { required: true, type: Boolean });
const props = defineProps<{ id: string }>();

const fetchData = () => {
	getContractById(props.id).then((res) => {
		contract.value = res;
	});
};

onMounted(() => {
	fetchData();
});
</script>
