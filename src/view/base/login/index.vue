<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { LoginInfo } from './config.ts';
import { getRolePermission, login } from '@/axios';
import StudentSvg from '@/assets/role/sutdent.svg';
import StudentHoverSvg from '@/assets/role/student-hover.svg';
import StudentSelectedSvg from '@/assets/role/student-selected.svg';
import SchoolmanSvg from '@/assets/role/schoolman.svg';
import SchoolmanHoverSvg from '@/assets/role/schoolman-hover.svg';
import SchoolmanSelectedSvg from '@/assets/role/schoolman-selected.svg';
import TeacherSvg from '@/assets/role/teacher.svg';
import TeacherHoverSvg from '@/assets/role/teacher-hover.svg';
import TeacherSelectedSvg from '@/assets/role/teacher-selected.svg';
import ManagerSvg from '@/assets/role/manager.svg';
import ManagerHoverSvg from '@/assets/role/manager-hover.svg';
import ManagerSelectedSvg from '@/assets/role/manager-selected.svg';
import LeaderSvg from '@/assets/role/leader.svg';
import LeaderHoverSvg from '@/assets/role/leader-hover.svg';
import LeaderSelectedSvg from '@/assets/role/leader-selected.svg';
import CloudSvg from '@/assets/role/cloud.svg';
import CloudHoverSvg from '@/assets/role/cloud-hover.svg';
import CloudSelectedSvg from '@/assets/role/cloud-selected.svg';
import LoginSvg from '@/assets/image/login/logo.svg';
import { message } from 'ant-design-vue';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import useUserStore from '@/store/modules/useUserStore.ts';
import router from '@/router';
import { FormInstance } from 'ant-design-vue/es/form';

const loginForm = ref<LoginInfo>({
	account: '',
	password: '',
	phone: undefined,
	code: undefined,
	checked: undefined,
});

// 0 密码 1验证码 2扫码
const currentWay = ref<number>(0);
const isRoleSelected = ref<boolean>(false);
// 1 学生  2 老师 3领导 4 后台管理员  5 学校后台管理员 6 企业
const selectedRole = ref<string>('');
const hoverRole = ref<string>('');

const roles = ref<Array<Option>>([]);
const roleList = ref<string[]>([]);
const roleKeyValue = ref<Record<string, string>>({});
const formRef = useTemplateRef<FormInstance>('formRef');
const isRememberMe = ref<boolean>(true);

const userStore = useUserStore();
const handleLogin = () => {
	formRef.value!.validate().then(() => {
		login(loginForm.value.account, loginForm.value.password, isRememberMe.value).then((res) => {
			userStore.setUser(res);
			roleList.value = res.roleList.map((item) => item.code);
			roles.value = res.roleList.map((role) => ({ label: role.code, value: role.id }));
			roleKeyValue.value = roles.value.reduce(
				(acc, role) => {
					acc[role.label] = role.value as string;
					return acc;
				},
				{} as Record<string, string>,
			);
			if (roles.value.length === 0) {
				message.warning('该用户没有角色,请联系管理员绑定角色');
			} else if (roles.value.length === 1) {
				const currentRole = roles.value[0].value as string;
				handleSelectRole(currentRole);
			} else {
				isRoleSelected.value = true;
			}
		});
	});
};

const tempToken = ref('');

const handleSelectRole = async (role: string) => {
	getRolePermission(role).then((permissions) => {
		userStore.setPermission(
			permissions.map((permission) => {
				return { id: permission.id, path: permission.path, name: permission.name, parentId: permission.parentId };
			}),
		);
		router.push(permissions[0].path);
		const dictionaryStore = useDictionaryStore();
		dictionaryStore.fetchDictionary();
	});
};

const handleBackLogin = () => {
	sessionStorage.removeItem('jwt');
	tempToken.value = '';
	isRoleSelected.value = false;
};

onMounted(() => {
	isRoleSelected.value = false;
	const string = localStorage.getItem('login_form');
	if (string) {
		try {
			const localLoginForm = JSON.parse(string) as { account: string; password: string };
			loginForm.value.account = localLoginForm.account;
			loginForm.value.password = localLoginForm.password;
		} catch {
			localStorage.removeItem('login_form');
		}
	}
});
</script>

