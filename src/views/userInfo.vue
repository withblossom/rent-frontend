<template>
  <div style="width: auto">
    <UserHeader :user="user"></UserHeader>
    <Rents :rents="rents"></Rents>
    <Comments :handle="handle"></Comments>
  </div>
</template>

<script setup lang="ts" name="UserInfo">
import { getUserInfo } from '@/api/user'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { rentsByUserId } from '@/api/rent'
import { commentsByUserId } from '@/api/comment'
import UserHeader from '@/components/userHeader.vue'
import Comments from '@/components/comments.vue'
import Rents from '@/components/rents.vue'

let $route = useRoute()
let user = ref({})
let rents = ref([])
const userId = $route.query.userId

onMounted(() => {
  getUserInfo(userId).then((r) => {
    user.value = r.data
  })
  rentsByUserId(userId).then((r) => {
    rents.value = r.data
  })
})

const handle = async () => {
  return new Promise((resolve, reject) => {
    commentsByUserId(userId)
      .then((r) => {
        return resolve(r.data)
      })
      .catch((errer) => reject(errer))
  })
}
</script>
