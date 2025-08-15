<script setup lang="ts">
import { theme } from 'ant-design-vue';
import MHeader from '@/layout/m-header.vue';
import MFooter from '@/layout/m-footer.vue';
import useAxios, { geStudentDashboard } from '@/axios';
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
const studentInfo = ref<PeopleType>();

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
	}>
>([]);
const steps = ref<any[]>([]);
const current = ref(0);
const changLiat = ref<any>([]);
const Listcar = ref<{ name: string; number: number; unit: string }[]>([
	{
		name: '所学课程',
		number: 0,
		unit: '门',
	},
	{
		name: '学习积分',
		number: 0,
		unit: '分',
	},
	{
		name: '班级综合排名',
		number: 0,
		unit: '位',
	},
	{
		name: '资讯综合得分',
		number: 0,
		unit: '分',
	},
	{
		name: '计划综合得分',
		number: 0,
		unit: '分',
	},
	{
		name: '决策综合得分',
		number: 0,
		unit: '分',
	},
	{
		name: '实施综合得分',
		number: 0,
		unit: '分',
	},
	{
		name: '检查综合得分',
		number: 0,
		unit: '分',
	},
	{
		name: '评价综合得分',
		number: 0,
		unit: '分',
	},
	{
		name: '认知与知识得分',
		number: 0,
		unit: '分',
	},
	{
		name: '技能与能力得分',
		number: 0,
		unit: '分',
	},
	{
		name: '素质与素养得分',
		number: 0,
		unit: '分',
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
});

watch(currentData, (newVal) => {
	daywekk(newVal);
	currentYearMonth.value = newVal.split('-')[0] + '年' + newVal.split('-')[1] + '月';
});
onMounted(async () => {
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
			studentInfo.value = res.data;
		}
	});

	await geStudentDashboard().then((res) => {
		if (res) {
			const values = Object.values(res);
			Listcar.value.forEach((item: any, index: number) => {
				item.number = values[index] ? +values[index].toFixed(2) : 0;
			});
		}
	});
	axios.get('/workbench/getUserFunction').then((reslut: any) => {
		let num = ref(1);
		if (reslut) {
			UserFunctionList.value = reslut.data;
		}
		if (UserFunctionList.value.length >= 8) {
			UserFunctionList.value.sort(sortBy('visits', num.value));
			changLiat.value = UserFunctionList.value
				.filter((item: any) => item.functionType === 2)
				.sort(sortBy('visits', num.value))
				.slice(0, 8);
		} else {
			changLiat.value = UserFunctionList.value
				.filter((item: any) => item.functionType === 2)
				.sort(sortBy('visits', num.value));
		}
	});

	// 获取日程数据
	daywekk(new Date().toLocaleDateString().replace('/', '-').replace('/', '-'));
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

