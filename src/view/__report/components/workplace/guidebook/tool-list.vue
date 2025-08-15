<script setup lang="ts">
import { ReportEditStatus, ReportMenuCourse } from '@/view/__report';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';
import useAxios from '@/axios';
import { message } from 'ant-design-vue';
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useRouterParams from '@/hooks/useRouterParams';

const { appTheme } = useAppTheme();
const params = useRouterParams<{ type: 'edit' | 'audit' }>();
const borderColor = computed(() => {
	return appTheme.value === 'white' ? '#b4d3ff' : '#1F253E';
});

const cardDisableColor = computed(() => {
	return appTheme.value === 'white' ? '#d9e8ff' : '#283560';
});
const data = defineModel<ReportMenuCourse>('data', { required: true });
const save = defineModel<boolean>('save', { required: true });

const form = computed(() => data.value.tableFormData[1].data);
const totalTime = computed(() =>  data.value.tableFormData[0].data.totalTime);

const { reportInfo } = useReportInfo();
const handleRemove = (index: number) => {
	data.value.tableFormData[1].data.materialToolsDetails.splice(index, 1);
};

const axios = useAxios();
const handleSaveContent = () => {
	data.value.tableFormData[1].editedFlag = true;
	axios
		.put('/report/course/updateMenuCourseData', { ...data.value, tableFormData: [data.value.tableFormData[1]] })
		.then(() => {
			data.value.tableFormData[1].auditRecordData = null;
			message.success('保存成功');
		});
};

watch(
	() => save.value,
	() => {
		if (save.value) {
			handleSaveContent();
		}
	},
);
</script>

<template>
	<table class="w-full table-fixed">
		<tbody>
			<tr>
				<td colspan="12" class="table-title text-center">材料工具清单</td>
			</tr>
			<tr>
				<td colspan="3" class="table-title text-center">学习场名称</td>
				<td colspan="9" class="table-title text-center">{{ form.studyName }}</td>
			</tr>
			<tr>
				<td colspan="3" class="table-title text-center">学习情境名称</td>
				<td colspan="9" class="table-title text-center">{{ form.contextName }}</td>
			</tr>
			<tr>
				<td colspan="3" class="table-title text-center">学习任务名称</td>
				<td colspan="3" class="table-title text-center">{{ form.taskName }}</td>
				<td colspan="3" class="table-title text-center">学时</td>
				<td colspan="3" class="table-title text-center">{{ totalTime }}学时</td>
			</tr>
			<tr>
				<td class="table-title text-center font-mono">序号</td>
				<td colspan="2" class="table-title text-center">名称</td>
				<td colspan="2" class="table-title text-center">作用</td>
				<td colspan="2" class="table-title text-center">数量</td>
				<td colspan="2" class="table-title text-center">型号</td>
				<td class="table-title text-center">使用量</td>
				<td colspan="2" class="table-title text-center">使用者</td>
			</tr>
			<template v-for="(item, index) in form.materialToolsDetails">
				<tr class="group">
					<td class="text-center font-mono">
						{{ index + 1 }}
					</td>
					<td colspan="2">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input
								v-model="item.name"
								class="outline-none bg-transparent w-full text-center"
								placeholder="材料名称"
							/>
						</template>
						<template v-else>{{ item.name }}</template>
					</td>
					<td colspan="2" class="text-center">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input
								v-model="item.function"
								class="outline-none bg-transparent w-full text-center"
								placeholder="作用"
							/>
						</template>
						<template v-else>{{ item.function }}</template>
					</td>
					<td colspan="2" class="text-center">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input v-model="item.number" class="outline-none bg-transparent w-full text-center" placeholder="数量" />
						</template>
						<template v-else>{{ item.number }}</template>
					</td>
					<td colspan="2" class="text-center">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input v-model="item.model" class="outline-none bg-transparent w-full text-center" placeholder="型号" />
						</template>
						<template v-else>{{ item.model }}</template>
					</td>
					<td class="text-center">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<input v-model="item.used" class="outline-none bg-transparent w-full text-center" placeholder="使用量" />
						</template>
						<template v-else>{{ item.used }}</template>
					</td>
					<td colspan="2">
						<template v-if="ReportEditStatus.includes(reportInfo.reportStatus)">
							<div class="flex">
								<input
									v-model="item.user"
									class="outline-none bg-transparent w-full text-center"
									placeholder="使用者"
								/>
								<a-button type="link" class="px-1" @click="handleRemove(index)">
									<delete-red-svg></delete-red-svg>
								</a-button>
							</div>
						</template>
						<template v-else>{{ item.user }}</template>
					</td>
				</tr>
			</template>
			<tr v-if="params.type === 'edit'">
				<td colspan="12">
					<a-button
						size="small"
						type="link"
						block
						class="flex justify-center items-center py-4"
						@click="
							form.materialToolsDetails.push({ name: '', function: '', number: '', model: '', used: '', user: '' })
						"
					>
						<add-blue-svg></add-blue-svg>添加一项
					</a-button>
				</td>
			</tr>
		</tbody>
	</table>
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
