<template>
<div>
  <!--  面包屑区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片区域-->
  <el-card class="box-card">
<!--    添加分类按钮-->
    <el-row>
      <el-col :span="24">
        <el-button type="primary"
                   class="addBtn"
                   @click="showAddCategories"
        >添加分类</el-button>
<!--        添加分类的dialog-->
        <el-dialog
          title="添加分类"
          :visible.sync="addCategoriesDiaLogVisible"
          width="40%"
          @close="addCategoriesDialogClose"
          >
          <el-form label-width="130px"
                   :model="addCategoriesForm"
          ref="addCategoriesRef"
          :rules="addCategoriesRules">
            <el-form-item
              label="分类名称："
              prop="cat_name"
            >
              <el-input v-model="addCategoriesForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
<!--              props级联选择器的配置对象-->
<!--              v-model级联选择器选中的id数组-->
              <el-cascader
                :options="categoriesTwoData"
                clearable
                :props="{
                  value:'cat_id',
                  label:'cat_name',
                  children:'children',
                  expandTrigger: 'hover',
                  multiple:false,
                  checkStrictly:true
                  }"
                v-model="selectKeys"
                @change="selectCateChange"
                ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
    <el-button @click="addCategoriesDiaLogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>
      </el-col>
    </el-row>
<!--    表格部分-->
 <tree-table
   :data="categoriesData"
   :columns="categoriesColumns"
   :selection-type="false"
   :expand-type="false"
   :show-index="true"
   index-text="#"
   border
   show-row-hover
 >
<!--   是否有效列-->
   <template slot="isEffect" slot-scope="scope">
     <i :class="['el-icon-success','green']"
        v-if="!scope.row.cat_deleted"
     ></i>
     <i :class="['el-icon-error','red']"
        v-if="scope.row.cat_deleted"
     ></i>
   </template>
<!--   排序-->
   <template slot="categoriesLevel" slot-scope="scope">
     <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
     <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
     <el-tag type="danger" v-else="scope.row.cat_level==2">三级</el-tag>
   </template>
<!--   操作-->
   <template slot="operate" slot-scope="scope">
     <el-button type="primary" class="el-icon-edit"
                size="mini" @click="showCategoriesDialog(scope.row.cat_id)"
     >编辑</el-button>
<!--     编辑弹出来的dialog-->
     <el-dialog
       title="修改名称"
       :visible.sync="editCategoriesDialogVisible"
       width="40%"
       >
       <span>不好意思，该模块暂时出现了一丢丢问题！返回不了哦，
         你自己刷新去</span>
       <span slot="footer" class="dialog-footer">
    <el-button @click="editCategoriesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCategoriesDialogVisible = false">确 定</el-button>
  </span>
     </el-dialog>
     <el-button type="danger" class="el-icon-delete"
                size="mini" @click="deleteCategories(scope.row)"
     >删除</el-button>
   </template>
 </tree-table>
