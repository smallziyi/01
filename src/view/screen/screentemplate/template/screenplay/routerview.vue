<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Guoview from './components/guoview/guoview.vue';
import Videos from './components/content/video.vue';
import Charting from './components/content/charting.vue';
import Rbooton from './components/right/rbooton.vue';
import { getCardDataList, getDataIndexList } from '@/axios/module/screen.api';
import Getpie3d from '../echarts/getpie3d.vue';
import Rbootons from './components/right/rbos.vue';
import Decoraview from './components/guoview/decoraview.vue';
import Rooteview from './components/guoview/rooteview.vue';
const dataList = ref();
const dataListLfet = ref();
const dataListRight = ref();
const dataListrl = ref();
const dataLists = ref();
const lastdata = ref();
onMounted(() => {
	getDataIndexList().then((res) => {
		if (res.data && Object.keys(res.data).length > 0) {
			dataList.value = res.data;
			dataListLfet.value = dataList.value.slice(0, 5);
			dataListRight.value = dataList.value.slice(5, 8);
			dataListrl.value = dataList.value.slice(8, 11);
			lastdata.value = dataList.value.slice(10, 11);

			// 测试
			// dataList.value = res.data;
			// dataListLfet.value = dataList.value.slice(0, 5);
			// dataListRight.value = '';
			// dataListrl.value = '';
			// lastdata.value = '';
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
	<div class="flex justify-content align-items index-box">
		<div class="w-[19%] h-[98%] flex flex-col mt-3 ">
			<div class="mt-3 es-screen-left-item" v-for="item in dataListLfet" >
				<Guoview :listData="item" :typid="item.screenSourceType" :title="item.indexName">
					<Getpie3d :dataList="item" :typid="item.screenSourceType" :listid="item.showType"></Getpie3d>
				</Guoview>
			</div>
		</div>
		<div class="w-[35%] h-[98%] mt-3">
			<div class="w-[100%] mt-3 es-screen-right-itemv">
				<Videos :data-lists="dataLists" :typid="-3" title="成果展示" />
			</div>
			<div class="w-[100%] flex mt-3 es-screen-right-itemchart">
				<div class="w-full">
					<Charting :dataLists="dataLists" :typid="-1" title="院校介绍" />
				</div>
				<div class="w-full">
					<Charting :dataLists="dataLists" :typid="-2" title="校级专业建设成果展示" />
				</div>
			</div>
		</div>
		<div class="w-[46%] h-[98%] mt-3">
			<div class="flex w-[100%]">
				<div class="w-[50%] h-auto flex flex-col mt-3">
					<div v-for="itemst in dataListRight" class="es-screen-right-itemright">
						<Guoview :listData="itemst" :typid="itemst.screenSourceType" :title="itemst.indexName">
							<Getpie3d :dataList="itemst" :typid="itemst.screenSourceType" :listid="itemst.showType">
							</Getpie3d>
						</Guoview>
					</div>
				</div>
				<div class="w-[50%] flex flex-col mt-3 ">
					<div v-for="items in dataListrl"  class="es-screen-right-itemright">
						<Guoview :listData="items" :typid="items.screenSourceType" :title="items.indexName">
							<Getpie3d :dataList="items" :typid="items.screenSourceType" :listid="items.showType">
							</Getpie3d>
						</Guoview>
					</div>
				</div>
			</div>
			<div class="w-[100%] index-box2 h-auto flex r-b mt-3 es-screen-right-itemdecr" >
				<div v-for="item in lastdata">
					<Decoraview :dataLists="item" :typid="12" title="职业行动能力">
						<Rbooton :dataLists="item" :typid="12" title="职业行动能力">
						</Rbooton>
					</Decoraview>
				</div>

				<div v-for="itesm in lastdata">
					<Rooteview class="ml-6" :dataLists="itesm" title="职业倾向">
						<Rbootons :dataLists="itesm" title="职业倾向"></Rbootons>
					</Rooteview>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>


.es-screen-right-itemright{
	animation-name: rightitem;
}
.es-screen-right-itemright:nth-child(1) {
	animation-duration: 0.5s;
}
.es-screen-right-itemright:nth-child(2) {
	animation-duration: 1s;
}
.es-screen-right-itemright:nth-child(3) {
	animation-duration: 1.5s;
}

@keyframes rightitem {
	0% {
		transform: translateY(50%);
		opacity: 0;
	}

	80% {
		transform: translateY(-20px);
		opacity: 0.5;
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}


.es-screen-right-itemdecr{
	animation-name: itemdecr;
	animation-duration: 3s;
}

@keyframes itemdecr {
	0% {
		transform: translateY(100%);
		opacity: 0;
	}

	80% {
		transform: translateY(-20px);
		opacity: 0.5;
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}









.es-screen-left-item {
	/* ... */
	animation-name: slide;
}
.es-screen-left-item:nth-child(1) {
	animation-duration: 0.5s;
}
.es-screen-left-item:nth-child(2) {
	animation-duration: 1s;
}

.es-screen-left-item:nth-child(3) {
	animation-duration: 1.5s;
}

.es-screen-left-item:nth-child(4) {
	animation-duration: 2s;
}

.es-screen-left-item:nth-child(5) {
	animation-duration: 2.5s;
}

.es-screen-right-itemv{
	animation-name: slidev;
	animation-duration: 2.5s;
}

.es-screen-right-itemchart{
	animation-name: charts3d;
}

.es-screen-right-itemchart:nth-child(1){
	animation-duration: 2.5s;
}
.es-screen-right-itemchart:nth-child(2){
	animation-duration: 3s;
}

@keyframes charts3d {
	0% {
		transform: translateY(50%);
		opacity: 0;
	}

	80% {
		transform: translateY(-20px);
		opacity: 0.5;
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}


@keyframes slidev {
	0% {
		transform: translateY(-50%);
		opacity: 0;
	}

	80% {
		transform: translateY(20px);
		opacity: 0.5;
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}


@keyframes slide1 {
	0% {
		transform: translateY(-50%);
		opacity: 0;
	}

	80% {
		transform: translateY(20px);
		opacity: 0.5;
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}



@keyframes slide {
	0% {
		transform: translateX(-100%);
	}

	80% {
		transform: translateX(20px);
	}

	100% {
		transform: translateX(0);
	}
}












.index-box {
	width: 100%;
	height: 100%;
	padding-top: 75px;
}

.index-box2 {
	width: 100%;
}
</style>
