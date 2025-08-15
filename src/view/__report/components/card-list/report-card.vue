<script setup lang="ts">
import ReportCardDetail from './report-card-detail.vue';
import { message, Modal } from 'ant-design-vue';
import { MinusCircleOutlined, MinusCircleTwoTone, PlusCircleOutlined, PlusCircleTwoTone } from '@ant-design/icons-vue';
import { ReportField, ReportType, ReportUser, REPORT_TYPE, APPROVE_STATUS } from '@/view/__report';
import security from '@/utils/security.ts';
import { translationKey } from '@/utils/dictionary.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useAxios, { deleteReport, startEditReport, updateReportDisable, generateReport } from '@/axios';
import download from '@/utils/download.ts';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import useUserStore from '@/store/modules/useUserStore.ts';

const { dictionaryOption } = useDictionaryStore();
const { appTheme } = useAppTheme();

const { user } = useUserStore();
const router = useRouter();

const props = defineProps<{
	reportType: ReportType;
	pageType: 'edit' | 'audit' | 'preview';
	report: ReportField;
}>();

const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
const cardActionBgColor = computed(() => {
	return appTheme.value === 'white' ? '#FFF' : '#1F253E';
});
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

const toPathName = computed(() => {
	switch (props.reportType) {
		case REPORT_TYPE.SURVEY:
			return '/school/orientation/survey/workplace';
		case REPORT_TYPE.CULTIVATE:
			return '/school/orientation/cultivate/workplace';
		case REPORT_TYPE.STRUCTURE:
			return '/school/develop/structure/workplace';
		case REPORT_TYPE.STANDARD:
			return '/school/develop/standard/workplace';
		case REPORT_TYPE.TEXTBOOK:
			return '/school/develop/textbook/workplace';
		case REPORT_TYPE.GUIDEBOOK:
			return '/school/instruction/guidebook/workplace';
		case REPORT_TYPE.WORKBOOK:
			return '/school/instruction/guidebook/workbookworkplace';
		case REPORT_TYPE.CALENDAR:
			return '/school/resource/calendar/workplace';
		default:
			return '';
	}
});

const cardName = computed(() => {
	switch (props.reportType) {
		case REPORT_TYPE.SURVEY:
			return '企业调研报告';
		case REPORT_TYPE.CULTIVATE:
			return '人才培养方案';
		case REPORT_TYPE.STRUCTURE:
			return '课程结构';
		case REPORT_TYPE.STANDARD:
			return '课程标准';
		case REPORT_TYPE.TEXTBOOK:
			return '活页式教材';
		case REPORT_TYPE.GUIDEBOOK:
			return '教学用书';
		case REPORT_TYPE.CALENDAR:
			return '校历';
		default:
			return '其他报告';
	}
});

const handleShowBaseInfo = (id: string) => {
	if (props.report.status === 1) {
		emit('update');
		return;
	}
	pageState.reportId = id;
	pageState.visible = true;
};
const handleUpdateDisable = (report: ReportField) => {
	if (!report?.id) return;
	const { id: reportId, disable } = report;
	if (disable) {
		updateReportDisable(reportId).then(() => {
			message.success('启用成功!');
			emit('success');
		});
	} else {
		Modal.confirm({
			title: '停用',
			content: `该操作将对已选记录进行停用，停用后相关记录将不可选，确定操作吗？`,
			okText: '停用',
			cancelText: '取消',
			onOk() {
				updateReportDisable(reportId).then(() => {
					message.success(`停用成功！`);
					emit('success');
				});
			},
			onCancel() {
				return;
			},
		});
	}
};
const handleStartEdit = (id: string) => {
	Modal.confirm({
		title: '开始编辑',
		content:
			'开始编辑后，相关的专业关联、编辑人、审核人等基础信息均不可修改，同时开放所有编辑人员对具体内容的编辑授权。',
		onOk() {
			startEditReport(id).then(() => {
				props.report.status = 2;
			});
		},
	});
};
// 编辑、审核、查看
const handleToReport = (reportId: string, type: 'edit' | 'audit' | 'preview') => {
	if (!reportId || !toPathName.value) return;
	const query = security.base64(JSON.stringify({ reportId, type }));
	router.push({ path: toPathName.value, query: { v: query } });
};

const handleGenerateReport = (id: string) => {
	generateReport(id).then(() => {
		message.success('生成成功!');
		emit('success');
	});
};

const onCopy = (reportId: string) => {
	Modal.info({
		title: '复制',
		content: `将对已选报告信息进行复制，复制后可以更改学年、编辑成员、审核人员以及调研详情等部分信息，请根据实际情景进行操作。`,
		onOk() {
			emit('copy', reportId);
		},
	});
};

const onDelete = (reportId: string) => {
	Modal.confirm({
		title: '删除',
		content: `该操作将对选中报告进行删除，且不可恢复，确定操作吗？`,
		onOk() {
			deleteReport(reportId).then(() => {
				message.success('删除成功！');
				emit('success');
			});
		},
		onCancel() {
			return;
		},
	});
};

const axios = useAxios();
const handleExport = (type: number) => {
	axios
		.get('/resource/calendar/schedule/exportCalendarSchedule', { params: { reportId: props.report.id, type: type } })
		.then((res) => {
			download(res.data);
		});
};
</script>

