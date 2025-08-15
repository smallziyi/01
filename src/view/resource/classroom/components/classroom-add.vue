<script setup lang="ts">
import { updateClassroom } from '@/axios';
import {
	ClassroomAdd,
	sourceOption,
	natureOption,
	typeOption,
	disableOption,
	constructStatusOption,
	ENABLED_STATE,
} from '../config';
import closeSvg from '@/assets/icons/close.svg';
import { PlusOutlined } from '@ant-design/icons-vue';
import UserSelect from '@/view/base/user/components/user-select.vue';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { UploadFile } from 'ant-design-vue/es/upload/interface';
import { message, Modal } from 'ant-design-vue';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import { DICTIONARY_TYPE } from '@/utils/dictionary';
import { FormInstance } from 'ant-design-vue/es/form';
import useUserStore from '@/store/modules/useUserStore.ts';

const emits = defineEmits(['refresh']);
const { dictionaryOption } = useDictionaryStore();
const { user } = useUserStore();
const open = defineModel('open', { required: true, type: Boolean });
const selectUserVisible = ref<boolean>(false);
const classroomData = ref<ClassroomAdd>({
	clientId: user.value!.clientId,
});
const selectedUserIds = ref<string[]>([]);
const mangerIdOption = ref<Option[]>([]);

// 文件上传
const fileList = ref([]);
const token = sessionStorage.getItem('jwt');
const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
	if (info.fileList.length > 0 && info.fileList[0].xhr) {
		const file = JSON.parse(info.fileList[0].xhr.response) as IFile;
		classroomData.value.coverId = file.id;
	}
};
const handleRemoveImg = () => {
	classroomData.value.coverId = undefined;
};

