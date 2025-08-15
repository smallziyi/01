<template>
	<div class="flex justify-between items-center w-full">
		<div class="flex items-center font-bold">
			<template v-if="$config.clientPage === '1'">
				<zgeq-svg />
				<div class="ml-5 text-xl">优质中职学校和专业建设质量诊断与改进系统</div>
			</template>
			<template v-else-if="$config.clientPage === '2'">
				<jilin-svg />
				<div class="ml-5 text-xl">吉林铁道职业技术学院</div>
			</template>
			<template v-else-if="$config.clientPage === '3'">
				<zhongshan-svg />
				<div class="ml-5 text-xl">中山市第一职业技术学校</div>
			</template>
			<template v-else-if="$config.clientPage === '4'">
				<img class="h-[56px]" src="@/assets/image/login/eerduosi.jpg">
			</template>
			<template v-else>
				<img v-if="appTheme === 'white'" class="h-10" alt="logo动画" src="../assets/image/login/title-logo.gif" />
				<img v-else alt="logo动画" src="../assets/image/login/title-logo-white.png" />
			</template>
		</div>
		<div class="flex h-[56px]">
			<a-tabs v-model:activeKey="currentKey" size="large" @change="handleChangeTabs">
				<a-tab-pane v-if="isShowWorkbench" key="1" tab="工作台"></a-tab-pane>
				<a-tab-pane key="2" tab="关于我们"></a-tab-pane>
				<a-tab-pane key="3" tab="问题反馈"></a-tab-pane>
			</a-tabs>
			<skin-outlined class="ml-16 mr-4" @click="open = true" />
			<a-dropdown :trigger="['click']">
				<div class="flex gap-2 items-center select-none cursor-pointer">
					<div class="rounded-full overflow-hidden"><img :src="user?.avatarUrl" alt="" class="size-6" /></div>
					<div class="leading-6">{{ user?.name }}<i class="bi bi-caret-down-fill ml-1"></i></div>
				</div>
				<template #overlay>
					<a-menu>
						<a-menu-item key="1" @click="openUserCenter = true">
							<div class="flex justify-between">
								<div>用户设置</div>
							</div>
						</a-menu-item>
						<a-menu-item key="2" @click="handleUploadPassword">
							<div class="flex justify-between">
								<div>修改密码</div>
							</div>
						</a-menu-item>
						<a-menu-divider />
						<a-menu-item key="3" danger @click="handleLogout">
							<div class="flex justify-between">
								<div>退出登录</div>
							</div>
						</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>
		</div>
	</div>
	<user-center v-model:open="openUserCenter" />
	<a-drawer v-model:open="open" :close-icon="false" width="640px">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">主题</div>
				<div>
					<a-button type="text" @click="open = false">
						<template #icon>
							<i class="bi bi-x-lg"></i>
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div class="grid grid-cols-2 gap-4">
			<div class="rounded-lg overflow-hidden cursor-pointer" @click="setAppTheme('white')">
				<img v-if="appTheme !== 'white'" alt="" class="w-full h-full" src="../assets/theme/朝露白.webp" />
				<img v-else-if="appTheme === 'white'" alt="" class="w-full h-full" src="../assets/theme/朝露白check.webp" />
			</div>
			<div class="rounded-lg overflow-hidden cursor-pointer" @click="setAppTheme('blue')">
				<img v-if="appTheme !== 'blue'" alt="" class="w-full h-full" src="../assets/theme/科技蓝.webp" />
				<img v-else-if="appTheme == 'blue'" alt="" class="w-full h-full" src="../assets/theme/科技蓝check.webp" />
			</div>
		</div>
	</a-drawer>
	<a-modal v-model:open="openUpdatePassword" title="修改密码" @ok="handleOk">
		<a-form ref="form" :model="updatePasswordForm" :rules layout="vertical">
			<a-form-item label="输入旧密码" name="oldPassword">
				<a-input-password v-model:value="updatePasswordForm.oldPassword" />
			</a-form-item>
			<a-form-item label="输入新密码" name="newPassword">
				<a-input-password v-model:value="updatePasswordForm.newPassword" />
			</a-form-item>
			<a-form-item label="确认新密码" name="confirmPassword">
				<a-input-password v-model:value="updatePasswordForm.confirmPassword" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script setup lang="ts">
