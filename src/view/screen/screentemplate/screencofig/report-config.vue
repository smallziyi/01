<script setup lang="ts">
import useAppTheme from '@/hooks/useAppTheme.ts';
import { MinusCircleOutlined, MinusCircleTwoTone} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import  { updateScreenCard, deleteScreenCard, Screen } from '@/axios';
import screenEdit from './screen-add-edit.vue';
const { appTheme } = useAppTheme();

defineProps<{
	item: Screen;
}>();
// 跳到大屏
const router = useRouter();
const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
const cardActionBgColor = computed(() => {
	return appTheme.value === 'white' ? '#FFF' : '#1F253E';
});
const emit = defineEmits(['update']);
const pageState = reactive<{
	isDeleteHovering: boolean;
	screenId: string;
	visible: boolean;
	name: string,
}>({
	isDeleteHovering: false,
	screenId: '',
	visible: false,
	name: '',
});

const handleEdit = (id: string) => {
	pageState.screenId = id;
	pageState.visible = true;
	pageState.name = '编辑';
};

const handleShowBaseInfo = (id: string) => {
	router.push({
		path: '/school/analyse/screen/display',
		query: { id: id },
	});
};

const handleUpdateDisable = (id: string) => {
	updateScreenCard(id).then(() => {
		message.success('操作成功！');
		emit('update');
	})
}

// 删除
const handleDelete = (id: string) => {
	Modal.confirm({
		title: '删除确认',
		content: '确定要删除吗？',
		onOk: () => {
			deleteScreenCard(id).then(() => {
				message.success('删除成功！');
				emit('update');
			})
		}
	})
};

</script>

<template>
	<a-card :bordered="false" :style="{ 'background-color': `${cardBgColor}` }" class="min-w-[378px]"size="small">
		<div class="flex h-[146px] gap-5">
			<a-image v-if="item.coverUrl" :width="109.5" :height="146" class="rounded-lg" :src="item.coverUrl" />
			<a-image v-else :width="109.5" :height="146" class="rounded-lg" src="/images/report/default3.png" />
			<div class="flex-1 h-full overflow-hidden">
				<div class="mb-2 flex items-center justify-between">
					<a-tag :color="item.disable ? 'red' : 'green'">{{ item.disable ? '已停用' : '已启用' }}</a-tag>
					<div v-if="item.disable" @mouseleave="pageState.isDeleteHovering = false" @mousemove="pageState.isDeleteHovering = true">
						<a-tooltip v-if="pageState.isDeleteHovering" color="red" title="删除">
							<MinusCircleTwoTone @click="handleDelete(item.id)" />
						</a-tooltip>
						<MinusCircleOutlined v-else />
					</div>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-20">主题名称:</div>
					<span class="card-description">{{ item.name }}</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-20">投屏模板:</div>
					<span class="card-description">{{ item.screenTemplate === 1 ? '4k' : '2k' }}</span>
				</div>
				<div class="leading-6 truncate">
					<div class="inline-block w-20">创建日期:</div>
					<span class="card-description">{{ $datetime.format(item.createTime, 'date') }}</span>
				</div>
			</div>
		</div>
		<template #actions>
			<div class="flex justify-end mr-4">
				<a-button v-if="!item.disable" type="link" size="small" @click="handleShowBaseInfo(item.id)">查看</a-button>
				<a-button type="link" size="small" @click="handleUpdateDisable(item.id)">{{ item.disable? '启用': '停用' }}</a-button>
				<a-button type="link" size="small" @click="handleEdit(item.id)">编辑</a-button>
			</div>
		</template>
	</a-card>
	<screen-edit
		v-if="pageState.visible"
		v-model:open="pageState.visible"
		type="edit"
		:screen-id="pageState.screenId"
	/>
</template>

<style scoped>
:deep(.ant-card-actions) {
	background-color: v-bind(cardActionBgColor) !important;
}
</style>
