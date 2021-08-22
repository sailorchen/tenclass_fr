import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/user/Roles.vue'
import Permissions from '../components/user/Permissions.vue'
import '../assets/css/global.css'
import axios from 'axios'
Vue.use(VueRouter)
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:7000/first/api/v1'
// 配置拦截器
axios.interceptors.request.use(config =>{
  console.log(config)
 // 最后必须返回config
  config.headers.token = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome',component: Welcome },
      { path: '/users',component: Users },
      { path: '/roles',component: Roles },
      { path: '/permissions',component: Permissions }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // next 是一个函数，代表放行
  // from 代表从哪个路径过来
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
