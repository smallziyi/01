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
import jilinSvg from '@/assets/image/login/jilin.svg';
import zhongshanSvg from '@/assets/image/login/zhongshan.svg';
import eerduosiSvg from '@/assets/image/login/eerduosi.svg';
import zgeqSvg from '@/assets/image/login/zge.svg';
import MFooter from '@/layout/m-footer.vue';
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
	<div class="w-full h-screen flex justify-center bg-[url('@/assets/image/login/bg.png')] bg-no-repeat bg-cover">
		<div class="w-[1000px] h-[600px] min-h-80 flex logo-margin-top">
			<div class="flex-1 bg-[#0062FD8C] bg-no-repeat bg-cover rounded-l-lg">
				<div class="flex items-center ml-8 mt-8">
					<img src="@/assets/image/login/zdzy.png" alt="logo图片" />
					<div class="text-white ml-2.5 text-lg">优质中职学校和专业建设质量诊断与改进系统</div>
				</div>
				<div
					class="indent-7 ml-8 mt-2 w-[440px] h-[452px] rounded-lg bg-[#FFFFFF2E] opacity-75 text-white p-5 leading-7"
				>
					<p>
						2019年，姜大源先生研究团队的核心成员闫智勇博士及博士后、吴全全研究员等，结合现代信息技术，开发出基于云计算技术的“工作过程系统化教育业务规范管理系统”(中文版)，并即将推出多国语言版，使得工作过程系统化课程开发范式的应用领域更加广泛、操作更加便捷，可以为我国职业教育的先进理念和先进经验走出国门提供支撑。
					</p>
					<p class="mt-3">
						该系统主要包括企业调研、课程开发、教学实施、教学评价和班级匹配等核心模块，可以实现专业建设、课程和教材建设、教学实施和教学评价、职业素质倾向测评、混合学习和翻转课堂等功能。
					</p>
				</div>
			</div>
			<div v-if="!isRoleSelected" class="flex-1 bg-white flex justify-center relative rounded-r-lg">
				<div class="w-full flex flex-col px-[18%] mt-[15.6%]">
					<div class="mb-14 flex items-center justify-center">
						<template v-if="$config.clientPage === '1'">
							<zgeq-svg></zgeq-svg>
							<div class="ml-3.5 text-lg">准格尔旗职业高级中学</div>
						</template>
						<template v-else-if="$config.clientPage === '2'">
							<jilin-svg></jilin-svg>
							<div class="ml-3.5 text-lg">吉林铁道职业技术学院</div>
						</template>
						<template v-else-if="$config.clientPage === '3'">
							<zhongshan-svg></zhongshan-svg>
							<div class="ml-3.5 text-lg">中山市第一职业技术学校</div>
						</template>
						<template v-else-if="$config.clientPage === '4'">
							<eerduosi-svg></eerduosi-svg>
							<div class="ml-3.5 text-lg">鄂尔多斯理工学校</div>
						</template>
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
					<a-checkbox v-model:checked="isRememberMe">记住密码</a-checkbox>
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
	<m-footer class="fixed bottom-0" is-transparent />
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

.logo-margin-top {
	margin-top: calc((100vh - 780px) / 2);
}
</style>
