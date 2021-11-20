<template>
<div>
<!--  面包屑区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片区域-->
  <el-card>
<!--    搜索和添加用户框-->
    <el-row :gutter="28">
      <el-col :span="9">
        <!--    搜索框-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query"
                  clearable @clear="getUserList"
        >
          <el-button slot="append" icon="el-icon-search"
                     @click="getUserList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <!--    添加用户按钮-->
        <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
<!--        添加用户弹出输入框-->
        <el-dialog title="请输入用户信息" :visible.sync="dialogFormVisible" width="500px">
          <el-form :model="addUserData"
                   :rules="addFromRules"
                   ref="addFormRef"
          >
            <el-form-item label="用户名：" prop="username">
              <el-input v-model.trim="addUserData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model.trim="addUserData.password" autocomplete="off"
              type="password" show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="addUserData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号："  prop="mobile">
              <el-input v-model="addUserData.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" @click="addUserInfo">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>

<!--    用户列表表格-->
    <el-table
      :data="userList"
      border
      style="width: 100%"
      stripe
    >
      <el-table-column
        label="#"
        width="50"
        type="index"
        :index="indexMethods"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="183"
      >
      </el-table-column>
      <el-table-column
      prop="email"
      label="邮箱"
      width="210"
    >
    </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="180"
      >
      </el-table-column>
<!--      用户状态开关-->
      <el-table-column
        prop="mg_state"
        label="状态"
        width="130"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
<!--      操作-->
      <el-table-column
        label="操作"
        width="300"
      >
        <template slot-scope="scope">
<!--          修改用户邮箱和手机号-->
          <el-button
            type="primary"
           icon="el-icon-edit"
            size="mini"
            @click="showUpdateUserData(scope.row)"
          ></el-button>
<!--          表单提交用户修改信息表单-->
          <el-dialog
            title="修改信息"
            :visible.sync="dialogUpdateVisible"
            width="40%"
          >
            <el-form ref="updateUserRef"
                     :model="updateUserForm"
                     label-width="80px"
                     :rules="updateUserRules"
            >
              <el-form-item label="用户名">
                <el-input
                  :placeholder="updateUserName"
                  :disabled="true">
                </el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="updateUserForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="updateUserForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="closeUpdateDialog">取 消</el-button>
    <el-button type="primary" @click="updateUserInfo(scope.row)">确 定</el-button>
  </span>
          </el-dialog>
<!--          删除用户-->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUser(scope.row)"
          ></el-button>
