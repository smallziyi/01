<script lang="ts" setup>
import CloseSvg from '@/assets/icons/close.svg';
import {
	Screen,
	templateList,
	postScreenCard,
	getTemplateCardList,
	TemplateCardList,
	refreshTimeList,
	getDataIndexSourceList,
	DataIndexSourceList,
	screenShowTypeList,
	getScreenCardDetail,
} from '@/axios';
import { SelectValue, DefaultOptionType } from 'ant-design-vue/es/select/index.d';
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { FormInstance, message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import useUserStore from '@/store/modules/useUserStore';
import FileOverview from '@/view/__report/components/workplace/file-overview.vue';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import MUpload from '@/components/m-upload.vue';
const { user } = useUserStore();
const open = defineModel<boolean>('open', { type: Boolean, required: true });
const uploadRef = useTemplateRef<any>('uploadRef');
const uploadRef1 = useTemplateRef<any>('uploadRef1');
const props = defineProps<{
	type: 'add' | 'edit';
	screenId?: string;
}>();
const emits = defineEmits(['success']);
const formModel = ref<Screen>({
	clientId: user.value?.clientId || '',
	name: '',
	screenTemplate: 1,
	coverId: '',
	dataIndex: {
		indexCount: 12,
		refresh: 3,
		indexSetList: [],
	},
	disable: false,
	coverUrl: '',
	cardDataList: [],
	id: '',
	createBy: '',
	createUser: '',
	createTime: '',
	lastUpdateTime: '',
});

const rules: Record<string, Rule[]> = {
	name: [{ required: true, message: '请输入主题名称', trigger: 'change' }],
	screenTemplate: [{ required: true, message: '请选择投屏模板', trigger: 'change' }],
	coverId: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
	// 'cardDataList[0].cardName': [{ required: true, message: '请输入卡片名称', trigger: 'change' }],
	// 'cardDataList[0].content': [{ required: true, message: '请输入内容', trigger: 'change' }],
	// 'cardDataList[1].cardName': [{ required: true, message: '请输入卡片名称', trigger: 'change' }],
	// 'cardDataList[1].fileDataList': [{ required: true, message: '请上传文件', trigger: 'change' }],
	// 'cardDataList[2].cardName': [{ required: true, message: '请输入卡片名称', trigger: 'change' }],
	// 'cardDataList[2].fileShowType': [{ required: true, message: '请输入展示类型', trigger: 'change' }],
	// 'cardDataList[2].fileDataList': [{ required: true, message: '请上传文件', trigger: 'change' }],
	// 'cardDataList[3].content': [{ required: true, message: '请输入公告内容', trigger: 'change' }],
	// 'dataIndex.indexCount': [{ required: true, message: '请输入指标数量', trigger: 'change' }],
	// 'dataIndex.refresh': [{ required: true, message: '请输入刷新频率', trigger: 'change' }],
	// 'dataIndex.indexSetList': [{ required: true, message: '请输入指标设置', trigger: 'change' }],
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = ref<any>({ placeholder: '请输入内容...', MENU_CONF: {} });
// 富文本编辑器生成后触发
const handleCreated = (editor: any) => {
	editorRef.value = editor;
};

// 监听富文本编辑器粘贴行为
const customPaste = (
	editor: { insertText: (arg0: any) => void },
	event: { clipboardData: { getData: (arg0: string) => any }; preventDefault: () => void },
	callback: (arg0: boolean) => void,
) => {
	// 获取粘贴的纯文本
	const text = event.clipboardData.getData('text/plain');
	if (text) {
		editor.insertText(text);
		event.preventDefault();
		callback(false);
	}
};

const formRef = useTemplateRef<FormInstance>('formRef');
const dataIndexSourceListCopy = ref<DataIndexSourceList[]>([]);
const dataIndexSourceList = ref<DataIndexSourceList[]>([]);
const activeKey = ref(1);
const tabsList = ref<TemplateCardList[]>([]);
const dataSourceTypeList = ref<Option[]>([]);

const handleDataSourceTypeChange = (value: SelectValue, option: DefaultOptionType, index: number) => {
	if (value !== 13) {
		formModel.value.dataIndex.indexSetList[index] = {
			indexName: option.label,
			dataSourceType: value as number,
			showType: undefined,
			options: undefined,
		};
		dataIndexSourceList.value[index].showTypeList =
			dataIndexSourceListCopy.value.find((i) => i.type === value)?.showTypeList || [];
	} else {
		dataIndexSourceList.value[index].showTypeList = [1];
		formModel.value.dataIndex.indexSetList[index] = {
			indexName: option.label,
			dataSourceType: value,
			showType: undefined,
			options: [
				{ label: '', value: '' },
				{ label: '', value: '' },
			],
		};
	}
};

const handleCoverChange = (fileId: string) => {
	formModel.value.coverId = fileId;
};

const handleFileChange = (file: { id: string; url: string; originalFileName: string }) => {
	const { id, url, originalFileName } = file;
	formModel.value.cardDataList[1].fileDataList = [{ fileId: id, fileUrl: url, fileName: originalFileName }];
};

const handleAddImageChange = (fileIds: { fileId: string; fileUrl: string; fileName: string }[]) => {
	formModel.value.cardDataList[2].fileDataList = fileIds;
};

const handleRemoveImageChange = (fileId: string) => {
	if (formModel.value.cardDataList[2].fileDataList) {
		formModel.value.cardDataList[2].fileDataList = formModel.value.cardDataList[2].fileDataList?.filter(
			(item) => item.fileId !== fileId,
		);
	}
};

const handleRemoveFileChange = () => {
	if (formModel.value.cardDataList[1].fileDataList) {
		formModel.value.cardDataList[1].fileDataList = undefined;
	}
};

const handleSave = (disable: boolean) => {
	// 判断数据来源是否重复, 除了类型为13的自定义数据来源
	const sourceList = formModel.value.dataIndex.indexSetList
		.filter((item) => item.dataSourceType !== 13)
		.map((item) => item.dataSourceType);
	if (sourceList.length !== new Set(sourceList).size) {
		message.error('数据来源不能重复');
		return;
	}
	formRef.value!.validate().then(() => {
		formModel.value.disable = disable;
		postScreenCard(formModel.value).then(() => {
			message.success('保存成功');
			open.value = false;
			emits('success');
		});
	});
};

onMounted(() => {
	getTemplateCardList(formModel.value.screenTemplate as number).then((res) => {
		tabsList.value = res.data;
		formModel.value.cardDataList = res.data.map((item) => {
			return {
				cardType: item.cardType,
				cardName: undefined,
				content: undefined,
				fileShowType: undefined,
				fileDataList: undefined,
				intervalTime: undefined,
				speed: undefined,
			};
		});
		tabsList.value.splice(3, 0, { cardType: 9, name: '数据指标' });
	});
	getDataIndexSourceList().then((res) => {
		dataIndexSourceList.value = res.data;
		dataIndexSourceListCopy.value = res.data;
		dataSourceTypeList.value = res.data.map((item) => {
			return {
				value: item.type,
				label: item.name,
			};
		});
		dataSourceTypeList.value.unshift({
			value: 13,
			label: '自定义',
		});
		if (props.type === 'add') {
			formModel.value.dataIndex.indexSetList = res.data.map((item) => {
				return {
					indexName: item.name,
					dataSourceType: item.type,
					showType: undefined,
					options: undefined,
				};
			});
		}
	});
	if (props.type === 'edit' && props.screenId) {
		getScreenCardDetail(props.screenId).then((res) => {
			formModel.value = res.data;
			const { coverId, coverUrl } = res.data;
			if (coverId && coverUrl) {
				uploadRef.value!.fileList = [
					{
						uid: coverId,
						name: coverUrl,
						status: 'done',
						url: coverUrl,
					},
				];
			}
			watch(
				() => activeKey.value,
				(newVal) => {
					if (newVal === 3) {
						nextTick(() => {
							if (uploadRef1.value && res.data!.cardDataList![2]!.fileDataList!.length > 0) {
								uploadRef1.value[0].fileList = res.data!.cardDataList[2]!.fileDataList!.map((item) => ({
									uid: item.fileId,
									name: item.fileName,
									status: 'done',
									url: item.fileUrl,
								}));
							}
						});
					}
				},
			);
		});
	}
});
</script>

<template>
	<a-drawer :closable="false" v-model:open="open" destroy-on-close width="864" @close="open = false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">新增</div>
				<a-button type="link" @click="open = false">
					<template #icon>
						<close-svg />
					</template>
				</a-button>
			</div>
		</template>
		<a-form ref="formRef" :model="formModel" :rules="rules">
			<div class="drawer-title">基本信息</div>
			<div class="grid grid-cols-2 gap-4">
				<a-form-item label="主题名称" name="name">
					<a-input v-model:value="formModel.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item label="投屏模板" name="screenTemplate">
					<a-select
						v-model:value="formModel.screenTemplate"
						placeholder="请输入"
						:options="templateList"
						disabled
					></a-select>
				</a-form-item>
				<a-form-item label="封面图片" name="coverId">
					<m-upload
						ref="uploadRef"
						v-model:value="formModel.coverId"
						media-type="image"
						:max-count="1"
						@update:fileId="handleCoverChange"
					/>
				</a-form-item>
			</div>
			<div class="drawer-title">数据设置</div>
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane v-for="item in tabsList" :key="item.cardType" :tab="item.name">
					<!-- 数据指标 -->
					<div v-if="item.cardType === 9">
						<div class="grid grid-cols-2 gap-4">
							<a-form-item label="指标数量" name="dataIndex.indexCount">
								<a-radio-group v-model:value="formModel.dataIndex.indexCount" disabled>
									<a-radio :value="12">12</a-radio>
									<a-radio :value="10">10</a-radio>
									<a-radio :value="8">8</a-radio>
									<a-radio :value="6">6</a-radio>
								</a-radio-group>
							</a-form-item>
							<a-form-item></a-form-item>
							<a-form-item label="刷新频率" name="dataIndex.refresh">
								<a-select
									v-model:value="formModel.dataIndex.refresh"
									placeholder="请选择"
									:options="refreshTimeList"
								></a-select>
							</a-form-item>
							<a-form-item></a-form-item>
						</div>
						<a-form-item label="指标设置" name="dataIndex.indexSetList">
							<div class="flex items-center justify-between">
								<div class="text-[#b4d3ff]">可单独设置每个数据指标的名称、数据来源、呈现方式/图例</div>
								<div class="text-right">
									<a-button class="mr-4" type="primary">推荐设置</a-button>
									<a-button danger>重置</a-button>
								</div>
							</div>
						</a-form-item>
						<a-form-item>
							<table class="w-full table-fixed">
								<tbody>
									<tr class="table-title">
										<td>指标名称</td>
										<td>数据来源</td>
										<td>呈现方式/图例</td>
									</tr>
									<tr v-for="(item, index) in dataIndexSourceList" :key="item.name">
										<td>
											<a-input
												v-model:value="formModel.dataIndex.indexSetList[index].indexName"
												placeholder="请输入"
											></a-input>
										</td>
										<td>
											<a-select
												v-model:value="formModel.dataIndex.indexSetList[index].dataSourceType"
												placeholder="请选择"
												:options="dataSourceTypeList"
												@change="(value, option) => handleDataSourceTypeChange(value, option, index)"
											>
											</a-select>
											<div
												v-if="
													formModel.dataIndex.indexSetList[index].dataSourceType === 13 &&
													formModel.dataIndex.indexSetList[index].options
												"
											>
												<div v-if="formModel.dataIndex.indexSetList[index].options[0]" class="flex">
													<a-input
														v-model:value="formModel.dataIndex.indexSetList[index].options[0].label"
														placeholder="数据标签"
													></a-input>
													<a-input
														v-model:value="formModel.dataIndex.indexSetList[index].options[0].value"
														placeholder="数据值"
													></a-input>
												</div>
												<div v-if="formModel.dataIndex.indexSetList[index].options[1]" class="flex">
													<a-input
														v-model:value="formModel.dataIndex.indexSetList[index].options[1].label"
														placeholder="数据标签"
													></a-input>
													<a-input
														v-model:value="formModel.dataIndex.indexSetList[index].options[1].value"
														placeholder="数据值"
													></a-input>
												</div>
											</div>
										</td>
										<td>
											<a-select
												v-model:value="formModel.dataIndex.indexSetList[index].showType"
												placeholder="请选择"
												:options="screenShowTypeList.filter((i) => item.showTypeList.includes(i.value as number))"
											></a-select>
										</td>
									</tr>
								</tbody>
							</table>
						</a-form-item>
					</div>
					<!-- 院系介绍 -->
					<div v-else-if="item.cardType === 1">
						<div class="grid grid-cols-2 gap-4">
							<a-form-item label="卡片名称" name="cardDataList[0].cardName">
								<a-input v-model:value="formModel.cardDataList[0].cardName" placeholder="请输入" />
							</a-form-item>
							<a-form-item></a-form-item>
							<a-form-item label="内容编辑" name="cardDataList[0].content">
								<div class="ant-form-text text-[#b4d3ff]">富文本，支持图文编辑，不支持视频</div>
							</a-form-item>
							<a-form-item></a-form-item>
						</div>
						<a-form-item>
							<div style="border: 1px solid #b4d3ff; width: 100%">
								<Toolbar
									style="border-bottom: 1px solid #b4d3ff"
									:editor="editorRef"
									:defaultConfig="toolbarConfig"
									mode="default"
								/>
								<Editor
									style="height: 150px; overflow-y: hidden"
									v-model="formModel.cardDataList[0].content"
									:defaultConfig="editorConfig"
									mode="default"
									@onCreated="handleCreated"
									@customPaste="customPaste"
								/>
							</div>
						</a-form-item>
					</div>
					<!-- 成果展示 -->
					<div v-else-if="item.cardType === 2">
						<div class="grid grid-cols-2 gap-4">
							<a-form-item label="卡片名称" name="cardDataList[1].cardName">
								<a-input v-model:value="formModel.cardDataList[1].cardName" placeholder="请输入" />
							</a-form-item>
							<a-form-item></a-form-item>
							<a-form-item label="上传文件" name="cardDataList[1].fileDataList">
								<div v-if="formModel.cardDataList[1].fileDataList" class="flex justify-start items-center relative">
									<file-overview :file="formModel!.cardDataList![1].fileDataList![0]" />
									<delete-red-svg class="cursor-pointer absolute left-20 top-0" @click="handleRemoveFileChange" />
								</div>
								<m-upload v-else media-type="video" :max-count="1" @update:file="handleFileChange" />
							</a-form-item>
						</div>
					</div>
					<!-- 建设动态 -->
					<div v-else-if="item.cardType === 3">
						<div class="grid grid-cols-2 gap-4">
							<a-form-item label="卡片名称" name="cardDataList[2].cardName">
								<a-input v-model:value="formModel.cardDataList[2].cardName" placeholder="请输入" />
							</a-form-item>
							<a-form-item></a-form-item>
							<a-form-item label="展示类型" name="cardDataList[2].fileShowType">
								<a-select
									v-model:value="formModel.cardDataList[2].fileShowType"
									placeholder="请选择"
									:options="[{ label: '轮播图', value: 1 }]"
								></a-select>
							</a-form-item>
							<a-form-item></a-form-item>
						</div>
						<a-form-item label="上传图片" name="cardDataList[2].fileDataList">
							<m-upload
								ref="uploadRef1"
								:max-count="5"
								media-type="image"
								@update:fileId="handleAddImageChange"
								@delete:fileId="handleRemoveImageChange"
							/>
						</a-form-item>
					</div>
					<!-- 通知公告 -->
					<div v-else-if="item.cardType === 5">
						<a-form-item label="公告内容" name="cardDataList[3].content">
							<a-textarea
								v-model:value="formModel.cardDataList[3].content"
								show-count
								placeholder="请输入"
								:maxlength="20"
							/>
						</a-form-item>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-form>
		<template #footer>
			<div class="flex justify-end items-center">
				<a-button type="primary" @click="handleSave(false)">保存并启用</a-button>
				<a-button class="mx-4" type="primary" @click="handleSave(true)">保存</a-button>
				<a-button @click="open = false">取消</a-button>
			</div>
		</template>
	</a-drawer>
</template>

<style scoped>
table,
td {
	border-collapse: collapse;
	border: 1px solid #b4d3ff;
	line-height: 32px;
	padding: 4px 8px;
	text-wrap: wrap;
}

.table-title {
	background-color: #f9f9f9;
	text-align: center;
}
</style>
