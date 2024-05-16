<template>
  <div>
    <HouseHeader :house="house"></HouseHeader>
    <Rents :rents="rents"></Rents>
    <Comments :handle="handle"></Comments>
  </div>
</template>

<script setup lang="ts" name="HouseInfo">
import { getHouseInfo } from '@/api/house'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { commentsByHouseId } from '@/api/comment'
import { rentsByHouseId } from '@/api/rent'
import HouseHeader from '@/components/houseHeader.vue'
import Comments from '@/components/comments.vue'
import Rents from '@/components/rents.vue'

let $route = useRoute()
let house = ref({})
let rents = ref([])
const houseId = $route.query.houseId

onMounted(() => {
  getHouseInfo(houseId).then((r) => {
    house.value = r.data
  })
  rentsByHouseId(houseId).then((r) => {
    rents.value = r.data
  })
})
const handle = async () => {
  return new Promise((resolve, reject) => {
    commentsByHouseId(houseId)
      .then((r) => {
        return resolve(r.data)
      })
      .catch((errer) => reject(errer))
  })
}
</script>
