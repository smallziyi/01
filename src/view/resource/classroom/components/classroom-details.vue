<script setup lang="ts">
import { getClassroomDetails } from '@/axios';
import { translationValue, translationKey } from '@/utils/dictionary';
import { Classroom, constructStatusOption, natureOption, sourceOption, typeOption } from '../config';
import closeSvg from '@/assets/icons/close.svg';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';

const { dictionaryOption } = useDictionaryStore();

const props = defineProps<{
	classroomId: string;
}>();
const open = defineModel('open', { required: true, type: Boolean });
const classroomData = ref<Classroom>();

onMounted(() => {
	getClassroomDetails(props.classroomId).then((res) => {
		classroomData.value = res;
	});
});
</script>

<template>
	<a-drawer :closable="false" v-model:open="open" destroy-on-close width="864" @close="open = false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看</div>
				<a-button type="link" @click="open = false">
					<template #icon>
						<close-svg />
					</template>
				</a-button>
			</div>
		</template>
		<div class="drawer-title">基础信息</div>
		<a-descriptions :column="2" v-if="classroomData" :label-style="{ width: '130px !important' }">
			<a-descriptions-item label="实训基地名称">{{ classroomData.name }}</a-descriptions-item>
			<a-descriptions-item label="实训基地归属">{{
				translationValue(classroomData.source, sourceOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地性质">{{
				translationValue(classroomData.nature, natureOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地类型">{{
				translationValue(classroomData.type, typeOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地类别">{{
				translationKey(classroomData.typeDictionaryId, dictionaryOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地容量">{{ classroomData.capacity }}人</a-descriptions-item>
			<a-descriptions-item label="实训基地状态">{{ classroomData.disable ? '停用' : '启用' }}</a-descriptions-item>
			<a-descriptions-item label="实训基地建设状态">{{
				translationValue(classroomData.constructStatus, constructStatusOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="负责人" :span="2">{{ classroomData.mangerName }}</a-descriptions-item>
			<a-descriptions-item label="实训基地位置" :span="2">{{ classroomData.location }}</a-descriptions-item>
			<a-descriptions-item label="实训基地描述" :span="2">{{ classroomData.description }}</a-descriptions-item>
			<a-descriptions-item label="实训基地封面">
				<img
					v-if="classroomData.coverUrl"
					:src="classroomData?.coverUrl"
					style="width: 109.5px; height: 147px; border-radius: 8px"
					alt=""
				/>
				<img
					v-else
					src="/images/report/default3.png"
					style="width: 109.5px; height: 147px; border-radius: 8px"
					alt=""
				/>
			</a-descriptions-item>
		</a-descriptions>
	</a-drawer>
</template>
