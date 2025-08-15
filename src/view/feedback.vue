<script setup lang="ts">
import {
	createFeedback,
	Feedback,
	getFeedbackList,
	uploadFiles,
	getFeedbackAction,
	FeedbackAction,
	createFeedbackAction,
	updateFeedbackAction,
	deleteFeedbackAction,
	getFeedbackTop10,
	getFeedbackComment,
	createFeedbackComment,
	deleteFeedbackComment,
	FeedbackComment,
} from '@/axios';
import useUserStore from '@/store/modules/useUserStore';
import { FormInstance, message } from 'ant-design-vue';
import { Icon } from '@iconify/vue';
import TimeAgo from 'javascript-time-ago';
import zh from 'javascript-time-ago/locale/zh';
import mHeader from '@/layout/m-header.vue';
import { theme } from 'ant-design-vue';

TimeAgo.addDefaultLocale(zh);
const timeAgo = new TimeAgo('zh-CN');

const query = ref<{ type: 1 | 2 | 3 | 4; keyword: string; onlyMe: boolean }>({
	type: 1,
	keyword: '',
	onlyMe: false,
});
const token = theme.useToken().token;
function handleQueryChange() {
	getFeedbackList(query.value).then((res) => {
		feedbacks.value = res.data;
	});
}

const feedbackAction = ref<FeedbackAction[]>([]);

const top10 = ref<Feedback[]>([]);
onMounted(() => {
	getFeedbackList(query.value).then((res) => {
		feedbacks.value.push(...res.data);
	});
	getFeedbackAction().then((res) => {
		feedbackAction.value = res.data;
	});
	getFeedbackTop10().then((res) => {
		top10.value = res.data;
	});
});

const feedbacks = ref<Feedback[]>([]);

function openCreateModel() {
	const temp = localStorage.getItem('feedback_temp');
	if (temp) {
		try {
			form.value = JSON.parse(temp);
		} catch (err) {
			form.value = { files: [] };
		}
	} else {
		form.value = { files: [] };
	}
	createModelVisible.value = true;
}

const createModelVisible = ref(false);

const form = ref<Partial<Feedback>>({ files: [] });

const { permissions } = useUserStore();

const functionOptions = computed(() => {
	const tree = buildPermissionTree(permissions.value);

	// 将树形数据转换为 a-select 需要的格式
	const formatTreeOptions = (nodes: any[]): any[] => {
		return nodes.map((node) => ({
			value: node.id,
			label: node.name,
			children: node.children?.length ? formatTreeOptions(node.children) : undefined,
		}));
	};

	return formatTreeOptions(tree);
});

function buildPermissionTree(permissions: { id: string; path: string; name: string; parentId: string }[]) {
	const tree: any[] = [];
	const map = new Map();

	// 首先创建所有节点的映射
	permissions.forEach((item) => {
		map.set(item.id, { ...item, children: [] });
	});

	// 构建树结构
	permissions.forEach((item) => {
		const node = map.get(item.id);
		if (item.parentId === '0') {
			// 顶级节点
			tree.push(node);
		} else {
			// 将节点添加到父节点的children中
			const parent = map.get(item.parentId);
			if (parent) {
				parent.children.push(node);
			}
		}
	});

	return tree;
}

const fileInput = useTemplateRef<HTMLInputElement>('fileInput');

function handleFileChange(e: Event) {
	// 批量上传文件
	const files = (e.target as HTMLInputElement).files;
	if (files) {
		let flag = true;
		// 图片最大5M，视频最大50M，音频最大5M
		Array.from(files).forEach((file) => {
			if (file.type.startsWith('image/')) {
				if (file.size > 5 * 1024 * 1024) {
					message.error(`${file.name}大小不能超过了允许上传的最大图片大小（5M）`);
					flag = false;
				}
			} else if (file.type.startsWith('video/')) {
				if (file.size > 50 * 1024 * 1024) {
					message.error(`${file.name}大小不能超过了允许上传的最大视频大小（50M）`);
					flag = false;
				}
			} else if (file.type.startsWith('audio/')) {
				if (file.size > 5 * 1024 * 1024) {
					message.error(`${file.name}大小不能超过了允许上传的最大音频大小（5M）`);
					flag = false;
				}
			} else {
				message.error(`${file.name}不支持的文件类型`);
				flag = false;
			}
		});
		if (!flag) return;
		uploadFiles(Array.from(files)).then((res) => {
			res.data.forEach((item) => {
				form.value.files?.push({
					id: item.id,
					name: item.originalFileName,
					contentType: item.contentType,
					url: item.url,
					seconds: 0,
				});
			});
			if (fileInput.value?.value) {
				fileInput.value.value = '';
			}
		});
	}
}

