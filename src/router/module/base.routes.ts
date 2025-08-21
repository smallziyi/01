import { RouteRecordRaw } from 'vue-router';
import Forbidden from '@/view/Forbidden.vue';
import NotFound from '@/view/NotFound.vue';
import Feedback from '@/view/feedback.vue';

const Login = () => import('@/view/base/login/index.vue');
const SchoolLogin = () => import('@/view/base/login/login-school.vue');
const baseRoutes: RouteRecordRaw[] = [
		{path:'/',name:'',component:()=>import("@/layout/login.vue")},
	

	{
		path: '/login',
		meta: { isHide: true, title: '登录页' },
		component: window.config.clientPage === '0' ? Login : SchoolLogin,
	},
	{
		path: '/feedback',
		meta: { isHide: true, title: '问题反馈' },
		component: Feedback,
	},
	{
		path: '/about',
		meta: { isHide: true, title: '关于我们' },
		component: () => import('@/view/about-us.vue'),
	},
	{
		path: '/404',
		meta: { isHide: true, title: '404' },
		component: NotFound,
	},
	{
		path: '/403',
		meta: { isHide: true, title: '403' },
		component: Forbidden,
	},
];

export default baseRoutes;

// /school/instruction/study
