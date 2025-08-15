<script setup lang="ts">
import ReportContent from './report-content.vue';
import ContentForeword from './comment-content-foreword.vue';
import DevelopCareerDemand from '@/view/__report/components/workplace/course-develop/develop-career-demand.vue';
import emitter from '@/utils/event.ts';
import { message, Modal } from 'ant-design-vue';
import treeUtils from '@/utils/tree.ts';
import SidebarCloseSvg from '@/assets/menu/sidebar-close.svg';
import SidebarOpenSvg from '@/assets/menu/sidebar-open.svg';
import TextbookMenu from '@/view/__report/components/workplace/textbook-menu.tsx';
import { OccupationQuality, REPORT_TYPE, StructureData } from '@/view/__report';
import ReportMenu from '@/view/__report/components/workplace/report-menu.tsx';
import dayjs from 'dayjs';
import useAppTheme from '@/hooks/useAppTheme.ts';
import TextbookContent from '@/view/__report/components/workplace/textbook/textbook-content.vue';
import guidebookContent from './guidebook/guidebook-content.vue';
import useLearningTree from '@/view/__report/components/workplace/textbook/useLearningTree.ts';
import useReportInfo from './useReportInfo';
import useErrorTable from '@/view/__report/components/workplace/useErrorTable.ts';
import CalendarTabs from './calendar/calendar-tabs.vue';
import WorkbookContent from './workbook/workbook-content.vue';
import {
	addMenuCourseTree,
	checkReportStatus,
	doReportAction,
	generateCourseReportMenu,
	getMenuCourseTree,
	getMenuTree,
	checkReportAuditPass,
} from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';

const { appTheme } = useAppTheme();
const { reportInfo } = useReportInfo();
const { setErrors } = useErrorTable();

const cardBgColor = computed(() => (appTheme.value === 'white' ? '#EBF3FF' : '#333F69'));

const cardDetailTitle = computed(
	() =>
		({
			1: '企业调研详情',
			2: '人才培养方案详情',
			3: '课程结构详情',
			4: '课程标准详情',
			5: '活页教材详情',
			6: '教学用书详情',
			7: '学生用书详情',
			8: '学习用书详情',
			9: '校历详情',
		})[reportInfo.value.reportType] || '',
);

const reportUser = defineModel<{ editor: Array<string>; auditor: Array<string> }>('reportUser', {
	required: true,
	default: { editor: [], auditor: [] },
});
const { user } = useUserStore();
const successStatus = ref<boolean>(false);
const score = ref(0);
const reason = ref<string>('');
const router = useRouter();
const modalState = reactive<{ visible: boolean; type: 'pass' | 'reject' | 'notpass' }>({
	visible: false,
	type: 'pass',
});
const emits = defineEmits(['update']);
// 课程开发的编辑状态
const isDevelopEdit = ref<boolean>(false);
const developRef = ref();
// 重置
const developReset = () => {
	Modal.confirm({
		title: '确认重置',
		content: '重置后将清空所有已编辑的内容，是否确认重置？',
		onOk() {
			const { resetData } = developRef.value;
			resetData();
		},
	});
};
// 查看
const developView = () => {
	getMenuCourseTree(reportInfo.value.reportId, true).then((res) => {
		if (res.length > 0) {
			menuData.value = res;
			isDevelopEdit.value = false;
			textbookTrees.value = [menuData.value[0]];
		} else {
			message.warning('请先填写内容哦! ');
			isDevelopEdit.value = true;
		}
	});
};
// 结构转换
const processStudyStep = (nodes: StructureData[]): StructureData[] => {
	return nodes.map((node) => {
		const newNode: StructureData = { ...node };

		// 如果对象的 type 是 "studyStep" 并且有 children
		if (newNode.type === 'studyStep' && newNode.children) {
			const occupationQualityList: OccupationQuality[] = [];

			// 遍历当前对象的 children，收集 occupationQuality
			newNode.children.forEach((child) => {
				if (child.occupationQuality) {
					occupationQualityList.push(child.occupationQuality);
				}
			});

			// 将收集到的 occupationQuality 列表添加到对象本身
			newNode.occupationQualityData = occupationQualityList;

			// 清空 children
			newNode.children = [];
		}

		// 递归处理子节点并返回新节点
		if (newNode.children) {
			newNode.children = processStudyStep(newNode.children);
		}

		return newNode;
	});
};

