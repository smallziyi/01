<script setup lang="ts">
import { onMounted } from 'vue';
import ScaleScreen from './components/scale-screen';
import Headers from './components/header.vue';
import RouterViews from './screentemplate/template/screenplay/routerview.vue';
import RoueViewplay from './screentemplate/tsetstemplate/screenplay/roueviewplay.vue';
import { getScreenCardDetail } from '@/axios/module/screen.api';
import {  DownOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
const wrapperStyle = {};
const route = useRoute();
const listtitle = ref();
const listid = reactive({
  activeIndex: 1
})

onMounted(() => {
  getScreenCardDetail(route.query.id as string).then((res) => {
    if (res.data) {
      listtitle.value = res.data;
    }
  })
})


const handleMenuClick: MenuProps['onClick'] = e => {
  listid.activeIndex = Number(e.key)
};
</script>
<template>
  <scale-screen width="1920" height="1080" :delay="100" :fullScreen="false" :boxStyle="{
    background: '#03050C',
  }" :wrapperStyle="wrapperStyle">
    <div class="content_wrap">
      <Headers class="es-screen-header" :cardId="listid.activeIndex" :listtitles="listtitle">

        <a-dropdown>
				<div class="ant-dropdown-link" @click.prevent>
					模板
					<DownOutlined />
        </div>
				<template #overlay>
					<a-menu @click="handleMenuClick">
						<a-menu-item key="1">
							<a href="javascript:;">模板一</a>
						</a-menu-item>
						<a-menu-item key="2">
							<a href="javascript:;">模板二</a>
						</a-menu-item>
					</a-menu>
				</template>
			</a-dropdown>

      </Headers>
      <component :is="listid.activeIndex === 1 ? RouterViews : listid.activeIndex === 2 ? RoueViewplay : RoueViewplay"></component>
    </div>
  </scale-screen>

 
</template>
<style scoped>

.es-screen-header {
	animation: fade 5s;
}

@keyframes fade {
	0% {
		transform: translateY(-80%);
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


.content_wrap {
  width: 100%;
  height: 100%;
  padding: 0px 16px 0px 16px;
  box-sizing: border-box;
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/scrren/img/pageBg.png");
  color: #BFC7E6
}
</style>
