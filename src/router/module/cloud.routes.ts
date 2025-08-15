import Layout from '@/layout/index.vue';
import { RouteRecordRaw } from 'vue-router';

const cloudRoutes: RouteRecordRaw[] = [
	{
		path: '/cloud/system',
		component: Layout,
		name: 'cloudSystem',
		redirect: '/cloud/system/permission',
		meta: { title: '系统管理', icon: 'admin_system' },
		children: [
			{
				path: 'permission',
				component: () => import('@/view/cloud/permission/index.vue'),
				meta: { title: '权限管理' },
			},
			{
				path: 'role',
				component: () => import('@/view/cloud/role/index.vue'),
				meta: { title: '角色管理' },
			},
			{
				path: 'user',
				component: () => import('@/view/cloud/user/index.vue'),
				meta: { title: '用户管理' },
			},
		],
	},
	{
		path: '/cloud/manage',
		component: Layout,
		name: 'cloudManage',
		redirect: '/cloud/manage/client',
		meta: { title: '客户端管理', icon: 'admin_manage' },
		children: [
			{
				path: 'client',
				component: () => import('@/view/cloud/client/index.vue'),
				meta: { title: '客户列表' },
			},
			{
				path: 'contract',
				component: () => import('@/view/cloud/contract/index.vue'),
				meta: { title: '合同管理' },
			},
			{
				path: 'salesman',
				component: () => import('@/view/cloud/salesman/index.vue'),
				meta: { title: '销售员' },
			},
			{
				path: 'expense',
				component: () => import('@/view/cloud/expense/index.vue'),
				meta: { title: '缴费管理' },
			},
			{
				path: 'brokerage',
				component: () => import('@/view/cloud/brokerage/index.vue'),
				meta: { title: '提成管理' },
			},
		],
	},
	{
		path: '/cloud/encoding',
		component: Layout,
		name: 'cloudEncoding',
		redirect: '/cloud/encoding/major',
		meta: { title: '编码表管理', icon: 'admin_encoding' },
		children: [
			{
				path: 'major',
				component: () => import('@/view/cloud/major/index.vue'),
				meta: { title: '专业编码' },
			},
			{
				path: 'industry',
				component: () => import('@/view/cloud/industry/index.vue'),
				meta: { title: '行业编码' },
			},
			{
				path: 'occupation',
				component: () => import('@/view/cloud/occupation/index.vue'),
				meta: { title: '职业编码' },
			},
			{
				path: 'post',
				component: () => import('@/view/cloud/post/index.vue'),
				meta: { title: '岗位编码' },
			},
			{
				path: 'certificate',
				component: () => import('@/view/cloud/certificate/index.vue'),
				meta: { title: '资格证书' },
			},
		],
	},
];

export default cloudRoutes;
