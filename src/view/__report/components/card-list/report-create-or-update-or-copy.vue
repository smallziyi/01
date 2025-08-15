<script setup lang="ts">
import { FormInstance } from 'ant-design-vue/es/form';
import { LabelInValueType, RawValueType } from 'ant-design-vue/es/vc-select/Select';
import { PlusOutlined } from '@ant-design/icons-vue';
import { DefaultOptionType } from 'ant-design-vue/es/vc-cascader';
import {
	copyReport,
	createOrUpdateReport,
	getCertificateList,
	getCollegeOptions,
	getCourseList,
	getDomainsMajorOptionsByCollegeId,
	getDomainsOptionsByCollegeId,
	getReportInfo,
	reportDropdown,
} from '@/axios';
import { Domain } from '@/view/admin/domain/config.ts';
import { UploadFile } from 'ant-design-vue/es/upload/interface';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { message, Modal, RadioChangeEvent } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import UserSelect from '@/view/base/user/components/user-select.vue';
import CloseSvg from '@/assets/icons/close.svg';
import _ from 'lodash';
import {
	auditingTypeOption,
	columnsAudit,
	columnsEdit,
	DataOption,
	initReportAll,
	ReportField,
	ReportType,
	ReportUser,
} from '@/view/__report';
import dayjs from 'dayjs';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import { DICTIONARY_TYPE } from '@/utils/dictionary';
import useUserStore from '@/store/modules/useUserStore.ts';
import utc from 'dayjs/plugin/utc'; // 引入 utc 插件
dayjs.extend(utc); // 使用 utc 插件

const { dictionaryOption } = useDictionaryStore();
const appTheme = useAppTheme();

const open = defineModel('open', { type: Boolean, default: false, required: true });
const props = defineProps<{
	type: 'create' | 'update' | 'copy';
	id: string;
	reportType: ReportType;
}>();
const emit = defineEmits(['success']);
const form = ref<FormInstance>();
const formRef = ref<FormInstance>();
const { user } = useUserStore();
const report = ref<ReportField>(initReportAll(props.reportType));
const options = reactive<{
	dependence: Array<Option>;
	college: Option[];
	domain: Option[];
	industry: DataOption[];
	major: DataOption[];
	courseName: DataOption[];
	allCertificateNameList: DataOption[];
	certificateName: DataOption[];
}>({
	dependence: [],
	college: [],
	domain: [],
	industry: [],
	major: [],
	courseName: [],
	allCertificateNameList: [],
	certificateName: [],
});

const initReportId = ref<string>('');
const drawerTitle = computed(() => {
	switch (props.reportType) {
		case 1:
			return '企业调研报告';
		case 2:
			return '人才培养方案';
		case 3:
			return '课程结构';
		case 4:
			return '课程标准';
		case 5:
			return '活页式教材';
		case 6:
			return '教学用书';
	}
});

onMounted(() => {
	reportDropdown((props.reportType - 1) as ReportType).then((res) => {
		options.dependence = [...res];
	});
	getCollegeOptions().then((res) => {
		options.college = res;
	});
	// 获取职业资格证书下拉
	getCertificateList().then((res) => {
		options.allCertificateNameList = res.map((item) => ({ label: item.name, value: item.name }));
	});
	if (props.type === 'update') {
		getReportInfo<ReportField>(props.id).then((res) => {
			const { startTime, endTime, ...rest } = res;
			report.value = {
				...rest,
				startTime: dayjs.utc(res.startTime, 'YYYY-MM-DD HH:mm').local(),
				endTime: dayjs.utc(res.endTime, 'YYYY-MM-DD HH:mm').local(),
			};
			report.value.reportEditorData.forEach((item) => {
				if (item.userId === report.value.submitUserId) {
					item.isSubmitter = true;
				}
			});
			if (report.value.coverId && report.value.coverUrl) {
				fileList.value = [
					{
						uid: report.value.coverId,
						name: report.value.coverUrl,
						status: 'done',
						url: report.value.coverUrl,
					},
				];
			}
			getDomainsMajorOptionsByCollegeId(report.value.collegeData.value as string).then((res) => {
				options.domain = [];
				domainData.value = res;
				res.forEach((item) => {
					options.domain.push({
						value: item.id,
						label: item.name,
					});
					if (item.id === report.value.domainData.value) {
						options.industry = item.domainIndustryDataList.map((item) => {
							return { value: item[item.length - 1].code, label: item[item.length - 1].name };
						});
						options.major = item.domainMajorDataList.map((item) => {
							return { value: item[item.length - 1].code, label: item[item.length - 1].name };
						});
					}
				});
			});
		});
	}
	if (props.type === 'copy') {
		getReportInfo<ReportField>(props.id).then(async (res) => {
			initReportId.value = res.id;
			report.value = {
				...res,
				createBy: user.value!.id,
				createUser: user.value!.name,
				status: 1,
				startTime: '',
				endTime: '',
				description: '',
				submitUserId: '',
				auditingType: undefined,
				reportAuditorData: [],
				reportEditorData: [],
				copyReportId: res.id,
			};
			report.value.name = '';
			const domainOptions = await getDomainsOptionsByCollegeId(res.collegeData.value! as string);
			options.domain = [...domainOptions];
			options.major.push(res.majorData);
			getDomainsMajorOptionsByCollegeId(report.value.collegeData.value as string).then((res) => {
				res.forEach((item) => {
					if (item.id === report.value.domainData.value) {
						options.industry = item.domainIndustryDataList.map((item) => {
							return { value: item[item.length - 1].code, label: item[item.length - 1].name };
						});
					}
				});
			});
		});
	}
});

