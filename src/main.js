import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import ElementPlus from 'element-plus'
import axios from './axios/index'
import { createPinia } from 'pinia'

import './assets/css/global.css'

const app = createApp(App)
installElementPlus(app)
app.use(router).use(createPinia()).use(ElementPlus).mount('#app')

app.config.globalProperties.$http = axios
