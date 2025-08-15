<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { updateUser, updateUserAvatar } from '@/axios';
import { UploadChangeParam } from 'ant-design-vue/lib';
import { UploadFile } from 'ant-design-vue/es/upload/interface';
import { regexConfig } from '@/config/regex';
import useUserStore from '@/store/modules/useUserStore.ts';

const { user, setUser } = useUserStore();
const router = useRouter();
const open = defineModel<boolean>('open', { required: true });

const state = reactive<{
	updatePhone: boolean;
	phone: string;
	updateEmail: boolean;
	email: string;
	updateIdCard: boolean;
	idCard: string;
	updateAddress: boolean;
	address: string;
	updateNativePlace: boolean;
	nativePlace: string;
}>({
	updatePhone: false,
	phone: '',
	updateEmail: false,
	email: '',
	updateIdCard: false,
	idCard: '',
	updateAddress: false,
	address: '',
	updateNativePlace: false,
	nativePlace: '',
});

const auth = sessionStorage.getItem('jwt') || '';

const fileList = ref([]);
const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
	if (info.file.status === 'done' && info.file.xhr?.response) {
		const file = JSON.parse(info.file.xhr?.response) as IFile;
		updateUserAvatar(user.value?.id || '', file.id).then((res) => {
			setUser({ ...res });
			if (router.currentRoute.value.path.startsWith('/workbench')) {
				router.go(0);
			}
			fileList.value = [];
		});
	}
};
type PropertyType = 'phone' | 'idCard' | 'email' | 'address' | 'nativePlace';
type UpdateProperty = 'updatePhone' | 'updateIdCard' | 'updateEmail' | 'updateAddress' | 'updateNativePlace';
const handleStartUpdateProperty = (property: PropertyType, updateProperty: UpdateProperty): void => {
	state[property] = user.value![property] || '';
	state[updateProperty] = true;
};

const handleCancelUpdateProperty = (property: PropertyType, updateProperty: UpdateProperty) => {
	state[property] = user.value![property] || '';
	state[updateProperty] = false;
};

const handleUpdateProperty = (
	property: PropertyType,
	updateProperty: UpdateProperty,
	regex: RegExp,
	errorMessage: string,
) => {
	if (regex.test(state[property])) {
		updateUser({ ...user.value!, [property]: state[property] }).then(() => {
			user.value![property] = state[property];
			message.success('保存成功! ');
			handleCancelUpdateProperty(property, updateProperty);
		});
	} else {
		state[updateProperty] = true;
		message.warning(`${errorMessage}格式不正确`);
	}
};

onMounted(() => {
	state.phone = user.value!.phone || '';
	state.email = user.value!.email || '';
	state.idCard = user.value!.idCard || '';
	state.address = user.value!.address || '';
	state.nativePlace = user.value!.nativePlace || '';
});
</script>

