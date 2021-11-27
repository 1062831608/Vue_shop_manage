<template>
<div>
<!--  面包屑导航区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片区域-->
  <el-card class="box-card">
<!--    搜索框区域-->
    <el-row :gutter="25">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model.trim="goodsListQeury.query"
          clearable
          @clear="getGoodsList"
        >
          <el-button slot="append" icon="el-icon-search"
                     @click="getGoodsList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="primary"
                   @click="goAddGoodsPage"
        >添加商品</el-button>
      </el-col>
    </el-row>
<!--    表格区域-->
    <el-table
      :data="goodsList"
      stripe
      border
      style="width: 100%;font-size: 10px"
      >
<!--      索引列-->
      <el-table-column
        label="#"
        type="index"
        :index="computedListIndex"
      ></el-table-column>
<!--      商品名称列-->
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="580"
      >
      </el-table-column>
<!--      商品价格列-->
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="120">
      </el-table-column>
<!--      商品重量列-->
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="100"
      >
      </el-table-column>
<!--      创建时间列-->
      <el-table-column
        label="创建时间"
        width="210"
      >
        <template slot-scope="scope">
          {{ scope.row.add_time | datefmt('YYYY MMM Do YY')}}
        </template>
      </el-table-column>
<!--      操作列-->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--        编辑商品按钮-->
          <el-button class="el-icon-edit"
                     type="primary"
                     size="mini"
          ></el-button>
          <!--        删除商品按钮-->
          <el-button class="el-icon-delete"
                     type="danger"
                     size="mini"
                     @click="removeGoodsById(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsListQeury.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="goodsListQeury.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goodsTotal">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'List',
  created(){
    this.getGoodsList()
  },
  data(){
    return {
      //商品列表表格数据源
      goodsList:[],
      //获取商品列表表格的参数
      goodsListQeury:{
        query:'',
        pagenum: 1,
        pagesize: 10
      },
      //全部商品数据的数量
      goodsTotal:0
    }
  },
  methods:{
    //获取所有商品的数据
    getGoodsList(){
      this.$http({
        method:'get',
        url:'goods',
        params: this.goodsListQeury
      })
        .then(({data: res})=>{
          if(res.meta.status !== 200) {
            this.$message.error('服务器出小差了')
          }else {
            this.goodsList = res.data.goods
            this.goodsTotal = res.data.total
          }
        }).catch((err)=>{
        console.log(err)
      })
    },
    //页面放多少条数据发生变化
    handleSizeChange(val){
      this.goodsListQeury.pagesize = val
      this.getGoodsList()
    },
    //页数发生变化时
    handleCurrentChange(val) {
      this.goodsListQeury.pagenum = val
      this.getGoodsList()
    },
    //通过商品的ID来删除商品
    removeGoodsById(id){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //发起删除商品的请求
        this.$http.delete(`goods/${id}`).then(({data:res})=>{
          if(res.meta.status !=200) {
            return this.$message.error('删除失败')
          }else {
            this.$message.success('删除成功')
            this.getGoodsList()
          }
        }).catch((err)=>{
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //跳转到添加商品的页面
    goAddGoodsPage(){
      this.$router.push('/goods/addpage')
    }
  },
  computed:{
    computedListIndex(){
      let i = 1
      return i++
    }
  }
}
</script>

<style scoped>
.box-card {
  height: 600px;
  overflow: auto;
}
.el-pagination{
  margin-top: 30px;
  margin-left: 210px;
}
</style>


