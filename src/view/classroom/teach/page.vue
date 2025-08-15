<script setup lang="ts">
import useRouterParams from '@/hooks/useRouterParams.ts';
import { TeachPlan, TeachStructure } from '@/view/instruction';
import {
	getTeachMenuCourseTree,
	addQuickResponse,
	getCurrentQuickResponse,
	getInteractionList,
	quickResponseEnd,
	updateTeachInteractionSuccessFlag,
	getTeachTeam,
	updateTeachPlanStatus,
	updateSignInFlag,
	getTeachPlanById,
	getStudent,
	teacherNotifyAnswerResult,
} from '@/axios';
import { TeachInteraction } from '@/view/classroom/type.ts';
import courseDetail from '@/view/instruction/components/course-detail.vue';
import useAppTheme from '@/hooks/useAppTheme.ts';
import useLearningTree from '@/view/__report/components/workplace/textbook/useLearningTree.ts';
import courseMenu from '@/view/classroom/course-menu.tsx';
import SidebarCloseSvg from '@/assets/menu/sidebar-close.svg';
import SidebarOpenSvg from '@/assets/menu/sidebar-open.svg';
import signSvg from '@/assets/image/instruction/sign.svg';
import lightningSvg from '@/assets/image/instruction/lightning.svg';
import handSvg from '@/assets/image/instruction/hand.svg';
import circleSvg from '@/assets/image/instruction/circle.svg';
import teachContent from './teach-content.vue';
import { message, Modal, RadioChangeEvent } from 'ant-design-vue';
import { useWS } from '@/view/classroom/useWS.ts';
import useAxios from '@/axios';
import groupMenu from './group-menu.vue';
import groupCard from './group-card.vue';
import _ from 'lodash';
import pointRank from './point-rank.vue';
import usePage from '@/hooks/usePage';

// @ts-ignore
import { Snowyflake, Epoch } from 'snowyflake';
import useUserStore from '@/store/modules/useUserStore.ts';

const snowyflake = new Snowyflake({
	workerId: 1n,
	epoch: Epoch.Twitter, // BigInt timestamp
});
const router = useRouter();
const { state, onOnlyOpen } = usePage();
const axios = useAxios();
const { appTheme } = useAppTheme();
const { setData } = useLearningTree();
const { user } = useUserStore();
const params = useRouterParams<{ teachPlanId: string; workbookId: string }>();
const cardBgColor = computed(() => (appTheme.value === 'white' ? '#EBF3FF' : '#333F69'));
const teachPlan = ref<TeachPlan>();
const teachStructure = ref<TeachStructure>();
const showMenu = ref<boolean>(true);
const activeKey = ref<string>('1');
const ws = useWS(params.teachPlanId);
const interactionData = ref<TeachInteraction[]>([]);
const tree = ref<Tree[]>([]);
const teachTrees = ref<Array<Tree>>([]);
const signAbortController = ref<AbortController | null>(null);
const showSign = ref<boolean>(false);
const handsOpen = ref(false);
const groupData = reactive<{
	teamType: 1 | 2;
	// 判断是否已经有分组信息
	groupType: 'add' | 'update';
	saveFlag: boolean;
	teamId: string;
	groupNumber: number;
	currentGroupId: string;
	allStudentList: Array<any>;
	groupChunkList: Array<any>;
	currentGroup: Array<any>;
	groupPending: Array<any>;
	groupInfo: Array<any>;
}>({
	teamId: '',
	groupType: 'add',
	saveFlag: false,
	currentGroupId: '',
	teamType: 2,
	groupNumber: 3,
	allStudentList: [],
	groupChunkList: [],
	currentGroup: [],
	groupPending: [],
	// 查询回来完整的信息
	groupInfo: [],
});

