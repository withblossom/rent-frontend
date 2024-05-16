<template>
  <el-row>
    <el-col :span="2">{{ title }}</el-col>
    <el-col :span="22" @click="toEdit">
      <el-input
        ref="editFrom"
        v-if="flag"
        v-model="_value"
        @blur="toLook"
        type="textarea"
        maxlength="200"
        autosize
        show-word-limit
      ></el-input>
      <div v-else style="overflow-wrap: break-word">" {{ init }} "</div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="DivAndInput">
import { nextTick, ref } from 'vue'

let { handle, init } = defineProps(['handle', 'init', 'title'])
let flag = ref(false)
let _value = ref(init)
let editFrom = ref()

const toEdit = () => {
  flag.value = true
  nextTick(() => {
    editFrom.value.focus()
  })
}
const toLook = () => {
  if (_value.value && _value.value != init) {
    handle(_value.value)
  }
  flag.value = false
}
</script>
