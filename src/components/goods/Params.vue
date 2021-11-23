<template>
<div>
<!--  面包屑区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片区域-->
  <el-card class="box-card">
<!--    警告提示-->
    <el-alert
      title="注意:只允许为三级分类设置相关参数"
      type="warning"
      show-icon
      :closable="false">
    </el-alert>
    <el-row class="selectGoodsStyle">
<!--      选择商品分类标题-->
      <el-col :span="3">
        <span>选择商品分类:</span>
      </el-col>
<!--      选择商品的级联框-->
      <el-col :span="21">
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
          v-model="selectCateKeys"
          @change="categoriesChange"
        ></el-cascader>
      </el-col>
    </el-row>
    <!--tab页签区-->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--      添加动态参数的面板-->
      <el-tab-pane label="动态参数"
                   name="many"
                   :disabled="isDisabled"
      >
        <el-button
          type="primary"
          :disabled="isDisabled"
          size="mini"
          @click="addAtrDialogVisible=true"
        >添加参数</el-button>
        <!--        动态参数表格-->
        <el-table :data="manyTabData" border stripe>
          <!--          展开行-->
          <el-table-column type="expand">
            <!--            展开行里面的attrs_vals的tag标签-->
            <template slot-scope="scope">
              <el-tag
                v-for="(item,i) in scope.row.attr_vals"
                :key="i"
                closable
                :disable-transitions="false"
                @close="removeAtrTag(i,scope.row)"
              >
                {{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.addTagInputVisible"
                v-model="scope.row.addAtrTagInputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!--          索引列-->
          <el-table-column type="index"
                           :index="computedIndex"
                           label="#"
          ></el-table-column>
          <!--          参数名称列-->
          <el-table-column label="参数名称"
                           prop="attr_name"
          >
          </el-table-column>
          <!--          操作列-->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--              编辑参数按钮-->
              <el-button type="primary"
                         size="mini"
                         class="el-icon-edit"
                         @click="showEditDialog(scope.row.attr_id)"
              >编辑</el-button>
              <!--              删除参数按钮-->
              <el-button type="danger"
                         size="mini"
                         class="el-icon-delete"
                         @click="removeParams(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
<!--      添加静态属性的面板-->
      <el-tab-pane label="静态属性"
                   name="only"
                   :disabled="isDisabled"
      >
        <el-button
          type="primary"
          :disabled="isDisabled"
          size="mini"
          @click="addAtrDialogVisible=true"
        >
          添加属性</el-button>
        <!--        静态属性表格-->
        <el-table :data="onlyTabDate" border stripe>
          <!--          展开行-->
          <el-table-column type="expand">
            <!--            展开行里面的attrs_vals的tag标签-->
            <template slot-scope="scope">
              <el-tag
                v-for="(item,i) in scope.row.attr_vals"
                :key="i"
                closable
                :disable-transitions="false"
                @close="removeAtrTag(i,scope.row)"
              >
                {{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.addTagInputVisible"
                v-model="scope.row.addAtrTagInputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!--          索引列-->
          <el-table-column type="index"
                           :index="computedIndex"
                           label="#"
          ></el-table-column>
          <!--          参数名称列-->
          <el-table-column label="参数名称"
                           prop="attr_name"
          >
          </el-table-column>
          <!--          操作列-->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--              编辑参数按钮-->
              <el-button type="primary"
                         size="mini"
                         class="el-icon-edit"
                         @click="showEditDialog(scope.row.attr_id)"
              >编辑</el-button>
              <!--              删除参数按钮-->
              <el-button type="danger"
                         size="mini"
                         class="el-icon-delete"
                         @click="removeParams(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
<!--  添加参数的对话框-->
  <el-dialog
    :title="'添加'+attributesTitle"
    :visible.sync="addAtrDialogVisible"
    width="40%"
    @close="addDialogClose"
    >
    <el-form :model="addAtrForm" status-icon
             :rules="atrRules" ref="addAtrRef"
             label-width="100px">
      <el-form-item :label="attributesTitle"
                    prop="attr_name"
      >
        <el-input v-model="addAtrForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addAtrDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
  </el-dialog>
<!--  编辑参数的对话框-->
  <el-dialog
    :title="'编辑'+attributesTitle"
    :visible.sync="editAtrDialogVisible"
    width="40%"
    @close="editDialogClose"
  >
    <el-form :model="editAtrForm" status-icon
             :rules="atrRules" ref="editAtrRef"
             label-width="100px">
      <el-form-item :label="attributesTitle"
                    prop="attr_name"
      >
        <el-input v-model="editAtrForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editAtrDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'Params',
  data(){
    return {
      //所有商品分类数据
      categoriesData:[],
      //级联框记录选择项，将ID存放在这个数组中
      selectCateKeys:[],
      //被激活页的名称
      activeName:'many',
      //判断按钮是否禁用
      isDisabled: true,
      //动态参数信息
      manyTabData:[],
      //静态参数信息
      onlyTabDate:[],
      //控制添加参数对话框的 dialogvisible
      addAtrDialogVisible: false,
      //控制编辑参数对话框的 dialogvisible
      editAtrDialogVisible: false,
      //添加动态参数/静态属性的表单
      addAtrForm:{
        attr_name:''
      },
      //编辑动态参数/静态属性的表单
      editAtrForm:{
        attr_name:''
      },
      //动态静态属性id
      attrId:'',
      //控制添加tag的visible
      addTagInputVisible: false,
      //添加动态参数/静态属性的表单验证规则
      atrRules:{
        attr_name:[{ required: true, message: '输入的值不可以为空', trigger: 'blur' }]
      },
      //添加属性标签的文本输入框的值
      addAtrTagInputValue:''
    }
  },
  created () {
    this.getCategoriesData()
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
    //级联选择框的选择项发送变化时触发此事件
    categoriesChange(){
      //判断用户选择的是不是三层，如果不是强制清空
      if(this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.isDisabled = true
        this.manyTabData=[]
        this.onlyTabDate=[]
      }else {
        //如果选择的不为空，将tab体里面的按钮启用
        this.isDisabled = false
        //发起请求获取参数的数据
        this.getCateParams()
      }
    },
    //tab 页签点击事件的处理函数
    handleTabClick(){
      //发起请求获取参数数据
      this.getCateParams()
    },
    //侦听关闭添加静态 属性/动态参数的dialog框事件
    addDialogClose(){
      this.$refs.addAtrRef.resetFields()
    },
    //侦听关闭编辑静态属性 /动态参数的dialog框事件
    editDialogClose(){
      this.$refs.editAtrRef.resetFields()
    },
    //添加参数提交
    addParams(){
      this.$refs.addAtrRef.validate((valid)=>{
        if(!valid) {
          this.$message({type:'error', message:'未填写数据'})
        }else {
          this.$http.post(`categories/${ this.cateThirdId }/attributes`
          ,{
              attr_name: this.addAtrForm.attr_name,
              attr_sel: this.activeName
            }).then(({data:res})=>{
              if(res.meta.status !== 201) {
                return this.$message.error('添加失败')
              }else {
                this.addAtrDialogVisible = false
                this.getCateParams()
                return this.$message.success('添加成功')
              }
          }).catch((err)=>{
            console.log(err)
          })
        }
      })
    },
    //编辑参数提交
    editParams(){
      this.$refs.editAtrRef.validate((valid)=>{
        if(!valid){
          return this.$message.error('请填写表单的数据哦！')
        }else {
          this.$http.put(`categories/${this.cateThirdId}/attributes/${this.attrId}`,
            {
              attr_name: this.editAtrForm.attr_name,
              attr_sel: this.activeName
            })
            .then(({data:res})=>{
              if(res.meta.status !== 200) {
                return this.$message.error('更新失败')
              }else {
                this.editAtrDialogVisible = false
                this.getCateParams()
                this.$message.success('更新成功')
              }
            }).catch((err)=>{
            console.log(err)
          })
        }
      })
    },
    //删除参数
    removeParams(rid){
      this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${this.cateThirdId}/attributes/${rid}`)
          .then(({data: res})=>{
          if(res.meta.status !== 200){
            return this.$message.error('删除失败！')
          }else {
            this.getCateParams()
            return this.$message.success('删除成功')
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
    //监听展示编辑对话框
    showEditDialog(id){
      this.attrId = id
      this.$http({
        method:'get',
        url:`categories/${this.cateThirdId}/attributes/${id}`,
        params:{
          attr_sel: this.activeName
        }
      }).then(({data: res})=>{
        if(res.meta.status !== 200){
          return this.$message.error('获取参数失败')
        }else {
          this.editAtrDialogVisible = true
          this.editAtrForm = res.data
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    //展示添加tag的input输入框
    showInput(row){
      row.addTagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //鼠标回车或失去焦点添加tag
    handleInputConfirm(row){
      //如果用户输入的为空，那么当失去焦点或者回车后，将输入框清空
      //且隐藏输入框
      if(row.addAtrTagInputValue.trim().length === 0) {
        row.addAtrTagInputValue = ''
        row.addTagInputVisible = false
        return
      }
      //如果不为空就将值存放在attr_vals的数组中
      else {
        row.attr_vals.push(row.addAtrTagInputValue.trim())
        row.addAtrTagInputValue=''
        row.addTagInputVisible = false
        //将数据同步到数据库
        this.updateCateParams(row)
      }
    },
    //删除tag
    removeAtrTag(index,row){
      row.attr_vals.splice(index,1)
      //将数据同步到数据库
      this.updateCateParams(row)
    },
    //将数据同步到数据库的方法
    updateCateParams(row){
      this.$http.put(`categories/${this.cateThirdId}/attributes/${row.attr_id}`,
        {attr_name:row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join()})
        .then(({data: res})=>{
          if(res.meta.status !== 200) {
            return this.$message.error('同步更新到服务器失败')
          }
        }).catch((err)=>{
        console.log(err)
      })
    },
    //发起请求获取商品参数
    getCateParams(){
      this.$http({
        method:'get',
        url:`categories/${this.cateThirdId}/attributes`,
        params: {sel:this.activeName}
      })
        .then(({data: res})=>{
          if(res.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '服务器出小差了',
              showClose: true
            })
            return false
          } else {
            if(this.activeName==='only'){
              //将静态属性穿来的值给onlyTabDate
              this.onlyTabDate = res.data
              res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') :
                  []
                //控制添加tag的input框的打开和隐藏自定义属性
                this.$set(item,'addTagInputVisible',false)
                //tab的input框绑定的数据
                this.$set(item,'addAtrTagInputValue','')
              })
            }else {
              //将动态参数传来的值给manyTableDate
              this.manyTabData = res.data
              res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') :
                  []
                //控制添加tag的input框的打开和隐藏自定义属性
                this.$set(item,'addTagInputVisible',false)
                //tab的input框绑定的数据
                this.$set(item,'addAtrTagInputValue','')
              })
              console.log(this.manyTabData)
            }
          }
        }).catch((err)=> {
        console.log(err)
      })
      }
  },
  computed: {
    //当前选项的三级id的值
    cateThirdId(){
      if(this.selectCateKeys.length === 3) {
        return this.selectCateKeys[this.selectCateKeys.length-1]
      }
    },
    //计算表格的索引
    computedIndex(){
      let i = 1
      return i++
    },
    //添加参数和属性的dialog的标题
    attributesTitle(){
      if(this.activeName==='many') {
        return '动态参数'
      }else {
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped>
.selectGoodsStyle{
  margin: 18px 0;
}
.el-cascader {
  width: 40%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
