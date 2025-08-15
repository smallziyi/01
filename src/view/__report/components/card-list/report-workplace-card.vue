<script setup lang="ts">
import ReportCardDetail from './report-card-detail.vue';
import { ReportType, ReportField, REPORT_TYPE } from '@/view/__report';
import ReportApprovalRecord from '@/view/__report/components/workplace/report-approval-record.vue';
import treeDrawer from '@/view/__report/components/structure-tree/tree-drawer.vue';
import { translationKey } from '@/utils/dictionary';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';

const { dictionaryOption } = useDictionaryStore();

const { appTheme } = useAppTheme();

const props = defineProps<{
	reportType: ReportType;
	report: ReportField;
}>();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
const cardActionBgColor = computed(() => {
	return appTheme.value === 'white' ? '#FFF' : '#1F253E';
});
const open = ref<boolean>(false);
const drawerType = ref<'edit' | 'view'>('edit');
const emit = defineEmits(['copy', 'update', 'success']);
const pageState = reactive<{
	isCopyHovering: boolean;
	isDeleteHovering: boolean;
	reportId: string;
	visible: boolean;
}>({
	isCopyHovering: false,
	isDeleteHovering: false,
	reportId: '',
	visible: false,
});
const openRecord = ref<boolean>(false);
const uploadTree = () => {
	drawerType.value = 'edit';
	open.value = true;
};

const viewTree = () => {
	drawerType.value = 'view';
	open.value = true;
};

const handleShowBaseInfo = (id: string) => {
	if (props.report.status === 1) {
		emit('update');
		return;
	}
	pageState.reportId = id;
	pageState.visible = true;
};
</script>

<template>
	<a-card
		v-if="report"
		:bordered="false"
		:style="{ 'background-color': `${cardBgColor}` }"
		class="min-w-[378px]"
		size="small"
	>
		<div class="flex h-[146px] gap-5">
			<a-image v-if="report.coverUrl" :height="146" :src="report.coverUrl" :width="109.5" class="rounded-lg" />
			<a-image v-else :height="146" :width="109.5" class="rounded-lg" src="/images/report/default3.png" />
			<div class="flex-1 h-full overflow-hidden">
				<div class="flex justify-between">
					<div>
						<a-tag :color="['', '#AF6DF3', '#0091FF', '#EC5156', '#F0AE43', '#68D1A5', '#899ECC'][report.status]">
							{{ ['未知状态', '草稿', '编辑中', '已驳回', '审核中', '已通过', '审核未通过'][report.status] }}
						</a-tag>
						<a-tag v-if="![REPORT_TYPE.SURVEY, REPORT_TYPE.CALENDAR].includes(reportType)">
							{{
								translationKey(
									report.otherField[reportType === REPORT_TYPE.CULTIVATE ? 'learningModality' : 'courseNature'],
									dictionaryOption,
								)
							}}
						</a-tag>
					</div>
				</div>
				<div class="leading-8 font-bold text-base">
					{{ report.name }}
				</div>
				<div>
					<!-- 企业调研 -->
					<template v-if="reportType === REPORT_TYPE.SURVEY">
						<div class="leading-6 truncate">
							<div class="inline-block w-20">所属行业:</div>
							<span class="card-description">{{ report.otherField.industryName }}</span>
						</div>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">专业方向:</div>
							<span class="card-description">{{ report.majorDetails.target }}</span>
						</div>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">专业信息:</div>
							<span class="card-description">{{ report.majorData.label }}({{ report.majorData.value }})</span>
						</div>
					</template>
					<!-- 人才培养方案 -->
					<template v-else-if="reportType === REPORT_TYPE.CULTIVATE">
						<div class="leading-6 truncate">
							<div class="inline-block w-20">招生对象:</div>
							<span class="card-description">{{
								translationKey(report.otherField.enrollmentTarget, dictionaryOption)
							}}</span>
						</div>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">学制学历:</div>
							<span class="card-description">
								{{ translationKey(report.otherField.qualification, dictionaryOption) }}({{
									translationKey(report.otherField.grade, dictionaryOption)
								}})
							</span>
						</div>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">专业信息:</div>
							<span class="card-description">{{ report.majorData.label }}({{ report.majorData.value }})</span>
						</div>
					</template>
					<!-- 课程开发 -->
					<template
						v-else-if="
							[
								REPORT_TYPE.STRUCTURE,
								REPORT_TYPE.STANDARD,
								REPORT_TYPE.TEXTBOOK,
								REPORT_TYPE.GUIDEBOOK,
								REPORT_TYPE.WORKBOOK,
							].includes(reportType)
						"
					>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">课程名称:</div>
							<span class="card-description">{{ report.otherField.courseName }}</span>
						</div>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">课程类型:</div>
							<span class="card-description">{{ translationKey(report.otherField.courseType, dictionaryOption) }}</span>
						</div>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">专业信息:</div>
							<span class="card-description">{{ report.majorData.label }}({{ report.majorData.value }})</span>
						</div>
					</template>
					<!-- 教学实施 -->
					<template v-else-if="reportType === REPORT_TYPE.CALENDAR">
						<div class="leading-6 truncate">
							<div class="inline-block w-20">当前学年:</div>
							<span class="card-description">{{ report.currentYear }}年</span>
						</div>
						<div class="leading-6 truncate">
							<div class="inline-block w-20">专业数量:</div>
							<span class="card-description">{{ report.otherField.domainIds?.length }}个</span>
						</div>
						<!-- <div class="leading-6 truncate">
							<div class="inline-block w-20">学周学时:</div>
							<span class="card-description"></span>
						</div> -->
					</template>
					<div class="leading-6 truncate">
						<div class="inline-block w-20">创建时间:</div>
						<span class="card-description">
							<a-tooltip>
								<template #title>
									<div class="">计划开始时间: {{ $datetime.format(report.startTime as string, 'date') }}</div>
									<div class="">计划完成时间: {{ $datetime.format(report.endTime as string, 'date') }}</div>
								</template>
								{{ $datetime.format(report.createTime, 'date') }}
							</a-tooltip>
						</span>
					</div>
				</div>
			</div>
		</div>
		<template #actions>
			<div class="flex justify-end mr-4">
				<a-button size="small" type="link" @click="handleShowBaseInfo(report.id)">查看基础信息</a-button>
				<template v-if="[1, 2].includes(report.reportType)">
					<a-button
						v-if="[2, 3].includes(report.status)"
						class="flex items-center"
						size="small"
						type="link"
						@click="uploadTree"
						>查看结构树
					</a-button>
					<a-button
						v-if="[4, 5, 6].includes(report.status)"
						class="flex items-center"
						size="small"
						type="link"
						@click="viewTree"
						>查看结构树
					</a-button>
				</template>
				<a-button size="small" type="link" @click="openRecord = true">查看审核记录</a-button>
			</div>
		</template>
	</a-card>
	<report-card-detail
		v-if="pageState.visible"
		v-model:open="pageState.visible"
		:report-id="pageState.reportId"
		:report-type="reportType"
	/>
	<treeDrawer v-if="open" v-model="open" :relation-report-id="report.relationReportId" :type="drawerType" />
	<report-approval-record
		v-if="openRecord"
		v-model:open="openRecord"
		:max-score="report.score"
		:report-id="report.id"
	/>
</template>

<style scoped>
:deep(.ant-card-actions) {
	background-color: v-bind(cardActionBgColor) !important;
}
</style>