function handleSave() {
	localStorage.setItem('feedback_temp', JSON.stringify(form.value));
}

const formRef = useTemplateRef<FormInstance>('formRef');
function handlePublish() {
	formRef.value
		?.validate()
		.then(() => {
			createFeedback(form.value).then((res) => {
				message.success('发布成功');
				createModelVisible.value = false;
				if (query.value.type === res.data.type) {
					res.data.avatar = user.value?.avatarUrl ?? '';
					res.data.createUser = user.value?.name ?? '';
					feedbacks.value = [res.data, ...feedbacks.value];
				}
			});
		})
		.catch((err: FormError) => {
			message.warning(err.errorFields[0].errors[0]);
		});
}

const actionLoading = ref(false);
function handleClickAction(type: 'up' | 'down', feedbackId: string) {
	if (actionLoading.value) return;
	actionLoading.value = true;
	const action = feedbackAction.value.find((item) => item.feedbackId === feedbackId);
	let feedback = feedbacks.value.find((item) => item.id === feedbackId)!;
	if (action) {
		if (action.agree === (type === 'up')) {
			deleteFeedbackAction(action)
				.then(() => {
					feedbackAction.value = feedbackAction.value.filter((item) => item.id !== action.id);
					if (type === 'up') {
						feedbacks.value.find((item) => item.id === feedbackId)!.up = feedback.up - 1;
					} else {
						feedbacks.value.find((item) => item.id === feedbackId)!.down = feedback.down - 1;
					}
				})
				.finally(() => {
					actionLoading.value = false;
				});
		} else {
			updateFeedbackAction({ ...action, agree: type === 'up' })
				.then((res) => {
					action.agree = type === 'up';
					feedbacks.value.find((item) => item.id === feedbackId)!.up = res.data.up;
					feedbacks.value.find((item) => item.id === feedbackId)!.down = res.data.down;
					if (type === 'up') {
						const dom = document.getElementById(`feedback-${feedbackId}`);
						if (dom) {
							dom.classList.remove('hidden');
							dom.classList.add('like-animation');
						}
						setTimeout(() => {
							dom?.classList.remove('like-animation');
							dom?.classList.add('hidden');
						}, 400);
					}
				})
				.finally(() => {
					actionLoading.value = false;
				});
		}
	} else {
		createFeedbackAction({ feedbackId, agree: type === 'up' })
			.then((res) => {
				feedbackAction.value.push(res.data);
				if (type === 'up') {
					feedback.up++;
					const dom = document.getElementById(`feedback-${feedbackId}`);
					if (dom) {
						dom.classList.remove('hidden');
						dom.classList.add('like-animation');
					}
					setTimeout(() => {
						dom?.classList.remove('like-animation');
						dom?.classList.add('hidden');
					}, 400);
				} else {
					feedback.down++;
				}
			})
			.finally(() => {
				actionLoading.value = false;
			});
	}
}

function handleSelectComment(feedbackId: string) {
	getFeedbackComment(feedbackId).then((res) => {
		feedbacks.value.find((item) => item.id === feedbackId)!.comments = res.data;
	});
}