<template>
	<a-modal v-model:open="open" :footer="false" class="w-[640px]" title="用户信息">
		<div class="flex h-32 mt-4 gap-8">
			<a-badge :offset="[-16, 110]">
				<template #count>
					<a-upload
						v-model:file-list="fileList"
						:action="`${$config.file}/upload`"
						:headers="{ authorization: auth ?? '' }"
						:show-upload-list="false"
						:max-count="1"
						accept=".png,.jpg,.jpeg"
						@change="handleFileChange"
					>
						<a-button shape="circle">
							<template #icon>
								<i class="bi bi-camera"></i>
							</template>
						</a-button>
					</a-upload>
				</template>
				<a-avatar :src="user!.avatarUrl" class="size-32"></a-avatar>
			</a-badge>
			<div class="grow">
				<div class="text-xl font-bold leading-10">{{ user!.name }}</div>
				<div class="leading-10"><i class="bi bi-person-vcard mr-2"></i> {{ user!.number }}</div>
				<div class="leading-10 flex gap-4">
					<div><i class="bi bi-calendar-date mr-2"></i> {{ user!.birthday ? $datetime.format(user!.birthday, 'date') : '' }}</div>
					<div>
						<i v-if="user!.gender === 0" class="bi bi-gender-female mr-2 text-pink-500"></i>
						<i v-if="user!.gender === 1" class="bi bi-gender-male mr-2 text-blue-500"></i>
						{{ user!.gender === 0 ? '女': user!.gender === 1 ? '男' : ''  }}
					</div>
				</div>
			</div>
		</div>

		<div class="flex leading-8 mt-4 items-center">
			<div class="w-24">账号</div>
			<div class="grow">{{ user!.authAccount }}</div>
			<div></div>
		</div>
		<a-divider style="margin: 10px 0" />
		<div class="flex leading-8 items-center">
			<div class="w-24">手机号</div>
			<a-typography-paragraph
				v-model:content="state.phone"
				:editable="{
					editing: state.updatePhone,
					onStart: () => handleStartUpdateProperty('phone', 'updatePhone'),
					onEnd: () => handleUpdateProperty('phone', 'updatePhone', regexConfig.phoneNumber, '手机号'),
				}"
				class="grow m-0"
				copyable
			/>
			<a-button v-if="state.updatePhone" type="link" @click="handleCancelUpdateProperty('phone', 'updatePhone')"
				><i class="bi bi-x-circle text-red-500 text-base"></i
			></a-button>
		</div>
		<a-divider style="margin: 10px 0" />
		<div class="flex leading-8 items-center">
			<div class="w-24">邮箱</div>
			<a-typography-paragraph
				v-model:content="state.email"
				:editable="{
					editing: state.updateEmail,
					onStart: () => handleStartUpdateProperty('email', 'updateEmail'),
					onEnd: () => handleUpdateProperty('email', 'updateEmail', regexConfig.email, '邮箱'),
				}"
				class="grow m-0"
				copyable
			/>
			<a-button v-if="state.updateEmail" type="link" @click="handleCancelUpdateProperty('email', 'updateEmail')"
				><i class="bi bi-x-circle text-red-500 text-base"></i
			></a-button>
		</div>
		<a-divider style="margin: 10px 0" />
		<div class="flex leading-8 items-center">
			<div class="w-24">身份证</div>
			<a-typography-paragraph v-model:content="state.idCard" class="grow m-0" copyable />
			<a-button v-if="state.updateIdCard" type="link" @click="handleCancelUpdateProperty('idCard', 'updateIdCard')"
				><i class="bi bi-x-circle text-red-500 text-base"></i
			></a-button>
		</div>
		<a-divider style="margin: 10px 0" />
		<div class="flex leading-8 items-center">
			<div class="w-24">现住址</div>
			<a-typography-paragraph
				v-model:content="state.address"
				:editable="{
					editing: state.updateAddress,
					onStart: () => handleStartUpdateProperty('address', 'updateAddress'),
					onEnd: () => handleUpdateProperty('address', 'updateAddress', regexConfig.address, '现住址'),
				}"
				class="grow m-0"
				copyable
			/>
			<a-button v-if="state.updateAddress" type="link" @click="handleCancelUpdateProperty('address', 'updateAddress')"
				><i class="bi bi-x-circle text-red-500 text-base"></i
			></a-button>
		</div>
		<a-divider style="margin: 10px 0" />
		<div class="flex leading-8 items-center">
			<div class="w-24">籍贯</div>
			<a-typography-paragraph
				v-model:content="state.nativePlace"
				:editable="{
					editing: state.updateNativePlace,
					onStart: () => handleStartUpdateProperty('nativePlace', 'updateNativePlace'),
					onEnd: () => handleUpdateProperty('nativePlace', 'updateNativePlace', regexConfig.address, '籍贯'),
				}"
				class="grow m-0"
				copyable
			/>
			<a-button
				v-if="state.updateNativePlace"
				type="link"
				@click="handleCancelUpdateProperty('nativePlace', 'updateNativePlace')"
				><i class="bi bi-x-circle text-red-500 text-base"></i
			></a-button>
		</div>
	</a-modal>
</template>
