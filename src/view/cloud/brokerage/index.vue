<template>
	<a-card :bordered="false" style="height: calc(100vh - 88px)">
		<template #title>
			<div class="card-title">历史结算</div>
		</template>
		<TransitionGroup name="list" tag="div">
			<div key="1" class="space-y-4" v-if="!detailVisible">
				<a-table
					:columns="columns"
					:data-source="data"
					row-key="id"
					:loading="loading"
					:pagination="pagination"
					size="small"
					:scroll="{ y: calcHeight }"
				>
					<template #emptyText>
						<m-empty />
					</template>
					<template #bodyCell="{ column, record, index }: TableRow<Brokerage>">
						<template v-if="column.key === 'serial-number'">
							{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
						</template>
						<template v-if="column.key === 'operation'"><a @click="showDetail(record as Brokerage)">详情</a> </template>
					</template>
				</a-table>
			</div>
			<div v-if="detailVisible" key="2" class="space-y-4">
				<a-card size="small">
					<template #title>
						<div class="flex justify-between">
							<span class="leading-8">基础信息</span>
							<a-button type="link" @click="detailVisible = false">返回列表</a-button>
						</div>
					</template>

					<a-descriptions>
						<a-descriptions-item label="销售员">{{ detailBrokerage.salesmanName }}</a-descriptions-item>
						<a-descriptions-item label="联系电话">{{ detailBrokerage.contactPhone }}</a-descriptions-item>
						<a-descriptions-item label="应提成金额">{{ detailBrokerage.settleAmount }} 元</a-descriptions-item>
						<a-descriptions-item label="已提成金额">{{ detailBrokerage.brokerageAmount }} 元</a-descriptions-item>
						<a-descriptions-item label="购买客户">{{ detailBrokerage.clientName }}</a-descriptions-item>
						<a-descriptions-item label="关联合同">{{ detailBrokerage.contractName }}</a-descriptions-item>
					</a-descriptions>
				</a-card>
				<a-table :columns="settleColumns" :data-source="settleData" size="small" row-key="id">
					<template #emptyText>
						<m-empty />
					</template>
					<template #title>
						<div class="flex justify-between">
							<div class="leading-8">历史提成</div>
							<a-button type="link" @click="addSettleVisible = true">
								<i class="bi bi-plus-circle mr-1"></i>添加
							</a-button>
						</div>
					</template>
					<template #bodyCell="{ column, record }: TableRow<Settle>">
						<template v-if="column.key === 'createTime'">{{ new Date(record.createTime).toLocaleString() }}</template>
					</template>
				</a-table>
			</div>
		</TransitionGroup>

		<a-modal v-model:open="addSettleVisible" title="添加结算" @close="onClose" @ok="onSubmit" destroy-on-close>
			<a-form :model="addSettleData" ref="form" :rules="rules">
				<a-form-item label="结算金额">
					<a-input-number min="0" v-model:value="addSettleData.payment" class="w-60">
						<template #addonBefore>¥</template>
						<template #addonAfter>元</template>
					</a-input-number>
				</a-form-item>
				<a-form-item label="支付凭证">
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
	</a-card>
</template>

<script setup lang="ts">
import { Brokerage, columns, initBrokerage, QueryClientParams } from './config.ts';
import { fetchBrokerageList, getSettleListByBrokerageId, saveSettle } from '@/axios';
import { initSettle, Settle, settleColumns } from '@/view/cloud/settle/config.ts';
import { FormInstance, type Rule } from 'ant-design-vue/es/form';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { UploadFile } from 'ant-design-vue/es/upload/interface';
import useCalcHeight from '@/hooks/useCalcHeight.ts';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { loading, pagination } = useTableConfig();

const { calcHeight } = useCalcHeight(261);
const detailVisible = ref(false);
const detailBrokerage = ref<Brokerage>(initBrokerage());

const settleData = ref<Settle[]>([]);
const showDetail = (row: Brokerage) => {
	detailVisible.value = true;
	detailBrokerage.value = row;
	getSettleListByBrokerageId(row.id!).then((response) => {
		settleData.value = response.data;
	});
};
const addSettleVisible = ref(false);
const addSettleData = ref<Settle>(initSettle());
const rules: Record<string, Rule[]> = {
	payment: [{ required: true, message: '请输入支付金额' }],
	fileId: [{ required: true, message: '请上传支付凭证' }],
};

const form = ref<FormInstance>();
const onSubmit = () => {
	form.value?.validate().then(() => {
		addSettleData.value.brokerageId = detailBrokerage.value.id || '';
		addSettleData.value.salesmanId = detailBrokerage.value.salesmanId || '';
		saveSettle(addSettleData.value).then(() => {
			onClose();
			showDetail(detailBrokerage.value);
		});
	});
};

const onClose = () => {
	addSettleData.value = initSettle();
	addSettleVisible.value = false;
};

const queryParams = ref<QueryClientParams>({ current: 1, pageSize: 10 });
const data = ref<Brokerage[]>([]);
const fetchData = () => {
	loading.value = true;
	fetchBrokerageList(queryParams.value)
		.then((response) => {
			data.value = response.records;
			pagination.value.current = +response.pageNumber;
			pagination.value.total = +response.totalRow;
		})
		.finally(() => {
			loading.value = false;
		});
};

onMounted(() => {
	fetchData();
});

const auth = sessionStorage.getItem('jwt');
const fileList = ref([]);
const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
	if (info.fileList.length > 0 && info.fileList[0].xhr) {
		const file = JSON.parse(info.fileList[0].xhr.response) as IFile;
		addSettleData.value.fileId = file.id;
	} else {
		addSettleData.value.fileId = '';
	}
};
</script>

<style scoped>
.list-enter-active {
	transition: all 0.5s ease;
}
.list-enter-from {
	opacity: 0;
	transform: translateX(30px);
}
</style>
