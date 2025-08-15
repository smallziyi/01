<script setup lang="ts">
import { updateDisableClassroom, deleteClassroom } from '@/axios';
import { message, Modal } from 'ant-design-vue';
import { MinusCircleOutlined, MinusCircleTwoTone } from '@ant-design/icons-vue';
import { Classroom, ENABLED_STATE } from '../config';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { translationKey, translationValue } from '@/utils/dictionary';
import usePage from '@/hooks/usePage';
import classroomEdit from './classroom-edit.vue';
import classroomDetails from './classroom-details.vue';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';

const { dictionaryOption } = useDictionaryStore();

const { appTheme } = useAppTheme();
const { state, onUpdate, onRead } = usePage();
const props = defineProps<{
	cardItem: Classroom;
	mangerOption: Option[];
}>();
const emits = defineEmits(['update']);

const isDeleteHovering = ref<boolean>();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
const cardActionBgColor = computed(() => {
	return appTheme.value === 'white' ? '#FFF' : '#1F253E';
});
const handleUpdateDisable = () => {
	const { id: reportId, disable } = props.cardItem;
	if (disable) {
		updateDisableClassroom(reportId).then(() => {
			message.success('启用成功!');
			emits('update');
		});
	} else {
		Modal.confirm({
			title: '停用',
			content: `该操作将对已选记录进行停用，停用后相关记录将不可选，确定操作吗？`,
			okText: '停用',
			cancelText: '取消',
			onOk() {
				updateDisableClassroom(reportId).then(() => {
					message.success(`停用成功！`);
					emits('update');
				});
			},
			onCancel() {
				return;
			},
		});
	}
};

const onDelete = (reportId: string) => {
	Modal.confirm({
		title: '删除',
		content: `该操作将对选中实训基地进行删除，且不可恢复，确定操作吗？`,
		onOk() {
			deleteClassroom(reportId).then(() => {
				message.success('删除成功！');
				emits('update');
			});
		},
		onCancel() {
			return;
		},
	});
};
</script>

<template>
	<a-card
		:bordered="false"
		:style="{ 'background-color': `${cardBgColor}` }"
		class="min-w-[378px]"
		hoverable
		size="small"
	>
		<div class="flex h-[146px] gap-5">
			<a-image v-if="cardItem.coverUrl" :width="109.5" :height="146" class="rounded-lg" :src="cardItem.coverUrl" />
			<a-image v-else :width="109.5" :height="146" class="rounded-lg" src="/images/report/default3.png" />
			<div class="grow h-full overflow-hidden">
				<div class="flex justify-between">
					<div>
						<a-tag v-if="cardItem.constructStatus === ENABLED_STATE.PLAN" color="#AF6DF3">筹备中</a-tag>
						<a-tag v-else-if="cardItem.constructStatus === ENABLED_STATE.BUILDING" color="#F0AE43">建设中</a-tag>
						<a-tag v-else-if="cardItem.constructStatus === ENABLED_STATE.BUILDED" color="#0091FF">已建成</a-tag>
						<a-tag v-if="!cardItem.disable" color="#68D1A5">已启用</a-tag>
						<a-tag v-else color="#EC5156">已停用</a-tag>
					</div>
					<div>
						<template v-if="cardItem.constructStatus === ENABLED_STATE.PLAN || cardItem.disable">
							<div @mouseleave="isDeleteHovering = false" @mousemove="isDeleteHovering = true">
								<a-tooltip v-if="isDeleteHovering" color="red" title="删除">
									<MinusCircleTwoTone @click="onDelete(cardItem.id)" />
								</a-tooltip>
								<MinusCircleOutlined v-else />
							</div>
						</template>
					</div>
				</div>
				<div class="leading-8 font-bold text-base truncate">
					{{ cardItem.name }}
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-14">归属:</div>
					<span class="card-description">{{ cardItem.source === 1 ? '校内' : '校外' }}实训基地</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-14">类别:</div>
					<span class="card-description">{{ translationKey(cardItem.typeDictionaryId, dictionaryOption) }}</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-14">负责人:</div>
					<span class="card-description">{{ translationValue(cardItem.mangerId, mangerOption) }}</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-14">地点:</div>
					<span class="card-description">{{ cardItem.location }}</span>
				</div>
			</div>
		</div>

		<template #actions>
			<div class="flex justify-end mr-4">
				<a-button v-if="cardItem.disable" size="small" type="link" @click="onUpdate(cardItem.id)">编辑内容</a-button>
				<a-button v-else size="small" type="link" @click="onRead(cardItem.id)">查看内容</a-button>
				<a-button size="small" type="link" @click="handleUpdateDisable" :disabled="cardItem.constructStatus === 1">
					{{ cardItem.disable ? '启用' : '停用' }}
				</a-button>
			</div>
		</template>
	</a-card>
	<classroom-edit
		v-if="state.updateOpen && state.currentId"
		v-model:open="state.updateOpen"
		:classroom-id="state.currentId"
		:manger-option="mangerOption"
		@refresh="emits('update')"
	/>
	<classroom-details
		v-if="state.readOpen && state.currentId"
		v-model:open="state.readOpen"
		:classroom-id="state.currentId"
	/>
</template>

<style scoped>
:deep(.ant-card-actions) {
	background-color: v-bind(cardActionBgColor) !important;
}
</style>
