<template>
<div>
<!--  面包屑区域-->
  <el-row>
    <el-col :span="20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="4">
      <el-button type="primary"
                 class="closeAddBtn"
                 @click="backGoodsList"
      >取消添加</el-button>
    </el-col>
  </el-row>
<!--  卡片区域-->
  <el-card class="box-card">
    <!--    警告提示-->
    <el-alert
      title="添加商品信息"
      type="info"
      show-icon
      :closable="false"
      center
    >
    </el-alert>
<!--    步骤条区域-->
    <el-steps :space="200" :active="addGoodsStepActiveIndex" finish-status="success"
    align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
<!--    包裹tab栏的表单-->
    <el-form :model="addGoodsInfo"
             :rules="addGoodsRules" ref="addGoodsRef"
             label-position="top"
    >
<!--    tab栏-->
    <el-tabs
      tab-position="left"
      v-model="addGoodsStepActiveName"
      :before-leave="beforeTabsLeave"
      @tab-click="addGoodsTabClick"
    >
<!--      商品基本信息-->
      <el-tab-pane label="基本信息">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addGoodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input type="number" v-model.number="addGoodsInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" v-model.number="addGoodsInfo.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input type="number" v-model.number="addGoodsInfo.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            :options="categoriesData"
            clearable
            :props="{
                  value:'cat_id',
                  label:'cat_name',
                  children:'children',
                  expandTrigger: 'hover',
                  multiple:false
                  }"
            v-model="addGoodsInfo.goods_cat"
            @change="categoriesChange"
          ></el-cascader>
        </el-form-item>
      </el-tab-pane>
<!--      商品参数-->
      <el-tab-pane label="商品参数">
        <el-form-item
          v-for="m in manyParamsData" :key="m.attr_id"
          :label="m.attr_name"
        >
          <el-checkbox-group v-model="m.attr_vals"
          >
            <el-checkbox
              v-for="(a,i) in m.attr_vals" :key="i"
              :label="a" border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
<!--      商品属性-->
      <el-tab-pane label="商品属性">
        <el-form-item
          :label="item.attr_name"
          v-for="item in onlyParamsData"
          :key="item.attr_id"
        >
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
<!--      图片上传-->
      <el-tab-pane label="商品图片">
<!--        Action 表示图片要上传到的API地址-->
        <el-upload
          action="http://127.0.0.1:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :headers="uploadHeader"
          :on-success="handleSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <quill-editor
          ref="myQuillEditor"
          v-model="addGoodsInfo.goods_introduce"
        />
        <el-button type="primary"
                   @click.prevent="submitGoodsInfo"
                   class="submitBtn"
        >添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
      </el-form>
  </el-card>
  <el-dialog
    @close="previewDialogVisible=false"
    :visible.sync="previewDialogVisible"
    width="50%"
    center>
    <img :src="previewPath" alt="">
  </el-dialog>
</div>
</template>

<script>
//引入lodash 深拷贝的包
import _ from 'lodash'

