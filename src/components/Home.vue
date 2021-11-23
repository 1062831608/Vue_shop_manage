<template>
<div class="home">
  <el-container
    class="home-container"
  >
<!--    头部-->
    <el-header
      class="home-head"
      height="10%"
    >
      <div>
        <el-avatar :size="60"
                  >
          <img
            v-if="userSessionName==='admin'"
            src="../assets/heima.png" >
          <img
          v-if="userSessionName==='北木'"
          src="../assets/likeimg/weixintouxiang.jpg" >
          <img
            v-if="userSessionName==='桃子蘸酱油'"
            src="../assets/likeimg/taozijiangyou.jpg" >
        </el-avatar>
        <span>不太正经的电商管理系统</span>
      </div>
      <el-button
        type="info"
        @click="accountExit"
      >退出</el-button>
    </el-header>
    <el-container>
<!--      侧边栏-->
      <el-aside
        :width="asideWidth"
        class="home-aside"
      >
<!--        顶部折叠，展开按钮-->
        <div
          class="toggle-button"
          @click="toggleClick"
        >|&nbsp;|&nbsp;|</div>
<!--        侧边导航栏-->
        <el-menu
          :default-active="indexActive"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333333"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isToggle"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="list.id+''"
            v-for="list in menuList"
            :key="list.id"
          >
<!--            一级菜单-->
            <template slot="title">
<!--              图标-->
              <i
                :class="firstMenuIconList[list.id]"
              ></i>
              <span>{{ list.authName }}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item-group
              v-for="l in list.children"
              :key="l.id"
            >
              <el-menu-item
                :index="'/'+l.path"
                @click="setNavSecondActive('/'+l.path)"
              >
                <i class="el-icon-menu"></i>
                <span>{{ l.authName }}</span>
                </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      主体部分-->
      <el-main
        class="home-main"
      >
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
export default {
  name: 'Home',
  created(){
    this.getMenuList()
    //将创建home之后将 session 拿出来 复值给 indexActive
    this.indexActive = window.sessionStorage.getItem('activePath')
  },
  data(){
    return {
      menuList: [],  //动态渲染导航栏数据
      firstMenuIconList: {
      '125': 'el-icon-user-solid',
      '103': 'el-icon-s-help',
      '101': 'el-icon-s-goods',
      '102': 'el-icon-s-order',
      '145': 'el-icon-s-data'
      },
      asideWidth: '200px',
      isToggle: false,    //控制左侧导航栏展开还是折叠
      indexActive: '',
    }
  },
  methods:{
    //退出账号，清空 token
    accountExit(){
      this.$confirm('此操作将退出当前帐号，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });
    },
    handleOpen(key,keypath){
      console.log(key,keypath)
    },
    handleClose(key,keypath){
      console.log(key,keypath)
    },
    //获取导航栏数据
    async getMenuList(){
      const {data: res} = await this.$http.get('menus')
      this.menuList = res.data
    },
    //点击展开收起导航栏
    toggleClick(){
      this.isToggle = !this.isToggle
      if(this.isToggle) {
        this.asideWidth = '64px'
      }else{
        this.asideWidth = '200px'
      }
    },
    //点击二级菜单，将路径存到 session中
    setNavSecondActive(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.indexActive = activePath
    }
  },
  computed:{
    userSessionName(){
      return window.sessionStorage.getItem('uName')
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  .home-container {
    width: 100%;
    height: 100%;
  }
}
.home-head {
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: #333333;
  div {
    display: flex;
    justify-content: space-between;
    width: 23%;
    height: 100%;
    img {
      height: 100%;
    }
    span {
      transform: translateY(25%);
      color: #ffffff;
      font-size: 20px;
    }
  }
  button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-10%,-50%);
    height: 50%;
    line-height: 50%;
  }
}
.home-aside {
  background-color: #333333;
  .el-menu {
    border-right: none;
  }
  //展开关闭导航栏按钮
  .toggle-button{
    width: 100%;
    background-color: #000;
    text-align: center;
    color: #ffffff;
    line-height: 40px;
    font-size: 20px;
    cursor: pointer;
  }
}
.home-main {
  background-color: #eaedf1;
  height: 100%;
  overflow: auto;
}
</style>