const handleSelectCollege = (value: RawValueType | LabelInValueType, option: DefaultOptionType) => {
	options.domain = [];
	options.major = [];
	report.value.majorDetails.target = '';
	if (report.value.domainData.value) {
		report.value.domainData.value = undefined;
	}
	if (report.value.majorData.value) {
		report.value.majorData.value = undefined;
	}
	report.value.collegeData.label = option.label;
	getDomainsMajorOptionsByCollegeId(value as string).then((res) => {
		options.domain = [];
		domainData.value = res;
		res.forEach((item) => {
			options.domain.push({
				value: item.id,
				label: item.name,
			});
		});
	});
};
const domainData = ref<Array<Domain>>([]);
const handleSelectDomain = (value: RawValueType | LabelInValueType, option: DefaultOptionType) => {
	options.industry = [];
	options.major = [];
	report.value.domainData.label = option.label;
	const domain = domainData.value.find((item) => item.id === (value as string));

	domain?.domainIndustryDataList.forEach((item) => {
		options.industry.push({ value: item[item.length - 1].code, label: item[item.length - 1].name });
	});

	domain?.domainMajorDataList.forEach((item) => {
		options.major.push({ value: item[item.length - 1].code, label: item[item.length - 1].name });
	});
};
const handleSelectIndustry = (_value: RawValueType | LabelInValueType, option: DefaultOptionType) => {
	report.value.otherField.industryName = option.label;
};
const handleSelectMajor = (value: RawValueType | LabelInValueType, option: DefaultOptionType) => {
	report.value.majorData.label = option.label;
	const domain = domainData.value.find((item) => item.id === report.value.domainData.value);
	const major = domain?.domainMajorDataList.find((item) => item[item.length - 1].code === (value as string));
	report.value.majorDetails.bigCategoryName = major?.[1].name || '';
	report.value.majorDetails.bigCategoryCode = major?.[1].code || '';
	report.value.majorDetails.categoryName = major?.[2].name || '';
	report.value.majorDetails.categoryCode = major?.[2].code || '';
	report.value.majorDetails.typeName = major?.[0].name || '';
	report.value.majorDetails.typeCode = major?.[0].code || '';
	report.value.majorDetails.target = major?.[3].target || '';
};

const fileList = ref<any[]>([]);
const token = sessionStorage.getItem('jwt');
const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
	if (info.fileList.length > 0 && info.fileList[0].xhr) {
		const file = JSON.parse(info.fileList[0].xhr.response) as IFile;
		report.value.coverId = file.id;
	}
};
const handleRemoveImg = () => {
	report.value.coverId = undefined;
};

