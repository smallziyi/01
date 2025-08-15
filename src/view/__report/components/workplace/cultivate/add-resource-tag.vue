<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';

const tagsList = defineModel('tags', { required: true, default: [''] });

defineProps<{
	isEdit: boolean;
}>();
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
	<div class="flex flex-col">
		<template v-for="(tag, _index) in state.tags" :key="tag">
			<a-tooltip v-if="tag.length > 20" :title="tag">
				<a-tag :closable="isEdit" @close="handleClose(tag)">
					{{ `${tag.slice(0, 20)}...` }}
				</a-tag>
			</a-tooltip>
			<a-tag v-else class="my-1" :closable="isEdit" color="purple" @close="handleClose(tag)">
				{{ tag }}
			</a-tag>
		</template>
		<template v-if="isEdit">
			<a-input
				v-if="state.inputVisible"
				ref="inputRef"
				v-model:value="state.inputValue"
				class="w-full"
				size="small"
				type="text"
				@blur="handleInputConfirm"
				@keyup.enter="handleInputConfirm"
			/>
			<a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
				<plus-outlined />
				配套的教学资源
			</a-tag>
		</template>
	</div>
</template>
