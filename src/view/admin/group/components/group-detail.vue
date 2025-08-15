<script setup lang="ts">
import { Group } from '@/view/admin/group/config.ts';
import { getGroupMember } from '@/axios';
import CloseSvg from '@/assets/icons/close.svg';
import { useTableConfig } from '@/hooks/useTableConfig.ts';

const { pagination } = useTableConfig();

const open = defineModel('open', { required: true, type: Boolean, default: false });
const props = defineProps<{ group: Group }>();

const memberList = reactive<{ student: User[]; teacher: User[] }>({ student: [], teacher: [] });

onMounted(() => {
	getGroupMember(props.group.id).then((res) => {
		memberList.student = res.data.studentList;
		memberList.teacher = res.data.teacherList;
	});
});

const memberColumns: TableColumns<User> = [
	{ key: 'serial-number', title: '序号', width: 60 },
	{ key: 'name', dataIndex: 'name', title: '姓名', width: 120 },
	{ key: 'number', dataIndex: 'number', title: '编号', width: 120 },
	{ key: 'gender', dataIndex: 'gender', title: '性别', width: 120 },
	{ key: 'phone', dataIndex: 'phone', title: '电话', minWidth: 120 },
];
</script>

<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看</div>
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
		<div class="space-y-4">
			<a-descriptions :column="2">
				<a-descriptions-item label="班级名称">{{ group.name }}</a-descriptions-item>
				<a-descriptions-item label="年级">{{ group.grade }}级</a-descriptions-item>
				<a-descriptions-item label="所属院系">
					{{ group.collegeName }}
				</a-descriptions-item>
				<a-descriptions-item label="所学专业">{{ group.domainName }}</a-descriptions-item>
				<a-descriptions-item label="学制">{{ group.year }}年</a-descriptions-item>
			</a-descriptions>
			<a-divider />
			<div class="drawer-title">关联教师</div>
			<a-table :pagination="false" :columns="memberColumns" :data-source="memberList.teacher" bordered size="small">
				<template #emptyText>
					<m-empty />
				</template>
				<template #bodyCell="{ column, record, index }: TableRow<User>">
					<template v-if="column.key === 'serial-number'">
						{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
					</template>
					<template v-if="column.key === 'gender'">
						<div v-if="record.gender === 1">男</div>
						<div v-if="record.gender === 0">女</div>
					</template>
				</template>
			</a-table>
			<a-divider />
			<div class="drawer-title">关联学生</div>
			<a-table :pagination="false" :columns="memberColumns" :data-source="memberList.student" bordered size="small">
				<template #emptyText
					>y
					<m-empty />
				</template>
				<template #bodyCell="{ column, record, index }: TableRow<User>">
					<template v-if="column.key === 'serial-number'">
						{{ (pagination.current! - 1) * pagination.pageSize! + index + 1 }}
					</template>
					<template v-if="column.key === 'gender'">
						<div v-if="record.gender === 1">男</div>
						<div v-if="record.gender === 0">女</div>
					</template>
				</template>
			</a-table>
		</div>
	</a-drawer>
</template>

<style scoped></style>