import UserCenter from '@/layout/components/user/user-center.vue';
import { SkinOutlined } from '@ant-design/icons-vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { FormInstance, Rule } from 'ant-design-vue/es/form';
import { regexConfig } from '@/config/regex.ts';
import { message } from 'ant-design-vue';
import { checkPassword, logout, updatePassword } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';
import jilinSvg from '@/assets/image/login/jilin.svg';
import zhongshanSvg from '@/assets/image/login/zhongshan.svg';
import zgeqSvg from '@/assets/image/login/zge.svg';
const router = useRouter();
const { user, permissions } = useUserStore();

const openUserCenter = ref(false);
const isShowWorkbench = ref(false);
const open = ref(false);
const currentKey = ref<Key>('');

onMounted(() => {
	const isWorkBench = permissions.value.find((item) => item.path.startsWith('/workbench'));
	isShowWorkbench.value = !!isWorkBench;
	if (router.currentRoute.value.path.startsWith('/workbench')) {
		currentKey.value = '1';
	} else if (router.currentRoute.value.path === '/about') {
		currentKey.value = '2';
	} else if (router.currentRoute.value.path === '/feedback') {
		currentKey.value = '3';
	} else {
		currentKey.value = '4';
	}
});
const handleChangeTabs = (activeKey: Key) => {
	currentKey.value = activeKey;
	if (activeKey === '3') {
		router.push('/feedback');
	}
	if (activeKey === '1') {
		const findItem = permissions.value.find((item) => item.path.startsWith('/workbench'));
		if (findItem) {
			router.push(findItem.path);
		}
	} else if (activeKey === '4') {
		const path = permissions.value.find((item) => !item.path.startsWith('/workbench'));
		if (path) {
			router.push(path);
		} else {
			router.push('/login');
		}
	} else if (activeKey === '2') {
		router.push('/about');
	}
};

const { appTheme, setAppTheme } = useAppTheme();

const openUpdatePassword = ref(false);
const handleUploadPassword = () => {
	openUpdatePassword.value = true;
};
const updatePasswordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const form = ref<FormInstance>();
const validatePass1 = async (_rule: Rule, value: string) => {
	if (value === '') {
		return Promise.reject('请输入新密码');
	} else if (!regexConfig.password.test(value)) {
		return Promise.reject('密码包含至少一个字母和一个数字，允许但不强制包含特殊字符 !@#$%&*，并且长度在6到18位之间。');
	} else {
		return Promise.resolve();
	}
};
const validatePass2 = async (_rule: Rule, value: string) => {
	if (value === '') {
		return Promise.reject('请确认新密码');
	} else if (value !== updatePasswordForm.value.newPassword) {
		return Promise.reject('两次输入的密码不一致');
	} else {
		return Promise.resolve();
	}
};
const rules: Record<string, Rule[]> = {
	oldPassword: [{ required: true, message: '请输入旧密码' }],
	newPassword: [{ validator: validatePass1, trigger: 'change' }],
	confirmPassword: [{ validator: validatePass2, trigger: 'change' }],
};

const handleOk = () => {
	form.value
		?.validate()
		.then(() => {
			checkPassword({ userId: user.value!.id, password: updatePasswordForm.value.oldPassword }).then((res) => {
				if (res) {
					updatePassword({ userId: user.value!.id, destPassword: updatePasswordForm.value.newPassword }).then(() => {
						openUpdatePassword.value = false;
						logout();
					});
				} else {
					message.error('旧密码不正确');
				}
			});
		})
		.catch((err: FormError) => {
			message.warning(err.errorFields[0].errors[0]);
		});
};

const handleLogout = () => {
	logout().then(() => {
		message.success('退出成功！');
		router.push('/login');
	});
};
</script>

<style scoped>
:deep(.ant-tabs-nav::before) {
	display: none !important;
}
</style>