const handleSubmit = () => {
	formRef.value?.validate().then(() => {
		form.value
			?.validate()
			.then(() => {
				if (report.value.startTime > report.value.endTime) {
					message.warning('开始时间不能大于结束时间');
					return;
				}
				if (report.value.reportEditorData.length === 0) {
					message.warning('请添加编辑人员');
					return;
				}
				if (report.value.reportAuditorData.length === 0) {
					message.warning('请添加审核人员');
					return;
				}
				if (!report.value.submitUserId) {
					message.warning('请设置提交人');
					return;
				}
				const params = {
					...report.value,
					reportEditorData: report.value.reportEditorData.map((item) => ({
						userId: item.userId,
						isSubmitter: item.isSubmitter,
					})),
					reportAuditorData: report.value.reportAuditorData.map((item) => ({
						userId: item.userId,
						isSubmitter: item.isSubmitter,
					})),
					id: props.type === 'copy' ? '' : report.value.id,
				};
				createOrUpdateReport<ReportField>(params).then((res) => {
					if (props.type === 'copy') {
						copyReport(initReportId.value, res.id).then(() => {
							emit('success');
						});
					} else {
						emit('success');
					}
				});
			})
			.catch((err: ValidateErrorEntity) => {
				message.warning(err.errorFields[0].errors[0]);
			});
	});
};

const selectUserState = reactive({ visible: false, type: 'edit' });
const handleSelectUser = (type: 'edit' | 'audit') => {
	selectUserState.visible = true;
	selectUserState.type = type;
	if (type === 'edit') {
		selectedUserIds.value = report.value.reportEditorData.map((item) => item.userId);
	} else {
		selectedUserIds.value = report.value.reportAuditorData.map((item) => item.userId);
	}
};
const handleRemoveUser = (type: 'edit' | 'audit', id: string) => {
	if (type === 'edit') {
		report.value.reportEditorData = report.value.reportEditorData.filter((item) => item.userId !== id);
	} else {
		report.value.reportAuditorData = report.value.reportAuditorData.filter((item) => item.userId !== id);
	}
	if (report.value.submitUserId === id) {
		report.value.submitUserId = '';
	}
};

const selectedUserIds = ref<Array<string>>([]);
const selectUser = (state: { keys: Array<string>; records: Array<User> }) => {
	if (state.records.length === 0) {
		selectUserState.visible = false;
		return;
	}
	if (selectUserState.type === 'edit') {
		const findUser = report.value.reportEditorData.find((item) => item.isSubmitter)?.userId;
		report.value.reportEditorData = state.records.map((item) => ({
			userId: item.id,
			userName: item.name,
			number: item.number,
			phone: item.phone,
			isSubmitter: findUser === item.id,
		}));
	} else {
		const findUser = report.value.reportAuditorData.find((item) => item.isSubmitter)?.userId;
		report.value.reportAuditorData = state.records.map((item) => ({
			userId: item.id,
			userName: item.name,
			number: item.number,
			phone: item.phone,
			isSubmitter: findUser === item.id,
		}));
	}
	selectUserState.visible = false;
};

const previewVisible = ref(false);
const previewImage = ref('');
const handlePreview = async () => {
	previewImage.value = fileList.value[0]['response']['url'];
	previewVisible.value = true;
};
const handleCancelPreview = () => {
	previewVisible.value = false;
};

const handleSetSubmitter = (record: ReportUser) => {
	if (record.isSubmitter) {
		report.value.submitUserId = record.userId;
		report.value.reportEditorData.forEach((item) => {
			if (item.userId !== record.userId) {
				item.isSubmitter = false;
			}
		});
	} else {
		if (report.value.submitUserId === record.userId) {
			report.value.submitUserId = '';
		}
	}
};
// 企业调研变化动态渲染其他
const handleSelectSurveyReport = (value: RawValueType | LabelInValueType, _option: DefaultOptionType) => {
	getReportInfo<ReportField>(value as string).then(async (res) => {
		const domainOptions = await getDomainsOptionsByCollegeId(res.collegeData.value! as string);
		options.domain = [...domainOptions];
		options.major.push(res.majorData);
		report.value.currentYear = res.currentYear;
		report.value!.majorDetails = res.majorDetails;
		report.value!.majorData = res.majorData;
		report.value!.domainData = res.domainData;
		report.value!.collegeData = res.collegeData;
	});
};
// 人培方案的逻辑代码
const handleSelectCultivateReport = (value: RawValueType | LabelInValueType, _option: DefaultOptionType) => {
	getReportInfo<ReportField>(value as string).then(async (res) => {
		const domainOptions = await getDomainsOptionsByCollegeId(res.collegeData.value! as string);
		options.domain = [...domainOptions];
		options.major.push(res.majorData);
		const courseNameAndCertificateList = await getCourseList(value as string);
		options.courseName = courseNameAndCertificateList.map((item) => ({
			label: item.courseName,
			value: item.courseName,
		}));
		options.certificateName = courseNameAndCertificateList.map((item) => ({
			label: item.certificateName,
			value: item.certificateName,
		}));
		report.value.currentYear = res.currentYear;
		report.value!.majorDetails = res.majorDetails;
		report.value!.majorData = res.majorData;
		report.value!.domainData = res.domainData;
		report.value!.collegeData = res.collegeData;
		report.value!.otherField.enrollmentTarget = res.otherField.enrollmentTarget;
		report.value!.otherField.grade = res.otherField.grade;
		report.value!.otherField.qualification = res.otherField.qualification;
		report.value!.otherField.learningModality = res.otherField.learningModality;
	});
};

