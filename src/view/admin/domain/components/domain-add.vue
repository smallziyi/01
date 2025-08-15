<template>
	<a-drawer v-model:open="open" :closable="false" destroy-on-close width="864">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">新建专业{{ $props.createGroup ? '群' : '' }}</div>
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
		<a-form ref="formRef" :model="domain" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
			<template class="grid grid-cols-2">
				<a-form-item :rules="[{ required: true }]" label="类型选择" name="isMajorGroup">
					<a-radio-group v-model:value="domain.isMajorGroup" disabled>
						<a-radio :value="false">专业</a-radio>
						<a-radio :value="true">专业群</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item
					:rules="[{ required: true, message: '请输入专业名称', trigger: 'change' }]"
					label="专业名称"
					name="name"
				>
					<a-input v-model:value="domain.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item
					:label-col="{ span: 3 }"
					:rules="[{ required: true, message: '请输入专业介绍', trigger: 'change' }]"
					:wrapper-col="{ span: 21 }"
					class="col-span-full"
					label="专业介绍"
					name="description"
				>
					<a-textarea v-model:value="domain.description" placeholder="请输入" :auto-size="{ minRows: 2 }" />
				</a-form-item>
			</template>
		</a-form>
		<a-divider />
		<div class="drawer-title">专业信息</div>
		<domain-add-major
			v-model:group="domain.isMajorGroup"
			:major-data="domain.domainMajorDataList"
			:page-type="type"
			@update="handleSelectMajor"
		/>
		<a-divider />
		<div class="drawer-title">行业信息</div>
		<domain-add-industry :data-info="domain.domainIndustryDataList" :page-type="type" @update="handleSelectIndustry" />
		<a-divider />
		<div class="drawer-title">职业信息</div>
		<domain-add-occupation
			:data-info="domain.domainOccupationDataList"
			:page-type="type"
			@update="handleSelectOccupation"
		/>
		<a-divider />
		<div class="drawer-title">岗位信息</div>
		<domain-add-post :data-info="domain.domainPostDataList" :page-type="type" @update="handleSelectPost" />
		<a-divider />
		<div class="drawer-title">证书信息</div>
		<domain-add-certificate
			:data-info="domain.domainCertificateDataList"
			:page-type="type"
			@update="handleSelectCertificate"
		/>
		<template #footer>
			<div class="text-right">
				<a-space>
					<a-button>取消</a-button>
					<a-button type="primary" @click="handleSubmit">确认</a-button>
				</a-space>
			</div>
		</template>
	</a-drawer>
</template>

<script setup lang="ts">
import DomainAddMajor from '@/view/admin/domain/components/domain-add-major.vue';
import {
	Domain,
	DomainCertificate,
	DomainIndustry,
	DomainMajor,
	DomainOccupation,
	DomainPost,
	initDomain,
} from '@/view/admin/domain/config.ts';
import { createDomain } from '@/axios';
import DomainAddPost from '@/view/admin/domain/components/domain-add-post.vue';
import CloseSvg from '@/assets/icons/close.svg';
import DomainAddIndustry from '@/view/admin/domain/components/domain-add-industry.vue';
import DomainAddCertificate from '@/view/admin/domain/components/domain-add-certificate.vue';
import DomainAddOccupation from '@/view/admin/domain/components/domain-add-occupation.vue';
import { message } from 'ant-design-vue';

const emit = defineEmits(['success']);

const createGroup = defineModel('createGroup', { required: true, type: Boolean });
const open = defineModel('open', { required: true, type: Boolean });
const props = defineProps<{ domain?: Domain; type: 'create' | 'edit' | 'view' }>();
const formRef = ref();
const handleSelectMajor = (data: DomainMajor[][]) => {
	domain.value.domainMajorDataList = data;
};
const handleSelectPost = (data: DomainPost[][]) => {
	domain.value.domainPostDataList = data;
};
const handleSelectIndustry = (data: DomainIndustry[][]) => {
	domain.value.domainIndustryDataList = data;
};
const handleSelectCertificate = (data: DomainCertificate[]) => {
	domain.value.domainCertificateDataList = data;
};
const handleSelectOccupation = (data: DomainOccupation[][]) => {
	domain.value.domainOccupationDataList = data;
};
const domain = ref(initDomain(createGroup.value));

const handleSubmit = () => {
	formRef.value.validate().then(() => {
		domain.value.domainMajorDataList = domain.value.domainMajorDataList.filter(
			(major) => JSON.stringify(major) !== '[]',
		);
		if (domain.value.domainMajorDataList.length === 0) {
			message.warning('至少绑定一个专业');
			return;
		}
		if (!domain.value.domainMajorDataList.every((item) => item[3].target)) {
			message.warning('培养方向不能为空！');
			return;
		}
		domain.value.domainIndustryDataList = domain.value.domainIndustryDataList.filter(
			(domain) => JSON.stringify(domain) !== '[]',
		);
		if (domain.value.domainIndustryDataList.length === 0) {
			message.warning('至少绑定一个行业');
			return;
		}
		domain.value.domainOccupationDataList = domain.value.domainOccupationDataList.filter(
			(occupation) => JSON.stringify(occupation) !== '[]',
		);
		if (domain.value.domainOccupationDataList.length === 0) {
			message.warning('至少绑定一个职业');
			return;
		}
		domain.value.domainPostDataList = domain.value.domainPostDataList.filter((post) => JSON.stringify(post) !== '[]');
		if (domain.value.domainPostDataList.length === 0) {
			message.warning('至少绑定一个岗位');
			return;
		}
		domain.value.domainCertificateDataList = domain.value.domainCertificateDataList.filter(
			(certificate) => certificate.name !== '',
		);
		if (domain.value.domainCertificateDataList.length === 0) {
			message.warning('至少绑定一个资格证书');
			return;
		}
		createDomain(domain.value).then(() => {
			message.success('创建完成');
			emit('success');
		});
	});
};

onMounted(() => {
	if (props.type !== 'create') {
		domain.value = props.domain!;
	}
});
</script>
