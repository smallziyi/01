<script setup lang="ts">
import { TeachPlan } from '@/view/instruction';
import {
	getStudent,
	getTeachPlanById,
	getTeachMenuCourseTree,
	getCurrentQuickResponse,
	studentQuickResponseFlag,
	studentRaiseHandFlag,
	studentQuickResponseInteraction,
	getStudentCourseActive,
	getTeachTeam,
} from '@/axios';
import useRouterParams from '@/hooks/useRouterParams.ts';
import { useWS } from '@/view/classroom/useWS.ts';
import { message, Modal } from 'ant-design-vue';
import useAxios from '@/axios';
import useLearningTree from '@/view/__report/components/workplace/textbook/useLearningTree.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';
import courseDetail from '@/view/instruction/components/course-detail.vue';
import SidebarCloseSvg from '@/assets/menu/sidebar-close.svg';
import SidebarOpenSvg from '@/assets/menu/sidebar-open.svg';
import lightningSvg from '@/assets/image/instruction/lightning.svg';
import grabSvg from '@/assets/image/instruction/grab.svg';
import handSvg from '@/assets/image/instruction/hand.svg';
import graySvg from '@/assets/image/instruction/gray.svg';
import courseMenu from '@/view/classroom/course-menu.tsx';
import studyContent from './study-content.vue';
import pointRank from './point-rank.vue';
import usePage from '@/hooks/usePage';
import useUserStore from '@/store/modules/useUserStore.ts';
import studentCard from './student-card.vue';
import security from '@/utils/security.ts';

const { state, onOnlyOpen } = usePage();
const { appTheme } = useAppTheme();
const router = useRouter();
const { setData } = useLearningTree();
const params = useRouterParams<{
	teachPlanId: string;
	workbookId: string;
	courseType: 'preview' | 'detail' | 'practice';
}>();
const cardBgColor = computed(() => (appTheme.value === 'white' ? '#EBF3FF' : '#333F69'));
const axios = useAxios();
const { user } = useUserStore();
const studyTrees = ref<Array<Tree>>([]);
const grabId = ref<string | null>(null);
const openGrab = ref(false);
const lightningOpen = ref(false);
const handOpen = ref(false);
const isPreviewCompleted = ref<boolean>(false);
// 回答成功
const successOpen = ref(false);
// 回答失败
const warningOpen = ref(false);
const cardDetailRef = useTemplateRef('cardDetailRef');
const studyContentRef = useTemplateRef('studyContentRef');
const courseTreeNodes = ref<string[]>([]);

const beginClass = () => {
	Modal.info({
		title: '提醒',
		content: h('div', {}, [h('p', '上课时间到啦，请认真听讲哦')]),
		onOk() {
			goToClass();
		},
	});
};

const refreshPreview = () => {
	Modal.info({
		title: '提醒',
		content: h('div', {}, [h('p', '老师重新下发了课前预习')]),
		onOk() {
			studyContentRef.value?.handleTeachScene();
		},
	});
};

const refreshMiddlePractice = (dataType: number) => {
	const data = ['资讯单', '计划单', '决策单', '实施单', '检查单', '评价单'];
	Modal.info({
		title: '提醒',
		content: h('div', {}, [h('p', `老师下发了${data[dataType - 1]}课堂练习，请在规定时间内完成哦`)]),
		onOk() {
			studyContentRef.value?.handleTeachScene();
		},
	});
};

const releaseAfterPractice = () => {
	Modal.info({
		title: '提醒',
		content: h('div', {}, [h('p', `老师下发了课后练习，请在认真完成哦`)]),
		onOk() {
			studyContentRef.value?.handleTeachScene();
		},
	});
};

// 学生分组
const searchInfo = ref('');
const activeId = ref('');
const activeMemberList = ref([]);
const allStudentList = ref();
const groupList = ref<any[]>([]);
const onSearch = () => {
	return;
};
const handleClick = (group: any) => {
	activeId.value = group.id;
	activeMemberList.value = group.memberList;
};
const searchData = computed(() => {
	return activeMemberList.value?.filter(
		(item: any) => item.name.includes(searchInfo.value) || item.number.includes(searchInfo.value),
	);
});

