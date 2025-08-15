<script setup lang="ts">
import {
	columnsAudit,
	columnsEdit,
	initReportAll,
	REPORT_TYPE,
	ReportField,
	ReportType,
	ReportUser,
} from '@/view/__report';
import { translationKey } from '@/utils/dictionary';
import { Domain } from '@/view/admin/domain/config.ts';
import CloseSvg from '@/assets/icons/close.svg';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import { getReportInfo } from '@/axios';
import { PlusOutlined } from '@ant-design/icons-vue';
import { UploadChangeParam, UploadFile } from 'ant-design-vue/es/upload/interface';
import { updateReportCover } from '@/axios';
import { message } from 'ant-design-vue';

const { dictionaryOption } = useDictionaryStore();
const props = defineProps<{
	reportId: string;
	reportType: ReportType;
}>();

const emit = defineEmits(['success']);
const fileList = ref<any[]>([]);
const token = sessionStorage.getItem('jwt');
const open = defineModel('open', { type: Boolean, required: true });
const report = ref<ReportField>(initReportAll(props.reportType));
interface CreateTypeMap {
	[key: number]: { [key: number]: string };
}
const createTypeMap: CreateTypeMap = {
	1: {
		1: '已开设专业',
		2: '根据企业调研',
		3: '根据人才培养方案',
		4: '根据课程标准',
		5: '根据课程结构',
		6: '根据活页教材',
	},
	2: {
		1: '新专业',
		2: '独立创建',
	},
};
const createType = computed(() => {
	const reportCreateType = report.value.createType as number;
	const reportType = props.reportType;
	return createTypeMap[reportCreateType]?.[reportType] || createTypeMap[reportCreateType][2];
});
const domainData = ref();
const majorColumns = [
	{ key: 'serial', dataIndex: 'serial', title: '序号', width: 60 },
	{ key: 'collegeNameArray', dataIndex: 'collegeNameArray', title: '所属院系', rowSpan: 2 },
	{ key: 'bigCategoryCode', dataIndex: 'bigCategoryCode', title: '专业大类编码' },
	{ key: 'bigCategoryName', dataIndex: 'bigCategoryName', title: '专业大类', ellipsis: true },
	{ key: 'categoryCode', dataIndex: 'categoryCode', title: '专业类编码' },
	{ key: 'categoryName', dataIndex: 'categoryName', title: '专业类', ellipsis: true },
	{ key: 'domainCode', dataIndex: 'domainCode', title: '专业编码' },
	{ key: 'domainName', dataIndex: 'domainName', title: '专业名称', ellipsis: true },
];

const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
	if (info.fileList.length > 0 && info.fileList[0].xhr) {
		const file = JSON.parse(info.fileList[0].xhr.response) as IFile;
		report.value.coverId = file.id;
		updateReportCover(props.reportId, file.id).then(() => {
			message.success('上传成功！');
			emit('success');
		});
	}
};
const handleRemoveImg = () => {
	report.value.coverId = undefined;
};

const previewVisible = ref(false);
const previewImage = ref('');

const handleCancelPreview = () => {
	previewVisible.value = false;
};

const handlePreview = async () => {
	previewImage.value = fileList.value[0]?.response?.url || fileList.value[0]?.url;
	previewVisible.value = true;
};

onMounted(() => {
	getReportInfo<ReportField>(props.reportId).then((res) => {
		report.value = res;
		if (props.reportType === REPORT_TYPE.CALENDAR && res.otherField.domainList) {
			domainData.value = res.otherField.domainList.map((item) => {
				return item.domainMajorDataList.map((domain) => {
					const { code: bigCategoryCode, name: bigCategoryName } = domain[1] || { code: '', name: '' };
					const { code: categoryCode, name: categoryName } = domain[2] || { code: '', name: '' };
					const { code: domainCode, name: domainName } = domain[3] || { code: '', name: '' };
					return {
						collegeNameArray: item.collegeNameArray,
						bigCategoryCode,
						bigCategoryName,
						categoryCode,
						categoryName,
						domainCode,
						domainName,
					};
				});
			});
			domainData.value = domainData.value.flat();
		}
		if (res.coverId && res.coverUrl) {
				fileList.value = [{
					uid: res.coverId,
					name: res.coverUrl,
					status: 'done',
					url: res.coverUrl,
				}];
		} else {
			fileList.value = [];
		}
	});
});
</script>

