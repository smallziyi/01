<script setup lang="ts">
import useAxios from '@/axios';
import useRouterParams from '@/hooks/useRouterParams.ts';
import { ResourceCalendarSchedule } from '@/view/__report/components/workplace/calendar/index.ts';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

// @ts-ignore
import { Snowyflake, Epoch } from 'snowyflake';
import download from '@/utils/download.ts';

const snowyflake = new Snowyflake({
	workerId: 1n,
	epoch: Epoch.Twitter, // BigInt timestamp
});

const planNumber = ref(1);

const axios = useAxios();
const params = useRouterParams<{ reportId: string; type: 'edit' | 'audit' | 'preview' }>();
const isDisable = computed(() => {
	return params.type !== 'edit';
});
onMounted(() => {
	axios
		.get<ResourceCalendarSchedule>('/resource/calendar/schedule', { params: { reportId: params.reportId, type: 2 } })
		.then((res) => {
			data.value = res.data;
			data.value?.timePlanData.forEach((item, index) => {
				if (item.startTime && item.endTime) {
					date.value[index] = [dayjs(item.startTime), dayjs(item.endTime)];
				}
			});
		});
});

const data = ref<ResourceCalendarSchedule>();

const title = ['方案一', '方案二', '方案三', '方案四'];
const title2 = ['清晨', '上午', '中午', '下午', '晚上'];

const date = ref<
	[
		undefined | [dayjs.Dayjs, dayjs.Dayjs],
		undefined | [dayjs.Dayjs, dayjs.Dayjs],
		undefined | [dayjs.Dayjs, dayjs.Dayjs],
		undefined | [dayjs.Dayjs, dayjs.Dayjs],
	]
>([undefined, undefined, undefined, undefined]);

const handleDateChange = (index: number) => {
	if (date.value[index]) {
		if (data.value && data.value.timePlanData[index]) {
			data.value.timePlanData[index].startTime = date.value[index]?.[0].toString()!;
			data.value.timePlanData[index].endTime = date.value[index]?.[1].toString()!;
		}
	} else {
		if (data.value && data.value.timePlanData[index]) {
			data.value.timePlanData[index].startTime = null;
			data.value.timePlanData[index].endTime = null;
		}
	}
};

const getTimeCourseFlag = (itemIndex: number, dayPartType: number, slotIndex: number) => {
	return data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)?.timeSlotData[
		slotIndex
	].courseFlag;
};

const setTimeCourseFlag = (itemIndex: number, dayPartType: number, slotIndex: number, value: boolean) => {
	const slot = data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)
		?.timeSlotData[slotIndex];
	if (slot) {
		slot.courseFlag = value;
	}
};

const getTimeSlotName = (itemIndex: number, dayPartType: number, slotIndex: number) => {
	return data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)?.timeSlotData[
		slotIndex
	].timeSlotName;
};

const setTimeSlotName = (itemIndex: number, dayPartType: number, slotIndex: number, value: string) => {
	const slot = data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)
		?.timeSlotData[slotIndex];
	if (slot) {
		slot.timeSlotName = value;
	}
};

const getTimeSlotStartTime = (itemIndex: number, dayPartType: number, slotIndex: number) => {
	return data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)?.timeSlotData[
		slotIndex
	].startTime;
};

const setTimeSlotStartTime = (itemIndex: number, dayPartType: number, slotIndex: number, value: string) => {
	const slot = data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)
		?.timeSlotData[slotIndex];
	if (slot) {
		slot.startTime = value;
	}
};

const getTimeSlotEndTime = (itemIndex: number, dayPartType: number, slotIndex: number) => {
	return data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)?.timeSlotData[
		slotIndex
	].endTime;
};

const setTimeSlotEndTime = (itemIndex: number, dayPartType: number, slotIndex: number, value: string) => {
	const slot = data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType)
		?.timeSlotData[slotIndex];
	if (slot) {
		slot.endTime = value;
	}
};

const removeTimeSlot = (itemIndex: number, dayPartType: number, slotIndex: number) => {
	const dayPart = data.value?.timePlanData[itemIndex].dayPartDataList.find((l) => l.dayPartType === dayPartType);
	if (dayPart) {
		dayPart.timeSlotData.splice(slotIndex, 1);
	}
};

