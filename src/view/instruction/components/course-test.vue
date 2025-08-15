<script setup lang="ts">
import ShowQuestionTable from '@/view/instruction/workbook/overview/components/show-question-table.vue';
import AnswerSituation from '@/view/instruction/plan/components/answer-situation.vue';
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { message } from 'ant-design-vue';
import { getTeachScene, releaseMiddlePractice } from '@/axios';
import useRouterParams from '@/hooks/useRouterParams';
import dayjs, { Dayjs } from 'dayjs';
import testSvg from '@/assets/image/instruction/test.svg';

const saveFlag = inject('saveFlag') as boolean;
const { teachPlanId } = useRouterParams<{ teachPlanId: string }>();
const props = defineProps<{
	tableId: string;
	questions: Array<ReportCourseQuestion>;
	tableFormType: number;
}>();

// 下发时间
const dateTime = ref<Dayjs>();
// 课堂练习时长
const duration = ref<number>(0);

const testOpen = ref(false);

const deadline = computed(() => dateTime.value?.add(duration.value, 'seconds'));
const open = ref(false);
// 课堂练习时间
const time = ref<Dayjs>(dayjs('15:00', 'mm:ss'));
const isTest = ref<boolean>(false);
const handleTest = () => {
	// 将time的分钟秒转换成秒
	const durationSeconds = time.value.minute() * 60 + time.value.second();
	const middlePracticeData = {
		tableFormType: props.tableFormType,
		time: '',
		duration: durationSeconds,
	};
	dateTime.value = dayjs();
	duration.value = durationSeconds;
	releaseMiddlePractice(teachPlanId, middlePracticeData).then(() => {
		isTest.value = true;
		message.success('下发成功！');
	});
	testOpen.value = false;
};
const middlePracticeDataList = ref();

const onFinish = () => {
	message.success('测评结束！');
};

onMounted(() => {
	getTeachScene(teachPlanId).then((res) => {
		middlePracticeDataList.value = res.middlePracticeDataList.map((item) => item.tableFormType);
		dateTime.value = dayjs(res.middlePracticeDataList[props.tableFormType - 1]?.time);
		duration.value = res.middlePracticeDataList[props.tableFormType - 1]?.duration;
		if (middlePracticeDataList.value.includes(props.tableFormType)) {
			isTest.value = true;
		}
	});
});

const answerRef = useTemplateRef('answerRef');

const handleRefresh = () => {
	if (answerRef.value) {
		answerRef.value.refresh();
	}
};
</script>

<template>
	<a-divider dashed style="border-color: skyblue">课堂评测</a-divider>
	<div v-if="isTest">
		<div class="flex items-center mb-4">
			<a-button size="small" type="primary" @click="handleRefresh">刷新</a-button>
			<a-button size="small" class="ml-4 mr-4" @click="open = true">查看原题</a-button>
			<a-statistic-countdown v-model:value="deadline" @finish="onFinish"></a-statistic-countdown>
		</div>
		<answer-situation :table-id="tableId" ref="answerRef" :questions="questions" />
	</div>
	<div v-else>
		<div class="flex items-center mb-4">
			<a-button size="small" type="primary" @click="testOpen = true" :disabled="!saveFlag">开始测评</a-button>
			<div v-if="!saveFlag" class="text-orange-300 ml-4">请先对学生进行分组哦！</div>
		</div>
		<show-question-table :table-id="tableId" source="" :questions="questions" />
	</div>
	<a-modal v-model:open="testOpen" width="400px" @ok="handleTest">
		<template #title>
			<div class="flex items-center">
				<test-svg></test-svg>
				<div class="text-[#0091ff] ml-2">课堂测评</div>
			</div>
		</template>
		<div class="py-2">将当前授课表单中对应的测试题，分发给关联班级的学生端，检测学生的掌握情况。</div>
		<div class="flex items-center">
			<span class="mr-2">答题时间（倒计时）:</span>
			<a-time-picker v-model:value="time" format="mm:ss" placeholder="计时" />
		</div>
	</a-modal>
	<a-modal v-model:open="open" title="查看题目信息" width="700px" :footer="false">
		<div class="h-[500px] overflow-y-scroll">
			<show-question-table :table-id="tableId" source="" :questions="questions" />
		</div>
	</a-modal>
</template>
