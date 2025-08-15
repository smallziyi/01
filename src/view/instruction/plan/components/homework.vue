<script setup lang="ts">
import { getStepQuestion, releaseAfterPractice } from '@/axios';
import { TeachPlan } from '@/view/instruction';
import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import testSvg from '@/assets/image/instruction/test.svg';
import { message } from 'ant-design-vue';
import useRouterParams from '@/hooks/useRouterParams';
import afterSituation from './after-situation.vue';
import afterOrigin from './after-origin.vue';

const params = useRouterParams<{ teachPlanId: string; workbookId: string }>();
const teachPlan = inject<Ref<TeachPlan>>('teachPlan');
const props = defineProps<{ menuId: string }>();
const afterOpen = ref(false);
const open = ref(false);
const handleAfterPractice = () => {
	releaseAfterPractice(params.teachPlanId).then(() => {
		message.success('课后练习下发成功！');
		if (teachPlan?.value) {
			teachPlan.value.teachScene.afterPracticeFlag = true;
		}
		afterOpen.value = false;
	});
};

const answerRef = useTemplateRef('answerRef');
const handleRefresh = () => {
	if (answerRef.value) {
		answerRef.value.refresh();
	}
};

onMounted(() => {
	getStepQuestion({ menuCourseId: props.menuId }).then((res) => {
		homeworks.value = res.data;
	});
});

const homeworks = ref<Array<ReportCourseQuestion>>([]);
</script>

<template>
	<div class="overflow-y-auto" style="height: calc(100vh - 340px)">
		<div v-if="!teachPlan?.teachScene.afterPracticeFlag">
			<a-button size="small" class="my-2" type="primary" :disabled="teachPlan?.status !== 3" @click="afterOpen = true"
				>下发课后练习</a-button
			>
			<after-origin :homeworks="homeworks" />
		</div>
		<div v-else class="my-2">
			<a-button size="small" type="primary" @click="handleRefresh">刷新</a-button>
			<a-button size="small" class="ml-4 mr-4" @click="open = true">查看原题</a-button>
			<after-situation ref="answerRef" :questions="homeworks" />
		</div>
		<a-modal v-model:open="open" title="查看题目信息" width="700px" :footer="false">
			<div class="h-[500px] overflow-y-scroll">
				<after-origin :homeworks="homeworks" />
			</div>
		</a-modal>
		<!-- 下发课后练习 -->
		<a-modal v-if="afterOpen" v-model:open="afterOpen" width="400px" @ok="handleAfterPractice">
			<template #title>
				<div class="flex items-center">
					<test-svg></test-svg>
					<div class="text-[#0091ff] ml-2">课后练习</div>
				</div>
			</template>
			<div class="py-2">将当前授课环节中对应的课后测试题，分发给关联班级的学生端，检测学生的掌握情况。</div>
		</a-modal>
	</div>
</template>
