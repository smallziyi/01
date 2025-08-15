<script lang="ts" setup>
import { College } from '@/view/admin/college/config.ts';
import { getCollegeDomainById } from '@/axios';
import { Domain } from '@/view/admin/domain/config.ts';
import CloseSvg from '@/assets/icons/close.svg';

const open = defineModel('open', { required: true, type: Boolean, default: false });
const props = defineProps<{ college: College }>();

const domainData = ref<Domain[]>([]);

onMounted(() => {
	getCollegeDomainById(props.college.id).then((res) => {
		domainData.value = res;
	});
});

const columns: TableColumns<Domain> = [
	{ key: 'name', dataIndex: 'name', title: '专业(群)名称', ellipsis: true },
	{ key: 'name1', title: '专业大类', ellipsis: true },
	{ key: 'name2', title: '专业类', ellipsis: true },
	{ key: 'name3', title: '专业名称', ellipsis: true },
	{ key: 'code', title: '专业代码', width: 80 },
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
		<a-descriptions size="small" :column="2">
			<a-descriptions-item label="院系名称">{{ college.name }}</a-descriptions-item>
			<a-descriptions-item label="专业数量">{{ college.domainData.length }}个</a-descriptions-item>
			<a-descriptions-item label="院系领导">{{ college.leaderName }}</a-descriptions-item>
			<a-descriptions-item label="联系电话">{{ college.leaderPhone }}</a-descriptions-item>
			<a-descriptions-item label="院系简介">{{ college.description }}</a-descriptions-item>
		</a-descriptions>
		<div class="drawer-title mt-8">专业设置</div>
		<a-table
			size="small"
			bordered
			:columns="columns"
			:data-source="domainData"
			:pagination="false"
			table-layout="fixed"
		>
			<template #emptyText>
				<m-empty />
			</template>
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
			</template>
		</a-table>
	</a-drawer>
</template>