const handleSave = () => {
	let flag = true;

	const day: [dayjs.Dayjs, dayjs.Dayjs][] = [];

	data.value?.timePlanData.forEach((item, index) => {
		item.useFlag = index < planNumber.value;

		if (item.useFlag) {
			if (!item.name.trim()) {
				message.warn(`${title[index]}的名称未填写`);
				flag = false;
			}
			if (!item.startTime) {
				message.warn(`${title[index]}的开始时间未设置`);
				flag = false;
			}
			if (!item.endTime) {
				message.warn(`${title[index]}的结束时间未设置`);
				flag = false;
			}

			if (item.startTime && item.endTime) {
				day.push([dayjs(item.startTime), dayjs(item.endTime)]);
			}

			const time: [string, string, number, number, number][] = [];
			item.dayPartDataList.forEach((dayPart) => {
				dayPart.timeSlotData.forEach((v, i) => {
					if (!v.timeSlotName.trim()) {
						message.warn(`${title[index]}的${title2[dayPart.dayPartType]}的第${i + 1}项的课节/事项安排未填写`);
						flag = false;
					}
					if (!v.startTime.trim()) {
						message.warn(`${title[index]}的${title2[dayPart.dayPartType]}的第${i + 1}项的开始时间未设置`);
						flag = false;
					}
					if (!v.endTime.trim()) {
						message.warn(`${title[index]}的${title2[dayPart.dayPartType]}的第${i + 1}项的结束时间未设置`);
						flag = false;
					}

					if (v.startTime && v.endTime) {
						if (v.endTime <= v.startTime) {
							message.warn(`${title[index]}的${title2[dayPart.dayPartType]}的第${i + 1}项的结束时间必须晚于开始时间`);
							flag = false;
						}
						time.push([v.startTime, v.endTime, index, dayPart.dayPartType, i]);
						v.sort = i + 1;
					}
				});
			});
			// time.forEach((v, i) => {
			// 	time.forEach((k, j) => {
			// 		if (j > i) {
			// 			if (!(v[1] < k[0] || v[0] > k[1]) && v[2] === k[2]) {
			// 				if (v[3] === k[3]) {
			// 					message.warn(`${title[v[2]]}的${title2[v[3]]}的第${v[4] + 1}和${k[4] + 1}项时间重复`);
			// 				} else {
			// 					message.warn(`${title[v[2]]}的${title2[v[3]]}的第${v[4] + 1}和${title2[k[3]]}的${k[4] + 1}项时间重复`);
			// 				}
			// 				flag = false;
			// 			}
			// 		}
			// 	});
			// });
		}
	});

	// day.forEach((item, index) => {
	// 	day.forEach((item2, index2) => {
	// 		if (index2 > index) {
	// 			if (!(item[1].isBefore(item2[0]) || item[0].isAfter(item2[1]))) {
	// 				message.warn(`${title[index]}的时间与${title[index2]}的时间有重叠`);
	// 				flag = false;
	// 			}
	// 		}
	// 	});
	// });

	if (flag) {
		axios.post<ResourceCalendarSchedule>('/resource/calendar/schedule', data.value).then((res) => {
			data.value = res.data;
			message.success('保存成功');
		});
	}
};

const handleExport = () => {
	axios
		.get<string>('/resource/calendar/schedule/exportCalendarSchedule', {
			params: { reportId: params.reportId, type: 2 },
		})
		.then((res) => {
			download(res.data);
		});
};
</script>

