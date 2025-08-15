<template>
	<a-drawer v-model:open="open" width="864" :closable="false" destroy-on-close>
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
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">基本信息</div>
		<a-descriptions :column="2">
			<a-descriptions-item label="部门名称">{{ detailModel.name }}</a-descriptions-item>
			<a-descriptions-item label="上级部门">{{ detailModel.parentName }}</a-descriptions-item>
			<a-descriptions-item label="部门负责人">{{ detailModel.leaderName }}</a-descriptions-item>
			<a-descriptions-item label="成员数量">{{ detailModel.memberCount }}人</a-descriptions-item>
			<a-descriptions-item label="部门描述" :span="2">{{ detailModel.description }}</a-descriptions-item>
		</a-descriptions>
		<a-divider />
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">部门成员</div>
		<a-table class="mt-5" :data-source="dataSource" :columns="detailColumns" row-key="id" size="small">
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record }: TableRow<DepartmentUser>">
				<template v-if="column.key === 'roles'">
					<span>{{ record.roleNameArray }}</span>
				</template>
				<template v-if="column.key === 'isLeader'">
					<a-switch v-model:checked="record.isLeader" size="small" disabled />
				</template>
			</template>
		</a-table>
	</a-drawer>
</template>

<script setup lang="ts">
import { DepartmentUser, detailColumns, formDepartmentParam, initDepartmentItem } from '../config';
import { getDepartmentDetail } from '@/axios';
import useAppTheme from '@/hooks/useAppTheme.ts';
import CloseSvg from '@/assets/icons/close.svg';

const { token } = useAppTheme();

const props = defineProps<{
	departmentId: string;
}>();
const open = defineModel({ type: Boolean });
const detailModel = ref<formDepartmentParam>(initDepartmentItem());
const dataSource = ref<DepartmentUser[]>([]);

onMounted(() => {
	getDepartmentDetail(props.departmentId).then((res) => {
		const { department, users } = res.data;
		detailModel.value = department;
		dataSource.value = users.map((item, index) => {
			return {
				...item,
				postIds: department.userPostData[index].postIds || [],
				isLeader: department.leaderId === item.id,
			};
		});
	});
});
</script>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