<template>
	<a-card
		v-if="report"
		:bordered="false"
		:style="{ backgroundColor: `${cardBgColor}` }"
		class="min-w-[378px]"
		hoverable
		size="small"
	>
		<div class="flex h-[146px] gap-5">
			<a-image v-if="report.coverUrl" :width="109.5" :height="146" class="rounded-lg" :src="report.coverUrl" />
			<a-image v-else :width="109.5" :height="146" class="rounded-lg" src="/images/report/default3.png" />
			<div class="flex-1 h-full overflow-hidden">
				<div class="flex justify-between">
					<div>
						<a-tag :color="['', '#AF6DF3', '#0091FF', '#EC5156', '#F0AE43', '#68D1A5', '#899ECC'][report.status]">
							{{ ['未知状态', '草稿', '编辑中', '已驳回', '审核中', '已通过', '审核未通过'][report.status] }}
						</a-tag>
						<a-tag v-if="reportType !== 1 && reportType !== 9">
							{{
								translationKey(
									report.otherField[reportType === 2 ? 'learningModality' : 'courseNature'],
									dictionaryOption,
								)
							}}
						</a-tag>
						<span v-if="report.reportType === REPORT_TYPE.GUIDEBOOK && pageType === 'edit'">{{
							report.reportProgress
						}}</span>
					</div>
					<div>
						<a-space>
							<template
								v-if="report.status === APPROVE_STATUS.APPROVED && router.currentRoute.value.path.endsWith('edit')"
							>
								<div @mouseleave="pageState.isCopyHovering = false" @mousemove="pageState.isCopyHovering = true">
									<a-tooltip v-if="pageState.isCopyHovering" color="blue" title="复制">
										<PlusCircleTwoTone @click="onCopy(report.id)" />
									</a-tooltip>
									<PlusCircleOutlined v-else />
								</div>
							</template>
							<template
								v-else-if="
									report.status === APPROVE_STATUS.DRAFT || (report.status === APPROVE_STATUS.EDITING && report.disable)
								"
							>
								<div @mouseleave="pageState.isDeleteHovering = false" @mousemove="pageState.isDeleteHovering = true">
									<a-tooltip v-if="pageState.isDeleteHovering" color="red" title="删除">
										<MinusCircleTwoTone @click="onDelete(report.id)" />
									</a-tooltip>
									<MinusCircleOutlined v-else />
								</div>
							</template>
						</a-space>
					</div>
				</div>
				<div class="leading-8 font-bold text-base truncate">
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
							<span class="card-description">{{ report.majorData?.label }}({{ report.majorData?.value }})</span>
						</div>
					</template>
					<!-- 人才培养方案 -->
					<template v-if="reportType === REPORT_TYPE.CULTIVATE">
						<div class="leading-6 truncate">
							<div class="inline-block w-20">招生对象:</div>
							<span class="card-description">
								{{ translationKey(report.otherField.enrollmentTarget, dictionaryOption) }}
							</span>
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
							<span class="card-description">{{ report.majorData?.label }}({{ report.majorData?.value }})</span>
						</div>
					</template>
					<!-- 课程开发 -->
					<template
						v-if="
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
							<span class="card-description">{{ report.majorData?.label }}({{ report.majorData?.value }})</span>
						</div>
					</template>
					<!-- 校历-->
					<template v-if="reportType === REPORT_TYPE.CALENDAR">
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
				<template v-if="reportType === REPORT_TYPE.WORKBOOK">
					<a-button type="link" @click="handleToReport(report.id, 'preview')">查看学习用书</a-button>
				</template>
				<template v-else>
					<a-button size="small" type="link" @click="handleShowBaseInfo(report.id)">基础信息</a-button>
					<a-button
						v-if="![1, 6].includes(report.status)"
						size="small"
						type="link"
						@click="handleUpdateDisable(report)"
					>
						{{ report.disable ? '启用' : '停用' }}
					</a-button>
					<a-button
						:disabled="user?.id !== report.createBy && user?.id !== report.submitUserId"
						size="small"
						type="link"
						v-if="report.status === 1"
						@click="handleStartEdit(report.id)"
					>
						开始编辑
					</a-button>
					<a-button
						type="link"
						size="small"
						v-if="[2, 3].includes(report.status!) && router.currentRoute.value.path.endsWith('edit')"
						:disabled="!report.reportEditorData.some((item: ReportUser) => item.userId === user!.id)"
						@click="handleToReport(report.id, 'edit')"
					>
						编辑{{ cardName }}
					</a-button>
					<a-button
						v-if="report.status === 4 && pageType === 'audit'"
						type="link"
						size="small"
						@click="handleToReport(report.id, 'audit')"
					>
						审核{{ cardName }}
					</a-button>
					<a-button
						type="link"
						size="small"
						v-if="!(report.status === 4 && pageType === 'audit') && [4, 5, 6].includes(report.status!)"
						@click="handleToReport(report.id, 'preview')"
					>
						查看{{ cardName }}
					</a-button>
					<template
							v-if="
								report.status === 5 &&
								[3].includes(report.reportType) &&
								report.reportType !== REPORT_TYPE.CALENDAR
							"
						>
							<a-button v-if="!report.wordFileId" type="link" size="small" @click="handleGenerateReport(report.id)">
								生成报告
							</a-button>
							<a-button v-else size="small" type="link" @click="$download(report.wordFileId)">下载报告</a-button>
						</template>
					<template v-if="report.reportType === REPORT_TYPE.CALENDAR">
						<a-dropdown>
							<a-button type="link" size="small" v-if="report.status === 5">导出</a-button>
							<template #overlay>
								<a-menu>
									<a-menu-item @click="handleExport(1)">教职工作息安排</a-menu-item>
									<a-menu-item @click="handleExport(2)">学生作息安排</a-menu-item>
								</a-menu>
							</template>
						</a-dropdown>
					</template>
				</template>
			</div>
		</template>
	</a-card>
	<report-card-detail
		v-if="pageState.visible"
		v-model:open="pageState.visible"
		:report-id="pageState.reportId"
		:report-type="reportType"
		@success="emit('success')"
	/>
</template>

<style scoped>
:deep(.ant-card-actions) {
	background-color: v-bind(cardActionBgColor) !important;
}
</style>