export default {
  name: 'Add',
  created(){
    this.getCategoriesData()
  },
  data(){
    return {
      //tab栏当前项的索引
      addGoodsStepActiveName:'',
      //所有商品分类的数据
      categoriesData:[],
      //添加商品表单的信息
      addGoodsInfo:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        goods_cat:[], //商品分类
        pics:[],   //图片的数组
        goods_introduce:'',  //商品的双向绑定
        attrs:[]
      },
      //添加商品表单的验证规则
      addGoodsRules: {
        goods_name:[
          {required: true, message:'请输入商品名称',trigger:'blur'}
        ],
        goods_price: [
          {required: true, message:'请输入商品价格',trigger:'blur'}
        ],
        goods_weight:[
          {required: true, message:'请输入商品重量',trigger:'blur'}
        ],
        goods_number: [
          {required: true, message:'请输入商品数量',trigger:'blur'}
        ],
        goods_cat: [
          {required: true, message:'请选择商品分类',trigger:'blur'}
        ]
      },
      //动态参数数据
      manyParamsData:[],
      //静态参数数据
      onlyParamsData:[],
      //上传图片时携带的请求头token
      uploadHeader:{
        Authorization: window.sessionStorage.getItem('token')
      },
      //预览图片的地址
      previewPath: '',
      //控制dialog框的打开和取消
      previewDialogVisible: false
    }
  },
  methods:{
    //获取所有商品分类数据
    getCategoriesData () {
      this.$http.get('categories')
        .then(({data: res})=>{
          if( res.meta.status !== 200) {
            this.$message({type:'error',message:'服务器出小差了！',showClose:true})
          }else {
            this.categoriesData = res.data
          }
        })
    },
    //级联选择器数据发生改变
    categoriesChange(){
      if(this.addGoodsInfo.goods_cat.length !== 3) {
        this.addGoodsInfo.goods_cat = []
      }console.log(this.addGoodsInfo)
    },
    //tabs标签页发生之前执行的函数
    beforeTabsLeave(activeName,oldActiveName){
      //第一个tab切换到第二个标签页，条件
      //第一个标签页里面的cascader的值必须是三个
      if(oldActiveName === '0' &&
      this.addGoodsInfo.goods_cat.length !==3) {
        this.$message.error('请填写分类')
        //return false阻止跳转
        return false
      }
    },
    //当点击tab栏切换时调用这个函数
    addGoodsTabClick(){
      //如果要去商品参数这个tabs栏，发起网络请求获取动态参数信息
      if(this.addGoodsStepActiveName === '1') {
        this.$http({
          method:'get',
          url:`categories/${this.addGoodsInfo.goods_cat[2]}/attributes`,
          params: {
            sel: 'many'
          }
        })
        .then(({data: res})=>{
          if(res.meta.status !== 200) {
            this.$message.error('服务器好像出小差了')
          }else {
            res.data.forEach(item=>{
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            })
            this.manyParamsData = res.data
            console.log(this.manyParamsData)
          }
        })
      }else if (this.addGoodsStepActiveName === '2') {
        //如果要去静态属性那个栏，获取静态属性，渲染到页面上
        this.$http({
          method:'get',
          url:`categories/${this.cateThirdId}/attributes`,
          params: {sel:'only'}
        }).then(({data:res})=>{
          if(res.meta.status !== 200) {
            this.$message.error('服务器出小差了')
          }else {
            this.onlyParamsData = res.data
          }
        }).catch((err)=>{
          console.log(err)
        })
      }
    },
    //处理图片预览的函数
    handlePreview(file){
      this.previewDialogVisible =true
      this.previewPath=file.response.data.url
    },
    //处理图片移除时的函数
    handleRemove(file){
      //1.获取将要删除图片的临时路径
      //2.从 pics 数组中，找到这个图片对应的索引值
      //3.使用splice将图片临时路劲从 pics 数组中删除
      const deletePicPath = file.response.data.tmp_path
      const deletePicPathIndex =  this.addGoodsInfo.pics.
      findIndex(item=>item.pic === deletePicPath)
      this.addGoodsInfo.pics.splice(deletePicPathIndex,1)
    },
    //图片上传成功时立马执行的钩子
    handleSuccess(response){
      //拼接一个图片对象，将图片对象push到数组中
      let picObj = { pic: response.data.tmp_path }
      this.addGoodsInfo.pics.push(picObj)
    },
    //添加商品
    submitGoodsInfo(){
      this.$refs.addGoodsRef.validate(
        (valid)=>{
          if(!valid) {
            return this.$message.error('请输入表单信息！')
          }else {
            //执行的业务逻辑
            //将用户填写的分类变为数组
            //lodash _  对象深拷贝方法 cloneDeep(obj)
            const form = _.cloneDeep(this.addGoodsInfo)
            form.goods_cat = form.goods_cat.join(',')
            //处理动态参数
            this.manyParamsData.forEach(item=>{
              const manyObj = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals.join(',')
              }
              this.addGoodsInfo.attrs.push(manyObj)
            })
            //处理静态属性
            this.onlyParamsData.forEach((item)=>{
              const onlyObj = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
              }
              this.addGoodsInfo.attrs.push(onlyObj)
            })
            form.attrs = this.addGoodsInfo.attrs
            //发起请求添加商品
            //商品的名称必须是唯一的
            this.$http.post('goods',form)
            .then(({data: res})=>{
              if(res.meta.status !== 201) {
                return this.$message.error('添加失败了哦！')
              } else {
                this.$message.success('添加成功')
                this.$router.push('/goods')
              }
            }).catch((err)=>{
              console.log(err)
            })
          }
        }
      )
    },
    //点击取消按钮返回添加商品页面
    backGoodsList(){
      this.$router.push('/goods')
    }
  },
  computed:{
    //步骤条当前步骤当前的索引
    addGoodsStepActiveIndex(){
      return this.addGoodsStepActiveName*1
    },
    //当前分类的三级索引
    cateThirdId(){
      return this.addGoodsInfo.goods_cat[2]
    }
  }
}
</script>

<style lang="less">
.el-cascader {
  width: 40%;
}
.el-steps {
  margin: 30px 0;
  .el-step__title{
    font-size: 13px;
  }
}
.el-tabs {
  overflow: auto;
  .el-tabs__item {
    font-weight: 700;
    margin-top: 10px;
  }
  .submitBtn {
    margin-top: 20px;
  }
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.el-dialog {
  img {
    width: 100%;
    height: 100%;
  }
}
.ql-editor {
  height: 300px !important;
}
.closeAddBtn {
  margin-bottom: 5px !important;
}
</style>
