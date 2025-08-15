<script setup lang="ts">
import { College, initCollege } from '@/view/admin/college/config.ts';
import CollegeDomainSelect from '@/view/admin/college/components/college-domain-select.vue';
import { Domain } from '@/view/admin/domain/config.ts';
import { FormInstance } from 'ant-design-vue/es/form';
import { createCollege, fetchSchoolUserList, getCollegeDomainById } from '@/axios';
import UserSelect from '@/view/base/user/components/user-select.vue';
import CloseSvg from '@/assets/icons/close.svg';
import useUserStore from '@/store/modules/useUserStore.ts';

const props = defineProps<{
	pageType: String;
	college?: College;
}>();
const open = defineModel('open', { required: true, type: Boolean, default: false });
const emit = defineEmits(['success']);
const { user } = useUserStore();
const college = ref(initCollege());
const selectUserVisible = ref<boolean>(false);
const selectedUserIds = ref<string[]>([]);
const form = ref<FormInstance>();
const handleSubmit = () => {
	form.value?.validate().then(() => {
		createCollege(college.value).then(() => {
			emit('success');
		});
	});
};

const domainData = ref<Domain[]>([]);
const openSelectDomain = ref(false);
const handleSelectDomain = (data: Domain[]) => {
	openSelectDomain.value = false;
	domainData.value.push(...data);
	college.value.domainData = domainData.value.map((item) => item.id);
};
const columns: TableColumns<Domain> = [
	{ key: 'name', dataIndex: 'name', title: '专业(群)名称', ellipsis: true },
	{ key: 'name1', title: '专业大类', ellipsis: true },
	{ key: 'name2', title: '专业类', ellipsis: true },
	{ key: 'name3', title: '专业名称', ellipsis: true },
	{ key: 'code', title: '专业代码', width: 80 },
	{ key: 'operation', title: '操作', width: 80 },
];
const handleRemoveDomain = (id: string) => {
	domainData.value = domainData.value.filter((item) => item.id !== id);
	college.value.domainData = domainData.value.map((item) => item.id);
};

const leaderOptions = ref<Option[]>();
const selectUser = (state: { keys: Array<string>; records: Array<User> }) => {
	leaderOptions.value = state.records.map((item) => ({ label: item.name, value: item.id }));
	college.value.leaderId = state.keys[0];
	selectedUserIds.value = state.keys;
	selectUserVisible.value = false;
};

onMounted(() => {
	if (props.pageType === 'edit') {
		fetchSchoolUserList({ clientId: user.value!.clientId, code: 'leader', current: 1, pageSize: 10 }).then((res) => {
			leaderOptions.value = res.records.map((item) => ({ label: item.name, value: item.id }));
		});
		college.value = props.college || initCollege();
		getCollegeDomainById(props?.college!.id!).then((res) => {
			domainData.value = res || [];
		});
	}
});
</script>

<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
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
		<div class="drawer-title">基本信息</div>
		<a-form ref="form" :model="college" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
			<div class="grid grid-cols-2">
				<a-form-item label="院系名称" name="name" :rules="[{ required: true, message: '请输入院系名称' }]">
					<a-input v-model:value="college.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item label="专业数量" :rules="[{ required: true, message: '请选择专业' }]">
					<a-input v-model:value="college.domainData.length" suffix="个" disabled></a-input>
				</a-form-item>
				<a-form-item label="院系领导" name="leaderId">
					<!--				<a-form-item :rules="[{ required: true, message: '请输入选择院系领导' }]" label="院系领导" name="leaderId">-->
					<a-select v-model:value="college.leaderId" disabled :options="leaderOptions" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item>
					<a-button type="link" @click="() => (selectUserVisible = true)">选择领导</a-button>
				</a-form-item>
				<a-form-item
					:label-col="{ span: 3 }"
					:rules="[{ required: true, message: '请输入院系简介' }]"
					:wrapper-col="{ span: 21 }"
					class="col-span-full"
					label="院系简介"
					name="description"
				>
					<a-textarea v-model:value="college.description" placeholder="请输入" :auto-size="{ minRows: 2 }"></a-textarea>
				</a-form-item>
			</div>
		</a-form>
		<a-divider />
		<div class="flex justify-between items-center">
			<div class="drawer-title">专业设置</div>
			<a-button type="link" @click="openSelectDomain = true">选择专业</a-button>
		</div>
		<a-table
			v-if="domainData.length > 0"
			size="small"
			:columns="columns"
			bordered
			:data-source="domainData"
			:pagination="false"
			table-layout="fixed"
			row-key="id"
		>
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
				<template v-if="column.key === 'operation'">
					<a class="text-red-500" type="link" @click="handleRemoveDomain(record.id)">
						<i class="bi bi-trash3 mr-1"></i>移除
					</a>
				</template>
			</template>
		</a-table>
		<div v-else class="border rounded-lg h-[300px]">
			<m-empty size="small" />
		</div>
		<college-domain-select
			v-model:selected="college.domainData"
			v-if="openSelectDomain"
			v-model:open="openSelectDomain"
			@change="handleSelectDomain"
		/>
		<template #footer>
			<div class="py-2 text-right">
				<a-space>
					<a-button type="default" @click="open = false">取消</a-button>
					<a-button type="primary" @click="handleSubmit">确认</a-button>
				</a-space>
			</div>
		</template>
	</a-drawer>
	<user-select
		v-if="selectUserVisible"
		:client-id="user!.clientId"
		:selected="[]"
		:disable="[]"
		:select-role="['leader']"
		v-model:open="selectUserVisible"
		@select="selectUser"
	/>
</template>