<template>
	<div
		class="w-full h-screen flex justify-center items-center bg-[url('@/assets/image/login/bg.png')] bg-no-repeat bg-cover"
	>
		<div class="w-[1000px] h-[600px] min-h-80 flex">
			<div class="flex-1 bg-[url('@/assets/image/login/login.png')] bg-no-repeat bg-cover rounded-l-lg">
				<div class="flex mt-12 items-center">
					<login-svg class="ml-12 mr-2.5" />
					<div class="text-white text-xl">工作过程系统化教育业务规范管理系统</div>
				</div>
			</div>
			<div v-if="!isRoleSelected" class="flex-1 bg-white flex justify-center relative rounded-r-lg">
				<div class="w-full flex flex-col px-[18%] mt-[15.6%]">
					<div class="mb-12">
						<a-typography-title class="text-[#1677ff]" :level="3">恢闳宇内正道 荟聚天下智源</a-typography-title>
						<div class="text-[#1677ff] text-xs">IMPART THE TRUTH TO THE UNIVERSE,</div>
						<div class="text-[#1677ff] text-xs">ACQUIRE THE WISDOM FROM THE WORLD.</div>
					</div>
					<a-form ref="formRef" :model="loginForm" layout="vertical">
						<div v-show="currentWay === 0">
							<a-form-item name="account" :rules="[{ required: true, message: '请输入账号', trigger: 'change' }]">
								<a-input v-model:value="loginForm.account" class="h-12 text-lg" placeholder="账号/手机号">
									<template #prefix>
										<user-outlined></user-outlined>
									</template>
								</a-input>
							</a-form-item>
							<a-form-item :rules="[{ required: true, message: '请输入密码', trigger: 'change' }]" name="password">
								<a-input-password
									v-model:value="loginForm.password"
									class="h-12 text-lg"
									placeholder="密码"
									@keyup.enter="handleLogin"
								>
									<template #prefix>
										<lock-outlined></lock-outlined>
									</template>
								</a-input-password>
							</a-form-item>
						</div>
					</a-form>
					<a-checkbox v-model:checked="isRememberMe">记住我</a-checkbox>
					<a-button class="my-8 h-12 text-lg" type="primary" @click="handleLogin">登录</a-button>
				</div>
			</div>
			<div v-else class="w-[500px] bg-white flex flex-col justify-center px-20">
				<div class="text-lg text-[rgba(0,0,0,0.65)] mb-10 flex justify-between">
					<div>登录角色选择</div>
					<div>
						<a-button type="link" @click="handleBackLogin">返回登录</a-button>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4 items-center select-none">
					<div v-if="roleList.includes('admin')">
						<cloud-selected-svg v-if="selectedRole === roleKeyValue['admin']"></cloud-selected-svg>
						<div
							v-else
							@click="selectedRole = roleKeyValue['admin']"
							@mousemove="hoverRole = roleKeyValue['admin']"
							@mouseleave="hoverRole = ''"
						>
							<cloud-hover-svg v-if="hoverRole === roleKeyValue['admin']"></cloud-hover-svg>
							<cloud-svg v-else></cloud-svg>
						</div>
					</div>
					<div v-if="roleList.includes('admin_school')">
						<manager-selected-svg v-if="selectedRole === roleKeyValue['admin_school']"></manager-selected-svg>
						<div
							v-else
							@click="selectedRole = roleKeyValue['admin_school']"
							@mousemove="hoverRole = roleKeyValue['admin_school']"
							@mouseleave="hoverRole = ''"
						>
							<manager-hover-svg v-if="hoverRole === roleKeyValue['admin_school']"></manager-hover-svg>
							<manager-svg v-else></manager-svg>
						</div>
					</div>
					<div v-if="roleList.includes('student')">
						<student-selected-svg v-if="selectedRole === roleKeyValue['student']"></student-selected-svg>
						<div
							v-else
							@click="selectedRole = roleKeyValue['student']"
							@mousemove="hoverRole = roleKeyValue['student']"
							@mouseleave="hoverRole = ''"
						>
							<student-hover-svg v-if="hoverRole === roleKeyValue['student']"></student-hover-svg>
							<student-svg v-else></student-svg>
						</div>
					</div>
					<div v-if="roleList.includes('teacher')">
						<schoolman-selected-svg v-if="selectedRole === roleKeyValue['teacher']"></schoolman-selected-svg>
						<div
							v-else
							@click="selectedRole = roleKeyValue['teacher']"
							@mousemove="hoverRole = roleKeyValue['teacher']"
							@mouseleave="hoverRole = ''"
						>
							<schoolman-hover-svg v-if="hoverRole === roleKeyValue['teacher']"></schoolman-hover-svg>
							<schoolman-svg v-else></schoolman-svg>
						</div>
					</div>
					<div v-if="roleList.includes('leader')">
						<leader-selected-svg v-if="selectedRole === roleKeyValue['leader']"></leader-selected-svg>
						<div
							v-else
							@click="selectedRole = roleKeyValue['leader']"
							@mousemove="hoverRole = roleKeyValue['leader']"
							@mouseleave="hoverRole = ''"
						>
							<leader-hover-svg v-if="hoverRole === roleKeyValue['leader']"></leader-hover-svg>
							<leader-svg v-else></leader-svg>
						</div>
					</div>
					<div v-if="roleList.includes('company')">
						<teacher-selected-svg v-if="selectedRole === roleKeyValue['company']"></teacher-selected-svg>
						<div
							v-else
							@click="selectedRole = roleKeyValue['company']"
							@mousemove="hoverRole = roleKeyValue['company']"
							@mouseleave="hoverRole = ''"
						>
							<teacher-hover-svg v-if="hoverRole === roleKeyValue['company']"></teacher-hover-svg>
							<teacher-svg v-else></teacher-svg>
						</div>
					</div>
				</div>
				<a-button class="mt-10 h-[50px] text-lg rounded-lg" type="primary" @click="handleSelectRole(selectedRole)">
					进入工作台
				</a-button>
				<div>
					<span class="text-xs text-[#999]">没有对应角色？</span>
					<a-button class="text-xs" type="link">联系管理员</a-button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 1.875rem;
}

.code-input {
	font-size: 1.125rem !important;
}

input {
	font-size: 1.125rem;
	font-family: monospace;
}

.active {
	background-color: white;
	border-radius: 0.5rem;
	color: rgb(59, 130, 246);
}
</style>
