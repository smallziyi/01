<script setup lang="ts">
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { Answer, StudentAnswer, QuestionsRecord } from '@/view/instruction';
import { message } from 'ant-design-vue';
import useRouterParams from '@/hooks/useRouterParams';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { getAnswerRecord, getTeachScene, studentAnswerQuestion } from '@/axios';
import dayjs from 'dayjs';
import sandSvg from '@/assets/image/instruction/sand.svg';
import correctSvg from '@/assets/image/instruction/correct.svg';
import errorSvg from '@/assets/image/instruction/error.svg';
import arrowSvg from '@/assets/image/instruction/arrow.svg';
import useUserStore from '@/store/modules/useUserStore.ts';

const { appTheme } = useAppTheme();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#283560';
});

const params = useRouterParams<{ teachPlanId: string; workbookId: string; courseType: 'preview' | 'detail' }>();
const { user } = useUserStore();
const props = defineProps<{
	questionFlag: boolean;
	questions: Array<ReportCourseQuestion>;
	tableId: string;
	tableFormType: number;
}>();

const answer = ref<Array<Answer>>([]);
const activeTopic = ref<number>(0);
const showAnalysis = ref(false);
const submitFlag = ref<boolean>(false);
const questionsRecord = ref<QuestionsRecord>({
	tableId: '',
	studentId: '',
	answerTableTime: 0,
	itemScore: 0,
	totalScore: 0,
	answerDataList: [],
	correctRate: '',
});
const radioStyle = reactive({
	display: 'flex',
	height: 'auto', // 改为auto以适应内容高度
  lineHeight: '1.5', // 改为1.5倍行高提升可读性
  marginBottom: '10px', // 添加底部间距
  alignItems: 'flex-start', // 让内容从顶部对齐
  padding: '5px 0', // 添加上下内边距
});

const handleCheck = () => {
	getAnswerRecord({
		teachPlanId: params.teachPlanId,
		userId: user.value!.id,
		tableId: props.tableId,
		answerTableType: params.courseType === 'preview' ? 1 : 2,
	}).then((res) => {
		if (!res) return;
		if (res.answerDataList) {
			questionsRecord.value = {
				tableId: res.tableId,
				studentId: res.studentId,
				totalScore: res.totalScore,
				itemScore: res.itemScore,
				correctRate: res.correctRate,
				answerTableTime: res.answerTableTime,
				answerDataList: sortArrayByOrder(res.answerDataList, props.questions),
			};
			// 将秒转换成字符串,时分秒的格式，不足两位数补0
			const hours = Math.floor(res.answerTableTime / 3600);
			const minutes = Math.floor((res.answerTableTime % 3600) / 60);
			const seconds = res.answerTableTime % 60;
			answerTableTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
			questionCardList.value = res.answerDataList.map((item) => item.answerId === item.correctId);
			answerList.value = res.answerDataList.map((answer) => {
				const youAnswer = answer.optionIds.findIndex((a) => answer.answerId === a);
				const correctAnswer = answer.optionIds.findIndex((a) => answer.correctId === a);
				return [correctAnswer, youAnswer];
			});
			answer.value = questionsRecord.value.answerDataList.map((item) => {
				return {
					questionId: item.questionId || '',
					answerId: item.answerId,
					optionIds: item.optionIds || [],
				};
			});
			submitFlag.value = true;
		} else {
			return;
		}
	});
};

const handleSubmit = () => {
	const param: StudentAnswer = {
		answerTableType: params.courseType === 'preview' ? 1 : 2,
		teachPlanId: params.teachPlanId,
		studentId: user.value!.id,
		tableId: props.tableId,
		tableFormType: props.tableFormType,
		answerDataList: answer.value,
	};
	studentAnswerQuestion(param).then(() => {
		message.success('提交成功');
		handleCheck();
	});
};

// 数组按照之前答题顺序的顺序进行排序
const sortArrayByOrder = (newOrder: Array<Answer>, originalArray: Array<ReportCourseQuestion>): any => {
	return newOrder.map((item) => {
		const originalItem = originalArray.find((o) => o.id === item.questionId);
		if (originalItem) {
			const { title, source, options, id } = originalItem;
			const sortedOptions = item.optionIds.map((optionId) => options.find((option) => option.id === optionId));
			return {
				questionId: id,
				title,
				source,
				options: sortedOptions,
				answerId: item.answerId,
				correctId: item.correctId || '',
				analysis: item.analysis || '',
			};
		} else {
			return { questionId: '', title: '', source: '', options: [], answerId: '', correctId: '', analysis: '' };
		}
	});
};

