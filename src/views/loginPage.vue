<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
      <header class="header-title">
          <span class="linear-gradient-text">
              PPLove
          </span>
      </header>
      <div class="left">
          <el-carousel :interval="2000" type="scroll-x">
              <el-carousel-item v-for="slide in slides" :key="slide.id">
                  <img :src="(slide.img)" :alt="slide.alt" />
              </el-carousel-item>
          </el-carousel>
      </div>
      <div class="right">
          <div class="login-wrapper">
              <div class="header">Sign in to PPLove</div>
              <el-form
                  label-width="80px"
                  class="form"
                  :model="info"
                  :rules="rules"
                  ref="loginForm"
                  label-position="top"
              >
                  <div class="form-wrapper">
                      <el-form-item prop="username">
                          <input type="text" v-model="info.username" placeholder="username" class="input-item">
                      </el-form-item>
                      <el-form-item prop="password">
                          <input type="password" v-model="info.password" placeholder="password" class="input-item">
                      </el-form-item>
                      <button type="button" class="btn" @click="valid">Login in</button>
                  </div>
                  <div class="msg">
                      Don't have account?
                      <a>Sign up</a>
                  </div>
              </el-form>
          </div>
          <div class="login-back"></div>
      </div>
      <footer>present by group xxxx</footer>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUsersStore } from '../store/user'
import { storeToRefs } from 'pinia'

const slides = ref([
  { id: 1, img: require('@/assets/images/img1.jpg'), alt: 'image1' },
  { id: 2, img: require('@/assets/images/img2.jpg'), alt: 'image2' },
  { id: 3, img: require('@/assets/images/img3.jpg'), alt: 'image3' },
  { id: 4, img: require('@/assets/images/img4.jpg'), alt: 'image4' }
])

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
storeToRefs(store)
// 登录函数
const router = useRouter()
const valid = () => {
  loginForm.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    const { data: res } = await axios.post('login', info)
    if (res.meta.status !== 200) {
      console.log(res.meta)
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
</script>

<style scoped>
.container {
display: flex;
flex-direction: row;
height: 100vh;
width: 100vw;
margin: 0;
padding: 0;
background: linear-gradient(to right, #fbc2eb, #a6c1ee);
z-index: -5;
overflow: hidden;
}

.header-title {
font-family: Calibri, sans-serif;
font-size: 30px;
font-weight: bold;
text-align: left;
padding: 20px;
}

.linear-gradient-text {
background: linear-gradient(to right, red, blue);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
}
.left {
width: 40%;
flex: 1;
background-size: cover;
background-position: center;
margin: 0;
padding: 0;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
overflow: hidden;
}
.left .el-carousel {
width: 100%;
}

.left img {
width: 100%;
height: 100%;
object-fit: cover;
}

.right {
width: 60%;
position: relative;
}
.login-wrapper {
    background-color: #fff;
    width: 358px;
    height: 588px;
    border-radius: 15px;
    padding: 0 50px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}
.login-back{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 540px;
    height: 470px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.319);
    z-index: 0;
}

.header {
    font-size: 38px;
    font-weight: bold;
    text-align: center;
    line-height: 200px;
}
.input-item {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    border: 0;
    padding: 10px;
    border-bottom: 1px solid rgb(128, 125, 125);
    font-size: 15px;
    outline: none;
}
.input-item:placeholder {
    text-transform: uppercase;
}
.input-item:focus{
    border-bottom: 3px solid rgb(128, 125, 125);
}
.btn {
    text-align: center;
    padding: 10px;
    width: 100%;
    margin-top: 40px;
    background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
    background-size: 200%;
    color: #fff;
}
.btn:hover{
    font-weight: bold;
}
.msg {
    text-align: center;
    line-height: 88px;
}
a {
    text-decoration-line: none;
    color: #abc1ee;
    transition: all .3s ease-in-out;
}
a:hover {
    color: #747bff;
}
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all .5s ease-in-out;
  outline: none;
}
button::after,
button:active{
    outline:0;
    outline: none;
    border-color: transparent;
    box-shadow:none;
}
button:hover {
    background-position-x: 100%;
    transform:translateY(-5px) ;
}
/* button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
} */
footer{
    height: 25px;
    width: 100vw;
    position: absolute;
    bottom: 0;
    line-height: 25px;
    text-align: center;
    color: #fff;
}
</style>
