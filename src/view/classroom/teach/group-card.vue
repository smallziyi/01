<script lang="ts" setup>
import studentCard from './student-card.vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { QuestionCircleTwoTone } from '@ant-design/icons-vue';

const [list] = useAutoAnimate();

const emits = defineEmits(['add', 'delete', 'set']);
const props = defineProps<{
	titleName: string;
	studentList: {
		name: string;
		number: string;
		avatarUrl: string;
		groupName: string;
		class: string;
		userId: string;
	}[];
	type: 'add' | 'delete';
}>();

const searchInfo = ref('');

const onSearch = () => {
	return;
};

const searchData = computed(() => {
	return props.studentList?.filter(
		(item) => item.name.includes(searchInfo.value) || item.number.includes(searchInfo.value),
	);
});

const handleSet = (leaderId: string) => {
	emits('set', leaderId);
};

const handleAdd = (student: any) => {
	emits('add', student);
	props.studentList.push(student);
};

const handleDelete = (student: any) => {
	emits('delete', student);
	const findIndex = props.studentList.findIndex((item) => item.userId === student.userId);
	props.studentList.splice(findIndex, 1);
};
</script>

<template>
	<a-card size="small">
		<template #title>
			{{ props.titleName }}
			<a-tooltip v-if="props.titleName === '已分配小组成员'" placement="right" :arrow="true" color="#0091ff">
				<template #title>
					<span>（取消）设为组长，需要右键操作</span>
				</template>
				<question-circle-two-tone class="ml-2"></question-circle-two-tone>
			</a-tooltip>
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
		<div ref="list" class="grid grid-cols-3 gap-4 overflow-y-auto" style="max-height: calc((100vh - 410px) / 2)">
			<student-card
				v-for="item in searchData"
				:key="item.userId"
				:student-item="item"
				:type="type"
				@add="handleAdd"
				@delete="handleDelete"
				@set="handleSet"
			>
			</student-card>
		</div>
	</a-card>
</template>
