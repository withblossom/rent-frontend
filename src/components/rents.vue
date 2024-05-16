<template>
  <el-card>
    <p class="subtitle">交易记录</p>
    <el-table style="margin: 10px 0px" :data="rents" border>
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="用户姓名">
        <template #="{ row }">
          <el-button type="success" link @click="userStore.toUserInfoPage(row.userId)">{{
            row.username
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" prop="phoneNumber"></el-table-column>
      <el-table-column label="房产名">
        <template #="{ row }">
          <el-button type="success" link @click="houseStore.toHouseInfoPage(row.houseId)">{{
            row.houseName
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="交易时间" prop="startTime"></el-table-column>
      <el-table-column label="时长">
        <template #="{ row }">
          <span>{{ (row.time ? row.time : '') + units[row.unit].word }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额(元)" prop="totalPrice"></el-table-column>
      <el-table-column label="状态">
        <template #="{ row }">
          <span>{{ rentStates[row.state].word }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因">
        <template #="{ row }">
          <h2 style="color: red; font-style: italic">
            {{ row.reason ? row.reason : '无' }}
          </h2>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts" name="Comments">
defineProps(['rents'])

import { rentStates, units } from '@/utils/systemConstants'
import useUserStore from '@/store/user'
import useHouseStore from '@/store/house'

let houseStore = useHouseStore()
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.subtitle {
  font-style: italic;
  color: skyblue;
  margin-bottom: 10px;
}
</style>
