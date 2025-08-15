<script setup lang="ts">
import { theme } from 'ant-design-vue';
import MHeader from '@/layout/m-header.vue';
import MFooter from '@/layout/m-footer.vue';
import useAxios, { geTeacherDashboard } from '@/axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// 注册插件
dayjs.extend(utc);
dayjs.extend(timezone);
// 设置默认时区为中国时区
dayjs.tz.setDefault('Asia/Shanghai');

type PeopleType = {
	name: string;
	number: string;
	phone: string;
	email: string;
	idCard: string;
	nativePlace: string;
	address: string;
	birthday: string;
	gender: number;
	avatarId: string;
	avatarUrl: string;
	groupName: string;
	collegeName: string;
	domainName: string;
	roleName: string;
};
const token = theme.useToken().token;
const content = ref('暂无公告！');
const axios = useAxios();
const teachInfo = ref<PeopleType>();

const TeacherDashboard = ref({});
const UserFunctionList = ref<
	Array<{
		code: string;
		iconFileUrl: string;
		messageCount: number;
		name: string;
		path: string;
		permissionId: string;
		reportType: number;
		visits: number;
		parentId: string;
		functionType: number;
	}>
>([]);
const activeKey = ref(0);

const steps = ref<any[]>([]);
const current = ref(0);
const parentList = ref<any>([]);
const AllList = ref<any>([]);
const changLiat = ref<any>([]);
const Listcar = ref<Array<{ name: string; number: number; unit: string }>>([
	{
		name: '企业调研报告',
		number: 0,
		unit: '份',
	},
	{
		name: '人才培养方案',
		number: 0,
		unit: '份',
	},
	{
		name: '课程结构',
		number: 0,
		unit: '门',
	},
	{
		name: '课程标准',
		number: 0,
		unit: '份',
	},
	{
		name: '活页式教材',
		number: 0,
		unit: '本',
	},
	{
		name: '教学用书',
		number: 0,
		unit: '本',
	},
	{
		name: '教学计划',
		number: 0,
		unit: '条',
	},
	{
		name: '授权专业',
		number: 0,
		unit: '个',
	},
	{
		name: '授权课程',
		number: 0,
		unit: '门',
	},
]);
const currentWeek = ref<string[]>([]);
const week = ['一', '二', '三', '四', '五', '六', '日'];
const weekData = ref<number[]>([]);
const currentDay = ref<number>();
const currentIndex = ref<number>(0);
const currentYearMonth = ref<string>('');

const currentData = computed(() => {
	return currentWeek.value[currentIndex.value];
})


watch(currentData, (newVal) => {
	daywekk(newVal);
	currentYearMonth.value = newVal.split('-')[0] + '年' + newVal.split('-')[1] + '月';
});

onMounted(() => {
	// 获取本周的日期
	const today = dayjs();
	// 获取本周一的日期
	let monday = today.startOf('week');
	// 获取一周的日期(年月日格式)
	for (let i = 0; i < 7; i++) {
		weekData.value.push(monday.add(i, 'day').date());
		currentWeek.value.push(monday.add(i, 'day').format('YYYY-MM-DD'));
	}
	currentDay.value = today.date();
	currentIndex.value = weekData.value.findIndex((item) => item === currentDay.value);
	axios.get('/workbench/getUserDetails').then((res) => {
		if (res && res.status == 200) {
			teachInfo.value = res.data;
		}
	});

	geTeacherDashboard().then((res) => {
		if (res) {
			TeacherDashboard.value = res;
			const values = Object.values(res);
			let index = 0;
			Listcar.value.forEach((item: any) => {
				item.number = values[index++];
			});
		}
	});
	axios.get('/workbench/getUserFunction').then((reslut: any) => {
		if (reslut) {
			UserFunctionList.value = reslut.data;
			UserFunctionList.value.forEach((item) => {
				if (item.parentId == '0' && item.functionType == 1) {
					parentList.value.push(item);
				}
			});

			if (UserFunctionList.value.length >= 8) {
				changLiat.value = reslut.data.filter((item: any) => item.functionType === 2 && item.visits > 0).slice(0, 8);
			} else {
				changLiat.value = reslut.data;
			}
		}

		AllList.value = addChildrenToA(parentList.value, UserFunctionList.value);
	});

	// 获取日程数据
	daywekk(currentData.value);
});

