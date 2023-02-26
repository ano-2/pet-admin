import { createRouter, createWebHashHistory } from 'vue-router'

const Home = () =>
  import(/* webpackChunkName: "home" */ '../views/Home.vue')
const Welcome = () =>
  import(/* webpackChunkName: "Welcome" */ '../components/welcome/welcome.vue')

const Users = () =>
  import(/* webpackChunkName: "Users" */ '@/views/User.vue')

const Goods = () =>
  import(/* webpackChunkName: "Goods" */ '@/views/good/Goods.vue')

const Cate = () =>
  import(/* webpackChunkName: "Cate" */ '@/views/good/Cate.vue')

const AddGood = () =>
  import(/* webpackChunkName: "Cate" */ '@/views/good/Add.vue')

const Rights = () =>
  import(/* webpackChunkName: "Right" */ '@/views/right/Rights.vue')

const Role = () =>
  import(/* webpackChunkName: "Right" */ '@/views/right/Role.vue')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "loginPage" */ '../views/loginPage.vue')
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
      },
      {
        path: '/addGood',
        component: AddGood
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Role
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
