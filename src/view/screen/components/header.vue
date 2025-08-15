<script setup lang="ts">
import { reactive } from 'vue';
import dayjs from 'dayjs';
import type { DateDataType } from '../../__report/config';

const props = withDefaults(
	defineProps<{
		listtitles: any;
		cardId: number
	}>(),
	{
		listtitles: null,
		cardId: 0
	},
);
let CardList = reactive({
	cardName: '鄂尔多斯职业技术学校专业能力建设情况总览',
	content: '',
});

const scrollText = ref<any[]>([
	{
		title: '欢迎姜大源、闫智勇、吴全全等领导一行莅临指导我校双高建设情况'
	},
])
watch(
	() => props.listtitles,
	(valdd) => {
		if (valdd) {
			CardList.cardName = props.listtitles.name;
			CardList.content = props.listtitles.cardDataList[3].content;
			scrollText.value[0].title = CardList.content;
		}
	},
	{ immediate: true },
);

const dateData = reactive<DateDataType>({
	dateDay: '',
	dateYear: '',
	dateWeek: '',
	timing: null,
});
const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const timeFn = () => {
	dateData.timing = setInterval(() => {
		dateData.dateDay = dayjs().format('YYYY年-MM月-DD日 hh : mm : ss');
		dateData.dateWeek = weekday[dayjs().day()];
	}, 1000);
};
timeFn();

const router = useRouter();
const setSettingShow = () => {
	router.go(-1);
};

const state = reactive({
	single: false,
	height: 65,
	fontSize: 28,
	fontWeight: 800,
	color: 'red',
	backgroundColor: 'transparent',
	amount: 1,
	gap: 20,
	interval: 20,
	step: 1,
	vertical: false,
	verticalInterval: 1000,

})
</script>
<template>
	<div v-if="props.listtitles" class="d-flex jc-center title_wrap">
		<div small-bg>
			<dv-decoration-10 style="width: 23.3%; height: 5px" :color="['#45a1f1', '#000000']" :reverse="true" />
		</div>

		<div class="youjuxing">
			<dv-decoration-10 style="width: 23.3%; height: 5px" :color="['#45a1f1', '#000000']" :reverse="true" />
		</div>
		<div class="guang"></div>
		<div class="d-flex jc-center">
			<div class="title">
				<span class="title-text">{{ CardList.cardName }}</span>
			</div>
			<div small-bg>
				<dv-decoration5 :dur="2"
					style="position: absolute; top: 50px; left: 535px; width: 800px; height: 40px" />
			</div>
		</div>

		<!-- 文字滚动 -->
		<div v-if="props.cardId === 1">
			<div class="w-[100%] h-[55px] text-center mt-7 font">
			</div>
			<div class="full-text">
				<p>{{ CardList.content }}</p>
			</div>
		</div>


		<div v-else-if="props.cardId === 2" class="w-[100%]">
			<TextScroll class="mt-7" :scrollText="scrollText" :single="state.single" :height="state.height"
				:board-style="{
					backgroundColor: state.backgroundColor,

				}" :text-style="{
					fontSize: state.fontSize + 'px',
					fontWeight: state.fontWeight,
					color: state.color
				}" :amount="state.amount" :gap="state.gap" :interval="state.interval" :step="state.step" :vertical="state.vertical"
				:vertical-interval="state.verticalInterval"> 
			</TextScroll>
		</div>


		<div class="timers">{{ dateData.dateDay }} {{ dateData.dateYear }} {{ dateData.dateWeek }}</div>

		<div class="seeting flex">
			<slot></slot>

			<div class="setting_icon" @click="setSettingShow()">
				<img src="@/assets/scrren/img/headers/setting.png" alt="设置" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.title_wrap {
	height: 60px;
	background-image: url('@/assets/scrren/top.png');
	background-size: cover;
	margin-bottom: 4px;
}

.title_wrap .guang {
	position: absolute;
	bottom: -26px;
	background-image: url('../assets/scrren/img/guang.png');
	background-position: 80px center;
	width: 100%;
	height: 56px;
}

.title_wrap .zuojuxing,
.title_wrap .youjuxing {
	position: absolute;
	top: 0px;
	width: 100%;
}

.title_wrap .zuojuxing {
	left: 11%;
}

.title_wrap .youjuxing {
	transform: rotate(180deg);
}

.title_wrap .timers {
	width: 600px;
	height: 45px;
	position: absolute;
	left: 15px;
	top: 20px;
	font-size: 15px;
	font-weight: 900;
	display: flex;
	align-items: center;
	color: #ffff;
}

.title_wrap .seeting {
	position: absolute;
	right: 10px;
	top: 20px;
	font-size: 15px;
	font-weight: 900;
	display: flex;
	text-align: center;
	line-height: 40px;
	text-align: center;
}

.title_wrap .seeting .setting_icon {
	width: 20px;
	height: 20px;
	cursor: pointer;
	margin-left: 12px;
	margin-top: 10px;
}

.title_wrap .seeting .setting_icon img {
	width: 100%;
	height: 100%;
}

.title {
	position: relative;
	text-align: center;
	background-size: cover;
	color: transparent;
	height: 60px;
	line-height: 46px;
}

.title-text {
	font-size: 38px;
	font-weight: 900;
	letter-spacing: 6px;
	width: 100%;
	background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

.font {
	background-image: url('@/assets/scrren/bj.png');
	opacity: 0.4;
}

.full-text {
	position: absolute;
	top: 120px;
	left: 50%;
	transform: translate(-50%, -50%);
}

p {
	font-family: 'MyIconFont';
	content: '\e93a';
	speak-as: none;
	font-size: 36px;
	color: #fdb438;
	font-style: normal;
	font-weight: normal;
	font-variant: normal;
	text-transform: none;
	line-height: 50px;
	-webkit-font-smoothing: antialiased;
	-moz-font-smoothing: grayscale;
}

/* For demo */
:deep(.slick-slide) {
	text-align: center;
	max-height: 100%;
	line-height: 100%;
	background: #364d79;
	overflow: hidden;
}
</style>
