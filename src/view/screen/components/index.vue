<script setup lang="ts">
import { reactive, ref } from "vue";
import dayjs from 'dayjs';
import type { DateDataType } from '../../__report/config';
import { AntDesignOutlined } from '@ant-design/icons-vue';
const dateData = reactive<DateDataType>({
  dateDay: "",
  dateYear: "",
  dateWeek: "",
  timing: null
});


const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
const timeFn = () => {
  dateData.timing = setInterval(() => {
    dateData.dateDay = dayjs().format("YYYY年-MM月-DD日 hh : mm : ss");
    dateData.dateWeek = weekday[dayjs().day()];
  }, 1000);
};
timeFn();


// 文字滚动
const scrollText = ref<any[]>([
  {
    title: '欢迎姜大源、闫智勇、吴全全等领导一行莅临指导我校双高建设情况',
    href: 'https://baidu.com'
  },
  {
    title: '欢迎姜大源、闫智勇、吴全全等领导一行莅临指导我校双高建设情况',
    href: 'https://baidu.com'
  },
  {
    title:
      '欢迎姜大源、闫智勇、吴全全等领导一行莅临指导我校双高建设情况'
  },
  {
    title: '欢迎姜大源、闫智勇、吴全全等领导一行莅临指导我校双高建设情况',
    href: 'https://baidu.com'
  },
  {
    title: '欢迎姜大源、闫智勇、吴全全等领导一行莅临指导我校双高建设情况',
    href: 'https://baidu.com'
  }
])

// 文字滚动
// const scrollTextT = ref<any[]>()
function onClick(text: any) {
  // 获取点击的标题
  console.log('text', text)
}


const state = reactive({
  single: false,
  height: 50,
  fontSize: 22,
  fontWeight: 800,
  color: 'red',
  backgroundColor: 'transparent',
  amount: 1,
  gap: 20,
  interval: 20,
  step: 1,
  vertical: false,
  verticalInterval: 1000,
  logoText:'xxxx学院专业能力建设情况总览'
})


const router = useRouter();
const setSettingShow = () => {
	router.go(-1);
};


</script>

<template>
  <div class="d-flex jc-center title_wrap">
    <div small-bg>
      <dv-decoration-10 style="width:23.3%;height:5px;" :color="['#45a1f1', '#000000']" :reverse="true" />
    </div>

    <div class="youjuxing">
      <dv-decoration-10 style="width: 23.3%;height:5px;" :color="['#45a1f1', '#000000']" :reverse="true" />
    </div>
    <div class="guang"></div>
    <div class="d-flex jc-center">
      <div class="title">
        <span class="title-text">{{state.logoText}}</span>
      </div>
      <div small-bg>
        <dv-decoration5 :dur="2" style="position: absolute; top: 50px; left: 535px; width:800px;height:40px;" />
      </div>
    </div>

    <!-- 文字滚动 -->
    <div class="w-full mt-7">
      <TextScroll class="mt20" :scrollText="scrollText" :single="state.single" :height="state.height" :board-style="{
        backgroundColor: state.backgroundColor,
        
      }" :text-style="{
        fontSize: state.fontSize + 'px',
        fontWeight: state.fontWeight,
        color: state.color
      }" :amount="state.amount" :gap="state.gap" :interval="state.interval" :step="state.step"
        :vertical="state.vertical" :vertical-interval="state.verticalInterval" @click="onClick" />
    </div>


    <div class="timers">
      {{ dateData.dateWeek }} {{ dateData.dateDay }} {{ dateData.dateYear }}
    </div>

    <div class="seeting">
      <a-avatar class="avater">
        <template #icon>
          <AntDesignOutlined />
        </template>
      </a-avatar>
      <div class="setting_icon" @click="setSettingShow()">
        <img src="@/assets/scrren/img/headers/setting.png" alt="设置">
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.title_wrap {
	height: 60px;
	background-image: url('../assets/img/top.png');
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
	left: 0px;
	top: 20px;
	font-size: 18px;
	font-weight: 900;
	display: flex;
	align-items: center;
	color: #ffff;
}

.title_wrap .seeting {
	position: absolute;
	right: 10px;
	top: 20px;
	font-size: 18px;
	font-weight: 900;
	display: flex;
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
