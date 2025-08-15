<script setup lang="ts">
import useAxios, { deleteTeachPlan, getTeachPlan, getTeachPlanTree } from '@/axios';
import dayjs, { Dayjs } from 'dayjs';
import planAdd from './components/plan-add.vue';
import planEdit from './components/plan-edit.vue';
import planDetail from './components/plan-detail.vue';
import usePage from '@/hooks/usePage';
import { TableColumnsPlan, TeachPlan } from '@/view/instruction';
import security from '@/utils/security.ts';
import type { ValueType } from 'ant-design-vue/es/vc-cascader/Cascader';
import { DefaultOptionType } from 'ant-design-vue/es/vc-cascader';
import { TimePlan } from '@/view/__report/components/workplace/calendar';
import useCalcHeight from '@/hooks/useCalcHeight';
import { DownOutlined } from '@ant-design/icons-vue';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import { translationKey } from '@/utils/dictionary';
import { message, Modal } from 'ant-design-vue';
import preview from './components/preview.vue';
import evaluateDetail from '@/view/classroom/teach/evaluate-detail.vue';
import useUserStore from '@/store/modules/useUserStore.ts';

const { dictionaryOption } = useDictionaryStore();
const axios = useAxios();
const router = useRouter();
const { calcHeight } = useCalcHeight(368);
const { user } = useUserStore();
const timePlan = ref<TimePlan>();
const { state, onCreate, onUpdate, onRead, onOpen, onDetailOpen } = usePage();
const currentYearMonth = ref<Dayjs>();
// 0代表周日以此类推
const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const currentYear = computed(() => {
	return dayjs(currentYearMonth.value).year();
});
const currentMonth = computed(() => {
	return padZero(dayjs(currentYearMonth.value).month() + 1);
});
const currentDay = ref<string>('01');
// 当月日期集合
const currentDate = ref<{ day: string; weekDay: string }[]>([]);

// 补 0 函数
const padZero = (num: number): string => {
	return num < 10 ? `0${num}` : `${num}`;
};

const getMonthDaysInfo = (year: number, month: string) => {
	const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
	const daysInfo = [];
	for (let day = 1; day <= daysInMonth; day++) {
		const date = dayjs(`${year}-${month}-${day}`);
		const weekDay = weekDayNames[date.day()]; // 0: Sunday, 1: Monday, ..., 6: Saturday
		daysInfo.push({
			day: padZero(day),
			weekDay, // 返回的数字可以通过进一步转换为中文或其他格式
		});
	}
	currentDate.value = daysInfo;
};

watch(
	() => currentYear.value,
	(year) => {
		getMonthDaysInfo(year, currentMonth.value);
		const dayList = currentDate.value.map((item) => item.day);
		if (dayList.includes(currentDay.value)) {
			return;
		} else {
			currentDay.value = dayList[0];
		}
	},
);

watch(
	() => currentMonth.value,
	(month) => {
		getMonthDaysInfo(currentYear.value, month);
		const dayList = currentDate.value.map((item) => item.day);
		if (dayList.includes(currentDay.value)) {
			return;
		} else {
			currentDay.value = dayList[0];
		}
	},
);