watch(
	() => props.questions,
	(val) => {
		if (val.length > 0) {
			answer.value = val.map((item) => {
				return {
					questionId: item.id || '',
					answerId: '',
					optionIds: item.options.map((item) => item.id) || [''],
				};
			});
			handleCheck();
		}
	},
	{
		immediate: true,
	},
);

const questionCardList = ref<boolean[]>([]);

const currentScore = computed(() => {
	return (questionsRecord.value.totalScore / 5) * 100
});

// 正确答案，你的答案
const answerList = ref<any>([]);
// 截止时间
const deadline = ref();
// 答题用时
const answerTableTime = ref();

const buttonClass = reactive({
	base: 'flex justify-center items-center size-8 rounded-full border-2',
	done: 'border-gray-500 bg-gray-100 text-gray-500 hover:bg-gray-300',
	undone: 'border-blue-500 bg-blue-100 text-blue-500 hover:bg-blue-300',
	success: 'border-green-500 bg-green-100 text-green-500 hover:bg-green-300',
	error: 'border-orange-500 bg-orange-100 text-orange-500 hover:bg-orange-300',
	selectDone: 'bg-gray-500 text-white border-gray-500',
	selectUndone: 'bg-blue-500 text-white border-blue-500',
	selectSuccess: 'bg-green-500 text-white border-green-500',
	selectError: 'bg-orange-500 text-white border-orange-500',
});

// 确认提交气泡框是否展示
const confirmVisible = ref(false);
const isComfirmSubmit = computed(() => {
	return answer.value.every((item) => item.answerId);
});
const handleVisibleChange = (bool: boolean) => {
	if (!bool) {
		confirmVisible.value = false;
		return;
	}
	if (isComfirmSubmit.value) {
		handleSubmit();
	} else {
		confirmVisible.value = true;
	}
};

const handleFinsh = () => {
	if (!submitFlag.value) {
		handleSubmit();
	}
};

onMounted(() => {
	getTeachScene(params.teachPlanId).then((res) => {
		const time = res.middlePracticeDataList[props.tableFormType - 1]?.time;
		const duration = res.middlePracticeDataList[props.tableFormType - 1]?.duration;
		if (time && duration) {
			deadline.value = dayjs(time).add(duration, 'seconds');
		}
	});
});
</script>

