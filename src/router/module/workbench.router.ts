import { RouteRecordRaw } from 'vue-router';

const workbenchRouter: RouteRecordRaw[] = [
	{
		path: '/workbench',
		meta: { isHide: true, title: '工作台' },
		children: [
			{
				path: 'student',
				meta: { isHide: true, title: '学生工作台' },
				component: () => import('@/view/workbench/student.vue'),
			},
			{
				path: 'public',
				meta: { isHide: true, title: '非学生工作台' },
				component: () => import('@/view/workbench/teacher.vue'),
			},
		],
	},
];

export default workbenchRouter;
