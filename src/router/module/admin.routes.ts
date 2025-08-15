import Layout from '@/layout/index.vue';
import { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw[] = [
	{
		path: '/admin/system',
		component: Layout,
		name: 'adminSystem',
		redirect: '/admin/system/permission',
		meta: { title: '学校系统管理', icon: 'admin_system' },
		children: [
			{
				path: 'permission',
				component: () => import('@/view/admin/permission/index.vue'),
				meta: { title: '权限管理' },
			},
			{
				path: 'role',
				component: () => import('@/view/admin/role/index.vue'),
				meta: { title: '角色管理' },
			},
			{
				path: 'user',
				component: () => import('@/view/admin/user/index.vue'),
				meta: { title: '用户管理' },
			},
		],
	},
	{
		path: '/admin/organization',
		component: Layout,
		name: 'adminOrganization',
		redirect: '/admin/organization/department',
		meta: { title: '组织架构', icon: 'school_organization' },
		children: [
			{
				path: 'department',
				component: () => import('@/view/admin/department/index.vue'),
				meta: { title: '部门管理' },
			},
			{
				path: 'college',
				component: () => import('@/view/admin/college/index.vue'),
				meta: { title: '院系管理' },
			},
			{
				path: 'domain',
				component: () => import('@/view/admin/domain/index.vue'),
				meta: { title: '专业建设' },
			},
			{
				path: 'research',
				component: () => import('@/view/admin/research/index.vue'),
				meta: { title: '教研室' },
			},
			{
				path: 'group',
				component: () => import('@/view/admin/group/index.vue'),
				meta: { title: '班级管理' },
			},
		],
	},
	{
		path: '/admin/personnel',
		component: Layout,
		name: 'adminPersonnel',
		redirect: '/admin/personnel/post',
		meta: { title: '人员管理', icon: 'school_personnel' },
		children: [
			{
				path: 'post',
				component: () => import('@/view/admin/post/index.vue'),
				meta: { title: '职务管理' },
			},
			{
				path: 'leader',
				component: () => import('@/view/admin/leader/index.vue'),
				meta: { title: '领导管理' },
			},
			{
				path: 'company',
				component: () => import('@/view/admin/company/index.vue'),
				meta: { title: '企业人员' },
			},
			{
				path: 'teacher',
				component: () => import('@/view/admin/teacher/index.vue'),
				meta: { title: '教师管理' },
			},
			{
				path: 'student',
				component: () => import('@/view/admin/student/index.vue'),
				meta: { title: '学生管理' },
			},
		],
	},
	{
		path: '/admin/template',
		name: 'adminTemplate',
		component: Layout,
		redirect: '/admin/template/survey',
		meta: { title: '模板管理', icon: 'template_file_manage' },
		children: [
			{
				path: 'survey',
				component: () => import('@/view/template/survey-manage.vue'),
				meta: { title: '企业调研' },
			},
			{
				path: 'cultivate',
				component: () => import('@/view/template/cultivate-manage.vue'),
				meta: { title: '人才培养' },
			},
			{
				path: 'standard',
				component: () => import('@/view/template/standard-manage.vue'),
				meta: { title: '课程标准' },
			},
		],
	},
];

export default adminRoutes;
