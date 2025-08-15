<script setup lang="ts">
import useAxios, { getTeachPlanTree } from '@/axios';
import dayjs, { Dayjs } from 'dayjs';
import { TimePlan } from '@/view/__report/components/workplace/calendar';
import { DICTIONARY_TYPE } from '@/utils/dictionary.ts';
import { useDictionaryStore } from '@/store/modules/dictionaryStore.ts';
import { message } from 'ant-design-vue';
import type { ValueType } from 'ant-design-vue/es/vc-cascader/Cascader';
import { DefaultOptionType } from 'ant-design-vue/es/select';
import security from '@/utils/security.ts';
import { TeachPlan } from '@/view/instruction';
import useUserStore from '@/store/modules/useUserStore.ts';

const axios = useAxios();
const { user } = useUserStore();

onMounted(() => {
	getTeachPlanTree(user.value!.id, 2).then((res) => {
		tree.value = res;
		if (res.length && !a.value.length) {
			a.value = [
				res[0].id,
				res[0].children[0].id,
				res[0].children[0].children[0].id,
				res[0].children[0].children[0].children[0].id,
			];
			getPlan();
		}
	});
});

const params = ref<{ date: Dayjs; studentId?: string }>({ date: dayjs(), studentId: user.value!.id });

function fetchData() {
	// getTeachPlan(user.value.id, params.value.date.toDate(), 2).then((res) => {
	// 	data.value = res;
	// });
}

const handleChange = (_value: ValueType, _selectOptions: DefaultOptionType[] | DefaultOptionType[][]) => {
	getPlan();
};
function getPlan() {
	axios
		.get<TimePlan>('/resource/calendar/schedule/getTimePlanDataByTimePlanId', {
			params: { reportId: a.value[2], timePlanId: a.value[3] },
		})
		.then((res) => {
			timePlan.value = res.data;
		});
}

const data = ref<TeachPlan[]>([]);
const tree = ref<TreeNode[]>([]);
const a = ref<string[]>([]);

const timePlan = ref<TimePlan>();
const getCourse = computed(() => {
	return (id: string): TeachPlan => {
		return data.value.find((item) => item.timeSlotId === id)!;
	};
});
const { dictionaryOption } = useDictionaryStore();
const handleDelete = (id: string) => {
	axios.delete(`/teach/plan/${id}`).then(() => {
		message.success('删除成功');
		data.value = data.value.filter((item) => item.id !== id);
	});
};

const showBaseInfoFlag = ref(false);
const idSign = ref('');
const showBaseInfo = async (id: string) => {
	idSign.value = id;
	showBaseInfoFlag.value = true;
};

const router = useRouter();
const startCourse = (teachPlanId: string, workbookId: string) => {
	router.push({
		path: '/classroom/study',
		query: { v: security.base64(JSON.stringify({ teachPlanId, workbookId })) },
	});
};
</script>

