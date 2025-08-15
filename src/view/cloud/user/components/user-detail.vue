<template>
	<a-drawer v-model:open="open" width="864" :closable="false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">查看</div>
				<div>
					<a-button type="link" @click="open = false">
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
				<a-form-item label="所属角色" name="roles">
					<span>{{ currentDetailInfo.roleNameArray }}</span>
				</a-form-item>
				<a-form-item label="工号/学号" name="number">
					<span>{{ currentDetailInfo.number }}</span>
				</a-form-item>
				<a-form-item label="姓名" name="name">
					<span>{{ currentDetailInfo.name }}</span>
				</a-form-item>
				<a-form-item label="性别" name="gender">
					<a-radio-group v-model:value="currentDetailInfo.gender" name="genderGroup" disabled>
						<a-radio :value="1">男</a-radio>
						<a-radio :value="0">女</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="手机号" name="phone">
					<span>{{ currentDetailInfo.phone }}</span>
				</a-form-item>
				<a-form-item label="出生日期" name="birthday">
					<span>{{ currentDetailInfo.birthday ? $datetime.format(currentDetailInfo.birthday, 'date') : '' }}</span>
				</a-form-item>
				<a-form-item label="地址" name="address">
					<span>{{ currentDetailInfo.address }}</span>
				</a-form-item>
				<a-form-item label="身份证号" name="idCard">
					<span>{{ currentDetailInfo.idCard }}</span>
				</a-form-item>
				<a-form-item label="邮箱地址" name="email">
					<span>{{ currentDetailInfo.email }}</span>
				</a-form-item>
			</div>
		</a-form>
	</a-drawer>
</template>

<script setup lang="ts">
import useAppTheme from '@/hooks/useAppTheme.ts';
import CloseSvg from '@/assets/icons/close.svg';

const { token } = useAppTheme();

const open = defineModel({ type: Boolean });
defineProps<{
	currentDetailInfo: User;
}>();
</script>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