const teachPlanTree = ref<TreeNode[]>([]); // 级联框下拉数据
const teachPlan = ref<string[]>(); // 当前
const data = ref<TeachPlan[]>([]);
const dataParams = ref<{ teachDate?: string; teacherId?: string }>();
const tableData = ref<TableColumnsPlan[]>([]);
const handleChangePlan = async (value: ValueType, _selectOptions: DefaultOptionType[] | DefaultOptionType[][]) => {
	if (value) {
		axios
			.get<TimePlan>('/resource/calendar/schedule/getTimePlanDataByTimePlanId', {
				params: { reportId: value[2], timePlanId: value[3] },
			})
			.then((res) => {
				timePlan.value = res.data;
				const templateData: any = res.data.dayPartDataList.map((item) => {
					const timeItem = item.timeSlotData.filter((i) => i.courseFlag);
					return timeItem.map((aItem) => {
						return {
							id: aItem.id,
							dayPartType: ['', '清晨', '上午', '中午', '下午', '晚上'][item.dayPartType],
							plan: aItem.timeSlotName,
							time: `${aItem.startTime.slice(0, 5)} - ${aItem.endTime.slice(0, 5)}`,
							info: {
								courseName: '',
								courseType: '',
								courseNature: '',
								coverUrl: '',
							},
							content: {
								courseProgress: '',
								currentCourseName: '',
							},
							location: '',
							totalTime: '',
							teacherName: '',
							status: 0,
							teachPlanId: '',
							relationReportId: '',
						};
					});
				});
				tableData.value = templateData.flat();
			});
	} else {
		timePlan.value = undefined;
		data.value = [];
		dataParams.value = {};
	}
};
const handleSelectData = () => {
	dataParams.value = {
		teachDate: `${currentYear.value}-${currentMonth.value}-${currentDay.value}`,
		teacherId: user.value!.id,
	};
	if (dataParams.value.teacherId && dataParams.value.teachDate) {
		getTeachPlan(dataParams.value.teacherId, dataParams.value.teachDate, 1).then((res) => {
			data.value = res;
			if (res.length === 0) {
				tableData.value = [];
			}
			const templateData = res.map((item) => {
				const {
					courseData: { courseName, courseNature, courseType, coverUrl, relationReportId },
					coursePlanData: { classroomDisable, classRoomName, location, courseProgress, currentCourseName, teacherName },
					groupData,
					status,
					timeSlotId,
					teachPlanId,
				} = item;
				return {
					timeSlotId,
					info: {
						courseName,
						courseType,
						courseNature,
						coverUrl,
					},
					classroomDisable,
					location: `${classRoomName}(${location})`,
					content: {
						currentCourseName,
						courseProgress,
					},
					teacherName,
					status,
					class: groupData.map((item) => item.groupName).join('、'),
					teachPlanId,
					relationReportId,
				};
			});

			templateData.forEach((item) => {
				const resultData = tableData.value.find((i) => item.timeSlotId === i.id);
				if (resultData) {
					Object.assign(resultData, item);
				}
			});
		});
	}
};

const getData = () => {
	if (teachPlan.value) {
		handleChangePlan(teachPlan.value as ValueType, []).then(() => {
			handleSelectData();
		});
	} else {
		getTeachPlanTree(user.value!.id, 1).then((res) => {
			teachPlanTree.value = res;
			if (res.length) {
				teachPlan.value = [
					res[0].id,
					res[0].children[0].id,
					res[0].children[0].children[0].id,
					res[0].children[0].children[0].children[0].id,
				];
				handleChangePlan(teachPlan.value as ValueType, []).then(() => {
					handleSelectData();
				});
			}
		});
	}
};

onMounted(() => {
	if (router.currentRoute.value.query.currentData) {
		currentYearMonth.value = dayjs(router.currentRoute.value.query.currentData as string);
		currentDay.value = padZero(dayjs(router.currentRoute.value.query.currentData as string).date());
	} else {
		currentYearMonth.value = dayjs();
		currentDay.value = padZero(dayjs().date());
	}
	getMonthDaysInfo(currentYear.value, currentMonth.value);
	getTeachPlanTree(user.value!.id, 1).then((res) => {
		teachPlanTree.value = res;
		if (res.length) {
			teachPlan.value = [
				res[0].id,
				res[0].children[0].id,
				res[0].children[0].children[0].id,
				res[0].children[0].children[0].children[0].id,
			];
			getData();
		}
	});
	watch(
		() => currentYearMonth.value,
		() => {
			getData();
		},
	);

	watch(
		() => currentDay.value,
		() => {
			getData();
		},
	);
});

const startCourse = (teachPlanId: string, workbookId: string) => {
	router.push({
		path: '/school/instruction/teachworkplace',
		query: { v: security.base64(JSON.stringify({ teachPlanId, workbookId, pageType: 'teach' })) },
	});
};
const countDayPart = computed(() => {
	return tableData.value.reduce((acc: any, item: any) => {
		if (acc[item.dayPartType]) {
			acc[item.dayPartType]++;
		} else {
			acc[item.dayPartType] = 1;
		}
		return acc;
	}, {});
});

