<script setup lang="ts">
// import { SCREEN_SOURCE_ENUM} from '@/view/__report/config.ts';
// import Getpie3d from '@/view/screen/components/echarts/getpie3d.vue';
// import { getCardDataList } from '@/axios/module/screen.api';
// import { getDataIndexList } from '@/axios/module/screen.api'
// import Histogram from '@/view/screen/components/echarts/histogram.vue';
// import Line from '@/view/screen/components/echarts/line.vue';
// import Padar from '@/view/screen/components/echarts/padar.vue';
// import Ring from '@/view/screen/components/echarts/ring.vue';
// import Ringj from '@/view/screen/components/echarts/ringj.vue';
// import Linej from '@/view/screen/components/echarts/linej.vue';

const props = withDefaults(
    defineProps<{
        // 标题
        listData: any;
        title: number | string;
        typid: number | string;
    }>(),
    {
        listData: null,
        title: "",
        typid: 0
    }
);

const fileDataList = ref()
watch(() => props.listData, (val) => {
    if (val.length > 0) {
        fileDataList.value = val;
    }
}, { immediate: true });
</script>

<template>

    <dv-border-box12
    v-if="props.listData"
        :class="props.listData.screenSourceType=== 1 || props.listData.screenSourceType=== 2 || props.listData.screenSourceType=== 3 || props.listData.screenSourceType=== 4 || props.listData.screenSourceType=== 5 ? 'CONSTRUCTION' : 'rightcls'">
        <div
            class="w-full h-full">
            <div class="w-full h-full flex flex-col">
                <div class="justify-content align-items w-full flex" v-if="title !== ''">
                    <div class="item_title">
                        <div class="zuo"></div>
                        <dv-decoration-9 style="width:40px;height:40px; "></dv-decoration-9>
                        <span class="title-inner"> {{ props.title }} </span>
                        <div class="you"></div>
                    </div>
                </div>
                <div class="w-[100%] h-[100%]" :class="title !== '' ? 'item_title_content' : 'item_title_content_def'">
                    <slot> </slot>
                </div>
            </div>

        </div>
    </dv-border-box12>
</template>

<style scoped>
:root {
    --item-title-height: 38px;
}

.CONSTRUCTION {
    width: 350px;
    height: 170px;
}

.rightcls {
    width: 410px;
    height: 230px;
}

.item_title {
    height: var(--item-title-height);
    line-height: var(--item-title-height);
    width: 100%;
    color: #31abe3;
    text-align: center;
    background: linear-gradient(to right, transparent, #0f0756, transparent);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item_title .zuo,
.item_title .you {
    width: 58px;
    height: 14px;
    margin-top: 20px;
}

.item_title .you {
    transform: rotate(180deg);
}

.item_title .title-inner {
    margin-top: 20px;
    font-weight: 900;
    letter-spacing: 2px;
    background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: absolute;
    top: -10px;
}

.item_title_content {
    height: calc(100% - var(--item-title-height));
}
</style>
