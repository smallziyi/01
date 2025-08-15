<script setup lang="ts">
import {  Decoration1 } from '@kjgl77/datav-vue3'
const props = withDefaults(
    defineProps<{
        // 标题
  
        title: number | string;
    }>(),
    {

        title: "",
    }
);

const fileDataList = ref()
watch(() => props.title, (val) => {
    if (val) {
        fileDataList.value = val;
    }
}, { immediate: true });
</script>

<template>

    <dv-border-box13

    v-if="props.title" class="CONSTRUCTION">
        <div
            class="w-full h-full">
            <div class="w-full h-full flex flex-col">
                <div class="justify-content align-items w-full flex" v-if="title !== ''">
                    <div class="item_title">
                        <Decoration1 style=" width: 70px; height: 20px;  transform: rotate(180deg); " />
                        <div class="zuo"></div>
                        <dv-decoration-9 style="width:40px;height:40px; "></dv-decoration-9>
                        <span class="title-inner"> {{ props.title }} </span>
                        <div class="you"></div>
                        <Decoration1 style=" width: 70px; height: 20px;" />
                    </div>
                </div>
                <div class="w-[100%] h-[100%]" :class="title !== '' ? 'item_title_content' : 'item_title_content_def'">
                    <slot> </slot>
                </div>
            </div>

        </div>
    </dv-border-box13
    >
</template>

<style scoped>
:root {
    --item-title-height: 38px;
}

.CONSTRUCTION {
    width:300px; height: 230px;
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
