import Layout from '@/layout/index.vue';
import { RouteRecordRaw } from 'vue-router';

const schoolRoutes: RouteRecordRaw[] = [
	{
		path: '/school/orientation',
		name: 'schoolOrientation',
		component: Layout,
		redirect: '/school/orientation/survey',
		meta: { title: '人才培养定位', icon: 'school_orientation' },
		children: [
			{
				path: 'survey',
				meta: { title: '企业调研' },
				redirect: '/school/orientation/survey/dashboard',
				children: [
					{
						path: 'dashboard',
						component: () => import('@/view/orientation/survey/index.vue'),
						meta: { title: '数据概览' },
					},
					{
						path: 'edit',
						component: () => import('@/view/orientation/survey/edit.vue'),
						meta: { title: '企业调研管理' },
					},
					{
						path: 'audit',
						component: () => import('@/view/orientation/survey/audit.vue'),
						meta: { title: '企业调研审核' },
					},
					{
						path: 'workplace',
						component: () => import('@/view/orientation/survey/workplace.vue'),
						meta: { title: '企业调研工作区', isHide: true },
					},
				],
			},
			{
				path: 'cultivate',
				meta: { title: '人才培养方案' },
				redirect: '/school/orientation/cultivate/dashboard',
				children: [
					{
						path: 'dashboard',
						component: () => import('@/view/orientation/cultivate/index.vue'),
						meta: { title: '数据概览' },
					},
					{
						path: 'edit',
						component: () => import('@/view/orientation/cultivate/edit.vue'),
						meta: { title: '人才培养方案管理' },
					},
					{
						path: 'audit',
						component: () => import('@/view/orientation/cultivate/audit.vue'),
						meta: { title: '人才培养方案审核' },
					},
					{
						path: 'workplace',
						component: () => import('@/view/orientation/cultivate/workplace.vue'),
						meta: {
							title: '企业调研工作区',
							isHide: true,
						},
					},
				],
			},
		],
	},
	{
		path: '/school/develop',
		name: 'schoolDevelop',
		component: Layout,
		redirect: '/school/develop/structure',
		meta: { title: '课程开发', icon: 'school_develop' },
		children: [
			{
				path: 'structure',
				meta: { title: '课程结构' },
				redirect: '/school/develop/structure/dashboard',
				children: [
					{
						path: 'dashboard',
						component: () => import('@/view/develop/structure/index.vue'),
						meta: { title: '数据概览' },
					},
					{
						path: 'edit',
						component: () => import('@/view/develop/structure/edit.vue'),
						meta: { title: '课程结构管理' },
					},
					{
						path: 'audit',
						component: () => import('@/view/develop/structure/audit.vue'),
						meta: { title: '课程结构审核' },
					},
					{
						path: 'workplace',
						component: () => import('@/view/develop/structure/workplace.vue'),
						meta: { title: '课程结构工作台', isHide: true },
					},
				],
			},
			{
				path: 'standard',
				meta: { title: '课程标准' },
				redirect: '/school/develop/standard/dashboard',
				children: [
					{
						path: 'dashboard',
						component: () => import('@/view/develop/standard/index.vue'),
						meta: { title: '数据概览' },
					},
					{
						path: 'edit',
						component: () => import('@/view/develop/standard/edit.vue'),
						meta: { title: '课程标准管理' },
					},
					{
						path: 'audit',
						component: () => import('@/view/develop/standard/audit.vue'),
						meta: { title: '课程标准审核' },
					},
					{
						path: 'workplace',
						component: () => import('@/view/develop/standard/workplace.vue'),
						meta: { title: '课程标准工作台', isHide: true },
					},
				],
			},
			{
				path: 'textbook',
				meta: { title: '活页教材' },
				redirect: '/school/develop/textbook/dashboard',
				children: [
					{
						path: 'dashboard',
						component: () => import('@/view/develop/textbook/index.vue'),
						meta: { title: '数据概览' },
					},
					{
						path: 'edit',
						component: () => import('@/view/develop/textbook/edit.vue'),
						meta: { title: '活页教材管理' },
					},
					{
						path: 'audit',
						component: () => import('@/view/develop/textbook/audit.vue'),
						meta: { title: '活页教材审核' },
					},
					{
						path: 'workplace',
						component: () => import('@/view/develop/textbook/workplace.vue'),
						meta: { title: '活页教材工作台', isHide: true },
					},
				],
			},
		],
	},
	{
		path: '/school/instruction',
		name: 'schoolInstruction',
		component: Layout,
		redirect: '/school/instruction/guidebook',
		meta: { title: '教学实施', icon: 'school_instruction' },
		children: [
			{
				path: 'guidebook',
				meta: { title: '学材管理' },
				redirect: '/school/instruction/guidebook/dashboard',
				children: [
					{
						path: 'dashboard',
						component: () => import('@/view/instruction/guidebook/index.vue'),
						meta: { title: '数据概览' },
					},
					{
						path: 'edit',
						component: () => import('@/view/instruction/guidebook/edit.vue'),
						meta: { title: '教学用书管理' },
					},
					{
						path: 'audit',
						component: () => import('@/view/instruction/guidebook/audit.vue'),
						meta: { title: '教学用书审核' },
					},
					{
						path: 'workplace',
						component: () => import('@/view/instruction/guidebook/workplace.vue'),
						meta: { title: '教学用书工作区', isHide: true },
					},
					{
						path: 'workbook',
						meta: { title: '学习用书' },
						component: () => import('@/view/instruction/workbook/list.vue'),
					},
					{
						path: 'workbookworkplace',
						meta: { title: '学习用书工作区', isHide: true },
						component: () => import('@/view/instruction/workbook/workplace.vue'),
					},
				],
			},
			{
				path: 'teach',
				component: () => import('@/view/instruction/plan/teach.vue'),
				meta: { title: '课程教学' },
			},
			{
				path: 'teachworkplace',
				component: () => import('@/view/classroom/teach/page.vue'),
				meta: { isHide: true, title: '课程教学工作区' },
			},
			{
				path: 'study',
				meta: { title: '课程学习' },
				component: () => import('@/view/instruction/study/study.vue'),
			},
			{
				path: 'studyworkplace',
				component: () => import('@/view/classroom/study/page.vue'),
				meta: { isHide: true, title: '课程学习工作区' },
			},
		],
	},
	{
		path: '/school/analyse',
		name: 'schoolAnalysis',
		component: Layout,
		redirect: '/school/analyse/teach',
		meta: { title: '教学评价', icon: 'school_analysis' },
		children: [
			{
				path: 'teach',
				meta: { title: '学情分析（教）' },
				component: () => import('@/view/analysis/teacher/index.vue'),
			},
			{
				path: 'study',
				meta: { title: '学情分析（学）' },
				component: () => import('@/view/analysis/student/index.vue'),
			},
			{
				path: 'screen',
				meta: { title: '数据投屏管理' },
				redirect: '/school/analyse/screen/set',
				children: [
					{
						path: 'set',
						meta: { title: '数据投屏设置' },
						component: () => import('@/view/screen/set.vue'),
					},
				],
			},
		],
	},
	{
		path: '/school/resource',
		name: 'schoolResource',
		component: Layout,
		redirect: '/school/resource/calendar',
		meta: { title: '教学资源', icon: 'school_resource' },
		children: [
			{
				path: 'calendar',
				meta: { title: '校历' },
				redirect: '/school/resource/calendar/dashboard',
				children: [
					{
						path: 'dashboard',
						component: () => import('@/view/resource/calendar/index.vue'),
						meta: { title: '数据概览' },
					},
					{
						path: 'edit',
						component: () => import('@/view/resource/calendar/edit.vue'),
						meta: { title: '校历管理' },
					},
					{
						path: 'audit',
						component: () => import('@/view/resource/calendar/audit.vue'),
						meta: { title: '校历审核' },
					},
					{
						path: 'workplace',
						component: () => import('@/view/resource/calendar/workplace.vue'),
						meta: { title: '校历工作区', isHide: true },
					},
				],
			},
			{
				path: 'classroom',
				meta: { title: '实训基地' },
				redirect: '/school/resource/classroom/manage',
				children: [
					{
						path: 'manage',
						component: () => import('@/view/resource/classroom/manage.vue'),
						meta: { title: '实训基地管理' },
					},
					{
						path: 'schedule',
						component: () => import('@/view/resource/classroom/schedule.vue'),
						meta: { title: '实训基地排课' },
					},
				],
			},
		],
	},	
	// 将 display 路由移到顶层
	{
		path: '/school/analyse/screen/display',
		name: 'screenDisplay',
		component: () => import('@/view/screen/display.vue'),
		meta: { title: '数据投屏', isHide: true },
	},
];

export default schoolRoutes;
