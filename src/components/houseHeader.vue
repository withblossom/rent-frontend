<template>
  <el-card>
    <div class="box" v-if="house.obj">
      <div class="left">
        <p class="status subtitle">
          <span>房产</span>
        </p>
        <img :src="`${setting.imageBaseUrl}${house.obj.avatar}`" class="avatar" />
      </div>
      <div class="right">
        <h2 class="title">{{ house.obj.name }}</h2>
        <el-row class="subtitle">
          <el-col :span="24">
            <changeable-btn
              :arg="index"
              size="small"
              icon="Delete"
              :handle="deleteLabel"
              v-for="(label, index) in house.labels"
              :key="index"
              >{{ label }}</changeable-btn
            >
            <el-button
              type="info"
              size="small"
              icon="Plus"
              @click="dialogFormVisible = true"
            ></el-button>
          </el-col>
          <el-col :span="12"
            >价格：{{ house.obj.price + ' 元/' + units[house.obj.unit].word }}</el-col
          >
          <el-col :span="12">状态：{{ houseStates[house.obj.state].word }}</el-col>
          <el-col :span="12">地点：{{ house.obj.location }}</el-col>
          <el-col :span="12">房东：{{ house.obj.ownerName }}</el-col>
          <el-col :span="24">交易方式：{{ tradingModes[house.obj.tradingMode].word }}</el-col>
          <el-col :span="24">
            <divAndInput
              :init="_profile ? _profile : house.profile"
              :handle="afterEdit"
              title="简介："
            ></divAndInput>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-card>
  <el-dialog title="添加标签" v-model="dialogFormVisible" width="300px">
    <el-form>
      <el-form-item label="标签名">
        <el-input v-model="labelName" maxlength="5"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="confirm(house.obj.id)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="HouseHeader">
import { units, houseStates, tradingModes } from '@/utils/systemConstants'
import { ref, toRef } from 'vue'
import { admitHouseLabel, admitHouseProfile, deleteHouseLabel } from '@/api/house'
import setting from '@/setting'
import changeableBtn from './changeableBtn.vue'
import divAndInput from './divAndInput.vue'

let props = defineProps(['house'])
let house = toRef(props, 'house')
let _profile = ref('')
let dialogFormVisible = ref(false)
let labelName = ref('')

const afterEdit = (value) => {
  admitHouseProfile(house.value.obj.id, 'profile=' + value).then(() => {
    _profile.value = value
  })
}
const confirm = (id) => {
  admitHouseLabel(id, labelName.value).then(() => {
    if (!house.value.labels) {
      house.value.labels = []
    }
    house.value.labels.push(labelName.value)
    labelName.value = ''
    dialogFormVisible.value = false
  })
}
const deleteLabel = (labelNo) => {
  deleteHouseLabel(house.value.obj.id, house.value.labels[labelNo]).then(() => {
    house.value.labels.splice(labelNo, 1)
  })
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  width: 100%;

  .subtitle {
    font-style: italic;
    color: skyblue;
    margin: 10px 0;
  }
  .left {
    width: 10%;
    .status {
      position: relative;
    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
  .right {
    width: 80%;
    margin-left: 40px;

    .title {
      font-size: 40px;
      font-weight: 900;
    }
    .el-col {
      margin: 2px 0;
    }
    .profile {
      overflow-wrap: break-word;
    }
  }
}
</style>