const { user } = useUserStore();
function handleCreateComment(feedback: Feedback) {
	if (!feedback.newComment.trim()) {
		message.warning('请输入评论');
		return;
	}
	createFeedbackComment({ feedbackId: feedback.id, content: feedback.newComment }).then((res) => {
		res.data.avatar = user.value?.avatarUrl ?? '';
		res.data.createUser = user.value?.name ?? '';
		feedback.comments.push(res.data);
		feedback.newComment = '';
		feedback.commentCount = feedback.commentCount + 1;
	});
}
function handleDeleteComment(comment: FeedbackComment, feedback: Feedback) {
	deleteFeedbackComment(comment).then(() => {
		feedback.comments = feedback.comments.filter((item) => item.id !== comment.id);
		feedback.commentCount = feedback.commentCount - 1;
	});
}
function getFunctionName(functions: string[]) {
	return permissions.value.filter((item) => functions.includes(item.id)).map((permission) => permission.name);
}
</script>

<template>
	<a-layout class="h-screen">
		<a-layout-header :style="{ backgroundColor: `${token.colorBgContainer}` }" class="p-4 flex justify-between h-14">
			<m-header />
		</a-layout-header>
		<div class="overflow-hidden" style="height: calc(100vh - 88px)">
			<div class="mx-auto mt-4 w-fit flex gap-6">
				<a-card class="w-[780px]" style="height: calc(100vh - 120px)">
					<div class="flex gap-8 leading-8 border-b-[2px] border-[#E4E7ED] bg-white z-10">
						<div
							class="cursor-pointer"
							@click="
								() => {
									query.type = 1;
									handleQueryChange();
								}
							"
							:class="query.type === 1 ? 'activeTab' : ''"
						>
							BUG
						</div>
						<div
							class="cursor-pointer"
							@click="
								() => {
									query.type = 2;
									handleQueryChange();
								}
							"
							:class="query.type === 2 ? 'activeTab' : ''"
						>
							建议
						</div>
						<div
							class="cursor-pointer"
							@click="
								() => {
									query.type = 3;
									handleQueryChange();
								}
							"
							:class="query.type === 3 ? 'activeTab' : ''"
						>
							需求
						</div>
						<div
							class="cursor-pointer"
							@click="
								() => {
									query.type = 4;
									handleQueryChange();
								}
							"
							:class="query.type === 4 ? 'activeTab' : ''"
						>
							其他
						</div>
					</div>
					<div class="flex justify-between h-8 leading-8 my-3">
						<div class="flex gap-2 rounded-[6px] overflow-hidden border border-[#E4E7ED]">
							<div
								class="text-center cursor-pointer w-[66px]"
								:class="query.onlyMe ? '' : 'bg-[#0034FF] text-white'"
								@click="
									() => {
										query.onlyMe = false;
										handleQueryChange();
									}
								"
							>
								全部
							</div>
							<div
								class="text-center cursor-pointer w-[66px]"
								:class="query.onlyMe ? 'bg-[#0034FF] text-white' : ''"
								@click="
									() => {
										query.onlyMe = true;
										handleQueryChange();
									}
								"
							>
								我的
							</div>
						</div>
						<div class="flex rounded-[6px] overflow-hidden border border-[#E4E7ED]">
							<div class="w-[230px] px-2">
								<input
									v-model="query.keyword"
									placeholder="请输入关键字"
									class="w-full h-full outline-none border-none"
								/>
							</div>
							<div class="w-[42px] bg-[#0034FF] flex items-center justify-center" @click="handleQueryChange">
								<Icon icon="ri:search-line" class="text-white text-base" />
							</div>
						</div>
					</div>
					<div class="overflow-y-auto" style="height: calc(100vh - 255px)">
						<div v-for="(feedback, index) in feedbacks" :key="feedback.id" class="relative">
							<div class="flex gap-2">
								<div>
									<img :src="feedback.avatar" class="size-10 rounded-full" />
								</div>
								<div class="flex-1">
									<div class="flex justify-between leading-6">
										<div class="text-[18px] flex gap-3">
											<div>{{ feedback.createUser }}</div>
											<div
												v-if="feedback.function.length"
												class="text-[#0034FF] leading-6 px-3 rounded-[6px] text-xs bg-[#B3C2FF] arr"
											>
												{{ getFunctionName(feedback.function).join(' / ') }}
											</div>
										</div>
										<div class="text-xs text-[#909399]">{{ $datetime.format(feedback.createTime) }}</div>
									</div>
									<div class="text-[#303133]">{{ feedback.title }}</div>
									<div class="leading-[22px] text-[#606266]">{{ feedback.content }}</div>
									<div v-if="feedback.files.length">
										<div class="flex gap-2 flex-wrap">
											<div
												v-for="file in feedback.files.filter(
													(item) => item.contentType.startsWith('image') || item.contentType.startsWith('video'),
												)"
												:key="file.id"
												class="rounded-[6px] overflow-hidden"
											>
												<a-image
													v-if="file.contentType.startsWith('image')"
													:src="file.url"
													class="rounded-[6px] overflow-hidden"
													:class="
														feedback.files.filter((item) => item.contentType.startsWith('image')).length > 1
															? 'size-[130px]'
															: 'w-[169px] h-[224px]'
													"
												/>
												<video
													v-else
													:src="file.url"
													class="rounded-[6px] overflow-hidden hover:controls"
													:class="
														feedback.files.filter((item) => item.contentType.startsWith('image')).length > 1
															? 'h-[130px]'
															: 'h-[224px]'
													"
													@mouseenter="
														(e: Event) => {
															(e.target as HTMLVideoElement).controls = true;
														}
													"
													@mouseleave="
														(e: Event) => {
															(e.target as HTMLVideoElement).controls = false;
														}
													"
												/>
											</div>
										</div>
										<div
											v-for="file in feedback.files.filter((item) => item.contentType.startsWith('audio'))"
											class="rounded-[6px] overflow-hidden"
										>
											<div
												class="bg-[#E5EBFF] leading-8 rounded-[6px] px-3 h-8 flex gap-2 items-center cursor-pointer"
												@click="
													(e: Event) => {
														const target = e.target as HTMLElement;
														const audio = target.closest('.bg-\\[\\#E5EBFF\\]')?.nextElementSibling as HTMLAudioElement;
														if (audio?.paused) {
															audio.play();
														} else {
															audio?.pause();
														}
													}
												"
											>
												<Icon icon="material-symbols:wifi" class="dakjd font-bold" />
												<span class="text-[#0034ff]">{{ file.seconds }}s</span>
											</div>
											<audio
												:src="file.url"
												class="hidden"
												@loadedmetadata="
													(e) => {
														const audio = e.target as HTMLAudioElement;
														file.seconds = Math.floor(audio.duration);
													}
												"
											/>
										</div>
									</div>
									<a-divider />
									<div v-show="feedback.showComment">
										<div class="flex">
											<div class="mr-2">
												<img :src="user?.avatarUrl" class="size-8 rounded-full" />
											</div>
											<div class="flex-1 mr-3">
												<a-input
													v-model:value="feedback.newComment"
													placeholder="请输入评"
													class="w-full focus-within:border-[#0034FF]"
													show-count
													:maxlength="200"
												/>
											</div>
											<div
												class="bg-[#0034FF] text-white rounded-[6px] px-2 leading-8 w-16 text-center cursor-pointer"
												@click="handleCreateComment(feedback)"
											>
												评论
											</div>
										</div>
										<div v-for="comment in feedback.comments" :key="comment.id" class="flex mt-4 items-center">
											<img :src="comment.avatar" class="size-4 rounded-full" />
											<div class="text-[14px] mr-2">{{ comment.createUser }}</div>
											<div class="text-[#606266] grow">评论：{{ comment.content }}</div>
											<div class="select-none">{{ timeAgo.format(new Date(comment.createTime)) }}</div>
											<div
												v-if="comment.createBy === user?.id"
												@click="handleDeleteComment(comment, feedback)"
												class="select-none ml-2"
											>
												<a-tooltip title="删除评论">
													<Icon icon="material-symbols:delete-outline" class="hover:text-red-500" />
												</a-tooltip>
											</div>
										</div>
									</div>
									<div class="flex justify-end gap-3 mt-2 select-none">
										<div
											@click="handleClickAction('down', feedback.id)"
											class="flex items-center gap-1 cursor-pointer"
											:class="
												feedbackAction.find((item) => item.feedbackId === feedback.id && !item.agree)
													? 'text-[#0034FF]'
													: ''
											"
										>
											<Icon icon="icon-park-solid:thumbs-down" />踩（{{ feedback.down ?? 0 }}）
										</div>
										<div
											@click="handleClickAction('up', feedback.id)"
											class="flex items-center gap-1 cursor-pointer"
											:class="
												feedbackAction.find((item) => item.feedbackId === feedback.id && item.agree)
													? 'text-[#0034FF]'
													: ''
											"
										>
											<Icon icon="icon-park-solid:thumbs-up" />点赞（{{ feedback.up ?? 0 }}）
										</div>
										<div
											class="flex items-center gap-1 cursor-pointer"
											@click="
												() => {
													feedback.showComment = !feedback.showComment;
													handleSelectComment(feedback.id);
												}
											"
										>
											<Icon icon="icon-park-outline:comment" />评论（{{ feedback.commentCount ?? 0 }}）
										</div>
									</div>
								</div>
							</div>
							<div
								class="absolute top-0 left-0 w-full h-full flex items-start justify-center pointer-events-none pt-20"
								v-show="feedback.showLikeAnimation"
								@animationend="feedback.showLikeAnimation = false"
							>
								<Icon
									icon="icon-park-solid:thumbs-up"
									class="text-orange-500 text-4xl hidden"
									:id="`feedback-${feedback.id}`"
								/>
							</div>
							<a-divider v-if="index !== feedbacks.length - 1" />
						</div>
					</div>
				</a-card>
				<div>
					<div class="w-[282px] sticky top-4">
						<div
							class="w-[282px] h-8 leading-8 text-white text-center bg-[#0034FF] rounded-[6px] cursor-pointer"
							@click="openCreateModel"
						>
							我想说
						</div>
						<a-card class="my-3" size="small">
							<div class="text-[#303133] text-xl mb-3">热门问题</div>
							<div class="overflow-y-auto" style="height: calc(100vh - 230px)">
								<div v-for="(feedback, index) in top10" :key="feedback.id">
									<span
										:class="
											index === 0 ? 'text-[#EB4B16]' : index === 1 ? 'text-[#F5A58A]' : index === 2 ? 'text-[#FDB438]' : ''
										"
										>{{ index + 1 }}</span
									>
									{{ feedback.title }}
									<a-divider v-if="index !== top10.length - 1" style="margin: 8px 0" />
								</div>
							</div>
						</a-card>
					</div>
				</div>
			</div>
		</div>
		<a-modal v-model:open="createModelVisible" class="w-[720px] h-[457px]" title="我想说" :footer="null">
			<a-form ref="formRef" :model="form" class="w-full" :label-col="{ style: { width: '80px' } }">
				<div class="grid grid-cols-2 gap-x-6">
					<a-form-item label="问题类型" name="type" :required="true">
						<a-select v-model:value="form.type" placeholder="请选择" class="w-full">
							<a-select-option value="1">BUG</a-select-option>
							<a-select-option value="2">建议</a-select-option>
							<a-select-option value="3">需求</a-select-option>
							<a-select-option value="4">其他</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="关联功能" name="function">
						<a-cascader
							change-on-select
							v-model:value="form.function"
							:options="functionOptions"
							placeholder="请选择"
							class="w-full"
						></a-cascader>
					</a-form-item>
					<a-form-item label="标题" name="title" :required="true" class="col-span-2">
						<a-input
							v-model:value="form.title"
							placeholder="填写标题会有更多赞哦～"
							class="w-full"
							show-count
							:maxlength="50"
						>
						</a-input>
					</a-form-item>
					<a-form-item label="描述" name="content" :required="true" class="col-span-2">
						<a-textarea v-model:value="form.content" placeholder="请输入" class="w-full" :auto-size="{ minRows: 3 }">
						</a-textarea>
					</a-form-item>
					<a-form-item class="col-span-2" label="附件" extra="上传图片（最大5M）、音频（最大5M）、视频（最大50M）">
						<div class="flex flex-wrap gap-2">
							<template v-for="file in form.files">
								<template v-if="file.contentType.startsWith('image')">
									<img :src="file.url" class="size-[64px]" />
								</template>
								<template v-else-if="file.contentType.startsWith('video')">
									<video :src="file.url" class="size-[64px]" controls></video>
								</template>
								<template v-else-if="file.contentType.startsWith('audio')">
									<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
										<path
											id="Vector"
											d="M12.6665 58.6668C11.5619 58.6668 10.6665 57.7714 10.6665 56.6668V7.33349C10.6665 6.22892 11.5619 5.3335 12.6665 5.3335H40.4133C40.9972 5.3335 41.5519 5.58862 41.9318 6.03191L52.8517 18.7718C53.1624 19.1342 53.3332 19.5959 53.3332 20.0733V56.6668C53.3332 57.7714 52.4377 58.6668 51.3332 58.6668H12.6665Z"
											fill="#7E98FF"
										/>
										<path
											id="Vector_2"
											d="M42.6665 18.6665L37.4491 21.2481C35.7449 22.0913 34.6665 23.8281 34.6665 25.7295V41.9998"
											stroke="white"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											id="Vector_3"
											d="M27.3333 49.3332C31.3834 49.3332 34.6667 46.0499 34.6667 41.9998C34.6667 37.9497 31.3834 34.6665 27.3333 34.6665C23.2832 34.6665 20 37.9497 20 41.9998C20 46.0499 23.2832 49.3332 27.3333 49.3332Z"
											fill="white"
											stroke="white"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</template>
							</template>
							<div
								class="size-[64px] border border-dashed rounded-[6px] flex items-center justify-center text-[#C0C4CC]"
								@click="fileInput?.click()"
							>
								<Icon icon="bi:plus-lg" class="text-2xl" />
							</div>
						</div>
					</a-form-item>
	
					<input
						type="file"
						class="hidden"
						ref="fileInput"
						accept="image/*,video/*,audio/*"
						@change="handleFileChange"
						multiple
					/>
				</div>
			</a-form>
			<a-space class="flex justify-end">
				<a-button type="text" @click="handleSave">保存</a-button>
				<a-button class="bg-[#0034FF] text-white" @click="handlePublish">发布</a-button>
			</a-space>
		</a-modal>
	</a-layout>
