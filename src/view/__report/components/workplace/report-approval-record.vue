<script setup lang="ts">
import { getReportApprovalRecord } from '@/axios';
import CloseSvg from '@/assets/icons/close.svg';

const columns: TableColumns<any> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ dataIndex: 'createTime', title: '操作时间', key: 'createTime', width: 180 },
	{ dataIndex: 'userName', title: '操作人', key: 'userName', width: 120 },
	{ dataIndex: 'actionType', title: '操作行为', key: 'actionType', width: 120 },
	{ dataIndex: 'operationResult', title: '操作结论', key: 'operationResult' },
	{ dataIndex: 'opinion', title: '意见/评分', key: 'opinion' },
];
const props = defineProps<{
	reportId: string;
	maxScore?: number;
}>();
const data = ref();
const loading = ref(false);
const open = defineModel('open', { type: Boolean, required: true });
onMounted(() => {
	getReportApprovalRecord(props.reportId).then((res) => {
		data.value = res;
	});
});
</script>
<template>
	<a-drawer :closable="false" v-model:open="open" destroy-on-close width="864" @close="open = false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">审核记录</div>
				<a-button type="link" @click="open = false">
					<template #icon>
						<close-svg></close-svg>
					</template>
				</a-button>
			</div>
		</template>
		<a-table size="small" :columns="columns" :data-source="data" :loading="loading" :pagination="false">
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<any>">
				<template v-if="column.key === 'serial-number'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'actionType'">
					<span>{{ ['', '提交', '审核'][record.actionType] }}</span>
				</template>
				<template v-if="column.key === 'createTime'">
					{{ $datetime.format(record.createTime) }}
				</template>
				<template v-if="column.key === 'opinion'">
					<div v-if="record.operationType === 3 && maxScore">{{ record.opinion }}分(最高: {{ maxScore }}分)</div>
					<div v-else-if="record.actionType === 2">{{ record.opinion || '通过' }}</div>
				</template>
			</template>
		</a-table>
	</a-drawer>
</template>
