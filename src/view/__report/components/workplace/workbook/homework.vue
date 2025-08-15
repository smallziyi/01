<script setup lang="ts">
import { getStepQuestion } from '@/axios';
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';

const { appTheme } = useAppTheme();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});
const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const props = defineProps<{ menuId: string }>();

onMounted(() => {
	getStepQuestion({ menuCourseId: props.menuId }).then((res) => {
		homeworks.value = res.data;
	});
});

const homeworks = ref<Array<ReportCourseQuestion>>([]);
</script>

<template>
	<table class="mt-2 w-full">
		<tbody>
			<tr>
				<td class="w-20 text-center table-title">序号</td>
				<td colspan="2" class="text-center table-title">题目信息</td>
			</tr>
			<template v-for="(homework, index) in homeworks">
				<tr>
					<td :rowspan="4" class="text-center table-title">
						{{ index + 1 }}
					</td>
					<td class="w-28 text-center table-title">题目出处</td>
					<td class="table-title text-left"><span v-html="homework.source"></span></td>
				</tr>
				<tr>
					<td class="w-28 table-title">题目</td>
					<td class="text-left">{{ homework.title }}</td>
				</tr>
				<tr>
					<td colspan="2" class="text-left">
						<div v-for="(option, index) in homework.options" class="px-1 group rounded hover:bg-black/5">
							<span class="font-mono leading-8">{{ String.fromCharCode(65 + index) }}.&nbsp;</span>{{ option.content }}
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="text-left">解析：{{ homework.analysis }}</td>
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
