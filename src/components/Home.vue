<template>
    <!-- <div>
        <el-button type="primary" @click="logout">退出</el-button>
    </div> -->
    <el-container class="home_container">
    <el-header>
        <div style="line-height: 80px; text-align: center;margin-left:30px;">
            <img src="../assets/index_logo.png" alt="" style="width:120px;">
            <!-- <span>十方教育</span> -->
        </div>
        <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
        <el-aside :width="collapse ? '64px':'200px'">
            <!-- 侧边栏区域 -->
            <!-- 实现展开功能 -->
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- default-active 菜单激活的路径 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#1E90FF" unique-opened :collapse="collapse" :collapse-transition="false" :default-active="activePath" router>
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{ item.menuName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+submenu.path" v-for="submenu in item.children" :key="submenu.id" @click="saveNavState('/'+submenu.path)">
                 <i class="el-icon-menu"></i>
            <span>{{ submenu.subName }}</span>
            </el-menu-item>
            </el-submenu>
        </el-menu>
        </el-aside>
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>
</template>
<script>
export default {
    // 数据区域
    data () {
        return {
            menuList: [],
            // 图标对应类
            iconsObj: {
                '114': 'el-icon-user',
                '115': 'el-icon-s-goods'
            },
            // 是否折叠
            collapse: false,
            // 被激活的链接地址
            activePath: ''
        }
    },
// 生命周期，进入调用
created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
},
  // 退出登录
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    async getMenuList(){
       const { data: res } = await this.$http.get('menus')
       if (res.code !== 200) return this.$message.error('获取菜单失败')
       this.menuList = res.data
    },
    // 菜单的折叠与展开
    toggleCollapse (){
        this.collapse = !this.collapse
    },
    saveNavState (activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #fff;
    >div{
         display: flex;
        justify-content: space-between;
        padding-left: 0px;
        align-items: center;
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        // 去掉右侧的边框线
        border-right: none;
    }
}
.el-main {
    background-color: #eaedf1;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 24px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>