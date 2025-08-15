<template>
	<a-drawer v-model:open="open" width="864" :closable="false" destroy-on-close>
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">新增</div>
				<div>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div class="drawer-title">基本信息</div>
		<a-form ref="form" :label-col="{ span: 6 }" :model="group" :wrapper-col="{ span: 18 }">
			<div class="grid grid-cols-2">
				<a-form-item label="班级名称" name="name" :rules="[{ required: true, message: '请输入班级名称' }]">
					<a-input v-model:value="group.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item label="年级" name="year" :rules="[{ required: true, message: '请选择学年' }]">
					<a-input-number
						v-model:value="group.year"
						:controls="false"
						:precision="0"
						class="w-full"
						placeholder="请输入"
					>
						<template #addonAfter>学年</template>
					</a-input-number>
				</a-form-item>
				<a-form-item label="所属院系" name="collegeId" :rules="[{ required: true, message: '请选择院系' }]">
					<a-select
						v-model:value="group.collegeId"
						:options="options.collegeOptions"
						@change="handleSelectCollege"
						placeholder="请选择院系"
						allow-clear
					></a-select>
				</a-form-item>
				<a-form-item label="所属专业" name="domainId" :rules="[{ required: true, message: '请选择专业' }]">
					<a-select v-model:value="group.domainId" :options="options.domainOptions" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item label="学制" name="grade" :rules="[{ required: true, message: '请选择学制' }]">
					<a-select v-model:value="group.grade" :options="gradeList" allow-clear placeholder="请选择" />
				</a-form-item>
			</div>
		</a-form>
		<a-divider />
		<div class="flex justify-between items-center">
			<div class="drawer-title">关联教师</div>

			<a-button type="link" @click="openSelect.teacher = true">
				<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" />添加老师</div>
			</a-button>
		</div>
		<a-table
			:pagination="false"
			size="small"
			:columns="selectUserColumns"
			bordered
			:data-source="selectUserData.teacher"
		>
			<template #emptyText>
				<m-empty size="small" />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<User>">
				<template v-if="column.key === 'serial-number'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'gender'">
					<div v-if="record.gender === 1">男</div>
					<div v-if="record.gender === 0">女</div>
				</template>
				<template v-if="column.key === 'operation'">
					<a class="text-red-500" @click="removeUser(record.id, 'teacher')">移除</a>
				</template>
			</template>
		</a-table>
		<a-divider />
		<div class="flex justify-between items-center">
			<div class="drawer-title flex items-center">关联学生</div>
			<div>
				<a-button type="link" @click="openSelect.student = true">
					<div class="flex items-center gap-1"><Icon icon="bi:plus-circle" />添加学生</div>
				</a-button>
				<a-button type="link" @click="input?.click()">
					<div class="flex items-center">批量添加</div>
				</a-button>
			</div>
		</div>
		<a-table
			:pagination="false"
			size="small"
			:columns="selectUserColumns"
			bordered
			:data-source="selectUserData.student"
		>
			<template #emptyText>
				<m-empty size="small" />
			</template>
			<template #bodyCell="{ column, record, index }: TableRow<User>">
				<template v-if="column.key === 'serial-number'">
					{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
				</template>
				<template v-if="column.key === 'gender'">
					<div v-if="record.gender === 1">男</div>
					<div v-if="record.gender === 0">女</div>
				</template>
				<template v-if="column.key === 'operation'">
					<a class="text-red-500" @click="removeUser(record.id, 'student')">移除 </a>
				</template>
			</template>
		</a-table>
		<user-select
			v-if="openSelect.teacher"
			:client-id="clientId"
			:disable="[]"
			:selected="disableTeacher"
			v-model:open="openSelect.teacher"
			:select-role="['teacher']"
			@select="handleSelectTeacher"
		/>
		<user-select
			v-if="openSelect.student"
			:client-id="clientId"
			:disable="disableStudentIds"
			:selected="selectUserData.student.map((item) => item.id)"
			v-model:open="openSelect.student"
			:select-role="['student']"
			@select="handleSelectStudent"
		/>
		<input type="file" class="hidden" ref="file" accept=".xlsx, .xls" @input="handleFileInput" />
		<template #footer>
			<div class="flex justify-end p-2">
				<a-space>
					<a-button @click="open = false">取消</a-button>
					<a-button type="primary" @click="handleSubmit">确认</a-button>
				</a-space>
			</div>
		</template>
	</a-drawer>
</template>

<script setup lang="ts">
import { createGroup, getAlreadyGroupStudent, getCollegeOptions, getDomainsOptionsByCollegeId } from '@/axios';
import { gradeList, initGroup } from '@/view/admin/group/config.ts';
import UserSelect from '@/view/base/user/components/user-select.vue';
import { FormInstance } from 'ant-design-vue/es/form';
import { DataOption } from '@/view/__report';
import CloseSvg from '@/assets/icons/close.svg';
import { useTableConfig } from '@/hooks/useTableConfig.ts';
import useUserStore from '@/store/modules/useUserStore.ts';
import { uploadStudentExcel } from '@/axios/module/admin.api.ts';

const { pagination } = useTableConfig();

const open = defineModel<boolean>('open', { required: true, type: Boolean, default: false });
const emit = defineEmits(['success']);

const group = ref(initGroup());
const disableStudentIds = ref<string[]>([]);
const { user } = useUserStore();
const clientId = computed(() => {
	return user.value!.clientId;
});
const form = ref<FormInstance>();

const disableTeacher = computed(() => {
	return selectUserData.teacher.map((item) => item.id);
});

const handleSubmit = () => {
	form.value?.validate().then(() => {
		group.value.teacherData = selectUserData.teacher.map((item) => item.id);
		group.value.studentData = selectUserData.student.map((item) => item.id);
		createGroup(group.value).then(() => {
			emit('success');
		});
	});
};

const openSelect = reactive<{ teacher: boolean; student: boolean }>({ teacher: false, student: false });

const selectUserData = reactive<{ teacher: User[]; student: User[] }>({ teacher: [], student: [] });
const handleSelectTeacher = (state: { keys: string[]; records: User[] }) => {
	selectUserData.teacher = [...state.records];
	// selectUserData.teacher.push(...state.records);
	openSelect.teacher = false;
};
const handleSelectStudent = (state: { keys: string[]; records: User[] }) => {
	selectUserData.student = [...state.records];
	// selectUserData.student.push(...state.records);
	openSelect.student = false;
};

const removeUser = (id: string, type: 'student' | 'teacher') => {
	switch (type) {
		case 'student':
			selectUserData.student = selectUserData.student.filter((item) => item.id !== id);
			break;
		case 'teacher':
			selectUserData.teacher = selectUserData.teacher.filter((item) => item.id !== id);
			break;
	}
};
const options = reactive<{ collegeOptions: DataOption[]; domainOptions: DataOption[] }>({
	collegeOptions: [{ value: undefined, label: undefined }],
	domainOptions: [{ value: undefined, label: undefined }],
});
const handleSelectCollege = () => {
	getDomainsOptionsByCollegeId(group.value.collegeId).then((res) => {
		options.domainOptions = res as DataOption[];
		const index = options.domainOptions.findIndex((item) => {
			return item.value === group.value.domainId;
		});
		if (index === -1) {
			group.value.domainId = '';
		}
	});
};
const getStudentIds = () => {
	getAlreadyGroupStudent().then((res) => {
		disableStudentIds.value = res;
	});
};

onMounted(() => {
	getStudentIds();
	getCollegeOptions().then((res) => {
		options.collegeOptions = res as DataOption[];
	});
});

const selectUserColumns: TableColumns<User> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'name', dataIndex: 'name', title: '姓名' },
	{ key: 'number', dataIndex: 'number', title: '编号' },
	{ key: 'gender', dataIndex: 'gender', title: '性别' },
	{ key: 'phone', dataIndex: 'phone', title: '电话' },
	{ key: 'operation', title: '操作' },
];

const input = useTemplateRef<HTMLInputElement>('file');
function handleFileInput() {
	const fileList = input.value!.files;
	if (fileList) {
		const files = Array.from(fileList);
		uploadStudentExcel(files[0])
			.then((res) => {
				selectUserData.student.push(
					...res.data.filter((user) => selectUserData.student.flatMap((item) => item.id).indexOf(user.id) === -1),
				);
			})
			.finally(() => {
				input.value!.value = '';
			});
	}
}
</script>

<style scoped></style>
