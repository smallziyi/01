<script setup lang="ts">
import useAxios, {
	addTeachPlan,
	getReportInfo,
	getTeachPlanDetails,
	getTimeAndTeacherAlreadyTimeSlot,
	getTimeAndTimeSlotAlreadyGroupAndClassroom,
	reportUsableDropdown,
	getGroupTree,
} from '@/axios';
import { ReportField } from '@/view/__report';
import { SelectValue } from 'ant-design-vue/es/select';
import { DefaultOptionType } from 'ant-design-vue/es/vc-cascader';
import { message, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import useHoliday from '@/view/__report/components/workplace/calendar/useHoliday.ts';
import { Classroom } from '@/view/resource/classroom/config.ts';
import type { ValueType } from 'ant-design-vue/es/vc-cascader/Cascader';
import { useTemplateRef } from 'vue-demi';
import { FormInstance } from 'ant-design-vue/es/form';
import { CalendarSchedule, TeachPlan } from '@/view/instruction';
import { useDictionaryStore } from '@/store/modules/dictionaryStore.ts';
import { translationKey } from '@/utils/dictionary.ts';
import useUserStore from '@/store/modules/useUserStore.ts';

const { dictionaryOption } = useDictionaryStore();
const { holidays, generate } = useHoliday();
const { user } = useUserStore();
const axios = useAxios();
const open = defineModel('open', { type: Boolean, required: true });
const props = defineProps<{
	teachPlanId: string;
}>();
const disableTime = ref<string[]>([]);
const form = useTemplateRef<FormInstance>('form');
const emits = defineEmits(['success']);
const p = ref<Partial<TeachPlan>>({ clientId: user.value!.clientId, status: 1 });
const t = ref<
	Partial<{
		a: string;
		b: string;
		c: string;
		d: string;
		e: string;
		g: [number, string];
		h: string;
	}>
>({});
const groupTree = ref<TreeNode[]>([]);
const options = ref<{ a: Option[] }>({ a: [] });
const classrooms = ref<Classroom[]>([]);
const calendarSchedule = ref<Partial<CalendarSchedule>>({});
const calendarSchedules = ref<CalendarSchedule[]>([]);
const treeData = ref([]);
const disableGroup = ref<string[]>([]);
const disableRoom = ref<string[]>([]);

function isWorkday(date: { year: number; month: number; day: number }): boolean {
	const isSetting = () => {
		return (
			calendarSchedule.value.resourceCalendars?.some(
				(item) => item.year === date.year && item.month === date.month && item.day === date.day && item.settingFlag,
			) ?? false
		);
	};

	const isEndDay = () => {
		const day = new Date(date.year, date.month - 1, date.day).getDay();
		return day === 0 || day === 6;
	};

	const isHolidays = () => {
		return holidays.value.some((item) => item.day[0] === date.month && item.day[1] === date.day);
	};

	if (isHolidays()) return isSetting();
	if (isEndDay()) return isSetting();
	return !isSetting();
}

const handleChange = async (value: SelectValue, _option: DefaultOptionType | DefaultOptionType[]) => {
	p.value.teachDate = undefined;
	p.value.calendarId = undefined;
	p.value.classroomId = undefined;
	p.value.groupIdData = [];
	calendarSchedule.value = {};
	if (value) {
		await getReportInfo<ReportField>(value as string).then(async (res) => {
			t.value.a = res.otherField.courseName || '';
			t.value.b = res.otherField.courseType || '';
			t.value.c = res.otherField.courseNature || '';
			t.value.d = res.description;
			t.value.e = res.coverUrl || '';
			t.value.h = res.majorData.label;

			await axios
				.get<CalendarSchedule[]>('/resource/calendar/getCalendarReportCardByDomainId', {
					params: { domainId: res.domainData.value },
				})
				.then((res) => {
					if (res.data) {
						calendarSchedules.value = res.data;
					} else {
						message.warn('该教学用书绑定的专业未设置校历');
					}
				});
		});
		axios.get('/report/course/getMenuCourseTree', { params: { reportId: value, detailsFlag: false } }).then((res) => {
			treeData.value = res.data;
		});
	} else {
		t.value = {};
	}
};

const disDate = (date: Dayjs) => {
	const find = calendarSchedule.value.timePlans?.find((item) => item.id === p.value.calendarPlanId);

	if (!find) return false;

	if (date.isBefore(dayjs(find.startTime)) || date.isAfter(dayjs(find.endTime).add(1, 'day'))) {
		return true;
	}
	return !isWorkday({ year: date.year(), month: date.month() + 1, day: date.date() });
};

const handleChangeTeachDate = async () => {
	if (p.value.teachDate && p.value.teacherId) {
		getTimeAndTeacherAlreadyTimeSlot(p.value.teacherId, p.value.teachDate).then((res) => {
			disableTime.value = res;
		});
	}
	p.value.timeSlotId = undefined;
	t.value.g = undefined;
};

const handleSelectTime = (value: ValueType, _selectOptions: DefaultOptionType[] | DefaultOptionType[][]) => {
	if (value && p.value.teachDate) {
		p.value.timeSlotId = value[1] as string;
		getTimeAndTimeSlotAlreadyGroupAndClassroom(value[1] as string, p.value.teachDate).then((res) => {
			const { classroomIds, groupIds } = res;
			disableGroup.value = groupIds;
			disableRoom.value = classroomIds;
		});
	} else {
		p.value.timeSlotId = undefined;
		t.value.g = undefined;
	}
};

const handleUpdate = () => {
	form
		.value!.validate()
		.then(() => {
			addTeachPlan(p.value).then(() => {
				message.success('保存成功！');
				emits('success');
				open.value = false;
			});
		})
		.catch((err: FormError) => {
			message.warning(err.errorFields[0].errors[0]);
		});
};

const handleChangeCalendar = async (value: SelectValue, _option: DefaultOptionType | DefaultOptionType[]) => {
	if (value) {
		const selectedSchedule = calendarSchedules.value.find((item) => item.calendarId === (value as string));
		if (selectedSchedule) {
			calendarSchedule.value = selectedSchedule;
			generate(selectedSchedule.currentYear);
		} else {
			calendarSchedule.value = {};
		}
	} else {
		calendarSchedule.value = {};
	}
};

const handleCancel = () => {
	Modal.confirm({
		title: '确认关闭',
		content: '关闭后内容不可恢复，请谨慎操作!',
		onOk() {
			open.value = false;
		},
	});
};

onMounted(() => {
	reportUsableDropdown(6).then((res) => {
		options.value.a = res;
	});

	axios.get<Classroom[]>('/resource/classroom').then((res) => {
		classrooms.value = res.data;
	});

	getGroupTree().then((res) => {
		groupTree.value = res.data;
		groupTree.value.forEach((item) => {
			item.children.forEach((v) => {
				v.children.forEach((b) => {
					b.children.forEach((n) => {
						b.disabled = disableGroup.value.includes(n.id);
					});
				});
			});
		});
	});
	p.value.id = props.teachPlanId;
	getTeachPlanDetails(props.teachPlanId).then((res) => {
		const {
			courseData: { relationReportId },
			coursePlanData: {
				classRoomId,
				relationCalendarId,
				teacherId,
				teachDate,
				timeSlotScheduleDto: {
					timePlanData: { id: calendarPlanId },
					dayPartData: { dayPartType },
					timeSlotData: { id: timeSlotId },
				},
				treeNodes,
			},
			status,
			groupData,
		} = res;
		p.value.relationReportId = relationReportId;
		handleChange(relationReportId, []);
		p.value.calendarId = relationCalendarId;
		setTimeout(() => {
			handleChangeCalendar(relationCalendarId, []);
			p.value.calendarPlanId = calendarPlanId;
		}, 300);
		p.value.courseTreeNodes = treeNodes;
		p.value.teacherId = teacherId;
		p.value.status = status;
		p.value.teachDate = dayjs(teachDate);
		t.value.g = [dayPartType, timeSlotId];
		p.value.timeSlotId = timeSlotId;
		p.value.classroomId = classRoomId;
		p.value.groupIdData = groupData.map((item: { groupId: string }) => item.groupId);
	});
});
</script>

<template>
	<a-drawer v-model:open="open" width="50%" :close-icon="false">
		<template #title>
			<div class="card-title">编辑</div>
		</template>
		<template #extra>
			<a-button @click="handleCancel" type="text">
				<template #icon>
					<i class="bi bi-x-lg"></i>
				</template>
			</a-button>
		</template>
		<div class="drawer-title">基础信息</div>
		<a-form :model="p" ref="form">
			<div class="grid grid-cols-2 gap-2">
				<a-form-item label="教学用书" name="relationReportId" :rules="{ required: true, message: '请选择教学用书' }">
					<a-select
						v-model:value="p.relationReportId"
						:options="options.a"
						allow-clear
						@change="handleChange"
						placeholder="请选择"
					></a-select>
				</a-form-item>
				<a-form-item label="所属专业" required>
					<a-input disabled :value="t.h" placeholder="自动生成" />
				</a-form-item>
				<a-form-item label="课程名称" required>
					<a-input disabled :value="t.a" placeholder="自动生成" />
				</a-form-item>
				<a-form-item label="课程类型" required>
					<a-input disabled :value="translationKey(t.b, dictionaryOption)" placeholder="自动生成" />
				</a-form-item>
				<a-form-item label="课程性质" required>
					<a-input disabled :value="translationKey(t.c, dictionaryOption)" placeholder="自动生成" />
				</a-form-item>
				<a-form-item label="课程描述" required>
					<a-input disabled :value="t.d" placeholder="自动生成" />
				</a-form-item>
			</div>
			<a-form-item label="课程图片" required>
				<template v-if="t.e">
					<a-image :src="t.e" class="size-20" />
				</template>
			</a-form-item>
		</a-form>
		<div class="drawer-title">授课信息</div>
		<a-form :model="p" ref="form">
			<div class="grid-cols-2 grid gap-2">
				<a-form-item label="校历名称" name="calendarId" :rules="{ required: true, message: '请选择校历' }">
					<a-select
						:disabled="!p.relationReportId"
						:placeholder="!p.relationReportId ? '先选择专业' : '请选择'"
						v-model:value="p.calendarId"
						:options="
							calendarSchedules.map((item) => {
								return { value: item.calendarId, label: item.calendarName };
							})
						"
						@change="handleChangeCalendar"
					></a-select>
				</a-form-item>
				<a-form-item label="选择方案" name="calendarPlanId" :rules="{ required: true, message: '请选择方案' }">
					<a-select
						:options="
							calendarSchedule.timePlans?.map((item) => {
								return { value: item.id, label: item.name };
							}) || []
						"
						v-model:value="p.calendarPlanId"
						:disabled="!p.calendarId"
						:placeholder="!p.calendarId ? '先选择校历' : '请选择'"
					></a-select>
				</a-form-item>
				<a-form-item label="课程章节" name="courseTreeNodes" :rules="{ required: true, message: '请选择章节' }">
					<a-cascader
						v-model:value="p.courseTreeNodes"
						:disabled="!p.relationReportId"
						:options="treeData"
						allow-clear
						:field-names="{
							children: 'children',
							label: 'name',
							value: 'id',
						}"
						:placeholder="!p.relationReportId ? '先选择专业' : '请选择'"
					/>
				</a-form-item>
				<a-form-item label="授课教师" name="teacherId" :rules="{ required: true, message: '请选择授课教师' }">
					<a-select
						v-model:value="p.teacherId"
						:disabled="!p.calendarPlanId"
						:placeholder="!p.calendarPlanId ? '先选择校历方案' : '请选择'"
					>
						<a-select-option :value="user!.id">{{ user!.name }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="授课日期" name="teachDate" :rules="{ required: true, message: '请选择授课日期' }">
					<a-date-picker
						v-model:value="p.teachDate"
						class="w-full"
						:disabled-date="disDate"
						:disabled="!p.teacherId"
						:placeholder="!p.teacherId ? '先选择授课日期' : '请选择'"
						@change="handleChangeTeachDate"
					/>
				</a-form-item>
				<a-form-item label="选择课节" name="timeSlotId" :rules="{ required: true, message: '请选择课节' }">
					<a-cascader
						:options="
							calendarSchedule.timePlans
								?.find((item) => item.id === p.calendarPlanId)
								?.dayPartDataList.map((dayPart) => {
									return {
										label: ['清晨', '上午', '中午', '下午', '晚上'][dayPart.dayPartType - 1],
										value: dayPart.dayPartType,
										disabled: dayPart.timeSlotData.filter((slot) => slot.courseFlag).length === 0,
										children: dayPart.timeSlotData
											.filter((slot) => slot.courseFlag)
											.map((slot) => {
												return {
													label: `${slot.timeSlotName}:${slot.startTime.slice(0, 5)}~${slot.endTime.slice(0, 5)}`,
													value: slot.id,
													disabled: disableTime.includes(slot.id),
												};
											}),
									};
								}) || []
						"
						v-model:value="t.g"
						@change="handleSelectTime"
						:disabled="!p.teachDate"
						:placeholder="!p.teachDate ? '先选择授课教师' : '请选择'"
					/>
				</a-form-item>

				<a-form-item label="授课地点" name="classroomId" :rules="{ required: true, message: '请选择授课地点' }">
					<a-select
						:options="
							classrooms.map((item) => {
								return { value: item.id, label: item.name, disabled: disableRoom.includes(item.id) };
							})
						"
						v-model:value="p.classroomId"
						:placeholder="!t.g ? '先选择课节' : '请选择'"
						:disabled="!t.g"
					/>
				</a-form-item>

				<a-form-item label="授课班级" name="groupIdData" :rules="{ required: true, message: '请选择授课班级' }">
					<a-tree-select
						:tree-data="groupTree"
						treeCheckable
						:field-names="{ label: 'name', value: 'id' }"
						v-model:value="p.groupIdData"
						:placeholder="!t.g ? '先选择课节' : '请选择'"
						:disabled="!t.g"
					></a-tree-select>
				</a-form-item>
			</div>
		</a-form>
		<template #footer>
			<a-space class="float-end">
				<a-button @click="handleCancel">取消</a-button>
				<a-button type="primary" @click="handleUpdate">保存</a-button>
			</a-space>
		</template>
	</a-drawer>
</template>