<template>
	<a-card size="small" style="height: calc(100vh - 200px)">
		<template #title>
			作息时间方案：
			<a-radio-group v-model:value="planNumber" name="radioGroup" :disabled="isDisable">
				<a-radio :value="1">一套</a-radio>
				<a-radio :value="2">二套</a-radio>
				<a-radio :value="3">三套</a-radio>
				<a-radio :value="4">四套</a-radio>
			</a-radio-group>
		</template>
		<template #extra>
			<a-button type="primary" @click="handleSave" v-if="params.type === 'edit'">保存</a-button>
			<a-button type="primary" v-if="params.type === 'preview'" @click="handleExport">导出</a-button>
		</template>
		<div v-if="data" style="height: calc(100vh - 262px)" class="px-4 space-y-4 overflow-y-auto">
			<template v-for="item in planNumber">
				<div class="text-lg leading-8 font-semibold">{{ title[item - 1] }}</div>
				<div class="flex leading-8 gap-4">
					方案名称
					<a-input v-model:value="data.timePlanData[item - 1].name" class="w-40" :disabled="isDisable" /> 方案启用时间
					<a-range-picker
						class="w-80"
						v-model:value="date[item - 1]"
						@change="handleDateChange(item - 1)"
						:disabled="isDisable"
					/>
				</div>
				<table class="w-full">
					<thead>
						<tr>
							<td>时段</td>
							<td>排课标记</td>
							<td>课节/事项安排</td>
							<td>开始时间</td>
							<td>结束时间</td>
							<td>操作</td>
						</tr>
					</thead>
					<tbody>
						<template v-for="dayPartType in [1, 2, 3, 4, 5]">
							<tr>
								<td
									:rowspan="
										1 +
										data.timePlanData[item - 1].dayPartDataList.find((l) => l.dayPartType === dayPartType)?.timeSlotData
											.length!
									"
								>
									{{ title2[dayPartType - 1] }}
								</td>
								<td
									v-if="
										!data.timePlanData[item - 1].dayPartDataList.find((l) => l.dayPartType === dayPartType)
											?.timeSlotData.length
									"
									colspan="5"
								>
									<a-button
										v-if="params.type === 'edit'"
										type="dashed"
										block
										@click="
											data.timePlanData[item - 1].dayPartDataList
												.find((l) => l.dayPartType === dayPartType)
												?.timeSlotData.push({
													sort: 0,
													id: snowyflake.nextId().toString(),
													timeSlotName: '',
													startTime: '',
													endTime: '',
													courseFlag: true,
												})
										"
									>
										<i class="bi bi-plus-lg"></i>
									</a-button>
								</td>
								<template v-else>
									<td>
										<a-switch
											:disabled="isDisable"
											:checked="getTimeCourseFlag(item - 1, dayPartType, 0)"
											@change="
												(value: boolean | number | string, _e: Event) => {
													setTimeCourseFlag(item - 1, dayPartType, 0, !!value);
												}
											"
										/>
									</td>
									<td>
										<input
											:value="getTimeSlotName(item - 1, dayPartType, 0)"
											@input="setTimeSlotName(item - 1, dayPartType, 0, ($event.target as HTMLInputElement).value)"
											class="w-full bg-transparent outline-none text-center"
											placeholder="在此处输入课节/事项安排"
											:disabled="isDisable"
										/>
									</td>
									<td>
										<input
											:disabled="isDisable"
											placeholder="选择开始时间"
											type="time"
											:value="getTimeSlotStartTime(item - 1, dayPartType, 0)"
											@input="setTimeSlotStartTime(item - 1, dayPartType, 0, ($event.target as HTMLInputElement).value)"
										/>
									</td>
									<td>
										<input
											:disabled="isDisable"
											placeholder="选择结束时间"
											type="time"
											:value="getTimeSlotEndTime(item - 1, dayPartType, 0)"
											@input="setTimeSlotEndTime(item - 1, dayPartType, 0, ($event.target as HTMLInputElement).value)"
										/>
									</td>
									<td>
										<a-button type="link" danger :disabled="isDisable" @click="removeTimeSlot(item - 1, dayPartType, 0)"
											>删除</a-button
										>
									</td>
								</template>
							</tr>
							<template
								v-if="
									data.timePlanData[item - 1].dayPartDataList.find((l) => l.dayPartType === dayPartType)?.timeSlotData
										.length
								"
							>
								<template
									v-for="(_v, i) in data.timePlanData[item - 1].dayPartDataList.find(
										(l) => l.dayPartType === dayPartType,
									)?.timeSlotData"
								>
									<tr v-if="i !== 0">
										<td>
											<a-switch
												:disabled="isDisable"
												:checked="getTimeCourseFlag(item - 1, dayPartType, i)"
												@change="
													(value: boolean | number | string, _e: Event) => {
														setTimeCourseFlag(item - 1, dayPartType, i, !!value);
													}
												"
											/>
										</td>
										<td>
											<input
												:disabled="isDisable"
												:value="getTimeSlotName(item - 1, dayPartType, i)"
												@input="setTimeSlotName(item - 1, dayPartType, i, ($event.target as HTMLInputElement).value)"
												class="w-full bg-transparent outline-none text-center"
												placeholder="在此处输入课节/事项安排"
											/>
										</td>
										<td>
											<input
												:disabled="isDisable"
												placeholder="选择结束时间"
												type="time"
												:value="getTimeSlotStartTime(item - 1, dayPartType, i)"
												@input="
													setTimeSlotStartTime(item - 1, dayPartType, i, ($event.target as HTMLInputElement).value)
												"
											/>
										</td>
										<td>
											<input
												:disabled="isDisable"
												placeholder="选择结束时间"
												type="time"
												:value="getTimeSlotEndTime(item - 1, dayPartType, i)"
												@input="setTimeSlotEndTime(item - 1, dayPartType, i, ($event.target as HTMLInputElement).value)"
											/>
										</td>
										<td>
											<a-button
												type="link"
												danger
												:disabled="isDisable"
												@click="removeTimeSlot(item - 1, dayPartType, i)"
												>删除</a-button
											>
										</td>
									</tr>
								</template>
								<tr>
									<td colspan="5" v-if="params.type === 'edit'">
										<a-button
											type="dashed"
											block
											@click="
												data.timePlanData[item - 1].dayPartDataList
													.find((l) => l.dayPartType === dayPartType)
													?.timeSlotData.push({
														sort: 0,
														id: snowyflake.nextId().toString(),
														timeSlotName: '',
														startTime: '',
														endTime: '',
														courseFlag: true,
													})
											"
										>
											<i class="bi bi-plus-lg"></i>
										</a-button>
									</td>
								</tr>
							</template>
						</template>
					</tbody>
				</table>
			</template>
		</div>
	</a-card>
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
</style>