const handleDelete = (id: string) => {
	Modal.confirm({
		title: '删除计划',
		content: `确定要删除，删除后内容不可恢复，请谨慎操作！`,
		onOk() {
			deleteTeachPlan(id).then(() => {
				getData();
				message.success('删除成功! ');
			});
		},
		onCancel() {
			return;
		},
	});
};

// 表格
const columns: TableColumns<TableColumnsPlan> = [
	{
		title: '课程计划',
		colSpan: 2,
		dataIndex: 'dayPartType',
		fixed: 'left',
		width: 50,
		align: 'center',
		customCell: (_row, index = 0) => {
			let total = 0;
			// 通过循环确定是否合并行
			for (const part in countDayPart.value) {
				const count = countDayPart.value[part];
				if (index === total) {
					return { rowspan: count };
				} else if (index < total + count) {
					return { rowspan: 0 };
				}
				total += count;
			}
			return {}; // 默认不合并
		},
	},
	{ title: '计划', colSpan: 0, dataIndex: 'plan', key: 'plan', width: 40, align: 'center', fixed: 'left' },
	{ title: '上课时间', dataIndex: 'time', key: 'time', align: 'center', fixed: 'left', width: 120 },
	{ title: '课程信息', dataIndex: 'info', key: 'info', align: 'center', width: 280 },
	{ title: '教学地点', dataIndex: 'location', key: 'location', align: 'center', width: 200, ellipsis: true },
	{ title: '当前课时/内容', dataIndex: 'content', key: 'content', align: 'center', ellipsis: true, width: 200 },
	{ title: '授课教师', dataIndex: 'teacherName', key: 'teacherName', align: 'center', width: 100 },
	{ title: '授课班级', dataIndex: 'class', key: 'class', align: 'center', ellipsis: true, width: 120 },
	{ title: '状态', dataIndex: 'status', key: 'status', align: 'center', width: 80 },
	{ title: '操作', dataIndex: 'operation', key: 'operation', align: 'center', width: 280, fixed: 'right' },
];
</script>

