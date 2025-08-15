<script lang="ts" setup>
import MHeader from '@/layout/m-header.vue';
import MFooter from '@/layout/m-footer.vue';
import { theme } from 'ant-design-vue';

const token = theme.useToken().token;
</script>

<template>
	<a-layout class="h-screen">
		<a-layout-header :style="{ backgroundColor: `${token.colorBgContainer}` }" class="p-4 flex justify-between h-14">
			<m-header />
		</a-layout-header>
		<a-layout-content class="h-[calc(100vh-56px)] overflow-y-auto">
			<div class="h-72 bg-[url('@/assets/image/about/bg.png')] pt-8">
				<div class="flex justify-center">
					<div>
						<img alt="" src="/logo.png" />
					</div>
					<div class="text-white leading-8 text-lg">北京正道智源教育科技有限公司</div>
				</div>
				<div class="text-center leading-10 text-3xl font-bold mt-10 text-white">恢闳宇内正道 荟聚天下智源</div>
				<div class="text-center leading-10 text-xl mt-4 text-white/70">
					IMPART THE TRUTH TO THE UNIVERSE, ACQUIRE THE WISDOM FROM THE WORLD
				</div>
			</div>
			<div
				class="mx-28 -mt-16 rounded-xl backdrop-blur-sm border border-emerald-100 pt-16 pb-8 flex justify-center gap-4 px-4 shadow-md"
			>
				<div class="leading-8">
					<span class="box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
					早在1996年，教育部职业技术教育中心研究所研究员、我国当代教育名家姜大源先生就提出了工作过程系统化课程开发范式的思想萌芽；之后，姜大源先生带领其核心团队成员持续借鉴和吸收多种课程开发模式的优秀经验，并在兼顾中国文化精髓和国情的基础上，使得工作过程系统化课程开发范式日臻完善；到目前为止，经过二十余年的躬行实践和推广，业已在国内数千家中等职业学校、高等职业院校、应用型本科院校或普通本科院校获得应用；
				</div>
				<div>
					<a-divider class="h-full" type="vertical" />
				</div>
				<div class="leading-8">
					<span class="box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
					2019年，姜大源先生研究团队的核心成员闫智勇、吴全全等，结合现代信息技术，开发出基于云计算技术的“工作过程系统化教育业务规范管理系统”（中文版），并即将推出多国语言版，使得工作过程系统化课程开发范式的应用领域更加广泛、操作更加便捷，可以为我国职业教育的先进理念和先进经验走出国门提供支撑。为此，遂先后建立研究院和专业运营公司，旨在广泛构造和推广面向云计算、大数据和下一代互联网技术的教育业务网络生态系统。
				</div>
			</div>
			<div class="text-center flex justify-center mt-10">
				<div class="py-1.5"><span class="box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
				<span class="text-2xl">联系我们</span>
			</div>
			<div class="text-center mx-52 mt-6 leading-8">
				“职业教育与普通教育是两种不同教育类型，具有同等重要地位。”……为不断推进职业教育向专业特色鲜明的类型教育转变，为大幅提升新时代职业教育的现代化水平，为促进职业教育面向国家复兴、民族振兴、人民幸福、经济繁荣和社会安定提供更多优质人才，我们随时恭候您大驾光临，共商合作大计~
			</div>
			<div class="flex justify-center gap-4 mt-10">
				<div class="w-[480px] rounded-xl overflow-hidden">
					<img alt="" class="w-[480px]" src="/images/other/location.png" />
				</div>
				<div class="flex flex-col justify-between w-[480px]">
					<div class="border p-2 rounded-xl">
						<div class="text-xl text-[#999]">公司地址</div>
						<div>北京市丰台区南三环西路16号搜宝商务中心2号楼11层1105号</div>
					</div>
					<div class="border p-2 rounded-xl">
						<div class="text-xl text-[#999]">联系方式</div>
						<div>Tel: 010-52076988，400-1046668</div>
					</div>
					<div class="border p-2 rounded-xl">
						<div class="text-xl text-[#999]">联系邮箱：</div>
						<div>icloudcum@126.com</div>
					</div>
				</div>
			</div>
			<div class="h-[230px] mt-10 bg-[#29619B] flex justify-center items-center gap-10 py-10">
				<div>
					<div class="flex justify-center">
						<img alt="" src="../assets/image/about/qq.png" />
					</div>
					<div class="text-white text-center">工作过程系统化课程 QQ</div>
					<div class="text-white text-center">群:1139558793</div>
				</div>
				<div>
					<div class="flex justify-center">
						<img alt="" src="../assets/image/about/weixin.png" />
					</div>
					<div class="text-white text-center">工作过程系统化课程 专用微信：</div>
					<div class="text-white text-center">unicloudcum</div>
				</div>
				<div>
					<div class="flex justify-center">
						<img alt="" src="../assets/image/about/gongzonghao.png" />
					</div>
					<div class="text-white text-center">微信公众号</div>
					<div class="text-white text-center">“智能云课程”icloudcum</div>
				</div>
			</div>
			<m-footer :is-transparent="false"></m-footer>
		</a-layout-content>
	</a-layout>
</template>

<style scoped>
.box {
	position: relative;
	width: 16px;
}

.box::before {
	content: '';
	position: absolute;
	width: 16px;
	height: 16px;
	background-color: #8eceff;
	top: 0;
	left: 0;
	border-radius: 100%;
}

.box::after {
	content: '';
	position: absolute;
	width: 8px;
	height: 8px;
	background-color: white;
	top: 4px;
	left: 4px;
	border-radius: 100%;
}
</style>
