<!-- eslint-disable no-unused-vars -->
<!--  -->
<template>
  <div class="container">
    <div class="avater_img">
      <!-- <img src="../../assets/pkq.jpg" alt="" /> -->
    </div>
    <div>
      <el-form
        label-width="80px"
        class="form"
        :model="info"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input
            prefix-icon="el-icon-user"
            placeholder="enter your username"
            v-model="info.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="******"
            v-model="info.password"
            type="password"
          ></el-input>
        </el-form-item>
        <div class="btns">
          <el-button type="primary" @click="valid">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUsersStore } from '../store/user'
import { storeToRefs } from 'pinia'
export default {
  name: 'loginView',
  setup (props, context) {
    const info = reactive({
      username: '',
      password: ''
    })
    const rules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
      ]
    })
    const loginForm = ref(null)
    const reset = () => {
      loginForm.value.resetFields()
    }
    // 用户属性存储到store
    const store = useUsersStore()
    // eslint-disable-next-line no-unused-vars
    const a = storeToRefs(store)
    // 登录函数
    const router = useRouter()
    const valid = () => {
      loginForm.value.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await axios.post('login', info)
        if (res.meta.status !== 200) {
          return ElMessage.error(res.meta.msg)
        } else {
          const userI = { username: res.data.username, rid: res.data.rid, id: res.data.id }
          window.sessionStorage.setItem('token', res.data.token)
          store.userInfo = userI
          router.push('/home')
          return ElMessage.success('登录成功 successful !')
        }
      })
    }

    onMounted(() => {
      reset()
      valid()
    })

    return {
      info,
      rules,
      loginForm,
      reset,
      valid
    }
  }
}
</script>

<style scoped>
.container {
  width: 450px;
  height: 300px;
  background-color: whitesmoke;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avater_img {
  text-align: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid gray;
  padding: 10px;
  position: absolute;
  left: 50%;
  top: -20%;
  transform: translate(-50%);
}
.avater_img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: white;
  border: 1px solid gray;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.form {
  position: absolute;
  bottom: 10%;
  width: 90%;
  left: 50%;
  transform: translate(-50%);
  box-sizing: border-box;
}
</style>