const selectUser = (state: { keys: Array<string>; records: Array<User> }) => {
	mangerIdOption.value = state.records.map((item) => ({ label: item.name, value: item.id }));
	classroomData.value.mangerId = state.keys[0];
	selectedUserIds.value = [state.keys[0]];
	selectUserVisible.value = false;
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

watch(
	() => classroomData.value.constructStatus,
	(newVal) => {
		if (newVal === ENABLED_STATE.PLAN) {
			classroomData.value.disable = 1;
		} else {
			classroomData.value.disable = 0;
		}
	},
);

const form = useTemplateRef<FormInstance>('formRef');

const handleSave = () => {
	form.value
		?.validate()
		.then(() => {
			updateClassroom(classroomData.value).then(() => {
				message.success('新建成功！');
				open.value = false;
				emits('refresh');
			});
		})
		.catch((error: FormError) => {
			message.error(error.errorFields[0].errors[0]);
		});
};
const queryNature = computed(() => {
	const currentSource = classroomData.value.source;
	return currentSource === 1 ? natureOption.slice(0, 3) : currentSource === 2 ? natureOption.slice(3) : natureOption;
});

watch(
	() => classroomData.value.nature,
	(newVal) => {
		if ([1, 2, 3].includes(newVal as number)) {
			classroomData.value.source = 1;
		} else if ([4, 5, 6].includes(newVal as number)) {
			classroomData.value.source = 2;
		}
	},
);

watch(
	() => classroomData.value.source,
	(newVal) => {
		if (newVal) {
			if (newVal === 1 && [1, 2, 3].includes(classroomData.value.nature as number)) {
				return;
			} else if (newVal === 2 && [4, 5, 6].includes(classroomData.value.nature as number)) {
				return;
			} else {
				classroomData.value.nature = undefined;
			}
		}
	},
);
const handleClose = () => {
	Modal.confirm({
		title: '关闭确认',
		content: '内容不会保存，请确认',
		onOk() {
			open.value = false;
		},
	});
};
</script>

<template>
	<a-drawer :closable="false" v-model:open="open" destroy-on-close width="864" :maskClosable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">新增</div>
				<a-button type="link" @click="handleClose">
					<template #icon>
						<close-svg />
					</template>
				</a-button>
			</div>
		</template>
		<div class="drawer-title">基础信息</div>
		<a-form ref="formRef" :model="classroomData" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
			<div class="grid grid-cols-2 gap-x-4">
				<a-form-item
					label="实训基地名称"
					name="name"
					:rules="[{ required: true, message: '请输入实训基地名称', trigger: 'blur' }]"
				>
					<a-input v-model:value="classroomData.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item
					label="实训基地归属"
					name="source"
					:rules="[{ required: true, message: '请选择实训基地归属', trigger: 'change' }]"
				>
					<a-select v-model:value="classroomData.source" :options="sourceOption" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item
					label="实训基地性质"
					name="nature"
					:rules="[{ required: true, message: '请选择实训基地性质', trigger: 'change' }]"
				>
					<a-select v-model:value="classroomData.nature" :options="queryNature" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item
					label="实训基地类型"
					name="type"
					:rules="[{ required: true, message: '请选择实训基地类型', trigger: 'change' }]"
				>
					<a-select v-model:value="classroomData.type" :options="typeOption" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item
					label="实训基地类别"
					name="typeDictionaryId"
					:rules="[{ required: true, message: '请选择实训基地类别', trigger: 'change' }]"
				>
					<a-select
						v-model:value="classroomData.typeDictionaryId"
						:options="dictionaryOption[DICTIONARY_TYPE.CLASSROOM_TYPE]"
						placeholder="请选择"
					></a-select>
				</a-form-item>
				<a-form-item
					label="实训基地容量"
					name="capacity"
					:rules="[{ required: true, message: '请选择实训基地容量', trigger: 'change' }]"
				>
					<a-input-number
						class="w-full"
						v-model:value="classroomData.capacity"
						:controls="false"
						:precision="0"
						addon-after="人"
						placeholder="请输入"
					></a-input-number>
				</a-form-item>
				<a-form-item
					label="实训基地状态"
					name="disable"
					:rules="[{ required: true, message: '请选择实训基地状态', trigger: 'change' }]"
				>
					<a-select
						v-model:value="classroomData.disable"
						:options="disableOption"
						placeholder="请选择"
						:disabled="classroomData.constructStatus === ENABLED_STATE.PLAN"
					></a-select>
				</a-form-item>
				<a-form-item
					label="实训基地建设状态"
					name="constructStatus"
					:rules="[{ required: true, message: '请选择实训基地建设状态', trigger: 'change' }]"
				>
					<a-select
						v-model:value="classroomData.constructStatus"
						:options="constructStatusOption"
						placeholder="请选择"
					></a-select>
				</a-form-item>
				<a-form-item
					label="负责人"
					name="mangerId"
					:rules="[{ required: true, message: '请选择负责人', trigger: 'change' }]"
				>
					<div class="flex">
						<a-select
							v-model:value="classroomData.mangerId"
							:options="mangerIdOption"
							placeholder="请选择"
							disabled
						></a-select>
						<a-button type="link" @click="selectUserVisible = true">选择负责人</a-button>
					</div>
				</a-form-item>
			</div>
			<a-form-item
				label="实训基地位置"
				name="location"
				:rules="[{ required: true, message: '请输入实训基地位置', trigger: 'change' }]"
				:label-col="{ span: 4 }"
				:wrapper-col="{ span: 20 }"
			>
				<a-input v-model:value="classroomData.location" placeholder="请输入"></a-input>
			</a-form-item>
			<a-form-item label="实训基地描述" name="description" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
				<a-textarea v-model:value="classroomData.description" placeholder="请输入"></a-textarea>
			</a-form-item>
			<a-form-item label="实训基地封面" name="coverUrl" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
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
		<template #footer>
			<div class="py-2 text-right">
				<a-space>
					<a-button type="default" @click="handleClose">取消</a-button>
					<a-button type="primary" @click="handleSave">保存</a-button>
				</a-space>
			</div>
		</template>
	</a-drawer>
	<user-select
		v-if="selectUserVisible"
		v-model:open="selectUserVisible"
		:client-id="user!.clientId"
		:selected="selectedUserIds"
		:disable="[]"
		:select-role="['leader', 'teacher']"
		@select="selectUser"
	/>
</template>
