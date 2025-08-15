<script setup lang="ts">
import CommentCard from '@/view/__report/components/workplace/comment-card.vue';
import { message } from 'ant-design-vue';
import emitter from '@/utils/event.ts';
import security from '@/utils/security.ts';
import { useStorage } from '@vueuse/core';

import { CommentRecord, ReportAuditTableRecord } from '@/view/__report';
import { getTableAudit, updateTableAudit } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';

const tableId = defineModel('tableId', { required: true, type: String, default: '' });
defineProps<{ reportStatus: number }>();
const tableAudit = ref<ReportAuditTableRecord>();
const commentAction = {
	add: (comment: CommentRecord) => {
		updateAudit({
			auditTableRecordId: tableAudit.value!.id,
			auditDataList: [...tableAudit.value!.auditDataList, comment],
		});
	},
	delete: (id: string) => {
		const newAuditDataList = tableAudit.value?.auditDataList.filter((item) => item.id !== id);
		updateAudit({ auditTableRecordId: tableAudit.value!.id, auditDataList: newAuditDataList! });
	},
	update: (id: string, type: 'pass' | 'edit' | 'pending') => {
		switch (type) {
			case 'pass':
				updateAudit({
					auditTableRecordId: tableAudit.value!.id,
					auditDataList: tableAudit.value!.auditDataList.map((item) =>
						item.id === id ? { ...item, auditStatus: 3 } : item,
					),
				});
				break;
			case 'edit':
				updateAudit({
					auditTableRecordId: tableAudit.value!.id,
					auditDataList: tableAudit.value!.auditDataList.map((item) =>
						item.id === id ? { ...item, auditStatus: 1 } : item,
					),
				});
				break;
			case 'pending':
				updateAudit({
					auditTableRecordId: tableAudit.value!.id,
					auditDataList: tableAudit.value!.auditDataList.map((item) =>
						item.id === id ? { ...item, auditStatus: 2 } : item,
					),
				});
				break;
		}
	},
};

const updateAudit = (data: { auditTableRecordId: string; auditDataList: Array<CommentRecord> }) => {
	updateTableAudit(data).then((res) => {
		message.success('操作成功');
		tableAudit.value = res;
	});
};
const commentCells = ref<Array<number>>([]);
const emitterEvent = {
	addComment: (selectCell: Array<number>) => {
		commentCells.value = selectCell;
		addComment.value = true;
	},
	recoverComment: (id: string) => {
		recoverComment.value = true;
		parentId.value = id;
	},
};

onMounted(() => {
	emitter.on('report_table_add_comment', emitterEvent.addComment);
	emitter.on('report_table_recover_comment', emitterEvent.recoverComment);
});
onUnmounted(() => {
	emitter.off('report_table_add_comment', emitterEvent.addComment);
	emitter.off('report_table_recover_comment', emitterEvent.recoverComment);
});

const addComment = useStorage<boolean>('addComment', false);
const recoverComment = ref<boolean>(false);
const parentId = ref<string>('');

const comment = ref('');

const { user } = useUserStore();
const handleAddComment = (type: 'add' | 'recover') => {
	if (!comment.value.trim()) {
		message.warning('请输入批注内容');
		return;
	}
	const uuid = security.uuid();
	try {
		commentAction.add({
			id: uuid,
			userId: user.value!.id,
			opinion: comment.value,
			createTime: new Date().toString(),
			auditStatus: 1,
			cellIds: commentCells.value,
			parentId: type === 'recover' ? parentId.value : '',
		});
	} catch (err) {
		message.warning('添加批注失败');
	}
	addComment.value = false;
	recoverComment.value = false;
	comment.value = '';
};
watch(
	tableId,
	(value) => {
		if (value) {
			getTableAudit({ tableId: value }).then((res) => {
				tableAudit.value = res;
			});
		}
	},
	{ immediate: true },
);
</script>

<template>
	<div class="w-60 min-w-60" v-if="tableAudit && tableAudit.auditDataList.length">
		<template v-for="item in tableAudit.auditDataTree">
			<comment-card
				@mouseover="emitter.emit('report_table_comment_cells', item.cellIds)"
				@mouseout="emitter.emit('report_table_comment_cells', [])"
				:comment="item"
				@delete="commentAction.delete"
				:report-status="reportStatus"
				@update="commentAction.update"
			/>
		</template>
	</div>
	<a-modal v-if="addComment" v-model:open="addComment" title="添加批注" @ok="handleAddComment('add')" width="400px">
		<a-textarea v-model:value="comment" :auto-size="true" />
	</a-modal>
	<a-modal
		v-if="recoverComment"
		v-model:open="recoverComment"
		title="回复批注"
		@ok="handleAddComment('recover')"
		width="400px"
	>
		<a-textarea v-model:value="comment" :auto-size="true" />
	</a-modal>
</template>

<style scoped></style>
