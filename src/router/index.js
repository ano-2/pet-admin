import { createRouter, createWebHashHistory } from 'vue-router'

const Home = () =>
  import(/* webpackChunkName: "home" */ '../views/Home.vue')
const Welcome = () =>
  import(/* webpackChunkName: "Welcome" */ '../components/welcome/welcome.vue')

const Users = () =>
  import(/* webpackChunkName: "Users" */ '../components/sideLists/users.vue')

const Goods = () =>
  import(/* webpackChunkName: "Goods" */ '../components/sideLists/goods.vue')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/goods',
        component: Goods
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')

  // 确定是否登录(有token)
  if (!token) {
    next('/login')
  } else {
    next()
  }
})
export default router
