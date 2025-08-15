import { createApp } from 'vue';
import App from './App.vue';
import pinia from './store/index';
import './style.css';
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AntD from 'ant-design-vue';
import datetime from '@/utils/datetime.ts';
import security from '@/utils/security.ts';
import tree from '@/utils/tree.ts';
import emitter from '@/utils/event.ts';
import download from '@/utils/download.ts';
import MEmpty from '@/components/m-empty.vue';
import FileUpload from '@/components/file-upload.vue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import '@wangeditor/editor/dist/css/style.css' // 引入 css;'
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import { Icon } from '@iconify/vue';
import DataVVue3 from '@kjgl77/datav-vue3';
// @ts-ignore
import VueAmazingUI from 'vue-amazing-ui' ;
import 'vue-amazing-ui/css'
const app: any = createApp(App);
app.use(router);
app.use(AntD);
app.use(pinia);
app.use(DataVVue3);
app.use(VueVideoPlayer);
app.use(VueAmazingUI);
app.config.globalProperties.$datetime = datetime;
app.config.globalProperties.$security = security;
app.config.globalProperties.$tree = tree;
app.config.globalProperties.$emitter = emitter;
app.config.globalProperties.$download = download;
app.config.globalProperties.$reload = () => {
	window.location.reload();
};
app.config.globalProperties.$config = window.config;

app.use(autoAnimatePlugin);

app.component('m-empty', MEmpty);
app.component('file-upload', FileUpload);
app.component('Icon', Icon);
app.mount('#app');
