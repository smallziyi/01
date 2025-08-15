<script setup lang="ts">
import { addTeacherComment, updateTeacherComment, getTeacherComment } from '@/axios';
import { message } from 'ant-design-vue';

const props = defineProps<{
	teachPlanId: string;
}>();
const comment = ref('');
const type = ref('add');
const commentId = ref('');

const handleSave = () => {
	if (type.value === 'add') {
		addTeacherComment({ teachPlanId: props.teachPlanId, comment: comment.value }).then((res) => {
			commentId.value = res.id;
			message.success('新增成功！');
			type.value = 'update';
		});
	} else {
		updateTeacherComment({ teachPlanId: props.teachPlanId, comment: comment.value, id: commentId.value }).then(
			(res) => {
				commentId.value = res.id;
				message.success('保存成功！');
				type.value = 'update';
			},
		);
	}
};
onMounted(() => {
	getTeacherComment(props.teachPlanId).then((res) => {
		if (res?.comment) {
			comment.value = res.comment;
			commentId.value = res.id;
			type.value = 'update';
		} else {
			type.value = 'add';
		}
	});
});
</script>

<template>
	<a-card size="small">
		<template #title>
			<div class="card-title">教师综合评语</div>
		</template>
		<div style="height: calc(100vh - 402px)" class="relative">
			<a-textarea
				v-model:value="comment"
				:auto-size="{ minRows: 10 }"
				placeholder="请输入评语，不超过500字"
				show-count
				allowClear
				:maxlength="500"
				:bordered="false"
			/>
			<a-button class="absolute bottom-4 right-0" type="primary" @click="handleSave">保存</a-button>
		</div>
	</a-card>
</template>
