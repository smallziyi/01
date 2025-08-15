<script setup lang="ts">
import { FormInstance } from 'ant-design-vue/es/form';
import { PlusOutlined } from '@ant-design/icons-vue';
import { Domain } from '@/view/admin/domain/config.ts';
import { UploadFile } from 'ant-design-vue/es/upload/interface';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { message, Modal } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import UserSelect from '@/view/base/user/components/user-select.vue';
import CollegeDomainSelect from '@/view/admin/college/components/college-domain-select.vue';
import CloseSvg from '@/assets/icons/close.svg';
import _ from 'lodash';
import {
	auditingTypeOption,
	columnsAudit,
	columnsEdit,
	initReportAll,
	ReportField,
	ReportType,
	ReportUser,
} from '@/view/__report';
import dayjs from 'dayjs';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { copyReport, createOrUpdateReport, getReportInfo } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';

const appTheme = useAppTheme();
const token = sessionStorage.getItem('jwt');

const open = defineModel('open', { type: Boolean, default: false, required: true });
const props = defineProps<{
	type: 'create' | 'update' | 'copy';
	id: string;
	reportType: ReportType;
}>();
const emit = defineEmits(['success']);

const form = ref<FormInstance>();
const formRef = useTemplateRef<FormInstance>('formRef');
const { user } = useUserStore();
const report = ref<ReportField>(initReportAll(props.reportType));
const initReportId = ref<string>('');

const fileList = ref<UploadFile[]>([]);
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
					otherField: {
						domainIds: domainIds.value,
					},
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
};

const selectedUserIds = ref<Array<string>>([]);
const selectUser = (state: { keys: Array<string>; records: Array<User> }) => {
	if (selectUserState.type === 'edit') {
		report.value.reportEditorData = state.records.map((item) => ({
			userId: item.id,
			userName: item.name,
			number: item.number,
			phone: item.phone,
			isSubmitter: false,
		}));
	} else {
		report.value.reportAuditorData = state.records.map((item) => ({
			userId: item.id,
			userName: item.name,
			number: item.number,
			phone: item.phone,
			isSubmitter: false,
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

// 选择专业相关
const columns: TableColumns<Domain> = [
	{ key: 'name', dataIndex: 'name', title: '专业(群)名称', ellipsis: true },
	{ key: 'name1', title: '专业大类', ellipsis: true },
	{ key: 'name2', title: '专业类', ellipsis: true },
	{ key: 'name3', title: '专业名称', ellipsis: true },
	{ key: 'code', title: '专业代码', width: 80 },
	{ key: 'operation', title: '操作', width: 80 },
];
const domainData = ref<Domain[]>([]);
const domainIds = ref<string[]>([]);

const openSelectDomain = ref(false);
const handleSelectDomain = (data: Domain[]) => {
	openSelectDomain.value = false;
	domainData.value = [...domainData.value, ...data];
	domainIds.value = [...domainIds.value, ...data.map((item) => item.id)];
};
const handleRemoveDomain = (id: string) => {
	domainData.value = domainData.value.filter((item) => item.id !== id);
	domainIds.value = domainIds.value.filter((item) => item !== id);
};

onMounted(() => {
	if (props.type === 'update') {
		getReportInfo<ReportField>(props.id).then((res) => {
			const { startTime, endTime, ...rest } = res;
			report.value = {
				...rest,
				startTime: dayjs(res.startTime, 'YYYY-MM-DD HH:mm'),
				endTime: dayjs(res.endTime, 'YYYY-MM-DD HH:mm'),
			};
			if (res.otherField.domainList && res.otherField.domainIds) {
				domainData.value = res.otherField.domainList as any;
				domainIds.value = res.otherField.domainIds;
			}
			report.value.reportEditorData.forEach((item) => {
				if (item.userId === report.value.submitUserId) {
					item.isSubmitter = true;
				}
			});
			if (res.coverId) {
				fileList.value = [
					{
						uid: res.coverId,
						name: 'cover',
						status: 'done',
						url: `${res.coverUrl}`,
					},
				];
			}

			if (res.coverId) {
				fileList.value = [
					{
						uid: res.coverId,
						name: 'cover',
						status: 'done',
						url: `${res.coverUrl}`,
					},
				];
			}
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
				auditingType: undefined,
				reportAuditorData: [],
				reportEditorData: [],
				copyReportId: res.id,
			};
			report.value.name = '';
		});
	}
});
</script>

<template>
	<a-drawer v-model:open="open" width="864" :closable="false" :maskClosable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">
					<div v-if="type === 'create'">创建校历</div>
					<div v-else-if="type === 'update'">编辑校历</div>
					<div v-else-if="type === 'copy'">复制校历</div>
				</div>
				<div>
					<a-button type="link" @click="handleCancel">
						<template #icon><close-svg></close-svg></template>
					</a-button>
				</div>
			</div>
		</template>
		<div :style="{ color: `${appTheme.token.colorText}` }" class="drawer-title">基础信息</div>
		<a-form ref="formRef" :model="report" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
			<div class="grid grid-cols-2">
				<a-form-item
					label="校历名称"
					name="name"
					:rules="{ required: true, message: '请输入报告名称', trigger: 'change' }"
				>
					<a-input v-model:value="report.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item
					label="当前学年"
					name="currentYear"
					:rules="{ required: true, message: '请输入当前学年', trigger: 'change' }"
				>
					<a-input-number v-model:value="report.currentYear" :controls="false" class="w-full" placeholder="请输入">
						<template #addonAfter>学年</template>
					</a-input-number>
				</a-form-item>
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
				:rules="{ required: true, message: '请输入描述信息', trigger: 'change' }"
				:wrapper-col="{ span: 20 }"
				label="描述信息"
				name="description"
			>
				<a-textarea v-model:value="report.description" :auto-size="{ minRows: 2 }" placeholder="请输入"></a-textarea>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="封面图片" name="coverId">
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
			<div class="drawer-title">专业设置</div>
			<a-button type="link" @click="openSelectDomain = true">选择专业</a-button>
		</div>
		<a-table
			v-if="domainIds.length > 0"
			size="small"
			:columns="columns"
			bordered
			:data-source="domainData"
			:pagination="false"
			table-layout="fixed"
			row-key="id"
		>
			<template #bodyCell="{ column, record }: TableRow<Domain>">
				<template v-if="column.key === 'name1'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[1].name }}</div>
					</div>
				</template>
				<template v-if="column.key === 'name2'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[2].name }}</div>
					</div>
				</template>
				<template v-if="column.key === 'name3'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[3].name }}</div>
					</div>
				</template>
				<template v-if="column.key === 'code'">
					<div class="w-full" v-for="item in (record as Domain).domainMajorDataList">
						<div class="w-full overflow-hidden text-ellipsis">{{ item[3].code }}</div>
					</div>
				</template>
				<template v-if="column.key === 'operation'">
					<a class="text-red-500" type="link" @click="handleRemoveDomain(record.id)"> 移除 </a>
				</template>
			</template>
		</a-table>
		<div v-else class="border rounded-lg h-[300px]">
			<m-empty size="small" />
		</div>
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
			:select-role="['teacher', 'leader']"
			@select="selectUser"
		/>
		<college-domain-select
			v-if="openSelectDomain"
			v-model:open="openSelectDomain"
			v-model:selected="domainIds"
			@change="handleSelectDomain"
		/>
	</a-drawer>
</template>
