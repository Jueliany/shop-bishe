import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import GoodsManager from '../pages/view/GoodsManager.vue'
import Welcome from '../pages/view/Welcome.vue'
import OrderList from '../pages/view/OrderList.vue'
import Banner from '../pages/view/Banner.vue'
import UserList from '../pages/view/UserList.vue'
import Admin from '../pages/view/Admin.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children: [
      { path: '/welcome', component: Welcome},
      { path: '/goodsManager', component: GoodsManager},
      { path: '/orderList', component: OrderList},
      { path: '/banner', component: Banner},
      { path: '/admin', component: Admin},
      { path: '/userList', component: UserList}]
  }
]

const router = new VueRouter({
  routes
})

//
router.beforeEach((to, from, next) => {
  if(to.path ==='/login') return next();
  const token = window.localStorage.getItem('token');
  if(!token) return next('/login');
  return next();
});

export default router