let deadline: any;
const cardDetailRef = useTemplateRef('cardDetailRef');
const groupMenuRef = useTemplateRef<any>('groupMenuRef');
const courseTreeNodes = ref<string[]>([]);
const groupLeaderId = computed<string | undefined>(() => {
	if (groupData.groupType === 'update') {
		return groupMenuRef.value?.leaderId;
	} else {
		const groupId = groupMenuRef.value?.activeId as string | undefined;
		const findItem = groupData.groupChunkList.find((item: any) => item.groupId === groupId);
		return findItem?.leaderId;
	}
});
provide('leaderId', groupLeaderId);

const handleSelectTrees = (items: Array<Tree>) => {
	const tempIds = items.map((item) => item.id);
	// 存在一个tempIds不在courseTreeNodes中，直接return
	if (tempIds.some((id) => !courseTreeNodes.value.includes(id))) return;
	setData({
		level: items.length,
		id: items.at(-1)?.id ?? '',
		parentId: items.at(-1)?.parentId ?? '',
	});
	teachTrees.value = items;
};
const handleUpdateStatus = (status: 2 | 3) => {
	Modal.confirm({
		title: '确认提示',
		content: `是否${status === 2 ? '开始上课' : '结束课堂'}，请确认`,
		onOk() {
			updateTeachPlanStatus(params.teachPlanId, status).then(() => {
				if (teachPlan?.value) {
					teachPlan.value.status = status;
				}
				if (cardDetailRef.value) {
					cardDetailRef.value.updateReportState(status);
				}
			});
		},
	});
};
const handleSign = () => {
	updateSignInFlag(params.teachPlanId).then(() => {
		teachPlan.value!.teachScene.signInFlag = true;
		ws.value?.send(
			JSON.stringify({
				api: 'initiateSignIn',
				data: { teachPlanId: params.teachPlanId, teacherId: user.value!.id },
			}),
		);
	});
};
// 学生签到
const handleUpdateSignList = () => {
	if (signAbortController.value) {
		signAbortController.value.abort();
	}
	signAbortController.value = new AbortController();
	const { signal } = signAbortController.value;
	axios
		.get<
			string[]
		>('/teach/signIn/getAlreadySignInStudentIdList', { signal, params: { teachPlanId: params.teachPlanId } })
		.then((res) => {
			teachStructure.value?.groupDataList.forEach((item) => {
				item.students.forEach((v) => (v.signInFlag = res.data.includes(v.userId)));
			});
		});
};
// 抢答
const grabId = ref<string | null>(null);
const showGrab = ref(false);
// 学生抢答列表
const grabList = computed(() => {
	return interactionData.value
		.filter((item) => item.interactionType === 1 && item.quickResponseId === grabId.value)
		.sort((a, b) => new Date(a.createTime).toISOString().localeCompare(new Date(b.createTime).toISOString()));
});

const handleGrab = () => {
	showGrab.value = true;
};

const interactionController = ref<AbortController | null>(null);
const fetchInteractionData = () => {
	if (interactionController.value) {
		interactionController.value.abort();
	}
	interactionController.value = new AbortController()
	getInteractionList(params.teachPlanId, interactionController.value.signal).then((res) => {
		interactionData.value = res.data;
	});
};

const getStudentData = (id: string) => {
	return teachStructure.value?.groupDataList.flatMap((item) => item.students).find((student) => student.userId === id)!;
};

const handleAcceptGrab = (item: TeachInteraction) => {
	if (item.successFlag) return;
	updateTeachInteractionSuccessFlag({
		teachPlanId: params.teachPlanId,
		interactionId: item.id,
		successFlag: true,
		teacherId: user.value!.id,
		studentId: item.studentId,
	}).then(() => {
		interactionData.value.find((v) => v.id === item.id)!.successFlag = true;
	});
};

const handleGrabStart = () => {
	addQuickResponse(params.teachPlanId).then((res) => {
		grabId.value = res.data;
		deadline = Date.now() + 1000 * 60;
	});
};