<template>
	<template v-if="questionFlag">
		<a-divider dashed style="border-color: skyblue"
			>{{ params.courseType === 'preview' ? '课前预习' : '课堂测评' }}
		</a-divider>
		<div :style="{ background: cardBgColor }">
			<!-- 答题前 -->
			<div v-if="!submitFlag" class="h-[380px] grid grid-cols-3 gap-2 p-4">
				<a-card>
					<div class="border-[1px] h-[68px] mb-7 border-blue-500 rounded-md flex justify-center items-center">
						<sand-svg class="mr-4"></sand-svg>
						<template v-if="params.courseType === 'preview'">
							<div class="text-blue-500 text-lg">请在上课前完成</div>
						</template>
						<a-statistic-countdown v-else :value="deadline" :value-style="{ color: '#0091FF' }" @finish="handleFinsh" />
					</div>
					<div class="grid grid-cols-4 gap-5">
						<div v-for="(_item, index) in questions">
							<div
								:class="[
									activeTopic === index
										? answer[index].answerId
											? buttonClass.selectDone
											: buttonClass.selectUndone
										: answer[index].answerId
											? buttonClass.done
											: buttonClass.undone,
									buttonClass.base,
								]"
								@click="activeTopic = index"
							>
								{{ index + 1 }}
							</div>
						</div>
					</div>
					<div class="text-center">
						<a-popconfirm
							title="还有题目未完成，你确定提交吗?"
							:open="confirmVisible"
							ok-text="确定"
							cancel-text="取消"
							@open-change="handleVisibleChange"
							@confirm="handleSubmit"
						>
							<a-button class="mt-7" type="primary">提交</a-button>
						</a-popconfirm>
					</div>
				</a-card>
				<div class="col-span-2 relative">
					<a-card class="h-full">
						<div>
							<span class="text-[#000000,65%] font-bold">题目出处：</span>
							<span v-html="questions[activeTopic]?.source"></span>
						</div>
						<div class="my-4">
							<span class="text-[#000000,65%] font-bold">题目：</span>
							<span>{{ questions[activeTopic]?.title }}</span>
						</div>
						<div class="flex">
							<span class="text-[#000000,65%] font-bold">选项：</span>
							<div v-if="answer.length > 0 && questionsRecord.answerDataList">
								<a-radio-group v-model:value="answer[activeTopic].answerId">
									<a-radio
										v-for="(option, optionIndex) in questions[activeTopic]?.options"
										:style="radioStyle"
										:value="option.id"
									>
										{{ String.fromCharCode(65 + optionIndex) }}.
										{{ option.content }}
									</a-radio>
								</a-radio-group>
							</div>
						</div>
					</a-card>
					<a-button v-if="activeTopic !== 0" class="absolute left-2 bottom-2" @click="--activeTopic">上一题</a-button>
					<a-button v-if="activeTopic !== questions.length - 1" class="absolute right-2 bottom-2" @click="++activeTopic"
						>下一题</a-button
					>
				</div>
			</div>
			<!-- 答题后 -->
			<div v-else class="h-[480px] grid grid-cols-3 gap-2 p-4">
				<a-card class="h-full">
					<div class="text-[#0091ff] text-lg font-bold text-center">
						<div v-if="params.courseType === 'detail'">答题用时: {{ answerTableTime }}</div>
						<div class="text-center">
							<a-progress
								class="mt-4 mb-8"
								type="dashboard"
								:percent="currentScore"
								:size="200"
								:stroke-width="12"
								:format="(percent) => +(percent ? percent / 20 : 0).toFixed(2)"
							>
							</a-progress>
							<div class="-m-20 font-normal text-[#999]">得分</div>
						</div>
					</div>
					<div class="grid grid-cols-4 gap-5 mt-32">
						<div v-for="(check, index) in questionCardList">
							<!-- 未作答 -->
							<template v-if="answerList[index][1] === -1">
								<div
									:class="
										activeTopic === index
											? [buttonClass.base, buttonClass.selectDone]
											: [buttonClass.base, buttonClass.done]
									"
									@click="activeTopic = index"
								>
									{{ index + 1 }}
								</div>
							</template>
							<!-- 已作答 -->
							<template v-else>
								<div
									:class="[
										activeTopic === index
											? check
												? buttonClass.selectSuccess
												: buttonClass.selectError
											: check
												? buttonClass.success
												: buttonClass.error,
										buttonClass.base,
									]"
									@click="activeTopic = index"
								>
									{{ index + 1 }}
								</div>
							</template>
						</div>
					</div>
				</a-card>
				<div class="col-span-2 relative">
					<a-card class="h-full">
						<div class="bg-[rgba(0,145,255,0.05)] p-5 rounded-md relative z-10">
							<div>
								<span class="text-[#000000,65%] font-bold">题目出处：</span>
								<span v-html="questionsRecord.answerDataList[activeTopic]?.source"></span>
							</div>
							<div class="my-4">
								<span class="text-[#000000,65%] font-bold">题目：</span>
								<span>{{ questionsRecord.answerDataList[activeTopic]?.title }}</span>
							</div>
							<div class="flex">
								<span class="text-[#000000,65%] font-bold">选项：</span>
								<div v-if="answer.length > 0 && questionsRecord.answerDataList">
									<a-radio-group :value="answer[activeTopic].answerId">
										<a-radio
											v-for="(option, optionIndex) in questionsRecord.answerDataList[activeTopic]?.options"
											:style="radioStyle"
											:value="option.id"
											class="w-full" 
										>
											{{ String.fromCharCode(65 + optionIndex) }}.
											{{ option.content }}
										</a-radio>
									</a-radio-group>
								</div>
							</div>
							<template v-if="answerList[activeTopic][1] !== -1">
								<correct-svg v-if="questionCardList[activeTopic]" class="z-[-1] absolute top-28 right-20"></correct-svg>
								<error-svg v-else class="z-[-1] absolute top-32 right-20"></error-svg>
							</template>
						</div>
						<div>
							<a-button class="my-1 flex items-center" shape="round" @click="showAnalysis = !showAnalysis">
								解析
								<arrow-svg class="ml-2" :class="!showAnalysis && 'rotate-180'"></arrow-svg>
							</a-button>
							<div v-show="showAnalysis" class="transition duration-300">
								<div class="mb-2 ml-2">
									<span class="text-[#68d1a5] mr-4"
										>正确答案: {{ String.fromCharCode(65 + answerList[activeTopic][0]) }}</span
									>
									<span class="text-[#0091ff]"
										>你的答案:
										{{
											answerList[activeTopic][1] === -1 ? '' : String.fromCharCode(65 + answerList[activeTopic][1])
										}}</span
									>
								</div>
								<div class="text-[#000000,65%] font-bold">【解析】</div>
								<div>{{ questionsRecord.answerDataList[activeTopic].analysis }}</div>
							</div>
						</div>
					</a-card>
					<template v-if="!showAnalysis">
						<a-button v-if="activeTopic !== 0" class="absolute left-2 bottom-2" @click="--activeTopic">上一题</a-button>
						<a-button
							v-if="activeTopic !== questions.length - 1"
							class="absolute right-2 bottom-2"
							@click="++activeTopic"
							>下一题</a-button
						>
					</template>
				</div>
			</div>
		</div>
	</template>
</template>