// 最近访问的排序
const sortBy = (attr: string, rev: number) => {
	if (rev == undefined) {
		rev = 1;
	} else {
		rev ? 1 : -1;
	}
	return function (a: any, b: any) {
		a = a[attr];
		b = b[attr];
		if (a < b) {
			return rev * -1;
		}
		if (a > b) {
			return rev * 1;
		}
		return 0;
	};
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
	return val.replace(reg, '$1*************$2');
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
	EmitPath.value = UserFunctionList.value.filter((item) => item.name == '课程学习');
	const path = EmitPath.value[0].path;
	const firstPath = path.substring(0, path.lastIndexOf('/'));
	sessionStorage.setItem('menu_open_keys', JSON.stringify([firstPath, path]));
	router.push({
		path,
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
									<a-avatar :src="studentInfo?.avatarUrl" class="w-[100px] h-[100px]" />
									<div class="ml-4">
										<div class="text-lg text-[#333]">
											{{ studentInfo?.name }}
										</div>
										<div class="my-2">
											<span>性别：</span>
											<i v-if="studentInfo?.gender === 0" class="bi bi-gender-female mr-2 text-pink-500"></i>
											<i v-if="studentInfo?.gender === 1" class="bi bi-gender-male mr-2 text-blue-500"></i>
										</div>
									</div>
								</div>
								<div>
									<div class="leading-8">
										<span class="inline-block w-[70px]">所属院系：</span>{{ studentInfo?.collegeName }}
									</div>
									<div class="my-2 leading-8">
										<span class="inline-block w-[70px]">所属专业：</span>{{ studentInfo?.domainName }}
									</div>
									<div class="leading-8">
										<span class="inline-block w-[70px]">邮箱地址：</span>{{ studentInfo?.email }}
									</div>
								</div>
								<div>
									<div>
										<span class="inline-block w-[75px]">学生学号：</span>
										<span class="inline-block w-[150px]">{{
											carNoflage ? judgePhone(studentInfo?.number || '') : studentInfo?.number
										}}</span>
										<a-button @click="CarNoe()" type="link">{{ carNoflage ? '显 示' : '隐 藏' }}</a-button>
									</div>
									<div class="my-2">
										<span class="inline-block w-[75px]">身份证号：</span>
										<span class="inline-block w-[150px]">{{
											caeNotew ? judgePhone(studentInfo?.idCard || '') : studentInfo?.idCard
										}}</span>
										<a-button @click="CarNow()" type="link">{{ caeNotew ? '显 示' : '隐 藏' }}</a-button>
									</div>
									<div>
										<span class="inline-block w-[75px]">籍贯/住址：</span>
										<span class="inline-block w-[150px]">{{
											CarNoethee ? judgeCard(studentInfo?.nativePlace || '') : studentInfo?.nativePlace
										}}</span>
										<a-button @click="CarNot()" type="link">{{ CarNoethee ? '显 示' : '隐 藏' }}</a-button>
									</div>
								</div>
							</div>
						</a-card>
						<div class="card-title text-lg font-bold leading-none my-4">数据概览</div>
						<div class="grid grid-cols-5 gap-4">
							<div v-for="(item, index) in Listcar">
								<a-card class="h-[90px]" :bordered="false">
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
											<img v-if="index === 0" src="@/assets/student/course.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 1" src="@/assets/student/integral.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 2" src="@/assets/student/rank.png" class="w-full h-full" alt="" />
											<img
												v-else-if="index === 3"
												src="@/assets/student/information.png"
												class="w-full h-full"
												alt=""
											/>
											<img v-else-if="index === 4" src="@/assets/student/plan.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 5" src="@/assets/student/decision.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 6" src="@/assets/student/implement.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 7" src="@/assets/student/check.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 8" src="@/assets/student/evaluate.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 9" src="@/assets/student/cognize.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 10" src="@/assets/student/skill.png" class="w-full h-full" alt="" />
											<img v-else-if="index === 11" src="@/assets/student/quality.png" class="w-full h-full" alt="" />
										</div>
									</div>
								</a-card>
							</div>
						</div>
						<div class="card-title text-lg font-bold leading-none mt-10 mb-4">常用功能入口</div>
						<a-card style="height: 104px" :body-style="{ padding: '0px 24px' }" :bordered="false">
							<div class="flex py-4">
								<div class="flex flex-wrap">
									<div class="flex flex-col text-center" v-for="item in changLiat">
										<div
											@click="goToPatch(item.path)"
											class="flex flex-col text-center items-center size-24 cursor-pointer hover:text-[#0091ff]"
										>
											<a-badge :count="item.messageCount" :title="'你有' + item.messageCount + '条未读信息'"
												><img
													:src="
														item.iconFileUrl
															? item.iconFileUrl
															: 'http://192.168.18.201:9000/file/672ad93dd59059560021487c.svg'
													"
													class="size-14"
													alt=""
													srcset=""
												/>
											</a-badge>
											<span class="text-nowrap">{{ item.name }}</span>
										</div>
									</div>
								</div>
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
.css-dev-only-do-not-override-xax52g.ant-space {
	flex-wrap: wrap !important;
}

.ant-descriptions-item .a-descriptions-item-label {
	text-align: left !important;
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
</style>
