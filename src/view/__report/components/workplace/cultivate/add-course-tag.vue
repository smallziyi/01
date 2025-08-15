<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
const props = defineProps<{
	color: string;
	isCourse: boolean;
	isEdit: boolean;
}>();
const tagsList = defineModel('tags', { required: true, default: [''] });

const inputRef = ref();
const state = reactive({
	tags: tagsList.value,
	inputVisible: false,
	inputValue: '',
});

const handleClose = (removedTag: string) => {
	const tags = state.tags.filter((tag) => tag !== removedTag);
	state.tags = tags;
	tagsList.value = tags;
};
watch(
	() => tagsList.value,
	(newValue) => {
		state.tags = newValue;
	},
);

const showInput = () => {
	state.inputVisible = true;
	nextTick(() => {
		inputRef.value.focus();
	});
};

const handleInputConfirm = () => {
	const inputValue = state.inputValue;
	let tags = state.tags;
	if (inputValue && tags.indexOf(inputValue) === -1) {
		tags = [...tags, inputValue];
		tagsList.value = [...tags];
	}
	Object.assign(state, {
		tags,
		inputVisible: false,
		inputValue: '',
	});
};
</script>
<template>
	<template v-for="(tag, _index) in state.tags" :key="tag">
		<a-tooltip v-if="tag.length > 20" :title="tag">
			<a-tag :closable="isEdit" @close="handleClose(tag)">
				{{ `${tag.slice(0, 20)}...` }}
			</a-tag>
		</a-tooltip>
		<a-tag v-else :color="props.color" :closable="isEdit" @close="handleClose(tag)">
			{{ tag }}
		</a-tag>
	</template>
	<template v-if="isEdit">
		<a-input
			v-if="state.inputVisible"
			ref="inputRef"
			v-model:value="state.inputValue"
			:style="{ width: '78px' }"
			size="small"
			type="text"
			@blur="handleInputConfirm"
			@keyup.enter="handleInputConfirm"
		/>
		<a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
			<plus-outlined />
			添加{{ isCourse ? '课程' : '学习场' }}
		</a-tag>
	</template>
</template>
