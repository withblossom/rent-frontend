<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginUser" :rules="rules" ref="loginForm">
          <h1>Hello</h1>
          <h2>{{ setting.title }}</h2>
          <el-form-item prop="phoneNumber">
            <el-input prefix-icon="User" v-model="loginUser.phoneNumber" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              prefix-icon="Lock"
              v-model="loginUser.password"
              maxlength="15"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Login">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import useUserStore from '@/store/user'
import setting from '@/setting'

let userStore = useUserStore()
let loginUser = reactive({ phoneNumber: '', password: '' })
let $router = useRouter()
let $route = useRoute()
let loading = ref(false)
let loginForm = ref()

const checkPhonenum = (rule: any, value: any, callback: any) => {
  if (value.length != 11) {
    callback(new Error('手机号应为11位'))
  } else {
    callback()
  }
}
const checkPassword = (rule: any, value: any, callback: any) => {
  if (value.length < 5 || value.length > 15) {
    callback(new Error('密码应是5-15位'))
  } else {
    callback()
  }
}
const rules = {
  phoneNumber: [{ required: true, trigger: 'blur', validator: checkPhonenum }],
  password: [{ required: true, trigger: 'blur', validator: checkPassword }]
}
async function login() {
  await loginForm.value.validate()
  loading.value = true
  userStore
    .userLogin(loginUser)
    .then(() => {
      const redirect: any = $route.query.redirect
      $router.push({ path: redirect || '/' })
      ElNotification({
        type: 'success',
        message: '登录成功'
      })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/default-background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
