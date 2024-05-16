<template>
  <el-card class="box-card" style="height: 80px">
    <el-form inline class="sForm">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="usernameLike"></el-input>
      </el-form-item>
      <el-form-item label="用户手机号">
        <el-input placeholder="请输入用户手机号" v-model="phoneNumberLike"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="!usernameLike && !phoneNumberLike"
          @click="getUsersByPage()"
          >搜索</el-button
        >
        <el-button type="primary" @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="box-card" style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus" @click="openAddUserForm"
      >新增用户</el-button
    >

    <el-table style="margin: 10px 0px" :data="users" border>
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="用户姓名" prop="username"></el-table-column>
      <el-table-column label="用户头像">
        <template #="{ row }">
          <img :src="`${setting.imageBaseUrl}${row.avatar}`" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" prop="phoneNumber"></el-table-column>
      <el-table-column label="用户性别">
        <template #="{ row }">
          <h2>{{ row.sex ? '男' : '女' }}</h2>
        </template>
      </el-table-column>
      <el-table-column label="用户权限">
        <template #="{ row }">
          <h2>{{ row.vipStatus ? '管理员' : '用户' }}</h2>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="openUpdateUserForm(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="More"
            @click="userStore.toUserInfoPage(row.id)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除用户 ${row.username}`"
            icon="Delete"
            width="200px"
            @confirm="confirmDeleteUser(row.id)"
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
      @size-change="getUsersByPage"
      @current-change="getUsersByPage"
    />
  </el-card>

  <el-dialog v-model="dialogFormVisible" :title="userForm.id ? '修改用户' : '添加用户'">
    <el-form
      style="width: 80%"
      label-position="right"
      label-width="auto"
      :model="userForm"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="用户姓名" prop="username">
        <el-input
          placeholder="请输入用户姓名"
          v-model="userForm.username"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户性别" prop="sex">
        <el-radio-group v-model="userForm.sex">
          <el-radio :value="true">男</el-radio>
          <el-radio :value="false">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户手机号" prop="phoneNumber">
        <el-input
          placeholder="请输入用户手机号"
          v-model="userForm.phoneNumber"
          maxlength="15"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input
          type="password"
          placeholder="请输入用户密码"
          v-model="userForm.password"
          maxlength="15"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="用户年龄" prop="age">
        <el-input type="number" placeholder="请输入用户年龄" v-model="userForm.age"></el-input>
      </el-form-item>
      <el-form-item label="用户头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/file/image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="userForm.avatar"
            :src="`${setting.imageBaseUrl}${userForm.avatar}`"
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

<script setup lang="ts" name="AllUser">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { register, usersByPage, updateUser, deleteUser } from '@/api/user'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/user'
import setting from '@/setting'

let userStore = useUserStore()

let pageNum = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let users = ref<[]>([])
let dialogFormVisible = ref(false)
let userForm = reactive({
  username: '',
  age: '',
  sex: '',
  phoneNumber: '',
  avatar: '',
  password: ''
})
let formRef = ref()
let usernameLike = ref('')
let phoneNumberLike = ref('')

watch(dialogFormVisible, (newValue, oldValue) => {
  if (oldValue) {
    Object.assign(userForm, {
      id: '',
      username: '',
      age: '',
      sex: '',
      phoneNumber: '',
      avatar: '',
      password: ''
    })
  }
})
const getUsersByPage = async (page = 1) => {
  return new Promise((resolve, reject) => {
    pageNum.value = page
    usersByPage(pageNum.value, pageSize.value, usernameLike.value, phoneNumberLike.value)
      .then((r) => {
        total.value = r.total
        users.value = r.data
        resolve('ok')
      })
      .catch((errer) => reject(errer))
  })
}
const resetSearch = () => {
  usernameLike.value = ''
  phoneNumberLike.value = ''
  getUsersByPage()
}
onMounted(() => {
  getUsersByPage()
})
const openAddUserForm = () => {
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('age')
    formRef.value.clearValidate('sex')
    formRef.value.clearValidate('phoneNumber')
    formRef.value.clearValidate('awvatar')
    formRef.value.clearValidate('password')
  })
}
const openUpdateUserForm = (row) => {
  dialogFormVisible.value = true
  Object.assign(userForm, row)
}
const confirmDeleteUser = async (id) => {
  let result = await deleteUser(id)
  if (result.success) {
    ElMessage({
      type: 'success',
      message: '删除用户成功'
    })
    getUsersByPage(users.value.length > 1 ? pageNum.value : pageNum.value - 1)
  }
}
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  await formRef.value.validate()
  let result
  if (userForm.id) {
    result = await updateUser(userForm)
  } else {
    result = await register(userForm)
  }
  if (result.success) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: (userForm.id ? '修改' : '添加') + '用户成功'
    })
    getUsersByPage(userForm.id ? pageNum.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: (userForm.id ? '修改' : '添加') + '用户失败'
    })
  }
}
const beforeAvatarUpload = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('Avatar picture must be JPG/PNG/GIF format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Avatar picture size can not exceed 4MB!')
    return false
  }
  return true
}
const handleAvatarSuccess = (result) => {
  userForm.avatar = result.data
}
const usernameValidator = (rule: any, value: any, callBack: any) => {
  if (value.length) {
    callBack()
  } else {
    callBack(new Error('用户名不能为空'))
  }
}
const ageValidator = (rule: any, value: any, callBack: any) => {
  if (value && value >= 0) {
    callBack()
  } else {
    callBack(new Error('年龄需要大于0'))
  }
}
const passwordValidator = (rule: any, value: any, callback: any) => {
  if (value.length < 5 || value.length > 15) {
    callback(new Error('密码应是5-15位'))
  } else {
    callback()
  }
}
const phoneNumberValidator = (rule: any, value: any, callback: any) => {
  if (value.length == 11) {
    callback()
  } else {
    callback(new Error('手机号应为11位'))
  }
}
const rules = {
  username: [{ required: true, trigger: 'blur', validator: usernameValidator }],
  sex: [{ required: true, message: '请选择用户性别' }],
  age: [{ required: true, trigger: 'blur', validator: ageValidator }],
  phoneNumber: [{ required: true, trigger: 'blur', validator: phoneNumberValidator }],
  avatar: [{ required: true, message: '请上传用户头像' }],
  password: [{ required: true, trigger: 'blur', validator: passwordValidator }]
}
</script>

<style scoped>
.sForm {
  display: flex;
  justify-content: space-between;
}
</style>
