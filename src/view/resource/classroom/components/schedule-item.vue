<script setup lang="ts">
import { Classroom } from '../config';
import useAppTheme from '@/hooks/useAppTheme.ts';
import { translationKey, translationValue } from '@/utils/dictionary';
import usePage from '@/hooks/usePage';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import scheduleEdit from './schedule-edit.vue';

const { appTheme } = useAppTheme();
const { state, onUpdate } = usePage();
defineProps<{
	cardItem: Classroom;
	mangerOption: Option[];
	hasSchedule: boolean;
	teachDate: string;
}>();
const emits = defineEmits(['update']);
const { dictionaryOption } = useDictionaryStore();

const cardBgColor = computed(() => {
	return appTheme.value === 'white' ? '#EBF3FF' : '#1F253E';
});
const cardActionBgColor = computed(() => {
	return appTheme.value === 'white' ? '#FFF' : '#1F253E';
});
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
						<a-tag v-if="hasSchedule" color="#68D1A5">已排课</a-tag>
						<a-tag v-else color="#899ECC">空闲中</a-tag>
						<a-tag v-if="cardItem.disable" color="#EC5156">已停用</a-tag>
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
				<a-button size="small" type="link" @click="onUpdate(cardItem.id)">查看实训基地</a-button>
			</div>
		</template>
	</a-card>
	<schedule-edit
		v-if="state.updateOpen"
		v-model:open="state.updateOpen"
		:classroom-id="state.currentId"
		:teach-date="teachDate"
	>
	</schedule-edit>
</template>

<style scoped>
:deep(.ant-card-actions) {
	background-color: v-bind(cardActionBgColor) !important;
}
</style>
