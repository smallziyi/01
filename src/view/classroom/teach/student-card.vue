<script lang="ts" setup>
import AddBlueSvg from '@/assets/icons/add-blue.svg';
import DeleteRedSvg from '@/assets/icons/delete-red.svg';
import maleSvg from '@/assets/image/instruction/male.svg';
import femaleSvg from '@/assets/image/instruction/female.svg';

const props = defineProps<{
	studentItem: any;
	type: 'add' | 'delete';
}>();

const emits = defineEmits(['add', 'delete', 'set']);

const leaderId = inject('leaderId') as Ref<string>;
const teachPlan = inject('teachPlan') as any;

const status = computed(() => {
	return teachPlan.value.status;
});

const handleAdd = () => {
	emits('add', props.studentItem);
};

const handleDelete = () => {
	if (props.studentItem.userId === leaderId.value) {
		emits('set', '');
	}
	emits('delete', props.studentItem);
};

const handleSetTeamLeader = () => {
	emits('set', props.studentItem.userId);
};

const handleCancelLeader = () => {
	emits('set', '');
};
</script>

<template>
	<a-dropdown :trigger="['contextmenu']">
		<a-card size="small" class="relative h-32" :class="studentItem.gender === 0 ? 'bg-[#ffe6be]' : 'bg-[#def1ff]'">
			<template class="flex items-center">
				<a-avatar :src="studentItem.avatarUrl" :size="53"></a-avatar>
				<div class="text-lg font-bold ml-8">{{ studentItem.name }}</div>
			</template>
			<div class="my-1 truncate">所在班级:&nbsp;&nbsp; 软件工程专业{{ studentItem.groupName }}班</div>
			<div class="truncate">学号/工号: &nbsp;&nbsp;{{ studentItem.number }}</div>
			<template v-if="status !== 3">
				<male-svg v-if="studentItem.gender === 1" class="absolute top-2 right-5"></male-svg>
				<female-svg v-else class="absolute top-2 right-5"></female-svg>
				<a-button class="absolute top-0 right-0" v-if="type === 'add'" type="link" @click="handleAdd">
					<template #icon><AddBlueSvg></AddBlueSvg></template>
				</a-button>
				<a-button class="absolute top-0 right-0" v-if="type === 'delete'" type="link" @click="handleDelete">
					<template #icon><DeleteRedSvg></DeleteRedSvg></template>
				</a-button>
			</template>
			<div
				v-if="leaderId === studentItem.userId"
				class="absolute left-0 top-0 w-10 h-6 bg-[#ec5156] text-white flex justify-center items-center rounded-tl-lg rounded-br-lg"
			>
				组长
			</div>
		</a-card>
		<template #overlay>
			<a-menu v-if="status !== 3">
				<a-menu-item v-if="leaderId === studentItem.userId" key="1" @click="handleCancelLeader"
					>取消设为组长</a-menu-item
				>
				<a-menu-item v-else key="2" @click="handleSetTeamLeader">设为组长</a-menu-item>
			</a-menu>
		</template>
	</a-dropdown>
</template>
