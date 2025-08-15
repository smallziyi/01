<script lang="ts" setup>
import maleSvg from '@/assets/image/instruction/male.svg';
import femaleSvg from '@/assets/image/instruction/female.svg';
import useUserStore from '@/store/modules/useUserStore';
const { user } = useUserStore();

const props = defineProps<{
	studentItem: any;
	leaderId: string;
}>();

const styleList = computed(() => {
	const isCurrentUser = user.value!.id === props.studentItem.userId;
	const isMale = props.studentItem.gender === 1;
	return {
		'border-2': isCurrentUser,
		'border-[#ff6c00]': isCurrentUser,
		'bg-[#def1ff]': isMale && !isCurrentUser,
		'bg-[#ffe6be]': !isMale && !isCurrentUser,
		'bg-[#fff7ea]': !isMale && isCurrentUser,
		'bg-[rgba(222,241,255,0.45)]': isMale && isCurrentUser,
	};
});
</script>

<template>
	<a-card size="small" class="relative h-32" :class="styleList">
		<template class="flex items-center">
			<a-avatar :src="studentItem.avatarUrl" :size="53"></a-avatar>
			<div class="text-lg font-bold ml-8">{{ studentItem.name }}</div>
		</template>
		<div
			v-if="leaderId === studentItem.userId"
			class="absolute left-0 top-0 w-10 h-6 bg-[#ec5156] text-white flex justify-center items-center rounded-tl-md rounded-br-md"
		>
			组长
		</div>
		<div class="my-1 truncate">所在班级:&nbsp;&nbsp; 软件工程专业{{ studentItem.groupName }}班</div>
		<div class="truncate">学号/工号: &nbsp;&nbsp;{{ studentItem.number }}</div>
		<male-svg v-if="studentItem.gender === 1" class="absolute top-2 right-5"></male-svg>
		<female-svg v-else class="absolute top-2 right-5"></female-svg>
	</a-card>
</template>
