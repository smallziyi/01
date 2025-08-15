<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getCardDataList, getDataIndexList } from '@/axios/module/screen.api';
import Getview from './compents/getview.vue';
import Leftview from './compents/top/leftview.vue';
import Videos from './compents/top/videos.vue';
import EchartViews from './echart/echart-views.vue';
const dataList = ref();
const dataListLfet = ref();
const dataLists = ref();
onMounted(() => {
  getDataIndexList().then((res) => {
    if (res.data) {
      dataList.value = res.data;
      dataListLfet.value = dataList.value.slice(0, 12);
    }
  });
  getCardDataList().then((res: any) => {
    if (!res) return;
    dataLists.value = res.data;
  });
});
watch(
  () => dataList.value,
  (val) => {
    dataList.value = val;
  },
  { immediate: true },
);
</script>
<template>
  <div class="index-box" id="large-screen">
    <div class="w-full h-[35%] flex justify-between ">
      <div class="w-[615px] h-[100%] es-screen-right-item-child1" >
        <Leftview  :data-lists="dataLists" :typid="-1" title="院校介绍"></Leftview>
      </div>
      <div class="w-[615px] h-[100%] es-screen-right-item-child2">
        <Videos :data-lists="dataLists" :typid="-3" title="成果展示"></Videos>
      </div>
      <div class="w-[615px] h-[100%] es-screen-right-item-child3">
        <Leftview :data-lists="dataLists" :typid="-2" title="专业建设动态"></Leftview>
      </div>
    </div>
    <div class="w-full h-[65%] es-screen-right-item-child4">
      <div class="w-full flex flex-col">
        <div class=" w-[100%] h-[70px] contetbottom-title mt-4" >
          <div class="cont-top"></div>
          <div class="cont-ti">校企合作成果</div>
        </div>
        <div class="w-full grid grid-cols-6 gap-3 mt-4">
          <div v-for="item in dataListLfet" class="es-screen-right-item-child5">
            <Getview :listData="item" :typid="item.screenSourceType" :title="item.indexName">
              <EchartViews :dataList="item" :typid="item.screenSourceType" :listid="item.showType"></EchartViews>
            </Getview>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

/* 开场动画 */

.es-screen-right-item-child1 {
	animation-name: slide;
  animation-duration: 1.5s;
}
.es-screen-right-item-child2 {
	animation-name: slide2;
  animation-duration: 1.5s;
}
.es-screen-right-item-child3 {
	animation-name: slide3;
  animation-duration: 1.5s;
}
.es-screen-right-item-child4 {
	animation-name: slide4;
  animation-duration: 1.5s;
}
/* 下面 */
.es-screen-right-item-child5 {
	animation-name: slide5;
  animation-duration: 3.5s;
}

.es-screen-right-item-child5:nth-child(1) {
	animation-name: slide5;
  animation-duration: 0.5s;
}
.es-screen-right-item-child5:nth-child(2) {
	animation-name: slide5;
  animation-duration: 1s;
}
.es-screen-right-item-child5:nth-child(3) {
	animation-name: slide5;
  animation-duration: 1.5s;
}
.es-screen-right-item-child5:nth-child(4) {
	animation-name: slide5;
  animation-duration: 2s;
}
.es-screen-right-item-child5:nth-child(5) {
	animation-name: slide5;
  animation-duration: 2.5s;
}
.es-screen-right-item-child5:nth-child(6) {
	animation-name: slide5;
  animation-duration: 3s;
}
.es-screen-right-item-child5:nth-child(7) {
	animation-name: slide5;
  animation-duration: 3.5s;
}
.es-screen-right-item-child5:nth-child(8) {
	animation-name: slide5;
  animation-duration: 4s;
}
.es-screen-right-item-child5:nth-child(9) {
	animation-name: slide5;
  animation-duration: 4.5s;
}
.es-screen-right-item-child5:nth-child(10) {
	animation-name: slide5;
  animation-duration: 5s;
}

.es-screen-right-item-child5:nth-child(11) {
	animation-name: slide5;
  animation-duration: 5.5s;
}

.es-screen-right-item-child5:nth-child(12) {
	animation-name: slide5;
  animation-duration: 6s;
}




@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  80%{
    transform: translateX(20px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes slide2 {
  0% {
    transform: translateY(-100%);
  }
  80%{
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes slide3 {
  0% {
    transform: translateX(100%);
  }
  80%{
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide4 {
  0% {
    transform: translateY(20%);
    opacity: 0;
  }
  80%{
    transform: translateY(-10px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}


@keyframes slide5 {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  80%{
    transform: translateX(20px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}













.index-box {
  width: 100%;
  height: 100%;
  padding-top: 130px;
  display: flex;
  flex-direction: column;
}

.index-box2 {
  width: 100%;
}

.contetbottom-title {
  text-align: center;
  line-height: 60px;
  position: relative;


}

.cont-top {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/scrren/bj.png');
  opacity: 0.1;

}

.cont-ti {
  position: absolute;
	top: 35px;
	left: 50%;
	transform: translate(-50%, -50%);
  font-weight: 900;
  font-size: 25px;
  letter-spacing: 2px;
}
</style>
