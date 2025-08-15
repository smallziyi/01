<script lang="ts" setup>
import { ref } from 'vue';
import type { UploadChangeParam, UploadFile } from 'ant-design-vue/lib';
import { PlusOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
  maxCount?: number;
  mediaType?: 'image' | 'video' | 'all';
}>();

const emit = defineEmits(['update:fileId', 'delete:fileId', 'update:file']);

const token = sessionStorage.getItem('jwt');
const fileList = ref<any[]>([]);
const previewVisible = ref(false);
const previewUrl = ref('');

// 根据mediaType返回接受的文件类型
const acceptType = computed(() => {
  switch (props.mediaType) {
    case 'image':
      return '.png,.jpg,.jpeg,.svg,.bmp,.webp';
    case 'video':
      return '.mp4,.webm,.ogg,.mov,.m4v';
    default:
      return '.png,.jpg,.jpeg,.svg,.bmp,.webp,.mp4,.webm,.ogg';
  }
});

const handleFileChange = (info: UploadChangeParam<UploadFile<XMLHttpRequest>>) => {
  fileList.value = info.fileList;
  // 只处理上传完成的文件
  if (info.file.status === 'done') {
    if (props.maxCount === 1) {
      console.log(fileList.value);
      if (info.fileList.length > 0 && info.fileList[0].xhr) {
        const file = JSON.parse(info.fileList[0].xhr.response);
        emit('update:fileId', file.id);
        emit('update:file', file);
      }
    } else {
      if (info.fileList.length > 0) {
        const fileList = info.fileList.map((item) => JSON.parse(item.xhr?.response ?? '{}'));
        const fileIds = fileList.map((item) => ({fileId: item.id, fileUrl: ''}));
        emit('update:fileId', fileIds);
      }
    }
  }
};

const handleRemove = (res: any) => {
  if (props.maxCount === 1) {
    emit('update:fileId', undefined);
  } else {
    emit('delete:fileId', res.response.id);
  }
};

const handlePreview = async (file: UploadFile) => {
  previewUrl.value = file.response?.url || file.url;
  previewVisible.value = true;
};
defineExpose({
  fileList
})
</script>

<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      :action="`${$config.file}/upload`"
      :headers="{ authorization: token ?? '' }"
      :accept="acceptType"
      :maxCount="maxCount ?? 1"
      list-type="picture-card"
      @change="handleFileChange"
      @remove="handleRemove"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < (maxCount ?? 1)">
        <plus-outlined />
        <div style="margin-top: 8px">点击上传</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img :src="previewUrl" style="width: 100%" />
    </a-modal>
  </div>
</template>