<!--          给用户分配角色-->
           <el-tooltip
             class="item"
             effect="light"
             content="分配角色"
             placement="top"
             :enterable="false"
             :open-delay="500"
           >
             <el-button
               type="warning"
               icon="el-icon-s-help"
               size="mini"
               @click="showSetUserDialog(scope.row)"
             ></el-button>
           </el-tooltip>
          <el-dialog
            title="分配角色"
            :visible.sync="setUserRolesDialogVisible"
            width="50%"
            >
            <el-row>
              <el-col :span="24">
                <p>当前用户：{{ currentUserInfo.username }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <p>当前角色：{{ currentUserInfo.role_name }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><p>选择角色：</p></el-col>
              <el-col :span="20">
                <el-select
                  v-model="selectRulesId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in getRolesData"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setUserRolesDialogVisible = false">取 消</el-button>
<!--              设置用户角色-->
    <el-button type="primary" @click="setUserRoles">确 定</el-button>
  </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
<!--    分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3,5,7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal">
    </el-pagination>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Users',
  created () {
    this.getUserList()
  },
  data () {
    //rule 验证规则，value 验证的值， callback() 成功后调用
    //验证 email 的验证规则
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱不可以为空'))
      } else {
        let reg = /^([a-zA-Z0-9])+(([a-zA-Z0-9])|([._-][a-zA-Z0-9])*)+@([a-zA-Z0-9-])+((\.[a-zA-Z0-9-]{2,3}){1,2})$/
        if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      }
    }
    const validateMobile = (rule, value, callback)=>{
      if (value === '') {
        callback(new Error('手机号不可以为空'))
      }else {
        let reg=/^1[3-9]\d{9}$/
        if(!reg.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      //get请求管理员数据，携带的url
      queryInfo: {
        query: '', //查询参数，搜索功能携带此参数
        pagenum: 1,  //第几页
        pagesize: 3  //一个几个数据
      },
      //服务器传来的管理员名单
      userList: [],
      //总共有几页数据
      pageTotal: 0,
      //判断添加用户框dialog打开或者关闭
      dialogFormVisible: false,
      //更新用户信息dialog控制
      dialogUpdateVisible: false,
      //添加用户表单验证规则
      addFromRules:{
        username:[
          { required: true, message: '用户名不可以为空', trigger: 'blur' },
          { min: 1, max: 8, message: '用户名长度不可以超过8个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '密码不可以为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度为8到16位', trigger: 'blur' }
        ],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur'}]
      },
      //更新用户表单验证规则
      updateUserRules: {
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        mobile: [{ required: true, validator: validateMobile, trigger: 'blur'}]
      },
      //添加用户提交的数据
      addUserData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //更新用户提交的表单数据
      updateUserForm:{
        id: null,
        email: '',
        mobile: ''
      },
      //修改当前数据的用户名
      updateUserName: '张三',
      //控制分配用户角色的dialog
      setUserRolesDialogVisible: false,
      //当前用户的信息
      currentUserInfo:{},
      //角色的信息
      getRolesData:[],
      //选择的角色的值
      selectRulesId:''
    }
  },
  methods: {
    //发送 ajax 请求获取user数据
    getUserList () {
      this.$http({
        url: '/users',
        method: 'get',
        params: this.queryInfo
      }).then(({ data: res }) => {
        if (res.meta.status != 200) return this.$message.error('获取用户列表失败')
        this.userList = res.data.users
        this.pageTotal = res.data.total
      }).catch((err) => {
        console.log(err)
      })
    },
    //表格头部索引
    indexMethods (index) {
      return index + 1
    },
    //一页里面存放多少值发生改变
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    //第几页的数据发生改变
    handleCurrentChange(newCurrentPage){
      this.queryInfo.pagenum = newCurrentPage
      this.getUserList()
    },
    //当开关状态改变，触发事件
    changeUserStatus(userinfo){
      this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      .then(({ data: res })=>{
        if(res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          this.$message({
            message: '修改用户状态失败',
            type: 'error',
            showClose:true
          })
          return false
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    //提交用户信息，添加用户
    addUserInfo(){
      //要是表单提交返回的是 真 执行 message 确认环节
        this.$refs.addFormRef.validate((valid)=> {
          if (!valid) {
            this.$message({
              type: 'error',
              message: '请填写表单内容',
              showClose: true
            })
            return
          } else {
            //执行确认环节
            this.$confirm('确认添加管理员吗', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
              center: true
            }).then(() => {
              this.dialogFormVisible = false
              this.$http({
                method: 'post',
                url: 'users',
                data: this.addUserData
              })
                .then(({ data: res }) => {
                  if (res.meta.status !== 201) {
                    this.$message({
                      type: 'error',
                      message: '添加失败',
                      showClose: true
                    })
                  } else {
                    this.$message({
                      type: 'success',
                      message: '添加成功!',
                      showClose: true
                    })
                    this.resetForm()
                    this.getUserList()
                  }
                }).catch((err) => {
                console.log(err)
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '您已取消添加',
                showClose: true
              })
              this.resetForm()
            })
          }
        })
    },
    //修改用户的邮箱手机号信息
    updateUserInfo(userid){
      this.$refs.updateUserRef.validate((valid)=>{
        if(!valid) {
          this.$message({type:'error',message:'修改用户信息失败，请检查格式是否正确'})
        } else {
          this.$http.put(`users/${userid.id}`,{
            email: this.updateUserForm.email,
            mobile: this.updateUserForm.mobile
          })
            .then(({ data : res })=>{
            if(res.meta.status != 200) {
              this.$message({
                type:'error',
                message:'服务器出小差了哦！',
                showClose: true
              })
            }else {
              this.$message({
                type: 'success',
                message: '更新成功',
                showClose: true
              })
              this.closeUpdateDialog()
              this.getUserList()
            }
          }).catch((err)=>{
            console.log(err)
          })
        }
      })
    },
    //展开dialog对话框
    showUpdateUserData(rowUser){
      this.dialogUpdateVisible = true
      this.$http({
        method: 'get',
        url: `users/${rowUser.id}`
      }).then(({ data : res})=>{
        if(res.meta.status != 200) {
          this.dialogUpdateVisible = false
          this.$message({
            type: 'error',
            message: '服务器好像开小差了',
            showClose:true
          })
        }else {
          this.updateUserName = res.data.username
          this.updateUserForm.mobile = res.data.mobile
          this.updateUserForm.email = res.data.email
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    // 关闭添加用户弹出框并且重置表单
    resetForm(){
      this.$refs.addFormRef.resetFields()
        this.dialogFormVisible = false
    },
    // 关闭更新用户信息弹出框并重置表单
    closeUpdateDialog(){
      this.dialogUpdateVisible = false
      this.$refs.updateUserRef.resetFields()
    },
    //删除用户触发messagebox框
    removeUser(userid){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${userid.id}`)
          .then(({data: res})=>{
            if(res.meta.status != 200) {
              this.$message({
                type: 'error',
                message: '服务器出小差了',
                showClose:true
              })
            }else{
              this.$message({
                type: 'success',
                message: '删除成功',
                showClose: true
              })
              this.getUserList()
            }
          })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消删除',
          showClose: true
        });
      });
    },
    //打开设置用户角色的dialog
    showSetUserDialog(roles){
      this.selectRulesId='' //点开后重置select框的值
      this.currentUserInfo = roles //将当前用户的角色信息设置在页面中
      //获取角色列表
      this.$http.get('roles')
      .then(({data:res})=>{
        if(res.meta.status != 200) {
          this.$message({
            type:'error',
            message:'服务器出小差了！'
          })
          return false
        }else {
          this.getRolesData = res.data
        }
      }).catch((err)=>{
        console.log(err)
      })
      this.setUserRolesDialogVisible=true//打开dialog

    },
    //设置用户角色
    setUserRoles(){
      this.setUserRolesDialogVisible = false
      const uId = this.currentUserInfo.id
      const rId = this.selectRulesId
      this.$confirm('确认设置权限吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`users/${uId}/role`,
          {rid:rId})
          .then(({data: res})=>{
            if(res.meta.status != 200) {
              this.$message({type:'error',message:'更新失败！',showClose:true})
              return false
            }else {
              this.getUserList()
              this.$message({type:'success',message:'更新成功！',showClose:true})
            }
          }).catch((err)=>{
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消授权'
        });
      });
    }
    }
}
</script>

<style scoped>
.el-button {
  width: 25%;
  margin-right: 10px;
}
.form-btn {
  width: 15%;
  transform: translateY(200%);
}
.el-col{
  margin-bottom: 15px;
}
</style>
