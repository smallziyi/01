<script setup lang="ts">
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { Answer } from '@/view/instruction';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const questions = defineModel<Array<ReportCourseQuestion>>('questions', { required: true });
const props = defineProps<{
	answerDataList: Answer[];
}>();

const studentList = ref<any>();

watch(
	() => props.answerDataList,
	(val) => {
		if (val && questions) {
			studentList.value = questions.value.map((item: any, index: number) => {
				const order = val[index].optionIds;
				const copyOption = [...item.options];
				return {
					...item,
					options: copyOption.sort((a: any, b: any) => order.indexOf(a.id) - order.indexOf(b.id)),
					answerId: val[index].answerId,
					answerIndex: copyOption.findIndex((item) => item.id === val[index].answerId),
					correctIndex: copyOption.findIndex((item) => item.isCorrect),
				};
			});
		}
	},
	{ immediate: true },
);
</script>

<template>
	<table class="w-full">
		<tbody>
			<tr>
				<td class="w-20 table-title">序号</td>
				<td colspan="2" class="table-title">题目信息</td>
			</tr>
			<template v-if="!studentList.length">
				<tr>
					<td colspan="5">
						<a-empty />
					</td>
				</tr>
			</template>
			<template v-for="(item, index) in studentList">
				<tr>
					<td :rowspan="4" class="table-title font-mono">{{ index + 1 }}<br /></td>
					<td class="table-title w-20">题目出处</td>
					<td class="font-mono table-title text-left">
						<span v-html="item.source"></span>
					</td>
				</tr>
				<tr>
					<td class="table-title">题目</td>
					<td class="text-left">{{ item.title }}</td>
				</tr>
				<tr>
					<td colspan="2" v-auto-animate class="text-left">
						<div
							v-for="(a, aIndex) in item.options"
							:class="[!a.isCorrect ? 'hover:bg-black/5' : '']"
							:key="a.id"
							class="leading-6 px-1"
						>
							<a-radio :checked="item.answerId === a.id"></a-radio>
							<span class="font-mono">{{ String.fromCharCode(65 + aIndex) }}. </span>
							<span>{{ a.content }}</span>
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="3" class="text-left h-[32px]">
						<div>
							<span class="text-[#68d1a5] mr-4">正确答案:{{ String.fromCharCode(65 + item.correctIndex) }}</span>
							<span class="text-[#0091ff]"
								>你的答案: {{ item.answerId ? String.fromCharCode(65 + +item.answerIndex) : '' }}</span
							>
						</div>
					</td>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<style scoped>
table,
td {
	text-align: center;
	border-collapse: collapse;
	border: 1px solid v-bind(borderColor);
	line-height: 32px;
	padding: 0 8px;
	text-wrap: wrap;
}
.table-title {
	background-color: v-bind(cardDisableColor);
}
</style>
