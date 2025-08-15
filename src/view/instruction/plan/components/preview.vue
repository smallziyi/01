<script setup lang="ts">
import { previewDelivery, getTeachScene } from '@/axios';
import { message } from 'ant-design-vue';
import previewSvg from '@/assets/image/instruction/perview.svg';

const props = defineProps<{
	teachPlanId: string;
}>();
const open = defineModel('open', { required: true, type: Boolean });
const emit = defineEmits(['update']);
const plainOptions = [1, 2, 3, 4, 5, 6];
const state = reactive({
	indeterminate: false,
	checkAll: false,
	checkedList: [] as number[],
});
const onCheckAllChange = (e: any) => {
	Object.assign(state, {
		checkedList: e.target.checked ? plainOptions : [],
		indeterminate: false,
	});
};
watch(
	() => state.checkedList,
	(val) => {
		state.indeterminate = !!val.length && val.length < plainOptions.length;
		state.checkAll = val.length === plainOptions.length;
	},
);
const handlePerview = () => {
	if (state.checkedList.length === 0) {
		message.warning('请至少选择一个预习表单');
		return;
	}
	const params = {
		teachPlanId: props.teachPlanId,
		beforePreviewDataList: state.checkedList,
	};
	previewDelivery(params).then(() => {
		message.success('下发成功');
		open.value = false;
		emit('update');
	});
};

onMounted(() => {
	getTeachScene(props.teachPlanId).then((res) => {
		state.checkedList = res.beforePreviewDataList;
	});
});
</script>

<template>
	<a-modal v-model:open="open" width="520px" @ok="handlePerview" @cancel="open = false">
		<template #title>
			<div class="flex">
				<preview-svg></preview-svg>
				<div class="ml-2 text-[#0091ff]">课前预习下发</div>
			</div>
		</template>
		<a-checkbox
			class="mt-4"
			v-model:checked="state.checkAll"
			:indeterminate="state.indeterminate"
			@change="onCheckAllChange"
		>
			全选
		</a-checkbox>
		<a-divider class="my-4" />
		<a-checkbox-group v-model:value="state.checkedList" style="width: 100%">
			<div class="my-4">
				<a-checkbox :value="1">资讯单</a-checkbox>
				<a-checkbox :value="2">计划单</a-checkbox>
				<a-checkbox :value="3">决策单</a-checkbox>
				<a-checkbox :value="4">实施单</a-checkbox>
				<a-checkbox :value="5">检查单</a-checkbox>
				<a-checkbox :value="6">评价单</a-checkbox>
			</div>
		</a-checkbox-group>
	</a-modal>
</template>

<style scoped></style>
