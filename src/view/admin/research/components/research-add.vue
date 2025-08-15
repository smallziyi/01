<template>
	<a-drawer v-model:open="open" width="864" :closable="false" destroy-on-close>
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">{{ pageType === 'edit' ? '编辑' : '新增' }}教研室</div>
				<div>
					<a-button type="link" @click="onCancel">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">基本信息</div>
		<a-form ref="formRef" :model="formParams" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
			<div class="grid grid-cols-2">
				<a-form-item name="name" label="教研组织名称" :rules="[{ required: true, message: '请输入' }]">
					<a-input v-model:value="formParams.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item name="parentId" label="上级教研组织">
					<a-select v-model:value="formParams.parentId" placeholder="请选择" :options="currentParentInfo"> </a-select>
				</a-form-item>
				<a-form-item name="memberCount" label="团队成员个数">
					<a-input v-model:value="memberCount" disabled />
				</a-form-item>
				<a-form-item></a-form-item>
				<a-form-item
					:label-col="{ span: 4 }"
					:rules="[{ required: true, message: '请输入' }]"
					:wrapper-col="{ span: 20 }"
					class="col-span-full"
					label="教研组织描述"
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
			<div class="drawer-title">团队成员</div>
			<a-button type="link" @click="selectMember">选择成员</a-button>
		</div>
		<a-table :data-source="memberData" :columns="columns" row-key="userId" size="small" bordered>
			<template #emptyText>
				<m-empty size="small" />
			</template>
			<template #bodyCell="{ column, record }: TableRow<ResearchMemberListItem>">
				<template v-if="column.key === 'gender'">
					{{ record.gender === 0 ? '女' : record.gender === 1 ? '男' : '' }}
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
				<template v-if="column.key === 'operation'">
					<a class="text-red-500" @click="removeUser(record.id)"> <i class="bi bi-trash3 mr-1"></i>移除 </a>
				</template>
			</template>
		</a-table>
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
		:client-id="clientId"
		:selected="memberData.map((item) => item.id)"
		:disable="[]"
		@select="onSelectMember"
		:select-role="['leader', 'student', 'teacher', 'company']"
	/>
</template>

<script setup lang="ts">
import {
	columns,
	CreateResearchFormParams,
	initCreateResearchForm,
	ResearchMember,
	ResearchMemberListItem,
} from '../config';
import { createResearch, getPostList, getResearchDetail } from '@/axios';
import { message } from 'ant-design-vue';
import UserSelect from '@/view/base/user/components/user-select.vue';
import CloseSvg from '@/assets/icons/close.svg';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useUserStore from '@/store/modules/useUserStore.ts';

const { token } = useAppTheme();

const props = defineProps<{
	pageType: string;
	parentInfoList: Option[];
	researchId: string;
}>();
const open = defineModel('open', { type: Boolean });
const currentParentInfo = ref<Option[]>([]);
const emits = defineEmits(['fetchList']);
const formParams = ref<CreateResearchFormParams>(initCreateResearchForm());
const memberData = ref<ResearchMember[]>([]);
const { user } = useUserStore();
const clientId = computed(() => {
	return user.value!.clientId;
});

const memberCount = computed(() => {
	return memberData.value?.length;
});

// 选择成员
const selectOpen = ref<boolean>(false);
function selectMember() {
	selectOpen.value = true;
}
const removeUser = (id: string) => {
	memberData.value = memberData.value.filter((item) => item.id !== id);
};
function onCancel() {
	open.value = false;
}

function onSave(disable: boolean) {
	const msgInfo = disable ? '保存成功！' : '保存并启用成功！';
	const userPostData = memberData.value.map((item) => {
		return {
			userId: item.id,
			postIds: item.postIds || [],
		};
	});
	const params = {
		...formParams.value,
		disable,
		userPostData,
	};
	createResearch(params)
		.then(() => {
			message.success(msgInfo);
		})
		.finally(() => {
			onCancel();
			emits('fetchList');
		});
}

function onSelectMember(state: { keys: string[]; records: ResearchMember[] }) {
	memberData.value.push(
		...state.records.map((item: ResearchMember) => {
			return {
				...item,
				postIds: [],
			};
		}),
	);
	selectOpen.value = false;
}
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
		getResearchDetail(props.researchId).then((res) => {
			const { research, users } = res.data;
			formParams.value = research;
			if (formParams.value.parentId === '0') {
				formParams.value.parentId = undefined;
			}
			currentParentInfo.value = props.parentInfoList.filter((item) => item.value !== props.researchId);
			memberData.value = users.map((item, index) => {
				return {
					...item,
					postIds: research.userPostData[index].postIds || [],
					postArray: '',
				};
			});
		});
	}
});
</script>