const developSave = (type?: string) => {
	const { data } = developRef.value;
	updateSortValues(data);
	const resultData = processStudyStep(data);
	const structureDataList = treeUtils.treeToList(resultData) as StructureData[];
	const reportMenuCourseList = structureDataList.map((item) => ({
		...item,
		reportId: reportInfo.value.reportId,
	}));
	addMenuCourseTree(reportMenuCourseList).then(() => {
		message.success(type === 'auto' ? '已自动保存！' : '保存成功!');
	});
};

function updateSortValues(dataArray: Array<StructureData>) {
	function updateNodeSortValues(nodes: StructureData[]) {
		nodes.forEach((node, index) => {
			node.sort = index + 1;
			if (node.children && node.children.length > 0) {
				updateNodeSortValues(node.children);
			}
		});
	}

	updateNodeSortValues(dataArray);
}

// 完成
const developAdd = () => {
	const { data } = developRef.value;
	updateSortValues(data);
	const resultData = processStudyStep(data);
	const structureDataList = treeUtils.treeToList(resultData) as StructureData[];
	const reportMenuCourseList = structureDataList.map((item) => ({
		...item,
		reportId: reportInfo.value.reportId,
	}));
	addMenuCourseTree(reportMenuCourseList).then(() => {
		generateCourseReportMenu(reportInfo.value.reportId).then((res) => {
			menuData.value = res;
			isDevelopEdit.value = false;
		});
	});
};

const menuData = ref<Array<Tree>>([]);
const fetchReportMenu = () => {
	getMenuTree({ reportId: reportInfo.value.reportId }).then((res) => {
		menuData.value = res;
	});
};

const textbookTrees = ref<Array<Tree>>([]);

const { setData } = useLearningTree();
const handleSelectTrees = (items: Array<Tree>) => {
	setData({
		level: items.length,
		id: items.at(-1)?.id ?? '',
		parentId: items.at(-1)?.parentId ?? '',
	});
	textbookTrees.value = items;
};
const handleSelectTree = (item: Tree) => {
	tree.value = item;
};
const tree = ref<Tree>();

const pageState = reactive<{ showMenu: boolean; offsetTop: number; showError: boolean; error: Array<string> }>({
	showMenu: true,
	offsetTop: 72,
	showError: false,
	error: [],
});

const handleActionReport = () => {
	if (modalState.type === 'notpass') {
		if (!reason.value) {
			message.warning('请填写理由');
		} else {
			Modal.confirm({
				title: '请确认',
				content: '未通过的报告将无法继续使用，是否确认？',
				onOk() {
					doReportAction({
						reportId: reportInfo.value.reportId,
						userId: user.value!.id,
						actionType: 2,
						operationType: 4,
						opinion: reason.value,
					}).then(() => {
						router.back();
					});
				},
			});
		}
	}
	if (modalState.type === 'reject') {
		if (!reason.value) {
			message.warning('请填写理由');
		} else {
			doReportAction({
				reportId: reportInfo.value.reportId,
				userId: user.value!.id,
				actionType: 2,
				operationType: 2,
				opinion: reason.value,
			}).then(() => {
				router.back();
			});
		}
	}
	if (modalState.type === 'pass') {
		if (reportInfo.value.reportAuditType === 3) {
			if (!score.value) {
				message.warn('请填写分值');
				return;
			}
			doReportAction({
				reportId: reportInfo.value.reportId,
				userId: user.value!.id,
				actionType: 2,
				operationType: 3,
				opinion: score.value,
			}).then(() => {
				router.back();
			});
		} else {
			doReportAction({
				reportId: reportInfo.value.reportId,
				userId: user.value!.id,
				actionType: 2,
				operationType: 3,
			}).then(() => {
				router.back();
			});
		}
	}
};