const daywekk = (teachDates: any) => {
	axios
		.get('/workbench/getScheduleArrangement', {
			params: {
				teachDate: teachDates,
			},
		})
		.then((res) => {
			if (res.status == 200 && res) {
				steps.value = res.data;
				current.value = res.data.length;
			}
		});
};

const addChildrenToA = (att: any[], brr: any[]) => {
	att.forEach((objA: { children: any[]; permissionId: any }) => {
		objA.children = [];
		brr.forEach((objB: { parentId: any }) => {
			if (objA.permissionId === objB.parentId) {
				objA.children.push(objB);
			}
		});
	});
	return att;
};

// 私密信息脱敏模块
const carNoflage = ref<boolean>(true);
const caeNotew = ref<boolean>(true);
const CarNoethee = ref<boolean>(true);

// 控制器，显示/隐藏
const CarNoe = () => {
	carNoflage.value = !carNoflage.value;
};
const CarNow = () => {
	caeNotew.value = !caeNotew.value;
};
const CarNot = () => {
	CarNoethee.value = !CarNoethee.value;
};
// 手机号脱敏
const judgePhone = (val: string) => {
	if (!val) return '';
	let reg = /^(.{3}).*(.{4})$/;
	return val.replace(reg, '$1****$2');
};

// 身份证脱敏
const judgeCard = (val: string) => {
	if (!val) return '';
	let reg = /^(.{3}).*(.{2})$/;
	return val.replace(reg, '$1*****$2');
};

// 用户常用跳转
const router = useRouter();
const goToPatch = (path: string) => {
	if (path) {
		const firstPath = path.substring(0, path.lastIndexOf('/'));
		sessionStorage.setItem('menu_open_keys', JSON.stringify([firstPath, path]));
		router.push(path);
	}
};

const EmitPath = ref();
const goToPlan = () => {
	EmitPath.value = UserFunctionList.value.filter((item) => item.name === '课程教学');
	const path = EmitPath.value[0].path;
	const firstPath = path.substring(0, path.lastIndexOf('/'));
	sessionStorage.setItem('menu_open_keys', JSON.stringify([firstPath, path]));
	router.push({
		path: path,
		query: {
			currentData: currentData.value,
		},
	});
};
</script>