<template>
	<a-space>
		<a-cascader
			:options="tree"
			:field-names="{ value: 'id', label: 'name' }"
			placeholder="请选择"
			class="min-w-40 w-fit"
			v-model:value="a"
			:allow-clear="false"
			@change="handleChange"
		></a-cascader>
		<a-date-picker v-model:value="params.date" placeholder="请选择" :allow-clear="false"></a-date-picker>
		<a-button @click="fetchData">查询</a-button>
	</a-space>
	<template v-if="timePlan">
		<table class="w-full">
			<thead>
				<tr>
					<td colspan="2">课程计划</td>
					<td>上课时间</td>
					<td>课程信息</td>
					<td>教学模式</td>
					<td>教学地点</td>
					<td>当前课时</td>
					<td>授课教师</td>
					<td>上课班级</td>
					<td>状态</td>
					<td>操作</td>
				</tr>
			</thead>
			<tbody>
				<template v-for="item in timePlan.dayPartDataList">
					<tr>
						<td :rowspan="item.timeSlotData.length || 1">
							{{ ['清晨', '上午', '中午', '下午', '晚上'][item.dayPartType - 1] }}
						</td>
						<template v-if="item.timeSlotData.length">
							<td>{{ item.timeSlotData[0].timeSlotName }}</td>
							<td class="font-mono">
								{{ `${item.timeSlotData[0].startTime} ~ ${item.timeSlotData[0].endTime}` }}
							</td>
							<template v-if="data.some((v) => v.timeSlotId === item.timeSlotData[0].id)">
								<td>
									<div class="flex my-2 gap-2">
										<div class="rounded overflow-hidden">
											<img :src="getCourse(item.timeSlotData[0].id).courseData.coverUrl" alt="" class="size-24" />
										</div>
										<div>
											<div class="text-left">
												<span class="text-neutral-500">课程名称：</span>
												{{ getCourse(item.timeSlotData[0].id).courseData.courseName }}
											</div>
											<div class="text-left">
												<span class="text-neutral-500">课程类型：</span>
												{{
													dictionaryOption[DICTIONARY_TYPE.COURSE_TYPE].find(
														(v) => v.value === getCourse(item.timeSlotData[0].id).courseData.courseType,
													)?.label
												}}
											</div>
											<div class="text-left">
												<span class="text-neutral-500">课程性质：</span>
												{{
													dictionaryOption[DICTIONARY_TYPE.COURSE_NATURE].find(
														(v) => v.value === getCourse(item.timeSlotData[0].id).courseData.courseNature,
													)?.label
												}}
											</div>
										</div>
									</div>
								</td>
								<td>{{ '1' }}</td>
								<td>{{ getCourse(item.timeSlotData[0].id).coursePlanData.location }}</td>
								<td>
									{{ getCourse(item.timeSlotData[0].id).coursePlanData.courseProgress }}
									<br />
									{{ getCourse(item.timeSlotData[0].id).coursePlanData.currentCourseName }}
								</td>
								<td>{{ getCourse(item.timeSlotData[0].id).coursePlanData.teacherName }}</td>
								<td>
									{{
										getCourse(item.timeSlotData[0].id)
											.groupData.map((v) => v.groupName)
											.join('、')
									}}
								</td>
								<td>{{ ['未授课', '授课中', '已授课'][getCourse(item.timeSlotData[0].id).status] }}</td>
								<td>
									<div class="grid grid-cols-4 gap-4 select-none">
										<!-- 设置子级的样式 -->
										<div class="action-button" @click="showBaseInfo(getCourse(item.timeSlotData[0].id).teachPlanId)">
											基本信息
										</div>
										<div class="action-button" @click="handleDelete(getCourse(item.timeSlotData[0].id).teachPlanId)">
											删除计划
										</div>
										<div class="action-button">上课提醒</div>
										<div class="action-button">申请调课</div>
										<div
											class="action-button"
											@click="
												startCourse(
													getCourse(item.timeSlotData[0].id).teachPlanId,
													getCourse(item.timeSlotData[0].id).courseData.relationReportId,
												)
											"
										>
											课程详情
										</div>
										<div class="action-button">课前预习</div>
										<div class="action-button">课后练习</div>
										<div class="action-button">学生评教</div>
									</div>
								</td>
							</template>
							<template v-else>
								<td colspan="9">无数据</td>
							</template>
						</template>
						<template v-else>
							<td colspan="10">无数据</td>
						</template>
					</tr>
					<template v-if="item.timeSlotData.length">
						<template v-for="(a, b) in item.timeSlotData">
							<tr v-if="b !== 0">
								<td>{{ a.timeSlotName }}</td>
								<td class="font-mono">
									{{ `${a.startTime} ~ ${a.endTime}` }}
								</td>
								<template v-if="data.some((v) => v.timeSlotId === a.id)">
									<td>
										<div class="flex my-2 gap-2">
											<div class="rounded overflow-hidden">
												<img :src="getCourse(a.id).courseData.coverUrl" alt="" class="size-24" />
											</div>
											<div>
												<div class="text-left">
													<span class="text-neutral-500">课程名称：</span>
													{{ getCourse(a.id).courseData.courseName }}
												</div>
												<div class="text-left">
													<span class="text-neutral-500">课程类型：</span>
													{{
														dictionaryOption[11].find((v) => v.value === getCourse(a.id).courseData.courseType)?.label
													}}
												</div>
												<div class="text-left">
													<span class="text-neutral-500">课程性质：</span>
													{{
														dictionaryOption[12].find((v) => v.value === getCourse(a.id).courseData.courseNature)?.label
													}}
												</div>
											</div>
										</div>
									</td>
									<td>{{ '' }}</td>
									<td>{{ getCourse(a.id).coursePlanData.location }}</td>
									<td>
										{{ getCourse(a.id).coursePlanData.courseProgress }}
										<br />
										{{ getCourse(a.id).coursePlanData.currentCourseName }}
									</td>
									<td>{{ getCourse(a.id).coursePlanData.teacherName }}</td>
									<td>
										{{
											getCourse(a.id)
												.groupData.map((v) => v.groupName)
												.join('、')
										}}
									</td>
									<td>{{ ['未授课', '授课中', '已授课'][getCourse(a.id).status] }}</td>
									<td>
										<div class="grid grid-cols-4 gap-4 select-none">
											<div class="action-button" @click="showBaseInfo(getCourse(a.id).teachPlanId)">基本信息</div>
											<div class="action-button" @click="handleDelete(getCourse(a.id).teachPlanId)">删除计划</div>
											<div class="action-button">上课提醒</div>
											<div class="action-button">申请调课</div>
											<div
												class="action-button"
												@click="startCourse(getCourse(a.id).teachPlanId, getCourse(a.id).courseData.relationReportId)"
											>
												课程详情
											</div>
											<div class="action-button">课前预习</div>
											<div class="action-button">课后练习</div>
											<div class="action-button">学生评教</div>
										</div>
									</td>
								</template>
								<template v-else>
									<td colspan="9">无数据</td>
								</template>
							</tr>
						</template>
					</template>
				</template>
			</tbody>
		</table>
	</template>
</template>
<style scoped>
table,
td {
	text-align: center;
	border-collapse: collapse;
	border: 1px solid black;
	line-height: 32px;
	padding: 0 8px;
	text-wrap: wrap;
}
.action-button {
	cursor: pointer;
	&:hover {
		color: rgb(8, 103, 255);
	}
}
</style>