const memberNumber = computed(() => {
	return activeMemberList.value.length;
});

const handleSelectTrees = (items: Array<Tree>) => {
	const tempIds = items.map((item) => item.id);
	// 存在一个tempIds不在courseTreeNodes中，直接return
	if (tempIds.some((id) => !courseTreeNodes.value.includes(id))) return;
	setData({
		level: items.length,
		id: items.at(-1)?.id ?? '',
		parentId: items.at(-1)?.parentId ?? '',
	});
	studyTrees.value = items;
};

const teachPlan = ref<TeachPlan>();
let ws = useWS(params.teachPlanId);

const singInFlag = ref(false);
const toSignIn = () => {
	if (!teachPlan.value) return;
	axios
		.post(
			'/teach/signIn/studentSignIn',
			{},
			{
				params: {
					teachPlanId: teachPlan.value.id,
					teacherId: teachPlan.value.teacherId,
					studentId: user.value!.id,
				},
			},
		)
		.then(() => {
			message.success('已签到');
			singInFlag.value = false;
		});
};

const tree = ref<Tree[]>([]);
const showMenu = ref<boolean>(true);
const activeKey = ref<string>('1');
const studentRaiseAbleHandFlag = ref(false);

const leaderId = computed(() => {
	if (groupList.value && activeId.value) {
		return groupList.value.find((item) => item.id === activeId.value).leaderId;
	} else {
		return '';
	}
});

// 举手
const handleHandsUp = () => {
	studentRaiseHandFlag(params.teachPlanId, user.value!.id).then((res) => {
		studentRaiseAbleHandFlag.value = res;
		if (!studentRaiseAbleHandFlag.value) {
			message.success('你已经举过手啦，等待老师处理中');
			return;
		}
		message.success('举手已发送，等待老师处理中');
		ws.value?.send(
			JSON.stringify({
				api: 'studentRaiseHand',
				data: { teachPlanId: params.teachPlanId, teacherId: teachPlan.value?.teacherId, studentId: user.value!.id },
			}),
		);
		studentRaiseAbleHandFlag.value = false;
	});
};
// 抢答
const handleGrab = () => {
	studentQuickResponseInteraction({
		interactionType: 1,
		points: null,
		studentId: user.value!.id,
		successFlag: null,
		quickResponseId: grabId.value ?? '',
		teachPlanId: teachPlan.value?.id,
		teacherId: teachPlan.value?.teacherId,
	}).then(() => {
		message.success('已抢答，等待老师选择同学');
		openGrab.value = false;
	});
};

const getTeachTeamData = () => {
	getTeachTeam(params.teachPlanId).then((res) => {
		if (res.teamDataList) {
			groupList.value = res.teamDataList.map((item) => ({
				...item,
				memberList: allStudentList.value.filter((i: any) => item.userIds.includes(i.userId)),
			}));
			activeId.value = groupList.value[0].id || '';
			activeMemberList.value = groupList.value[0].memberList || [];
		}
	});
};

