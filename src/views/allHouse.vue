<template>
  <el-card class="box-card" style="height: 80px">
    <el-form inline class="sForm">
      <el-form-item label="房产名">
        <el-input placeholder="请输入房产名" v-model="housenameLike"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="houseState" placeholder="选择状态" style="width: 240px">
          <el-option
            v-for="state in houseStates"
            :key="state.id"
            :label="state.word"
            :value="state.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="!housenameLike && !houseState && houseState != '0'"
          @click="reqHousesPage()"
          >搜索</el-button
        >
        <el-button type="primary" @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="box-card" style="margin: 10px 0">
    <el-button type="primary" icon="Plus" @click="openAddHouseForm">新增房产</el-button>

    <el-table style="margin: 10px 0px" :data="houses" border>
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="房产名" prop="name"></el-table-column>
      <el-table-column label="房产图片">
        <template #="{ row }">
          <img :src="`${setting.imageBaseUrl}${row.avatar}`" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="发布者姓名">
        <template #="{ row }">
          <el-button type="success" link @click="userStore.toUserInfoPage(row.owner)">{{
            row.ownerName
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="房产地址" prop="location"></el-table-column>
      <el-table-column label="状态">
        <template #="{ row }">
          <span>{{ houseStates[row.state].word }} </span>
        </template>
      </el-table-column>
      <el-table-column label="交易方式">
        <template #="{ row }">
          <span>{{ tradingModes[row.tradingMode].word }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="openUpdateHouseForm(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="More"
            @click="houseStore.toHouseInfoPage(row.id)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除房产 ${row.name}`"
            icon="Delete"
            width="200px"
            @confirm="confirmDeleteHouse(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 4, 5, 6]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="reqHousesPage"
      @current-change="reqHousesPage"
    />
  </el-card>

  <el-dialog v-model="dialogFormVisible" :title="houseForm.id ? '修改房产' : '添加房产'">
    <el-form
      style="width: 80%"
      label-position="right"
      label-width="auto"
      :model="houseForm"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="房产名" prop="name">
        <el-input placeholder="请输入房产名" v-model="houseForm.name"></el-input>
      </el-form-item>
      <el-form-item label="发布者" prop="owner">
        <el-select
          v-model="houseForm.owner"
          placeholder="选择发布者"
          style="width: 240px"
          value-key="username"
        >
          <el-option
            v-for="user in usersForSelect"
            :key="user.id"
            :label="user.username"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房产价格" prop="price">
        <el-input type="number" placeholder="请输入房产价格" v-model="houseForm.price"></el-input>
      </el-form-item>
      <el-form-item label="时间单位" prop="unit">
        <el-select v-model="houseForm.unit" placeholder="选择时间单位" style="width: 240px">
          <el-option v-for="unit in units" :key="unit.id" :label="unit.word" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="房产地址" prop="location">
        <el-input placeholder="请输入房产地址" v-model="houseForm.location"></el-input>
      </el-form-item>
      <el-form-item label="房产图片" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/file/image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="houseForm.avatar"
            :src="`${setting.imageBaseUrl}${houseForm.avatar}`"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AllHouse">
import { nextTick, onMounted, ref, reactive, watch } from 'vue'
import { getHousesPage, updateHouse, deleteHouse, addHouse } from '@/api/house'
import { ElMessage } from 'element-plus'
import { units, houseStates, tradingModes } from '@/utils/systemConstants'
import { allUsersForSelect } from '@/api/user'
import useHouseStore from '@/store/house'
import useUserStore from '@/store/user'
import setting from '@/setting'

let userStore = useUserStore()
let houseStore = useHouseStore()

let pageNum = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let houses = ref<[]>([])
let dialogFormVisible = ref(false)
let houseForm = reactive({
  name: '',
  price: '',
  unit: '',
  location: '',
  owner: '',
  avatar: '',
  state: '',
  tradingMode: ''
})
let formRef = ref()
let housenameLike = ref('')
let houseState = ref('')
let usersForSelect = reactive([])

watch(dialogFormVisible, (newValue, oldValue) => {
  if (oldValue) {
    Object.assign(houseForm, {
      id: '',
      name: '',
      price: '',
      unit: '',
      location: '',
      owner: '',
      avatar: '',
      state: '',
      tradingMode: ''
    })
  }
})
const reqHousesPage = async (page = 1) => {
  return new Promise((resolve, reject) => {
    pageNum.value = page
    getHousesPage(pageNum.value, pageSize.value, housenameLike.value, houseState.value)
      .then((r) => {
        total.value = r.total
        houses.value = r.data
        resolve('ok')
      })
      .catch((errer) => reject(errer))
  })
}
onMounted(() => {
  reqHousesPage()
  allUsersForSelect().then((r) => {
    usersForSelect = r.data
  })
})
const resetSearch = () => {
  reqHousesPage()
  housenameLike.value = ''
  houseState.value = ''
}
const openAddHouseForm = () => {
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('price')
    formRef.value.clearValidate('unit')
    formRef.value.clearValidate('owner')
    formRef.value.clearValidate('location')
    formRef.value.clearValidate('avatar')
  })
}
const openUpdateHouseForm = (row) => {
  dialogFormVisible.value = true
  Object.assign(houseForm, row)
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('price')
    formRef.value.clearValidate('location')
    formRef.value.clearValidate('avatar')
  })
}
const confirmDeleteHouse = (id) => {
  deleteHouse(id).then((r) => {
    if (r.success) {
      ElMessage({
        type: 'success',
        message: '删除房产成功'
      })
      reqHousesPage(houses.value.length > 1 ? pageNum.value : pageNum.value - 1)
    }
  })
}
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  await formRef.value.validate()
  let result
  if (houseForm.id) {
    result = await updateHouse(houseForm)
  } else {
    result = await addHouse(houseForm)
  }
  if (result.success) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: (houseForm.id ? '修改' : '添加') + '房产成功'
    })
    await reqHousesPage(houseForm.id ? pageNum.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: (houseForm.id ? '修改' : '添加') + '房产失败'
    })
  }
}
const beforeAvatarUpload = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('Avatar picture size can not exceed 4MB!')
    return false
  }
  return true
}
const handleAvatarSuccess = (result) => {
  houseForm.avatar = result.data
}
const nameValidator = (rule: any, value: any, callBack: any) => {
  if (value.length) {
    callBack()
  } else {
    callBack(new Error('房产名不能为空'))
  }
}
const priceValidator = (rule: any, value: any, callBack: any) => {
  if (value && value >= 0) {
    callBack()
  } else {
    callBack(new Error('价格需要大于等于0'))
  }
}
const locationValidator = (rule: any, value: any, callBack: any) => {
  if (value.length) {
    callBack()
  } else {
    callBack(new Error('房产地址不能为空'))
  }
}
const rules = {
  name: [{ required: true, trigger: 'blur', validator: nameValidator }],
  owner: [{ required: true, message: '请选择发布者' }],
  price: [{ required: true, trigger: 'blur', validator: priceValidator }],
  unit: [{ required: true, message: '请选择时间单位' }],
  avatar: [{ required: true, message: '请选择房产图片' }],
  location: [{ required: true, trigger: 'blur', validator: locationValidator }]
}
</script>

<style scoped>
.sForm {
  display: flex;
  justify-content: space-between;
}
</style>
