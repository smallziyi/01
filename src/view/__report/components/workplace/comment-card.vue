<script setup lang="ts">
import security from '@/utils/security.ts';
import { CommentRecordTree } from '@/view/__report';
import emitter from '@/utils/event.ts';
import useUserStore from '@/store/modules/useUserStore.ts';

const props = defineProps<{ comment: CommentRecordTree; reportStatus: number }>();
const emits = defineEmits(['delete', 'update', 'reply']);
const router = useRouter();

const params = security.base64Decode<{ reportId: string; type: 'edit' | 'audit' }>(
	router.currentRoute.value.query.v as string,
);

const tipColor = computed(() => {
	return props.comment.auditStatus === 1 ? 'red' : props.comment.auditStatus === 2 ? 'gold' : 'green';
});
const { user } = useUserStore();

const handleReply = () => {
	emitter.emit('report_table_recover_comment', props.comment.id);
	emits('reply', props.comment.id);
};
</script>

<template>
	<div
		class="border p-2 rounded my-2"
		:class="
			$props.comment.auditStatus === 1
				? 'border-red-500 bg-red-100/30'
				: $props.comment.auditStatus === 2
					? 'border-orange-400 bg-orange-100/30'
					: 'border-green-500 bg-green-100/30'
		"
	>
		<div class="flex justify-between">
			<div class="leading-6 flex gap-0.5">
				<div class="size-6">
					<a-avatar size="small" :src="$props.comment.avatarUrl" />
				</div>
				<a-tooltip :color="tipColor">
					<template #title>{{ $datetime.format($props.comment.createTime) }}</template>
					{{ comment.userName }}
				</a-tooltip>
				<div>
					<a-tag :color="['default', 'error', 'warning', 'success'][$props.comment.auditStatus]">
						{{ ['未知状态', '待修改', '待评审', '已解决'][$props.comment.auditStatus] }}
					</a-tag>
				</div>
			</div>
			<div>
				<a-popconfirm @confirm="$emit('delete', $props.comment.id)">
					<template #title> 删除后无法恢复，请确认！ </template>
					<a-button
						type="text"
						danger
						size="small"
						v-if="$props.comment.auditStatus === 1 && params.type === 'audit' && $props.comment.userId === user!.id"
					>
						<template #icon>
							<i class="bi bi-trash3"></i>
						</template>
					</a-button>
				</a-popconfirm>
			</div>
		</div>
		<div class="px-1 my-2">
			<div class="px-6 text-sm leading-6">{{ $props.comment.opinion }}</div>
			<div v-for="item in comment.children" class="px-6">
				<div>
					<a-avatar size="small" :src="item.avatarUrl" />
					<a-tooltip :color="tipColor">
						<template #title>{{ $datetime.format(item.createTime) }}</template>
						{{ item.userName }}
					</a-tooltip>
				</div>
				<div class="px-6 first-line:text-sm leading-6">{{ item.opinion }}</div>
			</div>
		</div>
		<div class="flex justify-end">
			<a-space>
				<a-button v-if="![5, 6].includes(reportStatus)" size="small" @click="handleReply"> 回复</a-button>
				<a-button
					v-if="$props.comment.auditStatus === 1 && params.type === 'edit' && [2, 3].includes(reportStatus)"
					size="small"
					type="primary"
					@click="$emit('update', $props.comment.id, 'pending')"
				>
					解决
				</a-button>
				<template v-if="params.type === 'audit'">
					<a-button
						v-if="$props.comment.auditStatus === 2 && user!.id === $props.comment.userId && reportStatus === 4"
						size="small"
						@click="$emit('update', $props.comment.id, 'edit')"
					>
						继续修改
					</a-button>
					<a-button
						v-if="$props.comment.auditStatus === 2 && user!.id === $props.comment.userId && reportStatus === 4"
						size="small"
						type="primary"
						@click="$emit('update', $props.comment.id, 'pass')"
					>
						通过
					</a-button>
				</template>
			</a-space>
		</div>
	</div>
</template>

<style scoped></style>
