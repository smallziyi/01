<template>
  <div class="bg-[#65a3ff]   max-h-screen overflow-y-auto">
    <!-- 第一部分 -->
    <div class="container ml-4 py-4">
      <div class="flex">
        <img src="/logo.svg" alt="logo" class="w-10 h-10 rounded-full mr-3" />
        <div class="text-white text-sm">
          <p>北京正道智源教育科技有限公司</p>
          <p>北京华德智源教育科技产业有限公司</p>
        </div>
      </div>
    </div>

    <!-- 第二部分 -->
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-center gap-17">
        <h1 class="text-white text-3xl ml-10">工作过程系统化相关业务服务平台</h1>
        <div class="">
          <img src="/background.png" alt="右侧插图" class="w-100 h-60" />
        </div>
      </div>
    </div>

    <!-- 第三部分：六个盒子 -->
    <div class="bg-[#ffffff] -mt-8 rounded-t-3xl px-[169px] pt-[80.5px]">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[70px] max-w-full mx-auto">
        <div
          v-for="project in porjectList"
          :key="project.id"
          class="group relative h-[140px] hover:-translate-y-[5px] cursor-pointer transform duration-300  "
          @click="handleGoto(project)"
        >
          
          <div class="flex gap-[6px] h-full">
            <div class="w-[125px] rounded-[4px] h-full" :class="`${project.leftcolorClass}`">
              <div
                class="text-[36px] leading-6 font-black text-white my-[9px] ml-[9px] group-hover:opacity-0"
              >
                {{ project.id }}
              </div>
              <div
                class="flex justify-end items-center mr-[6px] group-hover:-translate-y-[5px] -translate-x-[6px]  group-hover:scale-125 transform duration-300"
              >
                <img src="/jiqi.svg" alt="" />
              </div>
            </div>
            <div
              class="flex-1 rounded-[4px] overflow-hidden relative"
              :class="`${project.rightColorClass1}`"
            >
              <div
                class="absolute left-0 top-0 w-[112px] h-[32px] bg-[url(/as.png)] bg-no-repeat pl-5 leading-8 group-hover:opacity-0"
                 :class="{
              'text-blue-500': !['05','06'].includes(project.id), // 非5、6时用蓝色
              'text-assist': ['05','06'].includes(project.id) // 5、6时用浅灰色
            }"
              >
                {{ project.version }}
              </div>
              <div class="  flex items-center  justify-center px-4  w-full h-full  text-amber-50"
               :class="{
              'text-amber-50': !['05','06'].includes(project.id), // 非5、6时用原有颜色
              'text-assist': ['05','06'].includes(project.id) // 5、6时用灰色
            }"
              >
                {{ project.name }}
              </div>
            </div>
          </div>
          <div
          v-if="['05','06'].includes(project.id)"
        class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span class="text-lg font-medium text-white">努力开发中...</span>
      </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import router from '@/router'
const porjectList = [
  {
    id: '01',
    name: '工作过程系统化教育业务规范管理系统',
    version: '标准版',
    leftcolorClass: 'bg-[#2CA4FF]',
    rightColorClass1: 'bg-gradient-to-r from-[#219DFB] to-[#75C1FB] ',
    address:'http://www.workcourse.top/login'
  },
  {
    id: '02',
    name: '工作过程系统化教育业务规范管理系统',
    version: 'Lite版',
    leftcolorClass: 'bg-[#9CD3FF]',
    rightColorClass1: 'bg-gradient-to-r from-[#9CD3FF] to-[#9CD4FF] ',
    address:'http://lite.workcourse.top/domain/login'
  
  },
  {
    id: '03',
    name: '行动逻辑的教学能力比赛软件',
    version: '标准版',
    leftcolorClass: 'bg-[#8BB3FF]',
    rightColorClass1: 'bg-gradient-to-r from-[#8BB3FF] to-[#BCD0FB] ',
    address:'http://competition.workcourse.top/competition/login'

  },
  {
    id: '04',
    name: '“中国特色高水平高职学校和专业建设计划”项目管理和专家伴随辅导',
    version: '标准版',
    leftcolorClass: 'bg-[#52EAD2]',
    rightColorClass1: 'bg-gradient-to-r from-[#52EAD2] to-[#7AE7F3] ',
    address:'http://high.workcourse.top/login'

  },

  {
    id: '05',
    name: '工作过程系统化课程业务规范管理系统认证平台',
    version: '开发中',
    leftcolorClass: 'bg-[#E6E6E6]',
    rightColorClass1: 'bg-[#E6E6E6]',
    address:''
  },
  {
    id: '06',
    name: '职业教育专业动态调整机制软件',
    version: '开发中',
    leftcolorClass: 'bg-[#E6E6E6]',
    rightColorClass1: 'bg-[#E6E6E6]',
    address:''
  },
]

const handleGoto = (project) => {
  // 开发中项目不执行跳转
  if (['05', '06'].includes(project.id)) {
    return;
  }

  // 验证地址有效性
  if (!project.address) {
    console.warn(`项目 ${project.id} 未配置地址`);
    return;
  }

  // 根据地址类型执行不同跳转方式
  if (project.address.startsWith('http')) {
    // 外部链接：使用window.open打开新窗口
    window.open(project.address, '_blank');
  } else {
    // 内部路由：使用vue-router跳转
    router.push(project.address);
  }
};
</script>

<style scoped>
</style>
