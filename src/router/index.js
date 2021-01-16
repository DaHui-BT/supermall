import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
const Home = () => import('views/home/Home');
const Category = () => import('views/category/Category');
const ShopCart = () => import('views/cart/ShopCart');
const Profile = () => import('views/profile/Profile');

// 1.安装VueRouter
Vue.use(VueRouter)

// 创建路由对象
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/cart',
    component: ShopCart
  },
  {
    path: '/profile',
    component: Profile
  }
]
// 3.创建路由对象
const router = new VueRouter({
  mode: 'history',
  routes
})

// 4.导出
export default router
