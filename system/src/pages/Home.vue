<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <!-- <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3689803727,1155650950&fm=26&gp=0.jpg" alt="logo"> -->
        <span>小程序商城后台管理</span>
      </div>
      <el-button type="info" @click="logout">{{text}}</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' :　'200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <el-menu
          :default-active="navState"
          :collapse = "isCollapse"
          :collapse-transition = 'false'
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#222"
          text-color="#fff"
          router
          active-text-color="#409EFF">
          <el-submenu :index="item.id + ''" v-for="item of menuList" :key='item.id'>
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item @click="saveNavState('/' + child.path)" :index="'/' + child.path " v-for="child of item.children" :key='child.id'>
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{child.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script >
  export default  {
    data(){
      return {
        menuList: [
        { authName:'商品管理', id: 1, icon: 'el-icon-s-goods',children: [
          {authName:'商品列表', id: 11, path: 'goodsManager'},]
        },
        { authName:'订单管理', id: 2, icon: 'el-icon-s-order',children: [
          {authName:'订单列表', id: 11, path: 'orderList'},
          // {authName:'订单发货', id: 12, path: 'sendGoods'}
          ]},
        { authName:'小程序管理', id: 3, icon: 'el-icon-s-promotion',children: [
          {authName:'首页图片', id: 31, path: 'banner'},
          // {authName:'发现管理', id: 32, path: 'miniArticle'}
          ]},
        // { authName:'用户管理', id: 4, icon: 'el-icon-user-solid',children: [
        //   {authName:'用户列表', id: 41, path: 'userList'}]},
        { authName:'系统管理', id: 5, icon: 'el-icon-s-tools',children: [
          {authName:'帐号管理', id: 51, path: 'admin'},
          // {authName:'权限管理', id: 52, path: 'goods'}
          ]}
        ],
        text: '退出',
        isCollapse: false,
        navState: sessionStorage.getItem('path')
      }
    },
    methods: {
      logout(){
        localStorage.clear();
        // this.$router.push('/home')
        this.$router.push('/login')
        // alert(1)
      },
      toggleMenu(){
        this.isCollapse = ! this.isCollapse;
      },
      saveNavState(path){
        sessionStorage.setItem('path', path)
        this.navState = path
      }
    }
  }
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #222;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    span {
      margin-right: 15px;
    }
    img {
      height: 60px;
    }
  }
}

.el-aside {
  background-color: #222;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #e8e8e8;
}
.toggle-button {
  background-color: #333;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
</style>