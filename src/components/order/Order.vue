<template>
<div>
  <!--  面包屑区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--  卡片区域-->
  <el-card class="box-card">
<!--    输入检索框区域-->
    <el-input
      placeholder="请输入内容"
      class="query-input-style"
      v-model.trim="queryOrderInfo.query"
      clearable
      @clear="getOrderData"
    >
      <el-button slot="append" icon="el-icon-search"
                 @click="getOrderData"
      ></el-button>
    </el-input>
<!--    表格区域-->
    <el-table
      :data="orderData"
      stripe
      border
      style="width: 100%"
    >
<!--      索引列-->
      <el-table-column
        label="#"
        type="index"
        :index="computedIndex"
      ></el-table-column>
<!--      订单编号列-->
      <el-table-column
        label="订单编号"
        prop="order_number"
        width="500px"
      ></el-table-column>
<!--      订单价格列-->
      <el-table-column
        label="订单价格"
        prop="order_price"
      ></el-table-column>
<!--      是否付款列-->
      <el-table-column
        label="是否付款"
      >
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_status*1===0">未付款</el-tag>
          <el-tag type="success" v-if="scope.row.pay_status*1!==0">已付款</el-tag>
        </template>
      </el-table-column>
<!--      是否发货列-->
      <el-table-column
        label="是否发货"
        prop="is_send"
      ></el-table-column>
<!--      下单时间列-->
      <el-table-column
        label="下单时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.create_time | datefmt('YYYY MMM Do YY') }}
        </template>
      </el-table-column>
<!--      操作列-->
      <el-table-column
        label="操作"
      >
<!--        编辑按钮-->
        <el-button type="primary"
                   class="el-icon-edit"
                   size="mini"
                   @click="editOrderBtn"
        ></el-button>
        <el-button class="el-icon-location-outline"
                   size="mini"
                   type="success"
                   @click="showProgress"
        ></el-button>
      </el-table-column>
    </el-table>
<!--    分页部分-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryOrderInfo.pagenum*1"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="queryOrderInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="orderTotal">
    </el-pagination>
  </el-card>
<!--  编辑的dialog弹出框-->
  <el-dialog
    title="添加地址"
    :visible.sync="editDialogVisible"
    width="50%"
    @close="addressDialogClose"
    >
    <el-form :model="addressFormData" status-icon
             :rules="addressFormRules" ref="addressFormRef" label-width="100px">
<!--      普通地址-->
      <el-form-item label="省市区/县" prop="selectCateKeys">
        <el-cascader
          :options="citydata"
          clearable
          :props="{
                  value:'value',
                  label:'label',
                  children:'children',
                  expandTrigger: 'hover',
                  multiple:false
                  }"
          v-model="addressFormData.selectCateKeys"
        ></el-cascader>
      </el-form-item>
<!--      详细地址-->
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="addressFormData.detailAddress"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>
<!--  显示物流进度的dialog弹出框-->
  <el-dialog
    title="物流进度"
    :visible.sync="progressDialogVisible"
  >
    大大
  </el-dialog>
</div>
</template>

<script>
//导入城市的数据
import citydata from './citydata'

export default {
  name: 'Order',
  created () {
    this.getOrderData()
  },
  data(){
    return {
      //获取订单发送的数据列表
      queryOrderInfo: {
        query: '',
        pagenum: '1',
        pagesize: 3
      },
      //服务端返回的订单数据
      orderData: [],
      //服务端返回的数据总数
      orderTotal: 0,
      //控制编辑dialog框弹出的 visible
      editDialogVisible: false,
      //控制物流进度dialog 对话框 的 visible
      progressDialogVisible: false,
      //全国各地的地址
      citydata,
      //地址的表单数据
      addressFormData: {
        selectCateKeys: [], //级联选择框的值
        detailAddress: ''   //详细的地址
      },
      //地址的表单验证规则
      addressFormRules:{
        detailAddress: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        selectCateKeys: [
          {required:true, message:'请填写省市区/县', trigger: blur}
        ]
      }
    }
  },
  methods:{
    //获取订单数据
    getOrderData(){
      this.$http({
        method:'get',
        url:'orders',
        params:this.queryOrderInfo
      }).then(({data: res})=>{
        if(res.meta.status !== 200) {
          return this.$message.error('服务器出小差了哦')
        }else {
          this.orderData = res.data.goods
          this.orderTotal = res.data.total //全部的数据数
        }
      })
    },
    //当前页码发生了变化
    handleSizeChange(newPageSize){
      this.queryOrderInfo.pagesize = newPageSize
      this.getOrderData()
    },
    //页面的显示多少条数据发生变化
    handleCurrentChange(newCurrentPage){
      this.queryOrderInfo.pagenum = newCurrentPage
      this.getOrderData()
    },
    //编辑订单按钮
    editOrderBtn(){
      this.editDialogVisible = true
    },
    //地址dialog栏关闭后重置表单
    addressDialogClose(){
      this.$refs.addressFormRef.resetFields()
    },
    //弹出展示物流进度的对话框
    showProgress(){
      this.progressDialogVisible = true
    }
  },
  computed:{
    // 用来计算表格前头索引的
    computedIndex(){
      let i = 1
      return i++
    }
  }
}
</script>

<style scoped>
.query-input-style {
  width: 40%;
}
.el-cascader {
  width: 100%;
}
</style>