// 课程标准逻辑代码
const handleSelectStructureReport = (value: RawValueType | LabelInValueType, _option: DefaultOptionType) => {
	getReportInfo<ReportField>(value as string).then(async (res) => {
		const domainOptions = await getDomainsOptionsByCollegeId(res.collegeData.value! as string);
		options.domain = [...domainOptions];
		options.major.push(res.majorData);
		report.value.otherField = res.otherField;
		report.value.currentYear = res.currentYear;
		report.value!.majorDetails = res.majorDetails;
		report.value!.majorData = res.majorData;
		report.value!.domainData = res.domainData;
		report.value!.collegeData = res.collegeData;
	});
};

// 选择课程结构逻辑
const handleSelectStandardReport = (value: RawValueType | LabelInValueType, _option: DefaultOptionType) => {
	getReportInfo<ReportField>(value as string).then(async (res) => {
		const domainOptions = await getDomainsOptionsByCollegeId(res.collegeData.value! as string);
		options.domain = [...domainOptions];
		options.major.push(res.majorData);
		report.value.otherField = res.otherField;
		report.value.collegeData = res.collegeData;
		report.value.domainData = res.domainData;
		report.value.majorDetails = res.majorDetails;
		report.value.majorData = res.majorData;
	});
};

const handleChangeCreateType = (e: RadioChangeEvent) => {
	const target = e.target as HTMLInputElement;
	const templateName = report.value.name;
	report.value = initReportAll(props.reportType);
	report.value.name = templateName;
	report.value.createType = +target.value;
	options.certificateName = [];
	options.courseName = [];
};

const handleCancel = () => {
	const initObj = initReportAll(props.reportType);
	if (_.isEqual(report.value, initObj)) {
		open.value = false;
		return;
	}
	Modal.confirm({
		title: '确认关闭',
		content: '关闭后内容不可恢复，请谨慎操作!',
		onOk() {
			open.value = false;
		},
		onCancel() {
			return;
		},
	});
};
</script>

