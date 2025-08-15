<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看详情</div>
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
			<a-descriptions-item label="教研组织名称">{{ detailModel.name }}</a-descriptions-item>
			<a-descriptions-item label="上级教研组织">{{ detailModel.parentName }}</a-descriptions-item>
			<a-descriptions-item label="团队成员个数">{{ detailModel.memberCount }}人</a-descriptions-item>
			<a-descriptions-item label="教研组织描述" :span="2">{{ detailModel.description }}</a-descriptions-item>
		</a-descriptions>
		<a-divider />
		<div class="drawer-title">团队成员</div>
		<a-table class="mt-5" :data-source="dataSource" :columns="detailColumns" row-key="id" size="small">
			<template #emptyText>
				<m-empty />
			</template>
			<template #bodyCell="{ column, record }: TableRow<ResearchMemberListItem>">
				<template v-if="column.key === 'gender'">
					{{ record.gender === 0 ? '女' : record.gender === 1 ? '男' : '' }}
				</template>
			</template>
		</a-table>
	</a-drawer>
</template>

<script setup lang="ts">
import { CreateResearchParams, detailColumns, initResearch, ResearchMember, ResearchMemberListItem } from '../config';
import { getResearchDetail } from '@/axios';
import useAppTheme from '@/hooks/useAppTheme.ts';
import CloseSvg from '@/assets/icons/close.svg';

const { token } = useAppTheme();

const props = defineProps<{
	researchId: string;
}>();
const open = defineModel({ type: Boolean });
const detailModel = ref<CreateResearchParams>(initResearch());
const dataSource = ref<ResearchMember[]>([]);

onMounted(() => {
	getResearchDetail(props.researchId).then((res) => {
		const { research, users } = res.data;
		detailModel.value = research;
		dataSource.value = users.map((item, index) => {
			return {
				...item,
				postIds: research.userPostData[index].postIds || [],
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
