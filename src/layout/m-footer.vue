<template>
	<div class="flex flex-col justify-center items-center w-full min-h-[180px] footer-bg-color">
		<div class="flex justify-center items-center w-full text-lg text-white">
			<div class="flex-1 flex justify-end items-center">
				<img alt="logo图片" class="mr-3.5" src="/src/assets/image/login/zdzy.png" />
				学术支持：北京全道智源教育科技院
			</div>
			<a-divider class="mx-10" style="border-color: #74c3ff" type="vertical" />
			<div class="flex-1 flex justify-start items-center">
				<template v-if="$config.clientPage === '1'">
					<zgeq-svg class="mr-3.5" />
					准格尔旗职业高级中学
				</template>
				<template v-else-if="$config.clientPage === '2'">
					<jilin-svg class="mr-3.5" />
					吉林铁道职业技术学院
				</template>
				<template v-else-if="$config.clientPage === '3'">
					<zhongshan-svg class="mr-3.5" />
					中山市第一职业技术学校
				</template>
				<template v-else-if="$config.clientPage === '4'">
					<eerduosi-svg class="mr-3.5" />
					鄂尔多斯理工学校
				</template>
				<template v-else>
					<img alt="logo图片" class="mr-3.5" src="/src/assets/image/login/zdzy.png" />
					技术支持：北京正道智源教育科技有限公司
				</template>
			</div>
		</div>
		<div class="flex text-sm mt-8 text-white">
			<a-space size="large">
				<div class="flex items-center">
					<img class="mr-2" src="/src/assets/image/footer/phone.png" />
					电话：010-52076988
				</div>
				<div class="flex items-center">
					<img class="mr-2" src="/src/assets/image/footer/web-link.png" />
					网址：http://www.unicloudedu.com/
				</div>
				<div class="flex items-center">
					<img class="mr-2" src="/src/assets/image/footer/email.png" />
					邮箱：icloudcum@vip.126.com
				</div>
				<div class="flex items-center">
					<img class="mr-2" src="/src/assets/image/footer/address.png" />
					地址：北京市丰台区南三环西路16号搜宝商务中心2号楼11层1105号
				</div>
			</a-space>
		</div>
	</div>
</template>
<script setup lang="ts">
import jilinSvg from '@/assets/image/login/jilin.svg';
import zhongshanSvg from '@/assets/image/login/zhongshan.svg';
import eerduosiSvg from '@/assets/image/login/eerduosi.svg';
import zgeqSvg from '@/assets/image/login/zge.svg';
const props = defineProps<{
	isTransparent: boolean;
}>();
const footerColor = props.isTransparent ? '#0062FD8C' : '#0062FD';
</script>
<style scoped>
.footer-bg-color {
	background-color: v-bind(footerColor);
}
</style>
