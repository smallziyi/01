<script setup lang="ts">
import { Decoration1 } from '@kjgl77/datav-vue3';
const props = withDefaults(
    defineProps<{
        // 标题
        dataLists: any,
        title: number | string;
    }>(),
    {
        dataLists: null,
        title: '',
    },
);
watch(() => props.dataLists, (val) => {
    if (val) {

    }
}, { immediate: true })




</script>

<template>
    <div  v-if="props.dataLists"
	 class="w-[410px] h-[205px] ">
        <dv-border-box12 class="w-full h-full">
            <div class="justify-content align-items w-full flex" v-if="title !== ''">
                <Decoration1 style=" width: 40px; height: 40px;" />
                <div class="item_title">
                    <div class="zuo"></div>
                    <dv-decoration-11 style="width:100px;height:60px; "></dv-decoration-11>
                    <span class="title-inner"> {{ title }} </span>
                    <div class="you"></div>
                </div>
                <Decoration1 style=" width: 40px; height: 40px;" />
            </div>
            <div :class="title !== '' ? 'item_title_content' : 'item_title_content_def'">
				<slot></slot>
			</div>
        </dv-border-box12>
    </div>
</template>

<style scoped>
.item_title {
    height: 38px;
    line-height: 38px;
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
    top: -20px;
}

.rbootob {
    width: 400px;
    height: 170px;
}
</style>
