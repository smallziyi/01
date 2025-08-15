<script setup lang="ts">
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { getScreenCardDetail } from '@/axios/module/screen.api';

const route = useRoute();
withDefaults(
    defineProps<{
        // 标题
        dataLists: any,
        title: number | string;
        typid: number | string;
    }>(),
    {
        dataLists: [],
        title: "",
        typid: 0
    }
);

const list2 = ref();
const images = ref();
onMounted(() => {
    getScreenCardDetail(route.query.id as string).then((res)=>{
        images.value = res.data.cardDataList[2].fileDataList;
        list2.value = res.data.cardDataList[0].content;
        let contentDiv = document.getElementById('contentDiv')!;
        contentDiv.innerHTML = list2.value;
    }) 
})

</script>

<template>
    <div class=" w-[100%] h-[100%]">
        <dv-border-box1 class="w-full h-full">
            <div class="justify-content align-items w-full flex" v-if="title !== ''">
                <!-- <Decoration1 style=" width: 45px; height: 45px;" /> -->
                <div class="item_title">
                    <div class="zuo"></div>
                    <dv-decoration-12 style="width:55px;height:55px;" />
                    <span class="title-inner"> {{ title }} </span>
                    <div class="you"></div>
                </div>
                <!-- <Decoration1 style=" width: 45px; height: 45px;" /> -->
            </div>
            <div :class="title !== '' ? 'item_title_content' : 'item_title_content_def'">
                <div v-if="typid === -1" class=" w-[100%] h-[100%] ">
                    <div class="w-full pl-2 pr-1">
                        <div class="w-full h-[120px] mt-3 indent-1">
                            <div class="scroll-container pr-1 pl-1" id="contentDiv" style=" overflow: hidden; overflow-y: auto; width: 100%; height: 245px;"></div>
                        </div>
                    </div>
                </div>

                <div v-else-if="typid === -2">
                    <div class="w-[100%] h-[100%] pl-3 pr-2 pt-2">
                        <a-carousel arrows autoplay>
                            <template #prevArrow>
                                <div class="custom-slick-arrow"
                                    style="top:100px;left: 10px; background-color: transparent;">
                                    <left-circle-outlined />
                                </div>
                            </template>
                            <template #nextArrow>
                                <div class="custom-slick-arrow"
                                    style="top: 100px; right:10px;background-color: transparent;">
                                    <right-circle-outlined />
                                </div>
                            </template>
                            <div class="w-full h-[280px]" v-for="item in images">
                                <h3><img class="w-[99%] h-[250px]" :src="item.fileUrl" alt="" srcset=""></h3>
                            </div>
                        </a-carousel>
                    </div>
                </div>
            </div>
        </dv-border-box1>
    </div>
</template>

<style scoped>

.zuo {
    width: 65px;
    height: 14px;
    background-image: url("@/assets/scrren/titles/zuo.png");
    margin-top: 7px;
    margin-right: 40px;
  }

  .you {
    transform: rotate(180deg);
    width: 65px;
    height: 14px;
    background-image: url("@/assets/scrren/titles/zuo.png");
    margin-top: 7px;
    margin-left: 40px;
  }



.leftClass {
    width: 100%;
    height: 140px;
}

.rightClass {
    width: 100%;
    height: 180px;
}

.item_title {
    height: 38px;
    line-height: 38px;
    width: 100%;
    color: #31abe3;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* .item_title .zuo,
.item_title .you {
    width: 58px;
    height: 14px;
    margin-top: 20px;
}

.item_title .you {
    transform: rotate(180deg);
} */

.item_title .title-inner {
    margin-top: 20px;
    font-weight: 900;
    letter-spacing: 2px;
    background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
    -webkit-background-clip: text;
    background-clip: transparent;
    position: absolute;
    top: -20px;
}

/* For demo */
:deep(.slick-slide) {
    text-align: center;
    max-height: 260px;
    line-height: 260px;
    overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
    width: 20px;
    height: 20px;
    font-size: 20px;
    color: #fff;
    transition: ease all 0.3s;
    opacity: 0.3;
    z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
    color: #fff;
    opacity: 0.5;
}

:deep(.slick-slide h3) {
    color: #fff;
}

/* 定义滚动容器样式 */
.scroll-container {
    height: 200px;
    width: 300px;
    overflow-y: hidden;
    scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
    width: 0;
}
</style>
