<script lang="tsx" setup>
import { message, Modal } from 'ant-design-vue';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';
import { ReportEditStatus } from '@/view/__report';

const data = defineModel<Array<{ isMark: boolean; text: string }>>('data', { required: true, default: [] });

const emits = defineEmits(['update']);

const { reportInfo } = useReportInfo();

const var1 = (event: Event, index: number) => {
	event.preventDefault();
	event.stopPropagation();
	const selection = window.getSelection();
	if (!selection || !selection.toString()) {
		return;
	}
	const range = selection.getRangeAt(0);
	const startDiv = range.startContainer.parentNode;
	let endDiv = range.endContainer.parentNode;

	if (range.endOffset === 0) {
		message.warn('选区无效');
		return;
	}

	if (endDiv === startDiv?.parentNode) {
		endDiv = startDiv;
	}

	if (startDiv !== endDiv) {
		message.warn('选区无效');
		return;
	}
	Modal.confirm({
		content: () => {
			return (
				<div>
					<span>确认对</span>
					<span class="text-red-500">{selection.toString()}</span>
					<span>设置题目？</span>
				</div>
			);
		},
		onOk() {
			const result = [];
			result.push(...data.value.slice(0, index));
			const startText = data.value[index].text.slice(0, range.startOffset);

			const entText = data.value[index].text.slice(
				range.endOffset === 0 ? data.value[index].text.length : range.endOffset,
				data.value[index].text.length,
			);
			if (startText) {
				result.push({ isMark: false, text: startText });
			}
			result.push({ isMark: true, text: selection.toString().trimEnd() });
			if (entText) {
				result.push({ isMark: false, text: entText });
			}
			result.push(...data.value.slice(index + 1));
			data.value = mergeAdjacentMarks(result);
			emits('update', data.value);
		},
	});
};

const handleCancel = (index: number) => {
	const start = data.value.slice(0, index);
	let end = data.value.slice(index + 1);
	const result = [];

	if (start.length) {
		if (start[start.length - 1].isMark) {
			start.push({ isMark: false, text: data.value[index].text });
		} else {
			start[start.length - 1].text = start[start.length - 1].text + data.value[index].text;
		}
	} else {
		start.push({ isMark: false, text: data.value[index].text });
	}
	result.push(...start);
	if (end.length && !end[0].isMark) {
		result[result.length - 1].text = result[result.length - 1].text + end[0].text;
		end = end.slice(1);
	}
	result.push(...end);
	data.value = mergeAdjacentMarks(result);
	emits('update', data.value);
};
const mergeAdjacentMarks = (arr: Array<{ isMark: boolean; text: string }>) => {
	let i = 0;
	while (i < arr.length - 1) {
		if (arr[i].isMark && arr[i + 1].isMark) {
			arr[i].text += arr[i + 1].text;
			arr.splice(i + 1, 1);
		} else {
			i++;
		}
	}
	return arr;
};
</script>

<template>
	<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
		<template v-for="(item, index) in data">
			<a-dropdown v-if="item.isMark" :trigger="['contextmenu']">
				<a-typography-text underline class="select-none text-red-500">{{ item.text }}</a-typography-text>
				<template #overlay>
					<a-menu>
						<a-menu-item @click="handleCancel(index)">取消设置</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>
			<span
				class="whitespace-pre-wrap break-words"
				v-else
				@contextmenu="
				(e: Event) => {
					var1(e, index);
				}
			"
			>
				{{ item.text }}
			</span>
		</template>
	</template>
	<template v-else>
		<span v-for="item in data" :class="item.isMark ? 'text-red-400' : ''">{{ item.text }}</span>
	</template>
</template>

<style scoped></style>