onMounted(() => {
	getStudentCourseActive(params.teachPlanId, user.value!.id).then((res) => {
		if (!res.beforePreviewFlag) {
			if (params.courseType === 'preview') {
				isPreviewCompleted.value = false;
				const timer = setTimeout(() => {
					isPreviewCompleted.value = true;
					clearTimeout(timer); // 清除定时器
				}, 10000);
			}
		}
	});
	getStudent(params.teachPlanId).then((res) => {
		allStudentList.value = res.data.groupDataList.flatMap((item) => {
			const { groupName, students } = item;
			return students.map((student) => {
				return {
					groupName,
					...student,
				};
			});
		});
		getTeachTeamData();
	});

	getTeachPlanById(params.teachPlanId).then((res) => {
		teachPlan.value = res.data;
	});

	if (ws.value) {
		ws.value.onmessage = (event: MessageEvent) => {
			// 添加对pong消息的处理
			if (event.data === 'pong') {
					return;
			}
			const messageInfo: { api: string; data: any } = JSON.parse(event.data);
			switch (messageInfo.api) {
			case 'releaseBeforePreview':
				refreshPreview();
				break;
			case 'updateTeamData':
				message.success('分组信息已更新！');
				getTeachTeamData();
				break;
			case 'classesBegin':
				beginClass();
				break;
			case 'initiateSignIn':
				singInFlag.value = true;
				break;
			case 'releaseMiddlePractice':
				refreshMiddlePractice(messageInfo.data);
				break;
			case 'notifyDisconnect':
				if (teachPlan.value) {
					teachPlan.value.status = 3;
				}
				if (cardDetailRef.value) {
					cardDetailRef.value.updateReportState(3);
				}
				message.info('本堂课已结束！');
				break;
			case 'releaseAfterPractice':
				releaseAfterPractice();
				break;
			case 'teacherNotifyAnswerResult':
				successOpen.value = false;
				warningOpen.value = false;
				if (lightningOpen.value) {
					lightningOpen.value = false;
				}
				if (messageInfo.data) {
					successOpen.value = true;
				} else {
					warningOpen.value = true;
				}
				break;
			case 'teacherReplyRaiseHand':
				message.success(`老师${messageInfo.data ? '回应' : '忽略'}了你的举手请求`);
				if (messageInfo.data) {
					handOpen.value = true;
				}
				studentRaiseAbleHandFlag.value = true;
				break;
			case 'teacherInitiateAnswer':
				getCurrentQuickResponse(params.teachPlanId).then((res) => {
					grabId.value = res.data;
					openGrab.value = true;
				});
				break;
			case 'teacherNotifyAnswerSuccess':
				openGrab.value = false;
				lightningOpen.value = true;
				break;
			case 'teacherQuickResponseEnd':
				openGrab.value = false;
				grabId.value = null;
				lightningOpen.value = false;
				successOpen.value = false;
				warningOpen.value = false;
				message.info('抢答已结束');
				break;
			}
		};
	}

	getCurrentQuickResponse(params.teachPlanId).then((res) => {
		grabId.value = res.data;
		if (grabId.value) {
			studentQuickResponseFlag(params.teachPlanId, user.value!.id, grabId.value).then((res) => {
				if (res.data) {
					openGrab.value = true;
				}
			});
		}
	});
	getTeachMenuCourseTree(params.teachPlanId).then((res) => {
		tree.value = res;
		if (teachPlan.value?.courseTreeNodes) {
			courseTreeNodes.value = teachPlan.value.courseTreeNodes;
			const [level1, level2, level3] = teachPlan.value?.courseTreeNodes;
			const levelTree1 = tree.value.find((treeItem) => treeItem.id === level1);
			const levelTree2 = levelTree1?.children?.find((treeItem) => treeItem.id === level2);
			const levelTree3 = levelTree2?.children?.find((treeItem) => treeItem.id === level3);
			if (levelTree1 && levelTree2 && levelTree3) {
				studyTrees.value = [levelTree1, levelTree2, levelTree3];
			}
			localStorage.setItem('expandedMenuIds', JSON.stringify(teachPlan.value.courseTreeNodes));
		}
	});
});
const goToClass = () => {
	router
		.replace({
			path: '/school/instruction/studyworkplace',
			query: {
				v: security.base64(
					JSON.stringify({
						teachPlanId: params.teachPlanId,
						workbookId: params.workbookId,
						courseType: 'detail',
						pageType: 'study',
						studentId: user.value!.id,
					}),
				),
			},
		})
		.then(() => {
			// 强制刷新页面
			window.location.reload();
		});
};

onBeforeUnmount(() => {
	if (ws.value) {
		ws.value.close();
		ws.value = null;
	}
});
</script>