const onClickSubmit = async () => {
	try {
		const res = await checkReportStatus({
			reportId: reportInfo.value.reportId,
			auditRecordType: 1,
		});

		if (res.data.length) {
			message.warning('无法提交，存在尚未解决的问题!');
			pageState.error = res.data.flatMap((item) => [item.menuId, ...item.tableIdList]);
			setErrors(pageState.error);
			pageState.showError = true;
		} else {
			await doReportAction({
				reportId: reportInfo.value.reportId,
				userId: user.value!.id,
				actionType: 1,
				operationType: 1,
				opinion: '',
			});
			emits('update');
			successStatus.value = true;
		}
	} catch (error) {
		message.error('提交失败，请重试');
	}
};

const handlePass = async () => {
	if ([5, 6].includes(reportInfo.value.reportType)) {
		const res = await checkReportAuditPass(reportInfo.value.reportId);
		if (!res.data) {
			message.warning('存在未审阅的表单，请先完成审阅');
			return;
		}
	}
	const promises = [
		await checkReportStatus({ reportId: reportInfo.value.reportId, auditRecordType: 1 }),
		await checkReportStatus({ reportId: reportInfo.value.reportId, auditRecordType: 2 }),
	];
	const [response1, response2] = await Promise.all(promises);

	if (response1.data.length) {
		message.warning('无法通过，存在待修改的问题');
		pageState.error = [];
		response1.data.forEach((item) => {
			pageState.error.push(item.menuId, ...item.tableIdList);
		});
		setErrors(pageState.error);
		pageState.showError = true;
	} else if (response2.data.length) {
		message.warning('无法通过，存在待审核的问题');
		pageState.error = [];
		response2.data.forEach((item) => {
			pageState.error.push(item.menuId, ...item.tableIdList);
		});
		pageState.showError = true;
	} else {
		modalState.type = 'pass';
		modalState.visible = true;
	}
};

const handleNotPass = () => {
	modalState.type = 'notpass';
	modalState.visible = true;
};
const handleRejectReport = () => {
	checkReportStatus({
		reportId: reportInfo.value.reportId,
		auditRecordType: 2,
	}).then((res) => {
		if (res.data.length) {
			message.warning('无法通过，存在待审核的问题');
			pageState.error = [];
			res.data.forEach((item) => {
				pageState.error.push(item.menuId, ...item.tableIdList);
			});
			pageState.showError = true;
		} else {
			modalState.type = 'reject';
			modalState.visible = true;
		}
	});
};

const handleUpdateTask = () => {
	textbookTrees.value[1].editedFlag = true;
	menuData.value.forEach((item) => {
		item.children?.forEach((v) => {
			if (v.id === textbookTrees.value[1].id) {
				v.editedFlag = true;
			}
		});
	});
};

const handleDevelopAction = (action: 'reset' | 'save' | 'add') => {
	const actions = {
		reset: developReset,
		save: developSave,
		add: developAdd,
	};
	actions[action]();
};

const handleReportAction = async (type: 'submit' | 'pass' | 'notPass' | 'reject') => {
	const actions = {
		submit: onClickSubmit,
		pass: handlePass,
		notPass: handleNotPass,
		reject: handleRejectReport,
	};
	await actions[type]();
};

// 添加定时器
let autoSaveTimer: ReturnType<typeof setInterval>;

watch(
	() => isDevelopEdit.value,
	(newValue) => {
		if (newValue) {
			// 如果 isDevelopEdit 为 true，每30秒自动保存
			autoSaveTimer = setInterval(() => {
				developSave('auto');
			}, 30000);
		} else {
			// 如果 isDevelopEdit 为 false，清除定时器
			clearInterval(autoSaveTimer);
		}
	},
);

onMounted(() => {
	if ([3, 5, 6, 7].includes(reportInfo.value.reportType)) {
		developView();
	} else {
		fetchReportMenu();
	}
});

// 在离开页面时清除定时器
onBeforeUnmount(() => {
	clearInterval(autoSaveTimer);
});
</script>