<template>
	<a-drawer :closable="false" v-model:open="open" destroy-on-close width="864" @close="open = false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看调研详情</div>
				<a-button type="link" @click="open = false">
					<template #icon>
						<close-svg />
					</template>
				</a-button>
			</div>
		</template>
		<div class="drawer-title">基础信息</div>
		<div class="space-y-4">
			<a-descriptions :column="2" size="small">
				<a-descriptions-item label="报告名称">{{ report.name }}</a-descriptions-item>
				<a-descriptions-item></a-descriptions-item>
				<template v-if="reportType !== REPORT_TYPE.CALENDAR">
					<a-descriptions-item label="创建方式">{{ createType }}</a-descriptions-item>
					<a-descriptions-item v-if="report.createType === 1 && reportType !== 1" label="关联报告">
						{{ report.relationReportName }}
					</a-descriptions-item>
					<a-descriptions-item v-else></a-descriptions-item>
					<a-descriptions-item label="关联院系">{{ report.collegeData.label }}</a-descriptions-item>
					<a-descriptions-item label="关联学年">{{ report.currentYear }}学年</a-descriptions-item>
					<a-descriptions-item label="专业分类">{{ report.domainData.label }}</a-descriptions-item>
					<a-descriptions-item label="专业名称">{{ report.majorData.label }}</a-descriptions-item>
					<template v-if="reportType === 1">
						<a-descriptions-item label="专业代码">{{ report.majorData.value }}</a-descriptions-item>
						<a-descriptions-item label="培养方向">{{ report.majorDetails.target }}</a-descriptions-item>
						<a-descriptions-item label="所属行业">{{ report.otherField.industryName }}</a-descriptions-item>
						<a-descriptions-item label="行业代码">{{ report.otherField.industryCode }}</a-descriptions-item>
					</template>
					<template v-if="[2, 3, 4].includes(reportType)">
						<a-descriptions-item label="专业大类">{{ report.majorDetails.bigCategoryName }}</a-descriptions-item>
						<a-descriptions-item label="专业代码">{{ report.majorData.value }}</a-descriptions-item>
					</template>
					<template v-if="[2, 3].includes(reportType)">
						<a-descriptions-item label="招生对象">
							{{ translationKey(report.otherField.enrollmentTarget, dictionaryOption) }}
						</a-descriptions-item>
						<a-descriptions-item label="学制">
							{{ translationKey(report.otherField.grade, dictionaryOption) }}
						</a-descriptions-item>
						<a-descriptions-item label="学习形式">
							{{ translationKey(report.otherField.learningModality, dictionaryOption) }}
						</a-descriptions-item>
						<a-descriptions-item label="学历">
							{{ translationKey(report.otherField.qualification, dictionaryOption) }}
						</a-descriptions-item>
					</template>
					<template v-if="[4, 5].includes(reportType)">
						<a-descriptions-item label="课程名称">
							{{ report.otherField.courseName }}
						</a-descriptions-item>
						<a-descriptions-item label="课程类型">
							{{ translationKey(report.otherField.courseType, dictionaryOption) }}
						</a-descriptions-item>
						<a-descriptions-item label="课程性质">
							{{ translationKey(report.otherField.courseNature, dictionaryOption) }}
						</a-descriptions-item>
						<a-descriptions-item label="资格证书">
							{{ report.otherField.certificateName }}
						</a-descriptions-item>
						<a-descriptions-item label="证书等级">
							{{ translationKey(report.otherField.certificateLevel, dictionaryOption) }}
						</a-descriptions-item>
						<a-descriptions-item></a-descriptions-item>
					</template>
				</template>
				<a-descriptions-item label="开始时间">{{ $datetime.format(report?.startTime as string) }}</a-descriptions-item>
				<a-descriptions-item label="结束时间">{{ $datetime.format(report?.endTime as string) }}</a-descriptions-item>
				<a-descriptions-item label="描述信息" :span="2">{{ report?.description }}</a-descriptions-item>
				<a-descriptions-item label="封面图片">
					<img
						v-if="[5,6].includes(report.status)"
						:src="report?.coverUrl"
						style="width: 109.5px; height: 147px; border-radius: 8px"
						alt=""
					/>
					<a-upload
						v-else
						v-model:file-list="fileList"
						:action="`${$config.file}/upload`"
						:headers="{ authorization: token ?? '' }"
						list-type="picture-card"
						@change="handleFileChange"
						@remove="handleRemoveImg"
						@preview="handlePreview"
						accept=".png,.jpg,.jpeg,.svg,.bmp,.webp"
					>
						<div v-if="fileList.length < 1">
							<plus-outlined></plus-outlined>
							<div style="margin-top: 8px">点击上传</div>
						</div>
				</a-upload>
				<a-modal :open="previewVisible" title="图片预览" :footer="null" @cancel="handleCancelPreview">
					<img alt="example" style="width: 100%" :src="previewImage" />
				</a-modal>
				</a-descriptions-item>
			</a-descriptions>
			<template v-if="reportType === REPORT_TYPE.CALENDAR">
				<a-table
					size="small"
					bordered
					:columns="majorColumns"
					:data-source="domainData"
					:pagination="false"
					table-layout="fixed"
				>
					<template #emptyText>
						<m-empty />
					</template>
					<template #bodyCell="{ column, index }: TableRow<Domain>">
						<template v-if="column.key === 'serial'">
							<div>{{ index + 1 }}</div>
						</template>
					</template>
				</a-table>
			</template>
			<div class="drawer-title">编辑人设置</div>
			<a-table
				bordered
				size="small"
				:data-source="report.reportEditorData"
				:columns="columnsEdit.slice(0, -1)"
				:pagination="false"
			>
				<template #emptyText>
					<m-empty />
				</template>
				<template #title>编辑人列表</template>
				<template #bodyCell="{ column, record }: TableRow<ReportUser>">
					<template v-if="column.key === 'serial-number'">
						{{ report.reportEditorData.findIndex((item: ReportUser) => item.userId === record.userId) + 1 }}
					</template>
					<template v-if="column.key === 'leader'">
						<a-badge :status="record.userId === report.submitUserId ? 'success' : 'default'" />
						{{ record.userId === report.submitUserId ? '是' : '否' }}
					</template>
				</template>
			</a-table>
			<div class="drawer-title">审核人设置</div>
			<a-descriptions :column="2" size="small">
				<a-descriptions-item label="审核方式">
					{{ report?.auditingType === 1 ? '逐级审核' : report?.auditingType === 2 ? '平级审核' : '评分审核' }}
				</a-descriptions-item>
				<a-descriptions-item v-if="report.auditingType === 3" label="最高分值"
					>{{ report.score }}分
				</a-descriptions-item>
				<a-descriptions-item v-else></a-descriptions-item>
			</a-descriptions>
			<a-table
				bordered
				size="small"
				:data-source="report.reportAuditorData"
				:columns="columnsAudit.slice(0, -1)"
				:pagination="false"
			>
				<template #emptyText>
					<m-empty />
				</template>
				<template #title>审核人列表</template>
				<template #bodyCell="{ column, record }: TableRow<ReportUser>">
					<template v-if="column.key === 'serial-number'">
						{{ report.reportAuditorData.findIndex((item: ReportUser) => item.userId === record.userId) + 1 }}
					</template>
				</template>
			</a-table>
		</div>
	</a-drawer>
</template>
