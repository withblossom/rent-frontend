<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div v-if="flag">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>

  <el-drawer v-model="layoutSettingStore.settingPage" direction="rtl">
    <template #header>
      <h2 style="font-size: larger">系统设置</h2>
    </template>
    <template #default>
      <el-row>
        <el-col :span="8">
          <div>
            <span>浏览器缓存 : </span>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <el-button size="small" type="warning" @click="layoutSettingStore.removeBrowserCache"
              >清除</el-button
            >
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>服务器一级缓存 : </span>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <el-button size="small" type="warning" @click="layoutSettingStore.removeCaffeineCache"
              >清除</el-button
            >
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>服务器二级缓存 : </span>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <el-button size="small" type="warning" @click="layoutSettingStore.removeRedisCache"
              >清除</el-button
            >
          </div>
        </el-col>
      </el-row>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="layoutSettingStore.closeSettingPage">取消</el-button>
        <el-button type="primary" @click="layoutSettingStore.closeSettingPage">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts" name="Main">
import { nextTick, ref, watch } from 'vue'
import useLayoutSettingStore from '@/store/layoutSetting'

let layoutSettingStore = useLayoutSettingStore()

let flag = ref(true)

watch(
  () => layoutSettingStore.refresh_flag,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  }
)
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
.el-col {
  margin: 3px 0px;
}
</style>
