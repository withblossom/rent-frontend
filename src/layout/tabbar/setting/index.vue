<template>
  <el-button size="small" icon="Refresh" circle @click="layoutSettingStore.refresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreenToggle"></el-button>
  <el-button
    size="small"
    icon="Setting"
    circle
    @click="layoutSettingStore.openSettingPage"
  ></el-button>
  <img
    :src="`${setting.imageBaseUrl}${userStore.avatar}`"
    style="width: 24px; height: 24px; margin: 0 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      <span>{{ userStore.username }}</span>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="Setting">
import useLayoutSettingStore from '@/store/layoutSetting'
import useUserStore from '@/store/user'
import setting from '@/setting'
import router from '@/router'

let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()

const fullScreenToggle = () => {
  let isFullSreen = document.fullscreenElement
  if (!isFullSreen) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
const logout = () => {
  userStore.logout().then(() => router.replace({ name: 'login' }))
}
</script>
