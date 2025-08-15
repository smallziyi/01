<template>
	<a-drawer v-model:open="open" width="864" :closable="false" destroy-on-close>
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">
					{{ pageType === 'add' ? '新增' : '编辑' }}
				</div>
				<div>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">基本信息</div>
		<a-form ref="formRef" :model="formParams" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
			<div class="grid grid-cols-2">
				<a-form-item :rules="[{ required: true, message: '请输入部门名称' }]" label="部门名称" name="name">
					<a-input v-model:value="formParams.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item name="parentId" label="上级部门">
					<a-select v-model:value="formParams.parentId" :options="currentParentInfo" allow-clear placeholder="请选择">
					</a-select>
				</a-form-item>
				<a-form-item name="currentLeaderName" label="部门负责人">
					<a-input v-model:value="currentLeaderName" placeholder="请输入" disabled />
				</a-form-item>
				<a-form-item name="memberCount" label="部门成员数">
					<a-input v-model:value="memberCount" disabled suffix="个" />
				</a-form-item>
				<a-form-item
					:label-col="{ span: 3 }"
					:rules="[{ required: true, message: '请输入部门描述' }]"
					:wrapper-col="{ span: 21 }"
					class="col-span-full"
					label="部门描述"
					name="description"
				>
					<a-textarea
						v-model:value="formParams.description"
						:auto-size="{ minRows: 2 }"
						placeholder="请输入"
					></a-textarea>
				</a-form-item>
			</div>
		</a-form>
		<a-divider />
		<div class="flex justify-between items-center">
			<div :style="{ color: `${token.colorText}` }" class="drawer-title">部门成员</div>
			<a-button type="link" @click="selectMember">选择成员</a-button>
		</div>
		<a-table
			v-if="memberData.length > 0"
			:columns="columns"
			:data-source="memberData"
			bordered
			row-key="userId"
			size="small"
		>
			<template #bodyCell="{ column, record }: TableRow<DepartmentUser>">
				<template v-if="column.key === 'roles'">
					<span>{{ record.roleNameArray }}</span>
				</template>
				<template v-if="column.key === 'postIds'">
					<a-select
						v-model:value="record.postIds"
						placeholder="请选择"
						mode="multiple"
						class="w-44"
						:options="postList"
					>
					</a-select>
				</template>
				<template v-if="column.key === 'isLeader'">
					<a-switch
						v-model:checked="record.isLeader"
						size="small"
						@change="setCurrentLeader(record as DepartmentUser)"
					/>
				</template>
				<template v-if="column.key === 'operation'">
					<a class="text-red-500" @click="removeUser(record.id)"> <i class="bi bi-trash3 mr-1"></i>移除 </a>
				</template>
			</template>
		</a-table>
		<div v-else class="border rounded-lg h-[300px]">
			<m-empty size="small" />
		</div>
		<!-- <div>部门成员</div> -->
		<template #footer>
			<div class="text-right my-8">
				<a-button class="mr-5" @click="onCancel">取消</a-button>
				<a-button class="mr-5" type="primary" @click="onSave(true)">保存</a-button>
				<a-button type="primary" @click="onSave(false)">保存并启用</a-button>
			</div>
		</template>
	</a-drawer>
	<user-select
		v-if="selectOpen"
		v-model:open="selectOpen"
		:selected="memberData.map((item) => item.id)"
		:disable="[]"
		:client-id="clientId"
		@select="onSelectMember"
		:select-role="['leader', 'student', 'teacher', 'company']"
	/>
</template>

<script setup lang="ts">
import { columns, DepartmentUser, formDepartmentParam, initDepartmentAdd } from '../config';
import { getDepartmentDetail, getPostList, saveDepartment } from '@/axios';
import UserSelect from '@/view/base/user/components/user-select.vue';
import { message } from 'ant-design-vue';
import CloseSvg from '@/assets/icons/close.svg';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useUserStore from '@/store/modules/useUserStore.ts';

const { token } = useAppTheme();

const props = defineProps<{
	pageType: string;
	parentInfoList: Option[];
	departmentId: string;
}>();
const open = defineModel({ type: Boolean });
const emits = defineEmits(['fetchList']);
const currentParentInfo = ref<Option[]>([]);
const formParams = ref<formDepartmentParam>(initDepartmentAdd());
const memberData = ref<DepartmentUser[]>([]);
const formRef = ref();
const { user } = useUserStore();
const clientId = computed(() => {
	return user.value!.clientId;
});

// 当前部门负责人
const currentLeaderName = computed(() => {
	const currentRecord = memberData.value.find((item) => item.isLeader);
	return currentRecord?.name;
});

// 设置当前负责人
const setCurrentLeader = (record: DepartmentUser) => {
	formParams.value.leaderId = record.id;
	memberData.value.forEach((item) => {
		if (item.id !== record.id) {
			item.isLeader = false;
		}
	});
};

const memberCount = computed(() => {
	return memberData.value?.length;
});

// 选择成员
const selectOpen = ref<boolean>(false);
function selectMember() {
	selectOpen.value = true;
}

function onCancel() {
	open.value = false;
}
function onSave(disable: boolean) {
	formRef.value.validate().then(() => {
		const msgInfo = disable ? '保存成功！' : '保存并启用成功！';
		const userPostData = memberData.value.map((item) => {
			return {
				userId: item.id,
				postIds: item.postIds || [],
			};
		});
		const params = {
			...formParams.value,
			userPostData,
			disable,
		};
		saveDepartment(params)
			.then(() => {
				message.success(msgInfo);
			})
			.finally(() => {
				onCancel();
				emits('fetchList');
			});
	});
}

const removeUser = (id: string) => {
	memberData.value = memberData.value.filter((item) => item.id !== id);
};
const onSelectMember = (state: { keys: string[]; records: User[] }) => {
	memberData.value.push(
		...state.records.map((item: User) => {
			return {
				...item,
				postIds: [],
				isLeader: false,
			};
		}),
	);
	selectOpen.value = false;
};
const postList = ref<Option[]>([]);
function getPostDict() {
	getPostList().then((res) => {
		postList.value = res.data;
	});
}

onMounted(() => {
	getPostDict();
	currentParentInfo.value = props.parentInfoList;
	// 是编辑的话，直接回显数据
	if (props.pageType === 'edit') {
		currentParentInfo.value = props.parentInfoList.filter((item) => item.value !== props.departmentId);
		getDepartmentDetail(props.departmentId).then((res) => {
			const { department, users } = res.data;
			formParams.value = department;
			memberData.value = users.map((item, index) => {
				return {
					...item,
					postIds: department.userPostData[index].postIds || [],
					isLeader: department.leaderId === item.id,
				};
			});
		});
	}
});
</script>
