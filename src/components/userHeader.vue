<template>
  <el-card>
    <div class="box" v-if="user.obj">
      <div class="left">
        <p class="status subtitle">
          <span>{{ user.obj.vipStatus ? '系统管理员' : '用户' + user.obj.id }}</span>
        </p>
        <img :src="`${setting.imageBaseUrl}${user.obj.avatar}`" class="avatar" />
      </div>
      <div class="right">
        <h2 class="title">{{ user.obj.username }}</h2>
        <el-row class="subtitle">
          <el-col :span="24">
            <div>
              <changeable-btn
                :arg="index"
                size="small"
                icon="Delete"
                :handle="deleteLabel"
                v-for="(label, index) in user.labels"
                :key="index"
                >{{ label }}</changeable-btn
              >
              <el-button
                type="info"
                size="small"
                icon="Plus"
                @click="dialogFormVisible = true"
              ></el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div>性别：{{ user.obj.sex ? '男' : '女' }}</div>
          </el-col>
          <el-col :span="12">
            <div>年龄：{{ user.obj.age }}</div>
          </el-col>
          <el-col :span="24">
            <div>联系方式：{{ user.obj.phoneNumber }}</div>
          </el-col>
          <el-col :span="24">
            <divAndInput
              :init="_profile ? _profile : user.profile"
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
      <el-button type="primary" @click="confirm(user.obj.id)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="UserHeader">
import { ref, toRef } from 'vue'
import { admitUserLabel, admitUserProfile, deleteUserLabel } from '@/api/user'
import setting from '@/setting'
import changeableBtn from './changeableBtn.vue'
import divAndInput from './divAndInput.vue'

let props = defineProps(['user'])
let user = toRef(props, 'user')
let _profile = ref('')
let dialogFormVisible = ref(false)
let labelName = ref('')

const confirm = (id) => {
  admitUserLabel(id, labelName.value).then(() => {
    if (!user.value.labels) {
      user.value.labels = []
    }
    user.value.labels.push(labelName.value)
    labelName.value = ''
    dialogFormVisible.value = false
  })
}
const deleteLabel = (labelNo) => {
  deleteUserLabel(user.value.obj.id, user.value.labels[labelNo]).then(() => {
    user.value.labels.splice(labelNo, 1)
  })
}
const afterEdit = (value) => {
  admitUserProfile(user.value.obj.id, 'profile=' + value).then(() => {
    _profile.value = value
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
  }
}
</style>