<!--    分页部分-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="categoriesInfo.pagenum"
      :page-size="8"
      layout=" prev, pager, next"
      :total="firstTableTotal">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Categories',
  created(){
    this.getCategoriesData()
  },
  data(){
    return {
      cat_name:[],
      //获取表格所有参数发送的信息
      categoriesInfo:{
        pagenum: 1,
        pagesize: 8
      },
      //商品分类表格所有的数据
      categoriesData:[],
      //商品分类表格前两层的数据
      categoriesTwoData:[],
      //一级表格的total
      firstTableTotal:0,
      //表格的columns 配置
      categoriesColumns: [
         {
          label: '分类名称',
          prop: 'cat_name',
          width: '250px',
         },
        {
          label:'是否有效',
          width: '250px',
          //将当前列定义为模板列
          type:'template',
          //模板列的名称
          template:'isEffect'
        },
        {
          label:'排序',
          width: '250px',
          type:'template',
          template:'categoriesLevel'
        },
        {
          label:'操作',
          width: '250px',
          type:'template',
          template:'operate'
        }
      ],
      //控制添加分类的dialog
      addCategoriesDiaLogVisible:false,
      //控制编辑的dialog
      editCategoriesDialogVisible:false,
      //添加分类的表单
      addCategoriesForm:{
        //父级分类ID
        cat_pid:0,
        //将要添加的分类的名称
        cat_name:'',
        //默认要添加分类的等级，一级
        cat_level:0
      },
      //添加分类表单的验证规则
      addCategoriesRules: {
        cat_name: [
          { required: true, message: '填写分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
      },
      //级联选择器选择的ID
      selectKeys:[],

    }
  },
  methods:{
    //获取商品表格所有的数据
    getCategoriesData(){
      this.$http({
        method: 'get',
        url:'categories',
        params: this.categoriesInfo
      }).then(({data: res})=>{
        if(res.meta.status != 200) {
          this.$message({type:'error',message:'服务器出小差了',showClose:true})
          return false
        }else {
          this.categoriesData = res.data.result
          this.firstTableTotal = res.data.total
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    //获取商品表格前两层的数据
    getCategoriesTwoData(){
      this.$http({
        method: 'get',
        url:'categories',
        params: {type:2}
      }).then(({data: res})=>{
        if(res.meta.status != 200) {
          this.$message({type:'error',message:'服务器出小差了',showClose:true})
          return false
        }else {
          this.categoriesTwoData = res.data
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    //第几页的数据发生改变
    handleCurrentChange(newCurrentPage){
      this.categoriesInfo.pagenum = newCurrentPage
      this.getCategoriesData()
    },
    //点击展开添加分类的对话框
    showAddCategories(){
      this.addCategoriesDiaLogVisible = true
      this.getCategoriesTwoData()

    },
    //级联选择器选项发生变化，触发这个事件
    selectCateChange(){
      //判断层级，当层级为0 时，level 和 pid 都为 0
      if(this.selectKeys.length === 0) {
        //父类的id
        this.addCategoriesForm.cat_pid = 0
        //层级
        this.addCategoriesForm.cat_level = 0
        return
      }
      //判断当不为0时，select的数组长度判断层级
      else {
        //选的的父类层级ID
        this.addCategoriesForm.cat_pid=
          this.selectKeys[this.selectKeys.length-1]
        //当前的层级
        this.addCategoriesForm.cat_level=this.selectKeys.length
      }
    },
    //提交添加分类表单触发此事件
    addCate(){
      //表单验证规则的校验
      this.$refs.addCategoriesRef.validate((valid)=>{
        if(!valid) {
          this.$message({type:'error',message:'发生错误了o！'})
        }else {
          this.$http.post('categories',this.addCategoriesForm)
          .then(({data:res})=>{
            if(res.meta.status !== 201) {
              this.$message({type:'error',message:'添加失败'})
              return
            }else {
              this.$message({type:'success',message:'添加成功'})
              this.addCategoriesDiaLogVisible = false
              this.getCategoriesData()
            }
          }).catch((err)=>{
            console.log(err)
          })
        }
      })
    },
    //监听分类dialog关闭事件,重置表单引用
    addCategoriesDialogClose(){
      this.$refs.addCategoriesRef.resetFields()
      this.selectKeys=[]
      this.addCategoriesForm.cat_level=0
      this.addCategoriesForm.cat_pid=0
    },
    //编辑当前行的名字
    showCategoriesDialog(id){
      this.editCategoriesDialogVisible = true
    },
    //删除当前行的操作
    deleteCategories(row){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${ row.cat_id }`)
        .then(({data: res})=>{
          if(res.meta.status !== 200) {
            this.$message({type:'error',message:'删除失败'})
          }else {
            this.$message({type:'success', message:'删除成功'})
            this.getCategoriesData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  computed:{
    //计算表格索引
    categoriesIndex(){
      let index = 1
      return index++
    }
  }
}
</script>

<style scoped>
.el-button{
  margin:5px 20px;
}
.green {
  color: #30dc30;
}
.red {
  color: red;
}
.el-pagination{
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%,100%);
  width: 300px;
}
.el-card {
  position: relative;
  height: 600px;
  overflow: auto;
}
.addBtn {
  margin-bottom: 25px;
}
.el-cascader {
  width: 100%;
}
</style>
