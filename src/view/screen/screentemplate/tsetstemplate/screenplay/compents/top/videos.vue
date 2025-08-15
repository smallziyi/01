<script setup lang="ts">
import {  Decoration9 } from '@kjgl77/datav-vue3'
import 'video.js/dist/video-js.css'
import {VideoPlayer} from '@videojs-player/vue';
import 'video.js/dist/video-js.css'
const props = withDefaults(
	defineProps<{
		// 标题
		dataLists: any;
		title: number | string;
		typid: number | string;
	}>(),
	{
		dataLists: [],
		title: '',
		typid: 0,
	},
);
const videosrc= ref();
watch(()=>props.dataLists,(val)=>{
	if(val.length>0){
		videosrc.value=props.dataLists[1].fileDataList[0].fileUrl;
		playerOptions.title=props.dataLists[1].fileDataList[0].fileName;
	}
})

const playerOptions: any = {
	autoplay: true, //如果true,浏览器准备好时开始回放。
	muted: true, // 默认情况下将会消除任何音频。
	loop: true, // 导致视频一结束就重新开始。
	aspectRatio: '14:7', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
	fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
	sources: [
		{
			type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
		},
	],
	// poster: "https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=600y500", // 你的封面地址
	notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
	controlBar: {
		timeDivider: true,
		durationDisplay: true,
		remainingTimeDisplay: true,
		fullscreenToggle: true, // 全屏按钮
	},
	mirror: true, //镜像画面
	ligthOff: true, //关灯模式
	volume: 0.3, //默认音量大小
	control: true, //是否显示控制器
	title: '', //视频名称
};




</script>

<template>
    <div class=" w-[100%] h-[100%] ">
        <dv-border-box12 class="w-full h-full">
            <div class="justify-content align-items w-full flex" v-if="title !== ''">
                <div class="item_title">
                    <div class="zuo"></div>
                    <Decoration9 style="width: 100px; height: 50px" />
                    <span class="title-inner"> {{ title }} </span>
                    <div class="you"></div>
                </div>
            </div>
            <div :class="title !== '' ? 'item_title_content' : 'item_title_content_def'">
                <div v-if="typid === -3" class="w-[100%] h-[100%] pl-2 pr-2 pt-1.5 pb-1">
                    <video-player autoplay :options="playerOptions" class="video-player vjs-custom-skin w-[100%] h-[100%]"
			  ref="videoPlayer"
			  :playsinline="true"
			  :src="videosrc"
			  />
                </div>
            </div>
        </dv-border-box12>
    </div>
</template>

<style scoped>


.zuo {
    width: 58px;
    height: 14px;
    background-image: url("@/assets/scrren/titles/zuo.png");
    margin-top: 20px;

  }

  .you {
    transform: rotate(180deg);
    width: 58px;
    height: 14px;
    background-image: url("@/assets/scrren/titles/zuo.png");
    margin-top: 20px;
   
  }

.item_title {
    height: 38px;
    line-height: 38px;
    width: 100%;
    color: #31abe3;
    text-align: center;
    /* background: linear-gradient(to right, transparent, #0f0756, transparent); */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    z-index: 99;
}

.item_title .title-inner {
    margin-top: 20px;
    font-weight: 900;
    letter-spacing: 2px;
    background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: absolute;
    top: -20px;
}
</style>
