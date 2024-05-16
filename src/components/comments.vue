<template>
  <el-card>
    <p class="subtitle">评论区</p>
    <el-card v-for="(comment, index) in comments" :key="comment.id">
      <houseComment
        :comment="comment"
        :index="index"
        :deleteHandle="deleteHandle"
        :updateHandle="updateHandle"
      ></houseComment>
    </el-card>
  </el-card>
</template>

<script setup lang="ts" name="Comments">
import { onMounted, ref } from 'vue'
import { deleteComment, updateComment } from '@/api/comment'
import houseComment from '@/components/houseComment.vue'

const { handle } = defineProps(['handle'])
let comments = ref([])

onMounted(() => {
  handle().then((r) => {
    comments.value = r
  })
})
const deleteHandle = (id, index) => {
  deleteComment(id).then(() => {
    comments.value.splice(index, 1)
  })
}
const updateHandle = (id, comment, index) => {
  updateComment(id, 'comment=' + comment).then(() => {
    comments.value[index].comment = comment
  })
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