const handleGrabEnd1 = () => {
	quickResponseEnd(params.teachPlanId, grabId.value ?? '').then(() => {
		showGrab.value = false;
		interactionData.value = interactionData.value.filter((item) => item.interactionType !== 1);
		grabId.value = null;
		deadline = 0;
	});
};
const handsUpList = computed(() => {
	return interactionData.value
		.filter((item) => item.interactionType === 2 && item.successFlag === null)
		.sort((a, b) => new Date(b.createTime).toISOString().localeCompare(new Date(a.createTime).toISOString()));
});

const handleDoHandsUp = (item: TeachInteraction, successFlag: boolean) => {
	updateTeachInteractionSuccessFlag({
		teachPlanId: params.teachPlanId,
		interactionId: item.id,
		successFlag,
		teacherId: user.value!.id,
		studentId: item.studentId,
	}).then(() => {
		interactionData.value.find((v) => v.id === item.id)!.successFlag = successFlag;
	});
};

const handleMember = (member: any) => {
	groupData.currentGroup = member;
};

const randomGroup = (groupNumber: number) => {
	const uniqueStudents = _.uniqBy(groupData.allStudentList, 'userId');
	const sortGroupList = shuffleArray(uniqueStudents);
	const chunkGroupList = _.chunk(sortGroupList, groupNumber);
	groupData.groupChunkList = chunkGroupList.map((item, index) => {
		return {
			groupName: `第${index + 1}小组`,
			groupId: snowyflake.nextId().toString(),
			groupMemberList: item,
			leaderId: item[0].userId,
		};
	});
};

watch(
	() => groupData.groupNumber,
	(newVal) => {
		if (newVal && groupData.teamType === 1) {
			if (groupMenuRef.value.activeId) {
				groupMenuRef.value.activeId = '';
			}
			groupData.currentGroup = [];
			groupData.groupPending = [];
			randomGroup(newVal);
		}
	},
	{
		immediate: true,
	},
);

const handleSetLeader = (leaderId: string) => {
	const groupId = groupMenuRef.value?.activeId;
	if (groupData.groupType === 'update') {
		const currentList = groupData.groupInfo.find((item) => item.id === groupId);
		currentList.leaderId = leaderId;
	} else {
		const currentList = groupData.groupChunkList.find((item) => item.groupId === groupId);
		currentList.leaderId = leaderId;
	}
};

const handleDeleteGroup = (numberList: any) => {
	groupData.currentGroup = [];
	groupData.groupPending.unshift(...numberList);
};

const handleDeleteMember = (student: any) => {
	groupData.currentGroup = groupData.currentGroup.filter((item) => item.userId !== student.userId);
	groupData.groupPending.push(student);
};

const handleAddMember = (student: any) => {
	const groupId = groupMenuRef.value?.activeId;
	if (groupId) {
		groupData.groupPending = groupData.groupPending.filter((item) => item.userId !== student.userId);
		groupData.currentGroup.push(student);
	} else {
		message.info('请先选中要分配的小组');
	}
};

const handleChangeGroupType = (e: RadioChangeEvent) => {
	const type = e.target.value;
	if (type === 2) {
		groupData.groupPending = groupData.allStudentList;
		groupData.currentGroup = [];
		if (groupMenuRef.value) {
			groupMenuRef.value.activeId = '';
		}
		message.info('请先新增小组信息再分配小组成员');
	} else {
		groupData.groupPending = [];
		groupData.currentGroup = [];
		randomGroup(groupData.groupNumber);
	}
};

