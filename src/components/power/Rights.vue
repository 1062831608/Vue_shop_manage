<template>
  <div class="usersBox">
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片-->
    <el-card
      class="box-card"
      style="height: 610px;overflow: auto"
    >
      <el-table
        ref="filterTable"
        style="width: 100%"
        :border="true"
        :data="rightsData"
        :stripe="true"
      >
        <el-table-column
          type="index"
          :index="rightsTableIndex"
          label="#"
          width="70"
        >
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="390">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="400">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
          width="394"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level=='0'">一级</el-tag>
            <el-tag v-if="scope.row.level=='1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level=='2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  created () {
    this.getRightsList()
  },
  data(){
    return{
      rightsData:[],
    }
  },
  methods: {
    //获取权限列表表单数据
    getRightsList(){
      this.$http({
        method: 'get',
        url: 'rights/list'
      }).then(({data: res})=>{
        if(res.meta.status != 200) {
          this.$message({
            type: 'error',
            message: '服务器好像开小差了哦！'
          })
        }else {
          console.log(res)
          this.rightsData = res.data
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
  },
  computed:{
    rightsTableIndex(){
      let i = 1
      return i++
    }
  }
}
</script>

<style scoped>
.el-tag{
  width: 15%;
  text-align: center;
  /*margin-left: 25%;*/
}
</style>