<template>
	<course-detail ref="cardDetailRef">
		<a-card size="small" style="height: calc(100vh - 88px)" :bordered="false">
			<template #title>
				<div class="card-title">课程详情</div>
			</template>
			<template #extra>
				<template v-if="teachPlan">
					<a-button
						v-if="params.courseType === 'detail' && teachPlan.status === 2"
						size="small"
						type="primary"
						@click="handleHandsUp"
					>
						举手
					</a-button>
					<a-button v-if="['detail', 'practice'].includes(params.courseType)" class="ml-4" size="small" type="primary" @click="onOnlyOpen">
						积分表现
					</a-button>
				</template>
			</template>
			<div class="w-full overflow-y-auto">
				<a-tabs v-model:activeKey="activeKey" type="card">
					<a-tab-pane key="1" tab="课程详情">
						<div class="flex gap-4">
							<a-card
								size="small"
								v-show="showMenu"
								:style="{ 'background-color': `${cardBgColor}` }"
								class="h-full min-w-[300px] max-w-[300px]"
								:bordered="false"
							>
								<template #title>目录</template>
								<template #extra>
									<a-tooltip v-if="showMenu" title="收起" placement="right">
										<a-button type="link" @click="showMenu = false">
											<template #icon>
												<sidebar-close-svg></sidebar-close-svg>
											</template>
										</a-button>
									</a-tooltip>
								</template>
								<div class="overflow-y-auto" style="height: calc(100vh - 270px)">
									<course-menu :menu-trees="tree" :selected="studyTrees" @select="handleSelectTrees" />
								</div>
							</a-card>
							<a-card
								:bordered="false"
								:style="{ 'background-color': `${cardBgColor}` }"
								class="grow h-full right-width"
								size="small"
							>
								<template #title>
									<div class="flex items-center">
										<a-tooltip v-if="!showMenu" title="展开" placement="right">
											<a-button type="link" @click="showMenu = true">
												<template #icon>
													<sidebar-open-svg></sidebar-open-svg>
												</template>
											</a-button>
										</a-tooltip>
									</div>
									<div>{{ studyTrees.at(-1)?.label || '' }}</div>
								</template>
								<div class="overflow-y-auto h-[calc(100vh-270px)]">
									<study-content
										ref="studyContentRef"
										:teach-trees="studyTrees"
										:teach-plan-id="params.teachPlanId"
										:course-type="params.courseType"
									>
									</study-content>
								</div>
							</a-card>
						</div>
					</a-tab-pane>
					<a-tab-pane key="2" tab="学生分组">
						<div class="flex gap-4">
							<a-card
								size="small"
								v-show="showMenu"
								:style="{ 'background-color': `${cardBgColor}` }"
								class="h-full min-w-[300px] max-w-[300px]"
								:bordered="false"
							>
								<template #title>分组目录</template>
								<template #extra>
									<a-tooltip v-if="showMenu" title="收起" placement="right">
										<a-button type="link" @click="showMenu = false">
											<template #icon>
												<sidebar-close-svg></sidebar-close-svg>
											</template>
										</a-button>
									</a-tooltip>
								</template>
								<div class="overflow-y-auto" style="height: calc(100vh - 270px)">
									<div v-for="(group, index) in groupList" :key="index">
										<div class="flex justify-between items-center">
											<div
												class="pl-4 py-2 cursor-pointer w-full"
												@click="handleClick(group)"
												:class="activeId === group.id ? 'text-[#0091ff] bg-[rgba(0,145,255,0.1)]' : ''"
											>
												<span>{{ group.name }}</span>
											</div>
										</div>
									</div>
								</div>
							</a-card>
							<a-card
								:bordered="false"
								:style="{ 'background-color': `${cardBgColor}` }"
								class="grow h-full right-width"
								size="small"
							>
								<template #title>
									<div class="flex items-center">
										<a-tooltip v-if="!showMenu" title="展开" placement="right">
											<a-button type="link" @click="showMenu = true">
												<template #icon>
													<sidebar-open-svg></sidebar-open-svg>
												</template>
											</a-button>
										</a-tooltip>
										小组成员（共{{ memberNumber }}人）
									</div>
								</template>
								<template #extra>
									<a-input-search
										class="w-52"
										v-model:value="searchInfo"
										placeholder="请输入学生信息查询"
										enter-button
										@search="onSearch"
									/>
								</template>
								<div class="overflow-y-auto h-[calc(100vh-270px)]">
									<div
										ref="list"
										class="grid grid-cols-3 gap-4 overflow-auto"
										style="max-height: calc((100vh - 270px))"
									>
										<student-card v-for="item in searchData" :student-item="item" :leader-id="leaderId"></student-card>
									</div>
								</div>
							</a-card>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
		</a-card>
	</course-detail>
	<a-modal
		:closable="false"
		v-model:open="singInFlag"
		:footer="false"
		class="w-80"
		:keyboard="false"
		:mask-closable="false"
	>
		<div class="flex gap-4">
			<div
				@click="toSignIn"
				class="size-20 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 leading-[80px] text-center font-semibold rounded-full text-white cursor-pointer"
			>
				签到
			</div>
			<div class="font-mono leading-8 py-2">
				<div>学生：{{ user!.name }}</div>
				<div>学号：{{ user!.number }}</div>
			</div>
		</div>
	</a-modal>
	<a-modal v-model:open="openGrab" :footer="false" width="350px">
		<template #title>
			<div class="flex">
				<lightning-svg></lightning-svg>
				<div class="ml-2 text-[#0091ff]">抢答</div>
			</div>
		</template>
		<div class="text-center font-bold mb-4">老师发起了问题抢答</div>
		<div class="flex justify-center items-center cursor-pointer" @click="handleGrab">
			<grab-svg> </grab-svg>
		</div>
		<div class="text-center text-[#999] mt-4">积极参与抢答会有积分奖励哦～</div>
	</a-modal>
	<!-- 成功抢答 -->
	<a-modal v-model:open="lightningOpen" :footer="false" width="370px">
		<template #title>
			<div class="flex">
				<lightning-svg></lightning-svg>
				<div class="ml-2 text-[#0091ff]">抢答</div>
			</div>
		</template>
		<div class="text-center font-bold mb-4">恭喜你，获得优先答题权</div>
		<div class="flex justify-center items-center cursor-pointer">
			<gray-svg></gray-svg>
		</div>
	</a-modal>
	<!-- 举手请求 -->
	<a-modal v-model:open="handOpen" :footer="false" width="370px">
		<template #title>
			<div class="flex">
				<hand-svg></hand-svg>
				<div class="ml-2 text-[#0091ff]">举手请求</div>
			</div>
		</template>
		<div class="text-center font-bold mb-4">你的请求已被同意，请讲述遇到的问题或回答问题</div>
		<div class="flex justify-center items-center cursor-pointer">
			<gray-svg></gray-svg>
		</div>
	</a-modal>
	<point-rank v-if="state.onlyOpen" v-model:open="state.onlyOpen"></point-rank>
	<a-modal v-model:open="successOpen" :footer="false" width="370px">
		<template #title>
			<div class="flex">
				<lightning-svg></lightning-svg>
				<div class="ml-2 text-[#0091ff]">抢答结果</div>
			</div>
		</template>
		<div class="flex justify-center items-center relative">
			<img src="@/assets/image/instruction/success.png" alt="空状态" />
			<button
				class="absolute bottom-10 w-[100px] h-[35px] bg-gradient-to-r from-[#60B7F9] to-[#3A73FF] rounded-3xl text-white"
				@click="successOpen = false"
			>
				关闭
			</button>
		</div>
	</a-modal>
	<a-modal v-model:open="warningOpen" :footer="false" width="370px">
		<template #title>
			<div class="flex">
				<lightning-svg></lightning-svg>
				<div class="ml-2 text-[#0091ff]">抢答结果</div>
			</div>
		</template>
		<div class="flex justify-center items-center relative">
			<img src="@/assets/image/instruction/warning.png" alt="空状态" />
			<button
				class="absolute bottom-10 w-[100px] h-[35px] bg-gradient-to-r from-[#EC8039] to-[#E23122] rounded-3xl text-white"
				@click="warningOpen = false"
			>
				关闭
			</button>
		</div>
	</a-modal>
</template>

<style scoped></style>
