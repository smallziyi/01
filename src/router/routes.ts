import { RouteRecordRaw } from 'vue-router';
import baseRoutes from '@/router/module/base.routes.ts';
import cloudRoutes from '@/router/module/cloud.routes.ts';
import adminRoutes from '@/router/module/admin.routes.ts';
import schoolRoutes from '@/router/module/school.routes.ts';
import workbenchRouter from '@/router/module/workbench.router.ts';

const routes: RouteRecordRaw[] = [...baseRoutes, ...cloudRoutes, ...adminRoutes, ...schoolRoutes, ...workbenchRouter];

export default routes;