<template>
	<a-drawer v-model:open="open" width="864" :closable="false" :maskClosable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">
					<div v-if="type === 'create'">创建{{ drawerTitle }}</div>
					<div v-if="type === 'update'">编辑{{ drawerTitle }}</div>
					<div v-if="type === 'copy'">复制{{ drawerTitle }}</div>
				</div>
				<div>
					<a-button type="link" @click="handleCancel">
						<template #icon>
							<close-svg></close-svg>
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div :style="{ color: `${appTheme.token.colorText}` }" class="drawer-title">基础信息</div>
		<a-form ref="formRef" :model="report" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
			<div class="grid grid-cols-2">
				<a-form-item
					:label="`${drawerTitle}名称`"
					name="name"
					:rules="{ required: true, message: '请输入报告名称', trigger: 'change' }"
				>
					<a-input v-model:value="report.name" placeholder="请输入" :maxlength="30"></a-input>
				</a-form-item>
				<a-form-item></a-form-item>
				<a-form-item
					label="创建方式"
					name="createType"
					:rules="{ required: true, message: '请选择创建方式', trigger: 'change' }"
				>
					<a-radio-group
						v-if="reportType === 1"
						v-model:value="report.createType"
						:disabled="type === 'copy' || !!report.copyReportId"
					>
						<a-radio :value="1">已开设专业</a-radio>
						<a-radio :value="2">新专业</a-radio>
					</a-radio-group>
					<a-radio-group
						v-else
						v-model:value="report.createType"
						:disabled="type === 'copy' || !!report.copyReportId"
						@change="handleChangeCreateType"
					>
						<a-radio v-if="reportType === 2" :value="1">根据企业调研</a-radio>
						<a-radio v-else-if="reportType === 3" :value="1">根据人才培养方案</a-radio>
						<a-radio v-else-if="reportType === 4" :value="1">根据课程结构</a-radio>
						<a-radio v-else-if="reportType === 5" :value="1">根据课程标准</a-radio>
						<a-radio v-else-if="reportType === 6" :value="1">根据活页教材</a-radio>
						<a-radio v-if="reportType !== 6" :value="2">独立创建</a-radio>
					</a-radio-group>
				</a-form-item>
				<template v-if="report.createType === 1">
					<a-form-item v-if="reportType === 1"></a-form-item>
					<a-form-item
						v-if="reportType === 2"
						label="选择企业调研"
						name="relationReportId"
						:rules="{ required: true, message: '请选选择企业调研' }"
					>
						<a-select
							:options="options.dependence"
							:disabled="type === 'copy' || !!report.copyReportId"
							v-model:value="report.relationReportId"
							placeholder="请选择"
							@select="handleSelectSurveyReport"
						></a-select>
					</a-form-item>
					<a-form-item
						v-if="reportType === 3"
						label="选择人才培养方案"
						name="relationReportId"
						:rules="{ required: true, message: '请选择人培方案' }"
					>
						<a-select
							:options="options.dependence"
							:disabled="type === 'copy' || !!report.copyReportId"
							v-model:value="report.relationReportId"
							@select="handleSelectCultivateReport"
							placeholder="请选择"
						></a-select>
					</a-form-item>
					<a-form-item
						v-if="reportType === 4"
						label="选择课程结构"
						name="relationReportId"
						:rules="{ required: true, message: '请选择课程结构' }"
					>
						<a-select
							v-model:value="report.relationReportId"
							:disabled="type === 'copy' || !!report.copyReportId"
							:options="options.dependence"
							placeholder="请选择"
							@select="handleSelectStructureReport"
						></a-select>
					</a-form-item>
					<a-form-item
						v-if="reportType === 5"
						:rules="{ required: true, message: '请选择课程标准' }"
						label="选择课程标准"
						name="relationReportId"
					>
						<a-select
							:options="options.dependence"
							:disabled="type === 'copy' || !!report.copyReportId"
							v-model:value="report.relationReportId"
							@select="handleSelectStandardReport"
							placeholder="请选择"
						></a-select>
					</a-form-item>
					<a-form-item
						v-if="reportType === 6"
						:rules="{ required: true, message: '请选择活页教材' }"
						label="选择活页教材"
						name="relationReportId"
					>
						<a-select
							:options="options.dependence"
							:disabled="type === 'copy' || !!report.copyReportId"
							v-model:value="report.relationReportId"
							@select="handleSelectStandardReport"
							placeholder="请选择"
						></a-select>
					</a-form-item>
				</template>
				<template v-else>
					<a-form-item></a-form-item>
				</template>
				<a-form-item
					label="选择院系"
					:name="['collegeData', 'value']"
					:rules="{ required: true, message: '请选择院系', trigger: 'change' }"
				>
					<a-select
						v-model:value="report.collegeData.value"
						:options="options.college"
						placeholder="请选择"
						:disabled="
							(report.reportType === 1 && type === 'copy') ||
							!!report.copyReportId ||
							(report.createType === 1 && reportType !== 1) ||
							type === 'copy' ||
							(!!report.copyReportId && report.createType === 2)
						"
						@select="handleSelectCollege"
					></a-select>
				</a-form-item>
				<a-form-item
					label="关联学年"
					name="currentYear"
					:rules="{ required: true, message: '请输入关联学年', trigger: 'change' }"
				>
					<a-input-number v-model:value="report.currentYear" :controls="false" class="w-full" placeholder="请输入">
						<template #addonAfter>学年</template>
					</a-input-number>
				</a-form-item>
				<template v-if="reportType === 1">
					<a-form-item
						label="专业分类"
						:name="['domainData', 'value']"
						:rules="{ required: true, message: '请选择专业/专业群分类', trigger: 'change' }"
					>
						<a-select
							:disabled="type === 'copy' || !!report.copyReportId"
							v-model:value="report.domainData.value"
							:options="options.domain"
							placeholder="请选择"
							@select="handleSelectDomain"
						></a-select>
					</a-form-item>
					<a-form-item
						label="专业名称"
						:name="['majorData', 'value']"
						:rules="{ required: true, message: '请选择专业名称', trigger: 'change' }"
					>
						<a-select
							:disabled="type === 'copy' || !!report.copyReportId"
							v-model:value="report.majorData.value"
							:options="options.major"
							placeholder="请选择"
							@select="handleSelectMajor"
						></a-select>
					</a-form-item>
					<a-form-item
						label="专业代码"
						:name="['majorData', 'value']"
						:rules="{ required: true, message: '请输入专业代码', trigger: 'change' }"
					>
						<a-input :value="report.majorData.value" disabled placeholder="自动生成"></a-input>
					</a-form-item>
					<a-form-item
						label="培养方向"
						:name="['majorDetails', 'target']"
						:rules="{ required: true, message: '请输入培养方向', trigger: 'change' }"
					>
						<a-input :value="report.majorDetails.target" disabled placeholder="自动生成"></a-input>
					</a-form-item>
					<a-form-item
						label="所属行业"
						:name="['otherField', 'industryCode']"
						:rules="{ required: true, message: '请选择关联行业', trigger: 'change' }"
					>
						<a-select
							:disabled="type === 'copy' || !!report.copyReportId"
							v-model:value="report.otherField.industryCode"
							:options="options.industry"
							@select="handleSelectIndustry"
							placeholder="请选择"
						></a-select>
					</a-form-item>
					<a-form-item :rules="{ required: true, message: '请输入行业代码', trigger: 'change' }" label="行业代码">
						<a-input v-model:value="report.otherField.industryCode" disabled placeholder="自动生成"></a-input>
					</a-form-item>
				</template>
				<template v-if="[2, 3, 4, 5, 6].includes(reportType)">
					<a-form-item
						label="专业分类"
						:name="['domainData', 'value']"
						:rules="{ required: true, message: '请选择专业/专业群分类', trigger: 'change' }"
					>
						<a-select
							v-model:value="report.domainData.value"
							:options="options.domain"
							placeholder="请选择"
							@select="handleSelectDomain"
							:disabled="
								report.createType === 1 || type === 'copy' || (!!report.copyReportId && report.createType === 2)
							"
						></a-select>
					</a-form-item>
					<a-form-item
						label="专业名称"
						:name="['majorData', 'value']"
						:rules="{ required: true, message: '请选择专业名称', trigger: 'change' }"
					>
						<a-select
							v-model:value="report.majorData.value"
							:options="options.major"
							placeholder="请选择"
							@select="handleSelectMajor"
							:disabled="
								report.createType === 1 || type === 'copy' || (!!report.copyReportId && report.createType === 2)
							"
						></a-select>
					</a-form-item>
					<a-form-item
						label="专业大类"
						:name="['majorDetails', 'bigCategoryName']"
						:rules="{ required: true, message: '请输入专业大类', trigger: 'change' }"
					>
						<a-input :value="report.majorDetails.bigCategoryName" disabled placeholder="自动生成"></a-input>
					</a-form-item>
					<a-form-item :rules="{ required: true, message: '请输入专业代码', trigger: 'change' }" label="专业代码">
						<a-input :value="report.majorData.value" disabled placeholder="自动生成"></a-input>
					</a-form-item>
				</template>
				<template v-if="[2, 3, 4, 5, 6].includes(reportType) && dictionaryOption">
					<a-form-item
						label="招生对象"
						:name="['otherField', 'enrollmentTarget']"
						:rules="{ required: true, message: '请选择招生对象' }"
					>
						<a-select
							v-model:value="report.otherField.enrollmentTarget"
							:disabled="report.createType === 1 && reportType > 2"
							:options="dictionaryOption[DICTIONARY_TYPE.ENROLLMENT_TARGET]"
							placeholder="请选择"
						>
						</a-select>
					</a-form-item>
					<a-form-item :name="['otherField', 'grade']" :rules="{ required: true, message: '请选择学制' }" label="学制">
						<a-select
							:options="dictionaryOption[DICTIONARY_TYPE.GRADE]"
							v-model:value="report.otherField.grade"
							:disabled="report.createType === 1 && reportType > 2"
							placeholder="请选择"
						>
						</a-select>
					</a-form-item>
					<a-form-item
						label="学习形式"
						:name="['otherField', 'learningModality']"
						:rules="{ required: true, message: '请选择学习形式' }"
					>
						<a-select
							:options="dictionaryOption[DICTIONARY_TYPE.LEARNING_MODALITY]"
							v-model:value="report.otherField.learningModality"
							:disabled="report.createType === 1 && reportType > 2"
							placeholder="请选择"
						>
						</a-select>
					</a-form-item>
					<a-form-item
						label="学历"
						:name="['otherField', 'qualification']"
						:rules="{ required: true, message: '请选择学历' }"
					>
						<a-select
							v-model:value="report.otherField.qualification"
							:options="dictionaryOption[DICTIONARY_TYPE.QUALIFICATION]"
							:disabled="report.createType === 1 && reportType > 2"
							placeholder="请选择"
						>
						</a-select>
					</a-form-item>
				</template>
				<template v-if="[3, 4, 5, 6].includes(reportType) && dictionaryOption">
					<a-form-item
						label="课程名称"
						:name="['otherField', 'courseName']"
						:rules="{ required: true, message: report.createType === 2 ? '请输入课程名称' : '请选择课程名称' }"
					>
						<a-select
							v-if="report.createType === 1"
							v-model:value="report.otherField.courseName"
							:disabled="[4, 5, 6].includes(reportType) && report.createType === 1"
							:options="options.courseName"
							placeholder="请选择课程名称"
						>
						</a-select>
						<a-input
							v-else
							v-model:value="report.otherField.courseName"
							:disabled="reportType === 5 && report.createType === 1"
							placeholder="请输入课程名称"
						/>
					</a-form-item>
					<a-form-item
						label="课程类型"
						:name="['otherField', 'courseType']"
						:rules="{ required: true, message: '请选择课程类型' }"
					>
						<a-select
							:options="dictionaryOption[DICTIONARY_TYPE.COURSE_TYPE]"
							v-model:value="report.otherField.courseType"
							placeholder="请选择"
							:disabled="[4, 5, 6].includes(reportType) && report.createType === 1"
						>
						</a-select>
					</a-form-item>
					<a-form-item
						label="课程性质"
						:name="['otherField', 'courseNature']"
						:rules="{ required: true, message: '请选择课程性质' }"
					>
						<a-select
							:options="dictionaryOption[DICTIONARY_TYPE.COURSE_NATURE]"
							v-model:value="report.otherField.courseNature"
							:disabled="[4, 5, 6].includes(reportType) && report.createType === 1"
							placeholder="请选择"
						>
						</a-select>
					</a-form-item>
					<a-form-item
						label="职业资格证书"
						:name="['otherField', 'certificateName']"
						:rules="{ required: true, message: '请选择职业资格证书' }"
					>
						<a-select
							v-model:value="report.otherField.certificateName"
							:disabled="[4, 5, 6].includes(reportType) && report.createType === 1"
							show-search
							placeholder="请选择"
							:options="report.createType === 1 ? options.certificateName : options.allCertificateNameList"
						>
						</a-select>
					</a-form-item>
					<a-form-item
						label="证书等级"
						:name="['otherField', 'certificateLevel']"
						:rules="{ required: true, message: '请选择' }"
					>
						<a-select
							v-model:value="report.otherField.certificateLevel"
							:disabled="[4, 5, 6].includes(reportType) && report.createType === 1"
							:options="dictionaryOption[DICTIONARY_TYPE.CERTIFICATE_LEVEL]"
							placeholder="请选择"
							show-search
						>
						</a-select>
					</a-form-item>
					<a-form-item></a-form-item>
				</template>
				<a-form-item
					label="开始时间"
					name="startTime"
					:rules="{ required: true, message: '请选择开始时间', trigger: 'change' }"
				>
					<a-date-picker
						:show-time="{ format: 'HH:mm' }"
						format="YYYY-MM-DD HH:mm"
						v-model:value="report.startTime"
						class="w-full"
						placeholder="请选择"
					></a-date-picker>
				</a-form-item>
				<a-form-item
					required
					label="结束时间"
					name="endTime"
					:rules="{ required: true, message: '请选择结束时间', trigger: 'change' }"
				>
					<a-date-picker
						:show-time="{ format: 'HH:mm' }"
						format="YYYY-MM-DD HH:mm"
						v-model:value="report.endTime"
						class="w-full"
						placeholder="请选择"
					></a-date-picker>
				</a-form-item>
			</div>
			<a-form-item
				:label-col="{ span: 4 }"
				:wrapper-col="{ span: 20 }"
				label="描述信息"
				name="description">
				<!--			<a-form-item-->
				<!--				:label-col="{ span: 4 }"-->
				<!--				:rules="{ required: true, message: '请输入调研描述', trigger: 'change' }"-->
				<!--				:wrapper-col="{ span: 20 }"-->
				<!--				label="描述信息"-->
				<!--				name="description"-->
				<!--			>-->
				<a-textarea v-model:value="report.description" :auto-size="{ minRows: 2 }" placeholder="请输入"></a-textarea>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="上传封面" name="coverId">
				<a-upload
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
			</a-form-item>
		</a-form>
		<a-divider />
		<div class="flex justify-between items-center">
			<div :style="{ color: `${appTheme.token.colorText}` }" class="drawer-title">编辑人设置</div>
			<a-button type="link" @click="handleSelectUser('edit')"><i class="bi bi-plus-circle mr-1" />添加</a-button>
		</div>
		<a-table
			bordered
			:data-source="report.reportEditorData"
			:columns="columnsEdit"
			size="small"
			:pagination="false"
			table-layout="auto"
		>
			<template #emptyText>
				<m-empty size="small" />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<ReportUser>">
				<template v-if="column.key === 'serial-number'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'leader'">
					<a-switch v-model:checked="record.isSubmitter" @click="handleSetSubmitter(record as ReportUser)"></a-switch>
				</template>
				<template v-if="column.key === 'action'">
					<a-space>
						<a-button type="link" danger @click="handleRemoveUser('edit', record.userId)">移除</a-button>
					</a-space>
				</template>
			</template>
		</a-table>
		<a-divider />
		<div class="flex justify-between items-center">
			<div :style="{ color: `${appTheme.token.colorText}` }" class="drawer-title">审核人设置</div>
			<a-button type="link" @click="handleSelectUser('audit')"><i class="bi bi-plus-circle mr-1" />添加</a-button>
		</div>
		<a-form ref="form" :model="report">
			<div class="grid grid-cols-2 gap-x-4">
				<a-form-item
					label="审核方式"
					name="auditingType"
					:rules="{ required: true, message: '请选择审核方式', trigger: 'change' }"
				>
					<a-select v-model:value="report.auditingType" placeholder="请选择" :options="auditingTypeOption"></a-select>
				</a-form-item>
				<a-form-item
					label="最高分值"
					v-if="report.auditingType === 3"
					:rules="{ required: true, message: '请输入最高分值', trigger: 'change' }"
				>
					<a-input-number class="w-full" :controls="false" v-model:value="report.score" placeholder="请输入">
						<template #addonAfter>分</template>
					</a-input-number>
				</a-form-item>
			</div>
		</a-form>
		<a-table
			bordered
			:data-source="report.reportAuditorData"
			:columns="columnsAudit"
			size="small"
			:pagination="false"
			table-layout="auto"
		>
			<template #emptyText>
				<m-empty size="small" />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<ReportUser>">
				<template v-if="column.key === 'serial-number'">
					{{ index + 1 }}
				</template>
				<template v-if="column.key === 'action'">
					<a-button type="link" danger @click="handleRemoveUser('audit', record.userId)">移除</a-button>
				</template>
			</template>
		</a-table>
		<template #footer>
			<a-space class="float-right">
				<a-button @click="handleCancel">取消</a-button>
				<a-button type="primary" @click="handleSubmit">
					<span v-if="type === 'create'">确定</span>
					<span v-else-if="type === 'update'">保存</span>
					<span v-else-if="type === 'copy'">复制</span>
				</a-button>
			</a-space>
		</template>
		<user-select
			v-if="selectUserState.visible"
			:client-id="user!.clientId"
			:selected="selectedUserIds"
			:disable="[]"
			v-model:open="selectUserState.visible"
			:select-role="['teacher', 'leader', 'company']"
			@select="selectUser"
		/>
	</a-drawer>
</template>
