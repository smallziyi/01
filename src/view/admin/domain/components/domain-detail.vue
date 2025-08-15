<script setup lang="ts">
import { certificateColumns, Domain, industryColumns, majorColumns, occupationColumns, postColumns } from '../config';
import CloseSvg from '@/assets/icons/close.svg';

const props = defineProps<{
	domainInfo: Domain;
}>();
const {
	domainMajorDataList,
	domainIndustryDataList,
	domainOccupationDataList,
	domainPostDataList,
	domainCertificateDataList,
} = props.domainInfo;
const majorData = computed(() => {
	return domainMajorDataList.map((major) => {
		const { code: bigCategoryCode, name: bigCategoryName } = major[1] || { code: '', name: '' };
		const { code: categoryCode, name: categoryName } = major[2] || { code: '', name: '' };
		const { code: domainCode, name: domainName, target } = major[3] || { code: '', name: '' };
		return { bigCategoryCode, bigCategoryName, categoryCode, categoryName, domainCode, domainName, target };
	});
});
const industryData = computed(() => {
	return domainIndustryDataList.map((industry) => {
		const { code: bigCategoryCode, name: bigCategoryName } = industry[1] || { code: '', name: '' };
		const { code: categoryCode, name: categoryName } = industry[2] || { code: '', name: '' };
		const { code: industryCode, name: industryName } = industry[3] || { code: '', name: '' };
		return { bigCategoryCode, bigCategoryName, categoryCode, categoryName, industryCode, industryName };
	});
});
const occupationData = computed(() => {
	return domainOccupationDataList.map((occupation) => {
		const { code: bigCategoryCode, name: bigCategoryName } = occupation[0] || { code: '', name: '' };
		const { code: categoryCode, name: categoryName } = occupation[1] || { code: '', name: '' };
		const { code: occupationCode, name: occupationName } = occupation[2] || { code: '', name: '' };
		return { bigCategoryCode, bigCategoryName, categoryCode, categoryName, occupationCode, occupationName };
	});
});
const postData = computed(() => {
	return domainPostDataList.map((post) => {
		const { code: bigCategoryCode, name: bigCategoryName } = post[0] || { code: '', name: '' };
		const { code: categoryCode, name: categoryName } = post[1] || { code: '', name: '' };
		const { code: postCode, name: postName } = post[2] || { code: '', name: '' };
		return { bigCategoryCode, bigCategoryName, categoryCode, categoryName, postCode, postName };
	});
});
const certificateData = computed(() => {
	return domainCertificateDataList.map((certificate) => {
		const { name: certificateName, type, description } = certificate || { code: '', type: '', description: '' };
		const certificateType = type === 1 ? '职业资格证书' : type === 2 ? '职业技能登记证书' : '';
		return { certificateName, certificateType, description };
	});
});
const open = defineModel('open', { required: true, type: Boolean });
</script>

<template>
	<a-drawer v-model:open="open" :closable="false" width="864">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看调研详情</div>
				<a-button type="link" @click="open = false">
					<template #icon>
						<close-svg />
					</template>
				</a-button>
			</div>
		</template>
		<div class="drawer-title">基本信息</div>
		<a-descriptions :column="2">
			<a-descriptions-item label="专业类型">{{ domainInfo.isMajorGroup ? '专业群' : '专业' }}</a-descriptions-item>
			<a-descriptions-item></a-descriptions-item>
			<a-descriptions-item label="专业名称">{{ domainInfo.name }}</a-descriptions-item>
			<a-descriptions-item label="专业大类">{{ domainInfo.domainMajorDataList[0][1].name }}</a-descriptions-item>
			<a-descriptions-item label="专业介绍">{{ domainInfo.description }}</a-descriptions-item>
		</a-descriptions>
		<a-divider />
		<div class="drawer-title">专业信息</div>
		<a-table :columns="majorColumns" :dataSource="majorData" :pagination="false">
			<template #emptyText>
				<m-empty />
			</template>
		</a-table>
		<a-divider />
		<div class="drawer-title">行业信息</div>
		<a-table :columns="industryColumns" :dataSource="industryData" :pagination="false">
			<template #emptyText>
				<m-empty />
			</template>
		</a-table>
		<a-divider />
		<div class="drawer-title">职业信息</div>
		<a-table :columns="occupationColumns" :dataSource="occupationData" :pagination="false">
			<template #emptyText>
				<m-empty />
			</template>
		</a-table>
		<a-divider />
		<div class="drawer-title">岗位信息</div>
		<a-table :columns="postColumns" :dataSource="postData" :pagination="false">
			<template #emptyText>
				<m-empty />
			</template>
		</a-table>
		<a-divider />
		<div class="drawer-title">证书信息</div>
		<a-table :columns="certificateColumns" :dataSource="certificateData" :pagination="false">
			<template #emptyText>
				<m-empty />
			</template>
		</a-table>
	</a-drawer>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