<template>
	<a-card size="small" style="height: calc(100vh - 88px)" :bordered="false">
		<template #title>
			<div class="card-title">{{ cardDetailTitle }}</div>
		</template>
		<template #extra>
			<div v-if="!successStatus">
				<!-- 课程开发 -->
				<a-space v-if="[3, 5].includes(reportInfo.reportType) && reportInfo.pageType === 'edit'">
					<template v-if="isDevelopEdit">
						<a-button
							v-for="action in ['reset', 'save', 'add']"
							:key="action"
							size="small"
							:type="action === 'add' ? 'primary' : undefined"
							@click="handleDevelopAction(action as 'reset' | 'save' | 'add')"
						>
							{{ { reset: '重置', save: '保存', add: '完成' }[action] }}
						</a-button>
					</template>
					<template v-else>
						<a-button v-if="!reportInfo.relationReportId" size="small" @click="isDevelopEdit = true">编辑</a-button>
						<a-button
							v-if="
								reportInfo.pageType === 'edit' &&
								[2, 3].includes(reportInfo.reportStatus) &&
								reportInfo.reportSubmitter === user!.id
							"
							size="small"
							type="primary"
							@click="handleReportAction('submit')"
						>
							提交审核
						</a-button>
					</template>
				</a-space>

				<!-- 普遍的操作按钮 -->
				<a-space v-else>
					<a-button
						v-if="
							reportInfo.pageType === 'edit' &&
							[2, 3].includes(reportInfo.reportStatus) &&
							reportInfo.reportSubmitter === user!.id
						"
						size="small"
						type="primary"
						@click="handleReportAction('submit')"
					>
						提交审核
					</a-button>
					<template
						v-if="
							reportInfo.pageType === 'audit' &&
							reportInfo.reportStatus === 4 &&
							reportUser.auditor.includes(user!.id) &&
							reportInfo.userAuditFlag
						"
					>
						<a-button size="small" @click="handleReportAction('notPass')">不通过</a-button>
						<a-button size="small" type="primary" danger @click="handleReportAction('reject')">驳回</a-button>
						<a-button size="small" type="primary" @click="handleReportAction('pass')">通过</a-button>
					</template>
				</a-space>
			</div>
		</template>
		<div v-if="successStatus" style="height: calc(100vh - 452px)">
			<a-result status="success" title="提交成功!">
				<template #extra>
					<a-button type="link" @click="router.back()">查看详情</a-button>
				</template>
			</a-result>
		</div>
		<div v-else class="w-full overflow-y-auto h-[calc(100vh - 148px)]">
			<develop-career-demand
				v-if="[3, 5].includes(reportInfo.reportType) && isDevelopEdit"
				ref="developRef"
				:report-id="reportInfo.reportId"
			></develop-career-demand>
			<!-- 校历 -->
			<calendar-tabs v-else-if="reportInfo.reportType === REPORT_TYPE.CALENDAR"></calendar-tabs>
			<div v-else class="flex gap-4">
				<a-card
					size="small"
					v-show="pageState.showMenu"
					:style="{ 'background-color': `${cardBgColor}` }"
					class="h-full min-w-[300px] max-w-[300px]"
					:bordered="false"
				>
					<template #title>
						目录
						<a-tooltip v-if="[5, 6, 7].includes(reportInfo.reportType)" placement="right">
							<i class="bi bi-question-circle-fill"></i>
							<template #title>
								<div class="w-20">
									<a-badge status="success" />
									已完成<br />
									<a-badge status="processing" />
									进行中<br />
									<a-badge status="warning" />
									未开始<br />
								</div>
							</template>
						</a-tooltip>
					</template>
					<template #extra>
						<a-tooltip v-if="pageState.showMenu" title="收起" placement="right">
							<a-button type="link" @click="pageState.showMenu = false">
								<template #icon>
									<sidebar-close-svg></sidebar-close-svg>
								</template>
							</a-button>
						</a-tooltip>
					</template>
					<div class="overflow-y-auto" style="height: calc(100vh - 214px)">
						<template v-if="[5, 6, 7].includes(reportInfo.reportType)">
							<textbook-menu
								:error="pageState.error"
								:menu-trees="menuData"
								:selected="textbookTrees"
								:show-error="pageState.showError"
								:type="reportInfo.pageType"
								@select="handleSelectTrees"
							/>
						</template>
						<template v-else>
							<report-menu
								:error="pageState.error"
								:menu-trees="menuData"
								:show-error="pageState.showError"
								class="overflow-y-auto"
								style="height: calc(100vh - 214px)"
								@select="handleSelectTree"
							/>
						</template>
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
							<a-tooltip v-if="!pageState.showMenu" title="展开" placement="right">
								<a-button type="link" @click="pageState.showMenu = true">
									<template #icon>
										<sidebar-open-svg></sidebar-open-svg>
									</template>
								</a-button>
							</a-tooltip>
							<div v-if="[5, 6, 7].includes(reportInfo.reportType)">{{ textbookTrees.at(-1)?.label || '' }}</div>
							<div v-else>{{ (tree && tree.label) || '' }}</div>
						</div>
					</template>
					<template #extra>
						<a-space>
							<template v-if="reportInfo.pageType === 'edit'">
								<a-button v-if="tree?.fileId" class="flex items-center" size="small" @click="$download(tree.fileId)">
									下载模版
								</a-button>
								<template v-if="[2, 3].includes(reportInfo.reportStatus)">
									<template v-if="tree?.fileId && reportUser.editor.includes(user!.id)">
										<a-button class="flex items-center" size="small" @click="emitter.emit('report_table_upload_excel')">
											上传模板
										</a-button>
									</template>
									<template v-if="reportUser.editor.includes(user!.id) && ![5, 6].includes(reportInfo.reportType)">
										<a-button size="small" @click="emitter.emit('report_table_reset_table_data')">重置</a-button>
										<a-button size="small" type="primary" @click="emitter.emit('report_table_save')"> 保存</a-button>
									</template>
								</template>
							</template>
						</a-space>
					</template>
					<div class="overflow-y-auto h-[calc(100vh-214px)]">
						<template v-if="reportInfo.reportType === 5">
							<textbook-content
								v-if="textbookTrees.length > 0"
								:text-book-trees="textbookTrees"
								:type="reportInfo.pageType"
								:report-status="reportInfo.reportStatus"
								@update:task="handleUpdateTask"
							/>
						</template>
						<template v-else-if="reportInfo.reportType === 6">
							<guidebook-content
								v-if="textbookTrees.length > 0"
								:text-book-trees="textbookTrees"
								:type="reportInfo.pageType"
								:report-status="reportInfo.reportStatus"
								@update:task="handleUpdateTask"
							>
							</guidebook-content>
						</template>
						<template v-else-if="reportInfo.reportType === 7">
							<workbook-content
								v-if="textbookTrees.length > 0"
								:text-book-trees="textbookTrees"
								:type="reportInfo.pageType"
								:report-status="reportInfo.reportStatus"
								@update:task="handleUpdateTask"
							>
							</workbook-content>
						</template>
						<template v-else>
							<template v-if="tree">
								<report-content
									v-model:check-error="pageState.showError"
									v-model:error="pageState.error"
									v-model:menu="tree"
									:type="reportInfo.pageType"
									class="overflow-y-auto"
									style="height: calc(100vh - 214px)"
								/>
							</template>
							<template v-else>
								<content-foreword class="overflow-hidden" style="height: calc(100vh - 214px)" />
							</template>
						</template>
					</div>
				</a-card>
			</div>
		</div>
	</a-card>
	<a-modal v-model:open="modalState.visible" @ok="handleActionReport">
		<template #title>
			<div>{{ { notpass: '未通过的报告将无法继续使用', reject: '驳回报告', pass: '审核通过' }[modalState.type] }}</div>
		</template>
		<div class="my-2">提交人: {{ user!.name }}</div>
		<div class="my-2">提交时间: {{ dayjs().format('YYYY-MM-DD HH:mm:ss') }}</div>
		<div v-if="reportInfo.reportAuditType === 3 && modalState.type === 'pass'" class="flex gap-4">
			<div class="leading-8">输入分值(最高{{ reportInfo.reportScore }}分)：</div>
			<div>
				<a-input-number v-model:value="score" :controls="false" :max="reportInfo.reportScore" :min="0"></a-input-number>
			</div>
		</div>
		<div>
			<a-textarea placeholder="请输入" v-model:value="reason" :auto-size="{ minRows: 2 }"></a-textarea>
		</div>
	</a-modal>
</template>

<style scoped>
.right-width {
	width: calc(100% - 356px);
}
</style>
