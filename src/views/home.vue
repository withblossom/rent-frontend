<template>
  <el-card>
    <div class="box">
      <img :src="`${setting.imageBaseUrl}${userStore.avatar}`" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ userStore.username }}</h3>
        <p class="subtitle">{{ setting.title }}</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <img src="/home.jpg" style="width: 100%" />
  </div>
</template>

<script setup lang="ts" name="Home">
import useUserStore from '@/store/user'
import setting from '@/setting'

let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
      margin-bottom: 15px;
    }
  }
}
</style>