onMounted(async () => {
	getTeachPlanById(params.teachPlanId).then((res) => {
		teachPlan.value = res.data;
		if (res.data.teachScene.signInFlag) {
			handleUpdateSignList();
		}
	});
	getInteractionList(params.teachPlanId).then((res) => {
		interactionData.value = res.data;
	});

	const result = await getTeachTeam(params.teachPlanId);
	if (result && result.teamDataList.length > 0) {
		groupData.teamId = result.id;
		groupData.currentGroupId = result.teamDataList[0].id;
		groupData.groupNumber = result.autoTeamSize;
		groupData.teamType = result.teamType;
		groupData.groupInfo = result.teamDataList;
		groupData.groupType = 'update';
		groupData.saveFlag = true;
	} else {
		groupData.groupType = 'add';
		groupData.saveFlag = false;
	}
	getStudent(params.teachPlanId).then((res) => {
		teachStructure.value = res.data;
		groupData.allStudentList = res.data.groupDataList.flatMap((item) => {
			const { groupName, students } = item;
			return students.map((student) => {
				return {
					groupName,
					...student,
				};
			});
		});
		if (groupData.groupInfo.length > 0) {
			return;
		} else {
			groupData.groupPending = groupData.allStudentList;
			groupData.currentGroup = [];
		}
	});
	getTeachMenuCourseTree(params.teachPlanId).then((res) => {
		tree.value = res;
		if (teachPlan.value?.courseTreeNodes) {
			courseTreeNodes.value = teachPlan.value.courseTreeNodes
			const [level1, level2, level3] = teachPlan.value?.courseTreeNodes;
			const levelTree1 = tree.value.find((treeItem) => treeItem.id === level1);
			const levelTree2 = levelTree1?.children?.find((treeItem) => treeItem.id === level2);
			const levelTree3 = levelTree2?.children?.find((treeItem) => treeItem.id === level3);
			if (levelTree1 && levelTree2 && levelTree3) {
				teachTrees.value = [levelTree1, levelTree2, levelTree3];
			}
			localStorage.setItem('expandedMenuIds', JSON.stringify(teachPlan.value.courseTreeNodes));
		}
	});

	getCurrentQuickResponse(params.teachPlanId).then((res) => {
		grabId.value = res.data;
	});
	if (ws.value) {
		ws.value.onmessage = (event) => {
			// 添加对pong消息的处理
			if (event.data === 'pong') {
					return;
			}
			const news: { api: string; data: string } = JSON.parse(event.data);
		switch (news.api) {
			case 'studentSignIn':
				handleUpdateSignList();
				break;
			case 'studentRaiseHand':
				fetchInteractionData();
				break;
			case 'studentAnswerNotifyTeacher':
				getInteractionList(params.teachPlanId).then((res) => {
					interactionData.value = res.data;
				});
				break;
			}
		};
	}
	fetchInteractionData();
});
// 随机排序数组
function shuffleArray<T>(array: T[]): T[] {
	const shuffledArray = [...array]; // 创建一个副本，避免改变原数组
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		// 生成一个 0 到 i 之间的随机整数
		const randomIndex = Math.floor(Math.random() * (i + 1));

		// 交换元素
		[shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
	}
	return shuffledArray;
}
// 签到类型
const signActiveKey = ref<string>('2');

// 已签到人数
const signLength = computed(() => {
	return (
		teachStructure.value?.groupDataList.flatMap((item) => item.students).filter((student) => student.signInFlag)
			.length || 0
	);
});

// 未签到人数
const unsignLength = computed(() => {
	return groupData.allStudentList.length - signLength.value;
});

// 签到率
const signPercent = computed(() => {
	return +((signLength.value / groupData.allStudentList.length) * 100).toFixed(1);
});

const handleGrabResult = (grabInfo: TeachInteraction, resultFlag: boolean) => {
	teacherNotifyAnswerResult({
		interactionId: grabInfo.id,
		quickResultFlag: resultFlag,
		teacherId: grabInfo.teacherId,
		studentId: grabInfo.studentId,
		teachPlanId: grabInfo.teachPlanId,
	});
	interactionData.value.find((v) => v.id === grabInfo.id)!.quickResultFlag = resultFlag;
};
const handleMenuSave = () => {
	if (!groupData.saveFlag) {
		groupData.saveFlag = true;
	}
};

