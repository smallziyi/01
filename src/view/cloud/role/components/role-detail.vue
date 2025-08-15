<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看</div>
				<div>
					<a-button type="link" @click="onCancel">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">基本信息</div>
		<a-form ref="formRef" class="mt-5" :model="currentDetailInfo" :label-col="{ span: 6 }">
			<div class="grid grid-cols-2 gap-4">
				<a-form-item name="name" label="角色名称">
					<span>{{ currentDetailInfo.name }}</span>
				</a-form-item>
				<a-form-item name="disable" label="是否启用">
					<span>{{ currentDetailInfo.disable ? '停用' : '启用' }}</span>
				</a-form-item>
				<a-form-item name="description" label="角色描述">
					<span>{{ currentDetailInfo.description }}</span>
				</a-form-item>
			</div>
		</a-form>
		<a-divider />
		<div :style="{ color: `${token.colorText}` }" class="drawer-title">功能选择</div>
		<a-form ref="formRef" class="my-5" :model="currentDetailInfo" :label-col="{ span: 6 }">
			<div class="grid grid-cols-2 gap-4">
				<a-form-item name="permissionArray" label="功能授权">
					<span>{{ currentDetailInfo.permissionArray.join('、') }}</span>
				</a-form-item>
			</div>
		</a-form>
	</a-drawer>
</template>

<script setup lang="ts">
import { Role } from '@/view/cloud/role/config.ts';
import useAppTheme from '@/hooks/useAppTheme.ts';
import CloseSvg from '@/assets/icons/close.svg';

const { token } = useAppTheme();

const open = defineModel({ type: Boolean });
defineProps<{
	currentDetailInfo: Role;
}>();

const onCancel = () => {
	open.value = false;
};
</script>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
