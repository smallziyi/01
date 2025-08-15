<script setup lang="ts">
import { message } from 'ant-design-vue';
import { addTeachTeam } from '@/axios';
import { StudentTeam } from '../type';
// @ts-ignore
import { Snowyflake, Epoch } from 'snowyflake';

const snowyflake = new Snowyflake({
	workerId: 1n,
	epoch: Epoch.Twitter, // BigInt timestamp
});

const props = defineProps<{
	status?: number;
	teachPlanId: string;
	teamType: 1 | 2;
	groupChunkList: {
		groupId: string;
		groupName: string;
		leaderId: string;
		groupMemberList: Array<{
			userId: string;
			name: string;
			number: string;
			gender: string;
			avatarUrl: string;
			signInFlag: boolean;
		}>;
	}[];
	groupNumber: number;
	groupInfo: {
		id: string;
		name: string;
		leaderId: string;
		userIds: string[];
	}[];
	allStudentList: any[];
	groupPending: any[];
	teamId: string;
}>();

const groupList = ref<
	{
		groupName: string;
		groupId: string;
		leaderId: string;
		groupMemberList: Array<{
			userId: string;
			name: string;
			number: string;
			gender: string;
			avatarUrl: string;
			signInFlag: boolean;
		}>;
	}[]
>([]);

const activeId = ref('');
const leaderId = computed(() => {
	return groupList.value.find((item) => item.groupId === activeId.value)?.leaderId;
});
const editId = ref('');
const tempTeamId = ref('');
const emits = defineEmits(['member', 'delete', 'save']);

// 是否可以提交保存
const isSubmit = computed(() => {
	return props.groupPending.length > 0;
});

const handleAddGroup = () => {
	const index = groupList.value?.length + 1;
	const groupInfo = {
		groupName: `第${index}小组`,
		groupId: snowyflake.nextId().toString(),
		groupMemberList: [],
		leaderId: '',
	};
	groupList.value?.push(groupInfo);
	message.success('新增成功！');
};

const handleSave = () => {
	if (isSubmit.value) {
		message.warning('存在未分配小组成员，请分配后保存');
		return;
	}
	const params: StudentTeam = {
		id: tempTeamId.value || props.teamId,
		teachPlanId: props.teachPlanId,
		teamType: props.teamType,
		autoTeamSize: props.groupNumber,
		teamDataList: groupList.value.map((item) => {
			return {
				id: item.groupId,
				name: item.groupName,
				userIds: item.groupMemberList.map((member) => member.userId),
				leaderId: item.leaderId,
			};
		}),
	};
	addTeachTeam(params).then((res) => {
		tempTeamId.value = res;
		message.success('保存成功！');
		emits('save');
	});
};

const handleDelete = (id: string) => {
	const group = groupList.value?.find((item) => item.groupId === id)?.groupMemberList;
	emits('delete', group);
	groupList.value = groupList.value?.filter((item) => item.groupId !== id);
	if (groupList.value.length > 0) {
		activeId.value = groupList.value[0].groupId;
	} else {
		activeId.value = ''
	}
	const findIndex = props.groupChunkList.findIndex((item) => item.groupId === id);
	props.groupChunkList.splice(findIndex, 1);
	message.success('删除成功！');
};

watch(
	() => props.groupChunkList,
	(val) => {
		if (val.length > 0) {
			if (val[0].groupMemberList.length > 0) {
				groupList.value = val;
				if (!activeId.value) {
					activeId.value = groupList.value[0].groupId;
				}
			}
		}
	},
	{ immediate: true, deep: true },
);

watch(
	() => activeId.value,
	(newVal) => {
		if (newVal) {
			const group = groupList.value?.find((item) => item.groupId === newVal)?.groupMemberList;
			emits('member', group);
		}
	},
	{ immediate: true },
);

watch(
	() => props.groupNumber,
	() => {
		if (activeId.value) {
			const group = groupList.value?.find((item) => item.groupId === activeId.value)?.groupMemberList;
			emits('member', group);
		}
	},
);

watch(
	() => props.groupInfo,
	(val) => {
		if (val.length > 0) {
			groupList.value = val.map((item) => {
				return {
					groupName: item.name,
					groupId: item.id,
					leaderId: item.leaderId,
					groupMemberList: item.userIds.map((userId) =>
						props.allStudentList.find((student) => student.userId === userId),
					),
				};
			});
			if (!activeId.value) {
				activeId.value = val[0].id;
			}
		}
	},
	{ immediate: true, deep: true },
);

watch(
	() => props.teamType,
	(teamType) => {
		if (teamType === 2) {
			groupList.value = [];
		} else {
			if (props.groupInfo.length > 0) {
				groupList.value = props.groupInfo.map((item) => {
					return {
						groupName: item.name,
						groupId: item.id,
						leaderId: item.leaderId,
						groupMemberList: item.userIds.map((userId) =>
							props.allStudentList.find((student) => student.userId === userId),
						),
					};
				});
			} else {
				groupList.value = props.groupChunkList;
			}
		}
	},
);
defineExpose({
	activeId,
	leaderId,
});
</script>

<template>
	<div v-if="status !== 3" class="mb-4 flex justify-between">
		<a-button type="primary" @click="handleAddGroup">新增分组</a-button>
		<a-button type="primary" @click="handleSave">保存</a-button>
	</div>
	<div>
		<div v-for="(group, index) in groupList" :key="index">
			<div
				class="flex justify-between items-center"
				:class="activeId === group.groupId ? 'text-[#0091ff] bg-[rgba(0,145,255,0.1)]' : ''"
			>
				<div class="pl-4 py-2 cursor-pointer" @click="activeId = group.groupId">
					<a-input v-if="group.groupId === editId" v-model:value="group.groupName" />
					<span v-else>{{ group.groupName }}</span>
				</div>
				<div v-if="status !== 3">
					<a-button v-if="editId === group.groupId" class="px-1" type="link" @click="editId = ''">确定</a-button>
					<a-button v-else class="px-1" type="link" @click="editId = group.groupId">编辑</a-button>
					<a-button
						v-if="activeId === group.groupId"
						class="px-1"
						type="link"
						danger
						@click="handleDelete(group.groupId)"
						>删除</a-button
					>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
:deep(.ant-typography) {
	margin-bottom: 0 !important;
}
</style>