const goToAnalysis = () => {
	router.push({
		path: '/school/analyse/teach',
		query: {
			type: 'look',
			teachPlanId: params.teachPlanId,
		},
	});
};

// 提供 saveFlag
provide('saveFlag', toRef(groupData, 'saveFlag'));
provide('teachPlan', teachPlan);

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
				<a-space v-if="teachPlan">
					<a-button v-if="[1, 4].includes(teachPlan.status)" size="small" type="primary" @click="handleUpdateStatus(2)">
						开始上课
					</a-button>
					<template v-if="teachPlan.status === 2">
						<a-button size="small" type="primary" @click="showSign = true">点名签到</a-button>
						<a-button size="small" type="primary" @click="handleGrab">抢答</a-button>
						<a-badge size="small" :count="handsUpList.length">
							<a-button size="small" type="primary" @click="handsOpen = true">举手</a-button>
						</a-badge>
						<a-button size="small" type="primary" @click="handleUpdateStatus(3)">结束授课</a-button>
					</template>
					<a-button size="small" type="primary" @click="onOnlyOpen">积分表现</a-button>
					<a-button size="small" type="primary" @click="goToAnalysis">学情分析</a-button>
				</a-space>
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
									<course-menu :menu-trees="tree" :selected="teachTrees" @select="handleSelectTrees" />
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
										<div>{{ teachTrees.at(-1)?.label || '' }}</div>
									</div>
								</template>
								<div class="overflow-y-auto h-[calc(100vh-270px)]">
									<teach-content ref="teachContentRef" :teach-trees="teachTrees"> </teach-content>
								</div>
							</a-card>
						</div>
					</a-tab-pane>
					<a-tab-pane key="2">
						<template #tab>
							<div>学生分组<a-badge v-if="!groupData.saveFlag" class="ml-2" status="warning" /></div>
						</template>
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
									<group-menu
										ref="groupMenuRef"
										:status="teachPlan?.status"
										:teach-plan-id="params.teachPlanId"
										:group-number="groupData.groupNumber"
										:team-type="groupData.teamType"
										:group-chunk-list="groupData.groupChunkList"
										:group-info="groupData.groupInfo"
										:all-student-list="groupData.allStudentList"
										:group-pending="groupData.groupPending"
										:team-id="groupData.teamId"
										@member="handleMember"
										@delete="handleDeleteGroup"
										@save="handleMenuSave"
									>
									</group-menu>
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
										<div>分组信息（{{ groupData.saveFlag ? '已分组' : '未分组' }}）</div>
									</div>
								</template>
								<template #extra>
									<a-radio-group
										v-show="teachPlan?.status !== 3"
										v-model:value="groupData.teamType"
										@change="handleChangeGroupType"
									>
										<a-radio :value="2">手动分组（人工选择每组成员）</a-radio>
										<a-radio :value="1">
											<div class="flex items-center">
												<span>自动分组（自动创建分组，随机分配成员）每组</span>
												<a-input-number
													size="small"
													class="w-10"
													v-model:value="groupData.groupNumber"
													:controls="false"
													:min="1"
													:precision="0"
												></a-input-number>
												人
											</div>
										</a-radio>
									</a-radio-group>
								</template>
								<div class="overflow-y-auto h-[calc(100vh-270px)]">
									<div class="grid grid-rows-2 gap-4 h-full">
										<group-card
											title-name="已分配小组成员"
											:student-list="groupData.currentGroup"
											type="delete"
											@delete="handleDeleteMember"
											@set="handleSetLeader"
										></group-card>
										<group-card
											title-name="未分配小组成员"
											:student-list="groupData.groupPending"
											type="add"
											@add="handleAddMember"
										></group-card>
									</div>
								</div>
							</a-card>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
		</a-card>
		<a-modal v-model:open="showSign" :footer="false" width="800px">
			<template #title>
				<div class="flex text-[#0091ff] items-center">
					<sign-svg class="mr-2"></sign-svg>
					上课签到
				</div>
			</template>
			<template v-if="!teachPlan?.teachScene.signInFlag">
				<div
					class="mx-auto size-24 rounded-full leading-[96px] text-center text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-600 cursor-pointer select-none"
					@click="handleSign"
				>
					签到
				</div>
			</template>
			<template v-else>
				<a-card>
					<div class="flex items-center">
						<a-progress type="circle" :percent="signPercent" :stroke-width="10" />
						<div class="mx-10">
							<div class="text-lg text-[#999] mb-4">学生总数</div>
							<div class="text-2xl text-[#0091ff]">
								{{ groupData.allStudentList.length || 0 }}<span class="ml-2 text-sm text-[#333]">人</span>
							</div>
						</div>
						<div class="mx-10">
							<div class="text-lg text-[#999] mb-4">完成签到</div>
							<div class="text-2xl text-[#0091ff]">
								{{ signLength }}<span class="ml-2 text-sm text-[#333]">人</span>
							</div>
						</div>
						<div class="mx-10">
							<div class="text-lg text-[#999] mb-4">未完成签到</div>
							<div class="text-2xl text-[#0091ff]">
								{{ unsignLength }}<span class="ml-2 text-sm text-[#333]">人</span>
							</div>
						</div>
					</div>
				</a-card>
				<a-tabs v-model:activeKey="signActiveKey">
					<a-tab-pane key="1" tab="已签到学生">
						<div class="grid grid-cols-3 gap-4 max-h-72 overflow-y-scroll">
							<a-card
								size="small"
								v-for="student in teachStructure?.groupDataList
									.flatMap((item) => item.students)
									.filter((student) => student.signInFlag)"
								:key="student.userId"
							>
								<div class="flex">
									<div class="size-12 overflow-hidden rounded-full mr-4">
										<img :src="student.avatarUrl" alt="" />
									</div>
									<div class="leading-6 font-mono">
										<div>学号：{{ student.number }}</div>
										<div>姓名：{{ student.name }}</div>
									</div>
								</div>
							</a-card>
						</div>
					</a-tab-pane>
					<a-tab-pane key="2" tab="未签到学生">
						<div class="grid grid-cols-3 gap-4 max-h-72 overflow-y-scroll">
							<a-card
								size="small"
								v-for="student in teachStructure?.groupDataList
									.flatMap((item) => item.students)
									.filter((student) => !student.signInFlag)"
								:key="student.userId"
							>
								<div class="flex">
									<div class="size-12 overflow-hidden rounded-full mr-4">
										<img :src="student.avatarUrl" alt="" />
									</div>
									<div class="leading-6 font-mono">
										<div>学号：{{ student.number }}</div>
										<div>姓名：{{ student.name }}</div>
									</div>
								</div>
							</a-card>
						</div>
					</a-tab-pane>
				</a-tabs>
			</template>
		</a-modal>
		<a-modal v-if="showGrab" v-model:open="showGrab" width="500px">
			<template #title>
				<div class="flex">
					<lightning-svg></lightning-svg>
					<div class="ml-2 text-[#0091ff]">抢答</div>
				</div>
			</template>
			<template v-if="grabList.length === 0">
				<div class="font-bold text-center mb-4">
					<div v-if="grabId">已成功发起问题抢答！</div>
					<div v-else>等待发起问题抢答</div>
				</div>
				<div class="relative flex justify-center items-center">
					<circle-svg></circle-svg>
					<a-statistic-countdown
						class="absolute top-[60px] left-[195px]"
						:value="deadline"
						format="ss:SS"
						:value-style="{ color: 'white' }"
					>
					</a-statistic-countdown>
				</div>
				<div v-if="grabId" class="text-center text-[#999] mt-4">等待学生抢答中</div>
			</template>
			<template v-else>
				<div class="bg-gradient-to-b from-[#ebf3fe] to-[#fff] rounded-lg shadow p-6 text-left">
					<table class="w-full">
						<thead>
							<tr>
								<th class="text-[#999] font-normal w-[50px]">排名</th>
								<th class="text-[#999] font-normal w-[110px]">学号</th>
								<th class="text-[#999] font-normal w-[90px]">姓名</th>
								<th class="text-[#999] font-normal w-[80px]">时间</th>
								<th class="text-[#999] font-normal">操作</th>
							</tr>
						</thead>
					</table>
					<div class="h-[200px] overflow-y-auto">
						<table class="w-full">
							<tbody>
								<tr v-for="(grab, index) in grabList" :key="grab.id" class="select-none hover:bg-sky-100">
									<td class="w-[50px]">
										<span class="ml-[6px] font-bold text-center">{{ index + 1 }}</span>
									</td>
									<td class="w-[110px]">{{ getStudentData(grab.studentId).number }}</td>
									<td class="w-[90px] font-bold">{{ getStudentData(grab.studentId).name }}</td>
									<td class="w-[80px] font-bold">{{ new Date(grab.createTime).toLocaleString().slice(10) }}</td>
									<td>
										<a-button v-if="!grab.successFlag" type="link" class="px-0" @click="handleAcceptGrab(grab)"
											>选择</a-button
										>
										<template v-else>
											<a-button
												class="px-0 mr-2"
												type="link"
												@click="handleGrabResult(grab, true)"
												:disabled="grab.quickResultFlag !== null"
												>正确</a-button
											>
											<a-button
												class="px-0"
												type="link"
												@click="handleGrabResult(grab, false)"
												:disabled="grab.quickResultFlag !== null"
												>错误</a-button
											>
										</template>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</template>
			<template #footer>
				<div class="flex justify-end gap-2">
					<a-button v-if="grabId" type="primary" @click="handleGrabEnd1">结束抢答</a-button>
					<a-button v-else type="primary" @click="handleGrabStart">开始抢答</a-button>
				</div>
			</template>
		</a-modal>
		<point-rank v-if="state.onlyOpen" v-model:open="state.onlyOpen"></point-rank>
		<!-- 学生举手列表 -->
		<a-modal v-if="handsOpen" v-model:open="handsOpen" width="500px" :footer="false">
			<template #title>
				<div class="flex">
					<hand-svg></hand-svg>
					<div class="ml-2 text-[#0091ff]">学生举手列表</div>
				</div>
			</template>
			<div class="bg-gradient-to-b from-[#ebf3fe] to-[#fff] rounded-lg shadow p-6 text-left">
				<table class="w-full">
					<thead>
						<tr>
							<th class="text-[#999] font-normal w-[50px]">序号</th>
							<th class="text-[#999] font-normal w-[110px]">学号</th>
							<th class="text-[#999] font-normal w-[90px]">姓名</th>
							<th class="text-[#999] font-normal w-[80px]">时间</th>
							<th class="text-[#999] font-normal">操作</th>
						</tr>
					</thead>
				</table>
				<div class="h-[200px] overflow-y-auto">
					<table class="w-full">
						<tbody>
							<tr v-for="(hand, index) in handsUpList" :key="hand.id" class="select-none hover:bg-sky-100">
								<td class="w-[50px]">
									<span class="ml-[6px] font-bold text-center">{{ index + 1 }}</span>
								</td>
								<td class="w-[110px]">{{ getStudentData(hand.studentId).number }}</td>
								<td class="w-[90px] font-bold">{{ getStudentData(hand.studentId).name }}</td>
								<td class="w-[80px] font-bold">{{ new Date(hand.createTime).toLocaleString().slice(10) }}</td>
								<td>
									<a-button class="px-0 mr-2" type="link" @click="handleDoHandsUp(hand, false)">忽略</a-button>
									<a-button class="px-0" type="link" @click="handleDoHandsUp(hand, true)">回应</a-button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</a-modal>
	</course-detail>
</template>
