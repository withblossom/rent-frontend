<template>
  <el-row>
    <el-col :span="24">
      <div class="header">
        用户
        <el-button type="success" link @click="userStore.toUserInfoPage(comment.userId)"
          >"{{ comment.username }}"</el-button
        >
        => 房产<el-button type="success" link @click="houseStore.toHouseInfoPage(comment.houseId)"
          >"{{ comment.houseName }}"</el-button
        >
      </div>
    </el-col>
    <el-col :span="24" style="margin: 10px 0px">
      <divAndInput :init="comment.comment" :handle="afterEdit" title="评论："></divAndInput>
    </el-col>
    <el-col :span="12">
      <el-popconfirm
        title="确定删除该条评论"
        icon="Delete"
        width="200px"
        @confirm="deleteHandle(comment.id, index)"
      >
        <template #reference>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-popconfirm>
    </el-col>
    <el-col :span="12">
      <span>{{ comment.createTime }}</span>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="Comments">
import { toRef } from 'vue'
import divAndInput from './divAndInput.vue'
import useUserStore from '@/store/user'
import useHouseStore from '@/store/house'

let props = defineProps(['comment', 'deleteHandle', 'updateHandle', 'index'])
let comment = toRef(props, 'comment')
let houseStore = useHouseStore()
let userStore = useUserStore()

const afterEdit = (value) => {
  if (value && value != comment.value.comment) {
    props.updateHandle(comment.value.id, value, props.index)
  }
}
</script>

<style scoped lang="scss">
.subtitle {
  font-style: italic;
  color: skyblue;
  margin-bottom: 10px;
}
.header {
  font-size: large;
  color: red;
}
.content {
  font-style: italic;
  color: skyblue;
}
</style>
