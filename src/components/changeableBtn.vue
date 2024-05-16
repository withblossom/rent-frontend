<template>
  <el-button v-if="flag" :size="size" :type="type" @click="flag = false">
    <slot></slot>
  </el-button>
  <el-button
    v-else
    :type="type"
    :size="size"
    @mouseleave="flag = true"
    @click="handle(arg)"
    :icon="icon"
  >
    <slot></slot
  ></el-button>
</template>

<script setup lang="ts" name="ChangeableBtn">
import { ref } from 'vue'

withDefaults(
  defineProps<{ arg: any; type?: String; icon: String; size?: String; handle: Function }>(),
  {
    type: () => 'info'
  }
)
let flag = ref(true)
</script>
