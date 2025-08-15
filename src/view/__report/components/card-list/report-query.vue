<script setup lang="ts">
import { QueryReportCardParams, ReportType, useReportStatusOption } from '@/view/__report';
import datetime from '@/utils/datetime.ts';
import { FormInstance } from 'ant-design-vue/es/form';
import MBreadcrumb from '@/components/m-breadcrumb.vue';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import { DICTIONARY_TYPE } from '@/utils/dictionary';
import { getReportDropOptions } from '@/axios';

const { dictionaryOption } = useDictionaryStore();

const props = defineProps<{
	reportType: ReportType;
	params: QueryReportCardParams;
}>();
const emits = defineEmits(['select']);
const labelCol = { style: { width: '70px' } };
onMounted(() => {
	fetchQueryList();
});

const options = ref<{
	domains: Array<Option>;
	years: Array<Option>;
	relationReport: Array<Option>;
}>({
	years: [],
	domains: [],
	relationReport: [],
});

const date = ref<[string, string] | undefined>();

const handleSelectedDateChange = () => {
	if (date.value) {
		props.params.startTime = datetime.dateStartTime(date.value[0]);
		props.params.endTime = datetime.dateEndTime(date.value[1]);
	} else {
		props.params.startTime = undefined;
		props.params.endTime = undefined;
	}
};
const form = ref<FormInstance>();
const handleReset = () => {
	date.value = ['', ''];
	form.value?.resetFields();
	emits('select');
};

const fetchQueryList = () => {
	getReportDropOptions(props.params.pageType, props.reportType).then((res) => {
		options.value.domains = res.domains.map((item) => ({ label: item.domainName, value: item.domainId }));
		options.value.years = res.years.map((item) => ({ label: `${item}学年`, value: item }));
	});
};

defineExpose({
	fetchQueryList,
});
</script>

<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form ref="form" :model="params" class="w-full" :label-col="labelCol">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item label="创建日期" name="startTime">
					<a-range-picker class="w-full" @change="handleSelectedDateChange" v-model:value="date" />
				</a-form-item>
				<a-form-item label="报告名称" name="name">
					<a-input v-model:value="params.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item label="学年" name="currentYear">
					<a-select v-model:value="params.currentYear" :options="options.years" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item label="专业" name="domainId">
					<a-select v-model:value="params.domainId" :options="options.domains" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item label="审核状态" name="status">
					<a-select
						v-model:value="params.status"
						allow-clear
						:options="useReportStatusOption(params.pageType)"
						placeholder="请选择"
					></a-select>
				</a-form-item>
				<template v-if="reportType === 1">
					<a-form-item label="所属行业" name="industryName">
						<a-input v-model:value="params.industryName" placeholder="请输入" />
					</a-form-item>
					<a-form-item></a-form-item>
					<a-form-item class="text-right">
						<a-button class="mr-4" @click="handleReset">重置</a-button>
						<a-button type="primary" @click="emits('select')">查询</a-button>
					</a-form-item>
				</template>
				<template v-else-if="reportType === 2 && dictionaryOption">
					<a-form-item label="关联报告" name="relationReportId">
						<a-select v-model:value="params.relationReportId" :options="options.relationReport" placeholder="请选择" />
					</a-form-item>
					<a-form-item label="学历" name="qualification">
						<a-select
							v-model:value="params.qualification"
							:options="dictionaryOption[DICTIONARY_TYPE.QUALIFICATION]"
							placeholder="请选择"
						/>
					</a-form-item>
					<a-form-item label="学制" name="grade">
						<a-select
							v-model:value="params.grade"
							:options="dictionaryOption[DICTIONARY_TYPE.GRADE]"
							placeholder="请选择"
						/>
					</a-form-item>
					<a-form-item label="招生对象" name="enrollmentTarget">
						<a-select
							v-model:value="params.enrollmentTarget"
							:options="dictionaryOption[DICTIONARY_TYPE.ENROLLMENT_TARGET]"
							placeholder="请选择"
						/>
					</a-form-item>
					<a-form-item label="学习形式" name="learningModality">
						<a-select
							v-model:value="params.learningModality"
							:options="dictionaryOption[DICTIONARY_TYPE.LEARNING_MODALITY]"
							placeholder="请选择"
						/>
					</a-form-item>
					<a-form-item></a-form-item>
					<a-form-item class="text-right">
						<a-button class="mr-4" @click="handleReset">重置</a-button>
						<a-button type="primary" @click="emits('select')">查询</a-button>
					</a-form-item>
				</template>
				<template v-else-if="[3, 4, 5].includes(reportType)">
					<a-form-item label="关联报告" name="relationReportId">
						<a-select v-model:value="params.relationReportId" :options="options.relationReport" placeholder="请选择" />
					</a-form-item>
					<a-form-item label="课程名称" name="courseName">
						<a-input v-model:value="params.courseName" allow-clear placeholder="请输入"></a-input>
					</a-form-item>
					<template v-if="dictionaryOption">
						<a-form-item label="课程类型" name="courseType">
							<a-select
								v-model:value="params.courseType"
								allow-clear
								:options="dictionaryOption[DICTIONARY_TYPE.COURSE_TYPE]"
								placeholder="请选择"
							></a-select>
						</a-form-item>
						<a-form-item label="课程性质" name="courseNature">
							<a-select
								v-model:value="params.courseNature"
								allow-clear
								:options="dictionaryOption[DICTIONARY_TYPE.COURSE_NATURE]"
								placeholder="请选择"
							></a-select>
						</a-form-item>
						<a-form-item></a-form-item>
						<a-form-item></a-form-item>
						<a-form-item class="text-right">
							<a-button class="mr-4" @click="handleReset">重置</a-button>
							<a-button type="primary" @click="emits('select')">查询</a-button>
						</a-form-item>
					</template>
				</template>
				<template v-else>
					<a-form-item></a-form-item>
					<a-form-item></a-form-item>
					<a-form-item class="text-right">
						<a-button class="mr-4" @click="handleReset">重置</a-button>
						<a-button type="primary" @click="emits('select')">查询</a-button>
					</a-form-item>
				</template>
			</div>
		</a-form>
	</a-card>
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