</template>

<style scoped>
.activeTab {
	color: #0034ff;
	position: relative;
}
.activeTab::after {
	content: '';
	position: absolute;
	bottom: -2px;
	left: 0;
	display: block;
	width: 100%;
	height: 2px;
	background-color: #0034ff;
}
.arr {
	position: relative;
}
.arr::before {
	content: '';
	position: absolute;
	top: 50%;
	left: -4px;
	border-radius: 3px;
	width: 12px;
	height: 12px;
	background-color: #b3c2ff;
	transform: rotate(45deg);
	translate: 0 -50%;
}
.dakjd {
	color: #0034ff;
	transform: rotate(90deg);
}
.header {
	/* background: linear-gradient(90deg, #6685ff 0%, #335dff 100%); */
	box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.06);
	color: #fff;
	padding: 0 24px;
}
.like-animation {
	animation: like-bounce 0.4s;
}

@keyframes like-bounce {
	0% {
		opacity: 0;
		transform: scale(0.3) rotate(15deg);
	}
	20% {
		opacity: 0.6;
		transform: scale(0.8) rotate(10deg);
	}
	40% {
		opacity: 1;
		transform: scale(1.3) rotate(5deg);
	}
	60% {
		opacity: 1;
		transform: scale(1.5) rotate(0deg);
	}
	80% {
		opacity: 0.5;
		transform: scale(1.2) rotate(0deg);
	}
	100% {
		opacity: 0;
		transform: scale(1) rotate(0deg);
	}
}
</style>
