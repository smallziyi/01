<script setup lang="ts">
import useAxios, { getStepQuestion } from '@/axios';
import { QuestionOptions, ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { message } from 'ant-design-vue';
import useHomework from '@/view/instruction/guidebook/workplace/useHomework.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useRouterParams from '@/hooks/useRouterParams';

const { appTheme } = useAppTheme();
const { type } = useRouterParams<{ type: 'audit' | 'edit' }>();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});

const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});

const props = defineProps<{ menuId: string }>();

const { homeworks, saveHomework } = useHomework();

onMounted(() => {
	getStepQuestion({ menuCourseId: props.menuId }).then((res) => {
		console.log(res.data);
		homeworks.value = res.data;
	});
});

watch(
	() => saveHomework.value,
	() => {
		if (saveHomework.value) {
			handleSave('课后练习题已同步更新');
		}
	},
);

const axios = useAxios();
const handleSave = (_message?: string) => {
	try {
		homeworks.value.forEach((item, index) => {
			if (!item.source.trim()) {
				throw new Error(`第${index + 1}题没有题目来源`);
			}
			if (!item.title.trim()) {
				throw new Error(`第${index + 1}题没有题目`);
			}
			if (item.options.length < 4) {
				throw new Error(`第${index + 1}题选项不足四项`);
			}
			if (item.options.some((option) => !option.content.trim())) {
				throw new Error(`第${index + 1}题选项无内容`);
			}
			if (new Set(item.options.map((v) => v.content.trim())).size < item.options.length) {
				throw new Error(`第${index + 1}题选型重复`);
			}
			if (item.options.every((option) => !option.isCorrect)) {
				throw new Error(`第${index + 1}题未设置正确答案`);
			}
		});
		homeworks.value.forEach((item, index) => {
			item.sort = index + 1;
		});		
		axios
			.post('/report/course/saveMenuCourseQuestion', {
				menuCourseId: props.menuId,
				reportCourseQuestions: homeworks.value,
				studyFlag: false,
			})
			.then((res) => {
				message.success(_message ?? '已保存');
				homeworks.value = res.data;
			});
	} catch (e) {
		if (e instanceof Error) {
			message.warn(e.message);
		}
	} finally {
		saveHomework.value = false;
	}
};

const setCorrectAnswer = (item: ReportCourseQuestion, option: QuestionOptions) => {
	item.options = [option, ...item.options.filter((item) => item !== option)];
	item.options.forEach((v, i) => {
		v.id = +i + 1 + '';
		v.isCorrect = i === 0;
	});
};
const handleAddOption = (homework: ReportCourseQuestion) => {
	homework.options.push({ isCorrect: false, content: '', id: homework.options.length + 1 + '' });
};
const handleDeleteOption = (homework: ReportCourseQuestion, index: number) => {
	homework.options.splice(index, 1);
	homework.options.forEach((option, i) => {
		option.id = +i + 1 + '';
	});
};

const handleRemove = (index: number) => {
	homeworks.value.splice(index, 1);
};
</script>

<template>
	<div style="height: calc(100vh - 280px)" class="overflow-y-auto">
		<div class="flex justify-between">
			<div></div>
			<a-space v-if="type === 'edit'">
				<a-button type="link" @click="handleSave()">保存</a-button>
			</a-space>
		</div>
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
							<a-tooltip v-if="type === 'edit'">
								<a-button @click="handleRemove(index)" type="text" danger size="small">
									<template #icon><i class="bi bi-trash3"></i></template>
								</a-button>
								<template #title>从课后练习中删除</template>
							</a-tooltip>
						</td>
						<td class="w-28 table-title text-left">题目出处</td>
						<td class="table-title">
							<input
								v-if="!homework.tableId"
								class="w-full bg-transparent outline-none"
								v-model="homework.source"
								placeholder="此处输入题目出处"
							/>
							<span v-else v-html="homework.source"></span>
						</td>
					</tr>
					<tr>
						<td class="w-28 text-left table-title">题目</td>
						<td>
							<input
								v-if="!homework.tableId"
								class="w-full bg-transparent outline-none"
								v-model="homework.title"
								placeholder="此处输入题目"
							/>
							<span v-else>{{ homework.title }}</span>
						</td>
					</tr>
					<tr>
						<td colspan="2" v-auto-animate>
							<div
								v-for="(option, index) in homework.options"
								class="flex justify-between rounded p-1 group hover:bg-slate-50 w-full"
							>
								<div class="flex">
									<a-radio :checked="option.isCorrect"></a-radio
									><span class="font-mono leading-8">{{ String.fromCharCode(65 + index) }}.&nbsp;</span>
									<template v-if="!homework.tableId">
										<input
											v-model="option.content"
											class="outline-none bg-transparent w-full"
											placeholder="此处输入选项内容"
										/>
										<div class="group-hover:opacity-100 opacity-0 flex gap-2 py-1">
											<a-tooltip v-if="!option.isCorrect">
												<template #title>设置为正确答案</template>
												<a-button size="small" type="text" @click="setCorrectAnswer(homework, option)">
													<template #icon>
														<i class="bi bi-check-circle-fill text-green-500"></i>
													</template>
												</a-button>
											</a-tooltip>
											<a-tooltip>
												<template #title>删除此选项</template>
												<a-button size="small" type="text" danger @click="handleDeleteOption(homework, index)">
													<template #icon>
														<i class="bi bi-trash"></i>
													</template>
												</a-button>
											</a-tooltip>
										</div>
									</template>
									<template v-else>{{ option.content }}</template>
								</div>
							</div>
							<a-button type="dashed" block @click="handleAddOption(homework)" v-if="!homework.tableId">
								<i class="bi bi-plus-lg mr-1"></i>
								添加选项
							</a-button>
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<div class="flex">
								<div class="text-nowrap">解析：</div>
								<input
									v-model="homework.analysis"
									v-if="!homework.tableId"
									class="outline-none bg-transparent w-full"
									placeholder="此处输入解析内容"
								/>
								<span v-else>{{ homework.analysis }}</span>
							</div>
						</td>
					</tr>
				</template>
			</tbody>
		</table>
	</div>
</template>

<style scoped>
table,
td {
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