<template>
	<a-layout class="h-screen">
		<a-layout-header :style="{ backgroundColor: `${token.colorBgContainer}` }" class="p-4 flex justify-between h-14">
			<m-header />
		</a-layout-header>
		<a-layout-content class="overflow-y-auto min-w-[1440px]">
			<div class="p-4 space-y-4">
				<a-card :bordered="false" size="small"><i class="bi bi-megaphone mr-2"></i>公告： {{ content }}</a-card>
				<div class="flex gap-4">
					<div class="flex-1">
						<a-card :body-style="{ padding: '0px 32px' }" :bordered="false" style="height: 180px">
							<div class="h-[180px] w-full flex justify-between items-center text-[#999]">
								<div class="flex items-center">
									<a-avatar :src="teachInfo?.avatarUrl" class="w-[100px] h-[100px]" />
									<div class="ml-4">
										<div class="text-lg text-[#333]">
											{{ teachInfo?.name }}
										</div>
										<div class="my-2">
											<span>性别：</span>
											<i v-if="teachInfo?.gender === 0" class="bi bi-gender-female mr-2 text-pink-500"></i>
											<i v-if="teachInfo?.gender === 1" class="bi bi-gender-male mr-2 text-blue-500"></i>
										</div>
									</div>
								</div>
								<div>
									<div class="leading-8"><span class="inline-block w-[70px]">工号：</span>{{ teachInfo?.number }}</div>
									<div class="my-2 leading-8">
										<span class="inline-block w-[70px]">所属角色：</span>{{ teachInfo?.roleName }}
									</div>
									<div class="leading-8">
										<span class="inline-block w-[70px]">邮箱地址：</span>{{ teachInfo?.email }}
									</div>
								</div>
								<div>
									<div>
										<span class="inline-block w-[75px]">手机号码：</span>
										<span class="inline-block w-[150px]">{{
											carNoflage ? judgePhone(teachInfo?.phone || '') : teachInfo?.phone
										}}</span>
										<a-button @click="CarNoe()" type="link">{{ carNoflage ? '显 示' : '隐 藏' }}</a-button>
									</div>
									<div class="my-2">
										<span class="inline-block w-[75px]">身份证号：</span>
										<span class="inline-block w-[150px]">{{
											caeNotew ? judgePhone(teachInfo?.idCard || '') : teachInfo?.idCard
										}}</span>
										<a-button @click="CarNow()" type="link">{{ caeNotew ? '显 示' : '隐 藏' }}</a-button>
									</div>
									<div>
										<span class="inline-block w-[75px]">籍贯/住址：</span>
										<span class="inline-block w-[150px]">{{
											CarNoethee ? judgeCard(teachInfo?.nativePlace || '') : teachInfo?.nativePlace
										}}</span>
										<a-button @click="CarNot()" type="link">{{ CarNoethee ? '显 示' : '隐 藏' }}</a-button>
									</div>
								</div>
							</div>
						</a-card>
						<div class="card-title text-lg font-bold leading-none my-4">数据概览</div>
						<div class="grid grid-cols-5 gap-4">
							<div v-for="(item, index) in Listcar">
								<a-card class="h-[100px]" :bordered="false">
									<div class="w-full h-full flex">
										<div class="w-full">
											<span>{{ item.name }}</span>
											<div>
												<span class="text-sm font-bold"
													>{{ Number(item.number) == 0 || Number(item.number) == null ? '--' : Number(item.number) }}
												</span>
												<span class="ml-2" style="font-size: 14px; font-weight: 500; color: black">
													{{ item.unit }}
												</span>
											</div>
										</div>
										<div>
											<img v-if="index === 0" src="@/assets/teacher/survey.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 1" src="@/assets/teacher/cultivate.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 2" src="@/assets/teacher/structure.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 3" src="@/assets/teacher/standard.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 4" src="@/assets/teacher/textbook.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 5" src="@/assets/teacher/guidebook.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 6" src="@/assets/teacher/plan.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 7" src="@/assets/teacher/major.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 8" src="@/assets/teacher/course.png" class="w-full h-full" alt="" />
										</div>
									</div>
								</a-card>
							</div>
						</div>
						<div class="card-title text-lg font-bold leading-none mt-10 mb-4">常用功能入口</div>
						<a-card style="height: 190px" :body-style="{ padding: '0px 24px' }" :bordered="false">
							<div class="flex py-4">
								<!-- 骨架填充  -->
								<a-tabs class="w-full" size="middle" v-model:activeKey="activeKey">
									<a-tab-pane :key="0" tab="常用">
										<div class="w-full flex">
											<div v-for="(item, index) in changLiat" :key="index">
												<div
													@click="goToPatch(item.path)"
													class="flex flex-col items-center size-24 cursor-pointer hover:text-[#0091ff]"
												>
													<a-badge :count="item.messageCount" :title="'你有' + item.messageCount + '条未读信息'">
														<img
															:src="
																item.iconFileUrl
																	? item.iconFileUrl
																	: 'http://192.168.18.201:9000/file/672ad93dd59059560021487c.svg'
															"
															class="size-14"
															alt=""
															srcset=""
													/></a-badge>
													<span class="text-nowrap">{{ item.name }}</span>
												</div>
											</div>
										</div>
									</a-tab-pane>

									<a-tab-pane v-for="(item, index) in AllList" :key="index + 1" :tab="item.name">
										<div class="w-full flex">
											<div v-for="(itemw, index) in item.children" :key="index">
												<div
													@click="goToPatch(itemw.path)"
													class="flex flex-col items-center size-24 cursor-pointer hover:text-[#0091ff]"
												>
													<a-badge :count="itemw.messageCount" :title="'你有' + itemw.messageCount + '条未读信息'">
														<img :src="itemw.iconFileUrl" class="size-14" alt="" srcset=""
													/></a-badge>
													<span class="text-nowrap">{{ itemw.name }}</span>
												</div>
											</div>
										</div>
									</a-tab-pane>
								</a-tabs>
							</div>
						</a-card>
					</div>
					<div class="w-[360px] space-y-4">
						<div class="rounded overflow-hidden">
							<img alt="封面图" class="w-[360px]" src="/images/workbench/workbench.png" />
						</div>
						<div class="card-title text-lg font-bold leading-none">日程处理</div>
						<a-card :bordered="false" style="min-height: auto">
							<div class="h-[auto] flex flex-col">
								<div class="bg-[#E5EBFF] w-[304px] h-[149px] py-3 px-2 rounded-lg">
									<div class="mb-6 text-sm text-[#8C8C8C]">{{ currentYearMonth }}</div>
									<div class="flex">
										<div v-for="(item, index) in weekData" :key="item">
											<div
												class="w-[32px] h-[66px] mr-2.5 flex flex-col justify-between items-center"
												:class="
													currentDay === item
														? 'bg-gradient-to-b from-[#754AFF] to-[#5D7EFF] rounded-full text-white'
														: ''
												"
												@click="
													currentDay = item;
													currentIndex = index;
												"
											>
												<div class="mb-4">{{ week[index] }}</div>
												<div>{{ item }}</div>
											</div>
										</div>
									</div>
								</div>
								<div class="text-lg my-2">当日课程安排</div>
								<div v-if="steps.length === 0" class="h-[239px]">
									<m-empty size="small" />
								</div>
								<div v-else class="w-full h-[239px]" style="overflow-y: scroll">
									<a-steps
										progress-dot
										size="small"
										v-model:current="current"
										direction="vertical"
										class="w-[100%] h-[200px]"
									>
										<a-step v-for="item in steps" :key="item.teachPlanId" class="w-full">
											<template #title>
												<div class="w-full flex flex-row items-center">
													<div class="w-full flex flex-col">
														<p>
															{{ item.dayPartName }}
															{{ item.timeSlotName }}
															<span class="ml-2">{{ item.startTime + '-' + item.endTime }}</span>
														</p>
														<p>地点：{{ item.classroomName }}</p>
														<p>内容：{{ item.courseName }}</p>
													</div>
													<span class="w-[auto] ml-3"><a-button @click="goToPlan()" type="link">查看</a-button></span>
												</div>
											</template>
										</a-step>
									</a-steps>
								</div>
							</div>
						</a-card>
					</div>
				</div>
			</div>
			<m-footer :is-transparent="false"></m-footer>
		</a-layout-content>
	</a-layout>
</template>

<style scoped>
td {
	padding: 0 8px;
	text-wrap: nowrap;
	text-overflow: ellipsis;
}

.css-dev-only-do-not-override-xax52g.ant-space {
	flex-wrap: wrap !important;
}

@media (max-width: 576px) {
	#components-page-header-demo-responsive .content {
		display: block;
	}

	#components-page-header-demo-responsive .main {
		width: 100%;
		margin-bottom: 12px;
	}

	#components-page-header-demo-responsive .extra {
		width: 100%;
		margin-left: 0;
		text-align: left;
	}
}

.ant-tabs-content .ant-tabs-content-top {
	width: 100% !important;
	height: 100% !important;
}

.ant-page-header .ant-page-header-ghost .css-dev-only-do-not-override-xax52g {
	padding: 20px 0 !important;
}
</style>
