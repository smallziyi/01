<script setup lang="ts">
import { ReportAuditTableRecord, ReportMenuCourse } from '@/view/__report';
import { message } from 'ant-design-vue';
import security from '@/utils/security.ts';
import useAxios, { updateTableAudit, getTableAudit } from '@/axios';
import dayjs from 'dayjs';
import commentCard from '../comment-card.vue';
import MApprove from '@/components/m-approve.vue';
import { Modal } from 'ant-design-vue';
import useUserStore from '@/store/modules/useUserStore.ts';

const { user } = useUserStore();
const axios = useAxios();

const props = defineProps<{
	type: 'edit' | 'audit' | 'preview';
	reportStatus: number;
	dataLength: number;
	taskForm: ReportMenuCourse;
	currentKey: number;
}>();
const emits = defineEmits(['update', 'approved']);
const saveFlag = defineModel('save', { required: true, type: Boolean });
const tableId = ref('');
const showComment = ref(false);
const auditRecord = ref<ReportAuditTableRecord>({
	reportId: '',
	menuId: '',
	tableId: '',
	reportAuditStatus: 0,
	auditDataList: [],
	auditDataTree: [],
	id: '',
	createBy: '',
	createUser: '',
	createTime: '',
	lastUpdateTime: '',
});
const approveInfo = computed(() => {
	return props.taskForm?.tableFormData[props.currentKey - 1].auditRecordData;
});
const addCommentVisible = ref(false);
const comment = ref('');
const replyId = ref('');
const handleSubmit = () => {
	if (!auditRecord.value?.id) {
		message.success('数据出错，联系运维人员');
		return;
	}
	if (!comment.value.trim()) {
		message.warning('请输入批注内容');
		return;
	}
	const newData = { ...auditRecord.value } as ReportAuditTableRecord;
	newData.auditDataList.push({
		id: security.uuid(),
		parentId: replyId.value,
		userId: user.value!.id,
		auditStatus: 1,
		opinion: comment.value,
		createTime: new Date().toString(),
		cellIds: [],
	});
	updateTableAudit({
		auditTableRecordId: auditRecord.value?.id!,
		auditDataList: newData.auditDataList,
	}).then((res) => {
		message.success(replyId.value ? '已回复' : '已完成');
		addCommentVisible.value = false;
		comment.value = '';
		auditRecord.value = res;
		replyId.value = '';
	});
	showComment.value = true;
};

const handleReply = (id: string) => {
	replyId.value = id;
	addCommentVisible.value = true;
};
const handleDeleteComment = (id: string) => {
	const newData = { ...auditRecord.value } as ReportAuditTableRecord;
	newData.auditDataList = newData.auditDataList.filter((item) => !(item.id === id || item.parentId === id));
	updateTableAudit({ auditTableRecordId: auditRecord.value?.id!, auditDataList: newData.auditDataList }).then((res) => {
		auditRecord.value = res;
	});
};
const handleUpdateComment = (id: string, type: 'edit' | 'pass') => {
	const newData = { ...auditRecord.value } as ReportAuditTableRecord;
	newData.auditDataList.forEach((item) => {
		if (id === item.id) {
			item.auditStatus = type === 'edit' ? 1 : type === 'pass' ? 3 : 2;
		}
	});
	updateTableAudit({ auditTableRecordId: auditRecord.value?.id!, auditDataList: newData.auditDataList }).then((res) => {
		auditRecord.value = res;
	});
};

const handleSave = () => {
	saveFlag.value = true;
};

const handleApprove = () => {
	Modal.confirm({
		title: '请确认操作',
		content: '审阅通过后该表单将进入教学阶段，无法撤回！',
		onOk: () => {
			const record = { userId: user.value!.id, createTime: dayjs().toString(), userName: user.value!.name };
			axios
				.put('/report/workplace/updateAuditRecord', {
					tableId: tableId.value,
					auditRecordData: record,
				})
				.then(() => {
					message.success('审阅完成');
					props.taskForm.tableFormData[props.currentKey - 1].auditRecordData = record;
				});
		},
	});
};
watch(
	() => auditRecord.value.auditDataList.length,
	(val) => {
		if (val === 0) {
			showComment.value = false;
		}
	},
	{ immediate: true },
);

onMounted(() => {
	tableId.value = props.taskForm?.tableFormData[props.currentKey - 1].tableId || '';
	getTableAudit({ tableId: tableId.value }).then((res) => {
		auditRecord.value = res;
		showComment.value = res.auditDataList.length > 0;
	});
});
</script>
<template>
	<div class="text-right">
		<a-space class="py-2">
			<div>
				<a-button v-if="type === 'audit'" size="small" type="link" @click="addCommentVisible = true">添加评论</a-button>
				<a-button
					v-if="auditRecord.auditDataList.length > 0"
					size="small"
					type="link"
					@click="showComment = !showComment"
					>{{ showComment ? '关闭' : '查看' }}评论</a-button
				>
			</div>
			<div>
				<a-button
					v-if="type === 'edit' && dataLength === 2"
					class="mr-5"
					size="small"
					type="primary"
					@click="handleSave"
				>
					保存
				</a-button>
				<a-button
					v-if="type === 'audit' && !approveInfo && dataLength === 2"
					class="mr-5"
					size="small"
					type="primary"
					@click="handleApprove"
				>
					审阅
				</a-button>
			</div>
		</a-space>
	</div>
	<div class="flex gap-4">
		<div>
			<m-approve
				v-if="approveInfo"
				:approveTime="approveInfo.createTime"
				:approver="approveInfo.userName || ''"
			></m-approve>
			<slot></slot>
		</div>
		<div v-show="showComment" class="w-60 min-w-60">
			<template v-if="!auditRecord?.auditDataList.length">
				<div class="text-center">暂无评论</div>
			</template>
			<template v-else>
				<template v-for="item in auditRecord?.auditDataTree">
					<comment-card
						:comment="item"
						:report-status="reportStatus"
						@delete="handleDeleteComment"
						@reply="handleReply"
						@update="handleUpdateComment"
					/>
				</template>
			</template>
		</div>
	</div>
	<a-modal
		v-model:open="addCommentVisible"
		title="添加批注"
		@cancel="comment = ''"
		@close="comment = ''"
		@ok="handleSubmit"
	>
		<a-textarea v-model:value="comment" :auto-size="{ minRows: 2 }" placeholder="在此处输入内容"></a-textarea>
	</a-modal>
</template>
