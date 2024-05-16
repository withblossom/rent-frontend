<template>
  <div class="tabbar">
    <div class="left_tabbar">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="right_tabbar">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tabbar">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .left_tabbar {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .right_tabbar {
    display: flex;
    align-items: center;
  }
}
</style>