<template>
	<a-card :body-style="{ padding: '16px', height: '132px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<div class="flex justify-between items-center">
			<a-date-picker v-model:value="currentYearMonth" size="large" picker="month" :allow-clear="false"> </a-date-picker>
			<a-cascader
				class="w-fit min-w-40"
				:options="teachPlanTree"
				:field-names="{ label: 'name', value: 'id' }"
				:placeholder="!teachPlanTree.length ? '暂无任务数据' : '选择方案'"
				@change="handleChangePlan"
				v-model:value="teachPlan"
			>
			</a-cascader>
		</div>
		<div class="flex mt-2">
			<div v-for="item in currentDate" :key="item.day" class="flex-1 flex flex-col items-center">
				<div class="text-[#999] mb-1">{{ item.weekDay }}</div>
				<template v-if="item.day === currentDay">
					<a-badge color="#0091FF">
						<div class="text-[#0091FF]">{{ item.day }}</div>
					</a-badge>
				</template>
				<template v-else>
					<a-badge color="#0091FF">
						<div @click="currentDay = item.day" class="cursor-pointer hover:border-2 rounded px-1 border-[#0091FF]">
							{{ item.day }}
						</div>
					</a-badge>
				</template>
			</div>
		</div>
	</a-card>
	<a-card size="small" style="height: calc(100vh - 273px)">
		<template #title>
			<div>当日课程安排（{{ currentYear }}年{{ currentMonth }}月{{ currentDay }}日）</div>
		</template>
		<template #extra>
			<a-button type="link" @click="onCreate"><i class="bi bi-plus-circle mr-1" />新建</a-button>
		</template>
		<m-empty v-if="tableData.length === 0"></m-empty>
		<a-table
			v-else
			size="small"
			:columns="columns"
			:data-source="tableData"
			:pagination="false"
			:scroll="{ x: 1200, y: calcHeight }"
		>
			<template #bodyCell="{ column, record }: TableRow<TableColumnsPlan>">
				<template v-if="column.key === 'info'">
					<div class="flex">
						<img class="mr-4 size-20 rounded-lg" v-if="record.info.coverUrl" :src="record.info.coverUrl" />
						<div v-if="record.info.coverUrl" class="text-left">
							<div>课程名称：{{ record.info.courseName }}</div>
							<div>课程类型：{{ translationKey(record.info.courseType, dictionaryOption) }}</div>
							<div>课程性质：{{ translationKey(record.info.courseNature, dictionaryOption) }}</div>
						</div>
					</div>
				</template>
				<template v-if="column.key === 'content'">
					<div v-if="record.content.courseProgress && record.content.currentCourseName" class="text-left">
						<div>课时：{{ record.content.courseProgress }}</div>
						<div>内容：{{ record.content.currentCourseName }}</div>
					</div>
				</template>
				<template v-if="column.key === 'status'">
					<a-tag v-if="record.status" :color="['', '#0091FF', '#F0AE43', '#68D1A5', '#0091FF'][record.status]">
						{{ ['', '未授课', '授课中', '已授课', '未授课'][record.status] }}
					</a-tag>
					<div v-else></div>
				</template>
				<template v-if="column.key === 'operation' && record.teacherName">
					<a-button
						class="px-1"
						type="link"
						@click="onOpen(record.teachPlanId)"
						:disabled="![1, 4].includes(record.status)"
						>课前预习</a-button
					>
					<a-button class="px-1" v-if="record.status === 4" type="link" @click="onUpdate(record.teachPlanId)"
						>编辑计划</a-button
					>
					<a-button class="px-1" v-else type="link" @click="onRead(record.teachPlanId)">查看计划</a-button>
					<template v-if="record.classroomDisable">
						<a-tooltip title="实训室已被停用，请联系管理员进行调换">
							<a-button class="px-1" type="link" disabled>课程详情</a-button>
						</a-tooltip>
					</template>
					<a-button v-else class="px-1" type="link" @click="startCourse(record.teachPlanId, record.relationReportId)"
						>课程详情</a-button
					>
					<a-dropdown>
						<a class="ant-dropdown-link" @click.prevent>
							更多
							<DownOutlined />
						</a>
						<template #overlay>
							<a-menu>
								<a-menu-item>
									<a-button type="link" :disabled="record.status !== 3">课后练习</a-button>
								</a-menu-item>
								<a-menu-item>
									<a-button type="link" :disabled="record.status !== 3" @click="onDetailOpen(record.teachPlanId)"
										>学生评教</a-button
									>
								</a-menu-item>
								<!-- <a-menu-item>
									<a-button type="link">申请调课</a-button>
								</a-menu-item> -->
								<a-menu-item>
									<a-button type="link" @click="handleDelete(record.teachPlanId)" :disabled="record.status !== 4">
										删除计划
									</a-button>
								</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown>
				</template>
			</template>
		</a-table>
	</a-card>
	<plan-add v-if="state.createOpen" v-model:open="state.createOpen" @success="getData" />
	<plan-edit
		v-if="state.updateOpen"
		v-model:open="state.updateOpen"
		:teach-plan-id="state.currentId"
		@success="getData"
	/>
	<plan-detail v-if="state.readOpen" v-model:open="state.readOpen" :teach-plan-id="state.currentId" />
	<preview v-if="state.open" v-model:open="state.open" :teach-plan-id="state.currentId" @update="getData"></preview>
	<evaluate-detail
		v-if="state.detailOpen"
		v-model:open="state.detailOpen"
		:teach-plan-id="state.currentId"
	></evaluate-detail>
</template>

<style scoped>
:deep(.ant-tabs-nav::before) {
	display: none !important;
}
:deep(.ant-tabs-top > .ant-tabs-nav) {
	margin-bottom: 0;
}
</style>
