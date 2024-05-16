<template>
  <el-card class="box-card" style="height: 80px">
    <el-form inline class="sForm">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="usernameLike"></el-input>
      </el-form-item>
      <el-form-item label="用户手机号">
        <el-input placeholder="请输入用户手机号" v-model="phoneNumberLike"></el-input>
      </el-form-item>
      <el-form-item label="房产名">
        <el-input placeholder="请输入房产名" v-model="houseNameLike"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="!usernameLike && !phoneNumberLike && !houseNameLike"
          @click="getRentsPage()"
          >搜索</el-button
        >
        <el-button type="primary" @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="box-card" style="margin: 10px 0">
    <el-button type="primary" @click="openAddRentForm">添加交易信息</el-button>

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
      <el-table-column label="交易方式">
        <template #="{ row }">
          <span>{{ tradingModes[row.tradingMode].word }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="openUpdateRentForm(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除序号 ${$index + 1} 租赁信息?`"
            icon="Delete"
            width="200px"
            @confirm="confirmDeleteRent(row.id)"
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
      @size-change="getRentsPage"
      @current-change="getRentsPage"
    />
  </el-card>

  <el-dialog v-model="dialogFormVisible" :title="(rentForm.id ? '修改' : '添加') + '交易信息'">
    <el-form
      style="width: 80%"
      label-position="right"
      label-width="auto"
      :model="rentForm"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="用户" prop="userId">
        <el-select
          v-model="rentForm.userId"
          placeholder="选择用户"
          style="width: 240px"
          :disabled="rentForm.id ? true : false"
        >
          <el-option
            v-for="item in usersForSelect"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房产" prop="houseId">
        <el-select
          @change="selectChange"
          v-model="rentForm.houseId"
          placeholder="选择房产"
          style="width: 240px"
          :disabled="rentForm.id ? true : false"
        >
          <el-option
            v-for="item in housesForSelect"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间" prop="startTime">
        <el-input
          v-model="rentForm.startTime"
          type="datetime-local"
          :disabled="rentForm.id ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易方式" required>
        <el-select
          v-model="houseForSelectChange.tradingMode"
          placeholder="选择交易方式"
          style="width: 240px"
          disabled
        >
          <el-option
            v-for="tradingMode in tradingModes"
            :key="tradingMode.id"
            :label="tradingMode.word"
            :value="tradingMode.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="持续时间" prop="time">
        <el-input v-model="rentForm.time" type="number" :disabled="rentForm.unit === 4"></el-input>
      </el-form-item>
      <el-form-item label="时间单位" required>
        <el-select
          v-model="houseForSelectChange.unit"
          placeholder="选择时间单位"
          style="width: 240px"
          disabled
        >
          <el-option v-for="unit in units" :key="unit.id" :label="unit.word" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="rentForm.totalPrice" type="number" placeholder="元"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="rentForm.state" placeholder="选择状态" style="width: 240px">
          <el-option
            v-for="state in rentStates"
            :key="state.id"
            :label="state.word"
            :value="state.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原因">
        <el-input v-model="rentForm.reason" type="test" placeholder="请输入原因"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="RentInfo">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { deleteRent, rent, rentsPage, updateRentById } from '@/api/rent'
import { ElMessage } from 'element-plus'
import { allUsersForSelect } from '@/api/user'
import { allHousesForSelect, getHouse } from '@/api/house'
import { rentStates, tradingModes, units } from '@/utils/systemConstants'
import useUserStore from '@/store/user'
import useHouseStore from '@/store/house'

let houseStore = useHouseStore()
let userStore = useUserStore()

let pageNum = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let rents = ref<[]>([])
let usernameLike = ref('')
let phoneNumberLike = ref('')
let houseNameLike = ref('')
let dialogFormVisible = ref(false)
let rentForm = reactive({
  userId: '',
  houseId: '',
  startTime: '',
  time: '',
  totalPrice: computed({
    get: () => {
      if (houseForSelectChange.unit === 4) {
        return houseForSelectChange.price
      }
      return rentForm.time * Number.parseInt(houseForSelectChange.price)
    },
    set: (value) => {
      if (houseForSelectChange.unit === 4) {
        houseForSelectChange.price = value
      }
      houseForSelectChange.price = (value / rentForm.time).toString()
    }
  }),
  state: '',
  reason: ''
})
let houseForSelectChange = reactive({
  price: '',
  unit: '',
  tradingMode: ''
})
let usersForSelect = reactive([])
let housesForSelect = reactive([])
let formRef = ref()

watch(dialogFormVisible, (newValue, oldValue) => {
  if (oldValue) {
    Object.assign(rentForm, {
      id: '',
      userId: '',
      houseId: '',
      startTime: '',
      time: '',
      price: '',
      state: '',
      reason: ''
    })
  }
})
const selectChange = () => {
  getHouse(rentForm.houseId).then((result) => {
    Object.assign(houseForSelectChange, result.data)
  })
}
const getRentsPage = async (page = 1) => {
  return new Promise((resolve, reject) => {
    pageNum.value = page
    rentsPage(
      pageNum.value,
      pageSize.value,
      usernameLike.value,
      phoneNumberLike.value,
      houseNameLike.value
    )
      .then((r) => {
        total.value = r.total
        rents.value = r.data
        resolve('ok')
      })
      .catch((errer) => reject(errer))
  })
}
const resetSearch = () => {
  getRentsPage()
  usernameLike.value = ''
  phoneNumberLike.value = ''
  houseNameLike.value = ''
}
onMounted(() => {
  getRentsPage()
  allUsersForSelect().then((r) => {
    usersForSelect = r.data
  })
  allHousesForSelect().then((r) => {
    housesForSelect = r.data
  })
})
const confirmDeleteRent = async (id) => {
  let result = await deleteRent(id)
  if (result.success) {
    ElMessage({
      type: 'success',
      message: '删除租赁信息成功'
    })
    getRentsPage(rents.value.length > 1 ? pageNum.value : pageNum.value - 1)
  }
}
const openAddRentForm = () => {
  Object.assign(houseForSelectChange, {
    price: '',
    unit: '',
    tradingMode: ''
  })
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value?.clearValidate('userId')
    formRef.value?.clearValidate('houseId')
    formRef.value?.clearValidate('startTime')
    formRef.value?.clearValidate('time')
  })
}
const openUpdateRentForm = (row) => {
  Object.assign(rentForm, row)
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value.clearValidate('userId')
    formRef.value.clearValidate('houseId')
    formRef.value.clearValidate('startTime')
    formRef.value.clearValidate('time')
  })
}
const cancel = () => {
  dialogFormVisible.value = false
}
const timeValidator = (rule: any, value: any, callBack: any) => {
  if (value > 0) {
    callBack()
  } else {
    callBack(new Error('时间需要大于0'))
  }
}
const rules = {
  time: [{ required: true, trigger: 'blur', validator: timeValidator }],
  userId: [{ required: true, trigger: 'change', message: '请输入用户' }],
  houseId: [{ required: true, trigger: 'change', message: '请输入房产' }],
  startTime: [{ required: true, trigger: 'blur', message: '请输入交易时间' }]
}
const confirm = async () => {
  if (rentForm.unit != 4) {
    await formRef.value.validate()
  } else {
    await formRef.value.validateField(['userId', 'houseId', 'startTime'])
  }
  let result
  if (rentForm.id) {
    result = await updateRentById(rentForm)
  } else {
    result = await rent(rentForm)
  }
  if (result.success) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: (rentForm.id ? '修改' : '添加') + '租赁信息成功'
    })
    getRentsPage(rentForm.id ? pageNum.value : 1)
  }
}
</script>

<style scoped>
.sForm {
  display: flex;
  justify-content: space-between;
}
</style>
