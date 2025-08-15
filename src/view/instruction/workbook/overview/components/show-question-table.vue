<script setup lang="ts">
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const questions = defineModel<Array<ReportCourseQuestion>>('questions', { required: true });

const autoQuestion = computed(() => {
	return questions.value.filter((item) => item.learnPointsCellId);
});

const peQuestion = computed(() => {
	return questions.value.filter((item) => !item.learnPointsCellId);
});
</script>

<template>
	<table class="w-full">
		<tbody>
			<tr>
				<td class="w-20 table-title">序号</td>
				<td colspan="2" class="table-title">题目信息</td>
			</tr>
			<template v-if="!questions.length">
				<tr>
					<td colspan="5">
						<a-empty />
					</td>
				</tr>
			</template>
			<template v-for="(item, index) in autoQuestion">
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
						<!-- <a-radio-group v-model:value="answer[index].answerId">
							<a-radio v-for="(option, optionIndex) in item.options" :style="radioStyle" :value="option.id" disabled>
								{{ String.fromCharCode(65 + optionIndex) }}.
								{{ option.content }}
							</a-radio>
						</a-radio-group> -->
						<div
							v-for="(a, aIndex) in item.options"
							:class="[!a.isCorrect ? 'hover:bg-black/5' : '']"
							:key="a.id"
							class="leading-6 px-1"
						>
							<a-radio :checked="aIndex === 0"></a-radio
							><span class="font-mono">{{ String.fromCharCode(65 + aIndex) }}. </span>
							<span>{{ a.content }}</span>
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="3" class="text-left">解析：{{ item.analysis }}</td>
				</tr>
			</template>
			<template v-for="(item, index) in peQuestion">
				<tr>
					<td :rowspan="4" class="table-title font-mono">{{ autoQuestion.length + index + 1 }}<br /></td>
					<td class="table-title">题目出处</td>
					<td class="font-mono text-left table-title">
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
							class="leading-6 px-1"
							:key="a.id"
						>
							<a-radio :checked="aIndex === 0"></a-radio>{{ String.fromCharCode(65 + aIndex) }}. {{ a.content }}
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="3" class="text-left">解析：{{ item.analysis }}</td>
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
