<template>
<div>
  <!--  面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片区域-->
  <el-card class="box-card">
<!--    添加角色按钮模块-->
    <el-row>
      <el-col :span="24">
        <el-button
          type="primary"
          @click="openAddDialog"
        >添加角色</el-button>
        <el-dialog
          title="添加用户"
          :visible.sync="addUserDialogVisible"
          width="40%"
          >
          <el-form
            :model="addRolesInfo"
            :rules="addUserRules"
            ref="addUserRef"
            label-width="100px"
          >
            <el-form-item label="角色名称：" prop="roleName">
              <el-input v-model="addRolesInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述：" prop="roleDesc">
              <el-input v-model="addRolesInfo.roleDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" >
    <el-button @click="addUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUserInfo">确 定</el-button>
  </span>
        </el-dialog>

      </el-col>
    </el-row>
<!--    角色列表区域-->
    <el-table
      :data="rolesList"
      style="width: 100%"
      :stripe="true"
      :border="true"
    >
<!--      角色权限打开入口-->
      <el-table-column
        type="expand"
        width="70"
      >
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children"
                  :key="item1.id"
                  :class="['vcenter']"
          >
<!--            渲染一级权限-->
            <el-col :span="5">
              <el-tag closable
                      @close="deleteRights(scope.row.id,item1.id)"
              >{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
<!--            渲染二,三级权限-->
            <el-col :span="19">
              <el-row v-for="item2 in item1.children"
                      :key="item2.id"
                      :class="['vcenter']"
              >
<!--                渲染二级权限-->
                <el-col :span="6">
                  <el-tag type="success"
                          closable
                          @close="deleteRights(scope.row.id,item2.id)"
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
<!--                渲染三级权限-->
                <el-col :span="18">
                  <el-tag closable type="warning"
                          v-for="item3 in item2.children" :key="item3.id"
                          @close="deleteRights(scope.row.id,item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="#"
        type="index"
        :index="indexMethods"
        width="50"
      >
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName"
        width="330"
      >
      </el-table-column>
      <el-table-column
        label="角色概述"
        prop="roleDesc"
        width="354"
      >
      </el-table-column>
<!--      对角色进行操作界面-->
      <el-table-column
        label="操作"
        prop="desc"
        width="430"
      >
        <template slot-scope="scope">
<!--          编辑按钮-->
          <el-button type="primary"
                     class="el-icon-edit"
                     @click="openEditUserDialog(scope.row)"
          >编辑</el-button>
<!--          编辑按钮点击后弹出的dialog-->
          <el-dialog
            title="编辑角色信息"
            :visible.sync="editUserDialogVisible"
            width="45%"
            >
              <el-form
                :model="editRolesInfo"
                :rules="editUserRules"
                ref="editUserRef"
                label-width="100px"
              >
                <el-form-item label="角色名称："
                              prop="roleName"
                >
                  <el-input v-model="editRolesInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述："
                              prop="roleDesc"
                >
                  <el-input v-model="editRolesInfo.roleDesc"></el-input>
                </el-form-item>
              </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo(scope.row)">确 定</el-button>
  </span>
          </el-dialog>
<!--          删除按钮-->
          <el-button type="danger"
                     class="el-icon-delete"
                     @click="delRoles(scope.row)"
          >删除</el-button>
<!--          分配角色按钮-->
          <el-button type="warning"
                     icon="el-icon-star-off"
                     @click="showSetRightsDialog(scope.row)"
          >分配权限</el-button>
          <el-dialog
            title="权限列表"
            :visible.sync="setRightsDialogVisible"
            width="40%"
            @close="closeSetRightsDialog"
            >
            <el-tree
              :data="setRightsData"
              show-checkbox
              :props="setRightsProps"
              node-key="id"
              :default-checked-keys="alreadyHaveRightsArr"
              ref="setRightsRef"
              >
            </el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible=false">取 消</el-button>
<!--              提交选中状态的按钮-->
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return{
      //用户的数据
      rolesList: [],
      //添加用户提交的表单的数据
      addRolesInfo:{
        roleName:'',
        roleDesc:''
      },
      //控制添加用户打开框的visible
      addUserDialogVisible:false,
      //添加用户表单的表单验证规则
      addUserRules:{
        roleName:[{ required: true, message: '请输入角色名称', trigger: 'blur' } ],
        roleDesc:[{ required: true, message: '请输入角色描述', trigger: 'blur'}]
      },
      //控制编辑用户打开框的visible
      editUserDialogVisible:false,
      //编辑用户提交的表单数据
      editRolesInfo: {
        roleName:'',
        roleDesc:''
      },
      //编辑用户的表单验证规则
      editUserRules:{
        roleName:[{ required: true, message: '请输入角色名称', trigger: 'blur' } ],
        roleDesc:[{ required: true, message: '请输入角色描述', trigger: 'blur'}]
      },
      //点击按钮当前按钮所在数据的ID值
      dialogID:'',
      //空值分配角色权限的dialog
      setRightsDialogVisible: false,
      //分配权限tree的数据
      setRightsData: [],
      //设置权限树的props
      setRightsProps:{
        children:'children',
        label:'authName'
      },
      //已经拥有的权限
      alreadyHaveRightsArr:[],
      //当前角色的ID
      roleID:0
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    // 获取所有角色列表
    getRolesList(){
      this.$http.get('roles')
        .then(({data: res})=>{
          if(res.meta.status != 200) {
            this.$message({
              type:'error',
              message:'服务器好像开小差啦！'
            })
          }else {
            this.rolesList = res.data
            console.log(res)
          }
        }).catch((err)=>{
        console.log(err)
      })
    },
    //提交添加用户表单
    addUserInfo () {
      this.$refs.addUserRef.validate((valid)=>{
        if(!valid) {
          this.$message({type:'error',message:'请填写表单信息'})
          return false
        }else {
          this.$http.post('roles',this.addRolesInfo)
          .then(({ data: res })=>{
            if(res.meta.status != 201) {
              this.$message({type:'error',message:'服务器出小差了，添加失败',showClose:true})
              this.addUserDialogVisible = false
            } else {
              this.$message({type:'success',message:'用户添加添加成功',showClose:true})
              this.getRolesList()
              this.addUserDialogVisible = false
            }
          })
        }
      })
    },
    //打开添加的dialog 框，将表单重置
    openAddDialog(){
      this.addUserDialogVisible=true
      this.$refs.addUserRef.resetFields()
    },
    //打开编辑的dialog 框，顺便将值填入框中
    openEditUserDialog(dialogRow){
      this.editUserDialogVisible=true
      this.dialogID = dialogRow.id
      this.$http.get(`roles/${dialogRow.id}`)
        .then(({data: res})=>{
          if(res.meta.status != 200) {
            return false
          }else {
            this.editRolesInfo.roleName=res.data.roleName
            this.editRolesInfo.roleDesc=res.data.roleDesc
          }
      }).catch((err)=>{
        console.log(err)
      })
    },
    //将用户编辑表单里面的表单提交
    editUserInfo(subEditRow){
      this.$refs.editUserRef.validate((valid)=>{
        if(!valid){
          this.$message({type:'error',message:'请输入表单内容哦！'})
        } else {
          this.$http.put(`roles/${this.dialogID}`, {
            roleName: this.editRolesInfo.roleName,
            roleDesc: this.editRolesInfo.roleDesc
          })
          .then(({data: res})=>{
            if(res.meta.status != 200) {
              this.$message({
                type:'error',
                message:'服务器好像出小差了哦！',
                showClose:true
              })
            }
            else {
              this.$message({
                type:'success',
                message:'更新成功',
                showClose:true
              })
              this.getRolesList()
              this.editUserDialogVisible=false
              console.log(subEditRow)
            }
          }).catch((err)=>{
            console.log(err)})
        }
      })
    },
    //点击按钮删除角色
    delRoles(rowId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${rowId.id}`)
        .then(({data:res})=>{
          if(res.meta.status != 200) {
            this.$message({type:'error',message:'删除失败'})
          }else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getRolesList()
          }
        }).catch((err)=>{
          console.log(err)})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //点击打开分配角色的 dialog
    showSetRightsDialog(role){
      this.setRightsDialogVisible = true
      this.roleID = role.id
      this.getLeaveRights(role,this.alreadyHaveRightsArr)
      this.$http.get('rights/tree')
      .then(({ data:res })=>{
        if(res.meta.status != 200) {
          this.$message({
            type:'error',
            message: '服务器出小差了！'
          })
        }else {
          this.setRightsData = res.data
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    //删除权限
    deleteRights(userId,rightsId) {
      this.$confirm('此操作将会永久删除该权限，是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${userId}/rights/${rightsId}`)
        .then(({data:res})=>{
          if(res.meta.status != 200) {
            this.$message({
              type: 'error',
              message: '删除失败！'
            });
          }else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getRolesList()
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
    //通过递归的形式，获取所有的三级权限节点，并且保存到
    // alreadyHaveRightsArr里面
    getLeaveRights(node,arr){
      if(!node.children) {
        return arr.push(node.id)
      }else {
        node.children.forEach((item)=>{
          this.getLeaveRights(item,arr)
        })
      }
    },
    //关闭设置权限的对话框
    closeSetRightsDialog(){
      this.alreadyHaveRightsArr=[]
    },
    //提交设置的权限
    allotRights(){
      this.setRightsDialogVisible=false
      const keys = [
        ...this.$refs.setRightsRef.getCheckedKeys(),
        ...this.$refs.setRightsRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join()
      this.$confirm('是否确认修改权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(`roles/${this.roleID}/rights`,{rids:idStr})
          .then(({data:res})=>{
            if(res.meta.status != 200) {
              this.$message({
                type:'error',
                message:'服务器好像出小差了！'
              })
            }else {
              this.$message({
                type:'success',
                message:'修改成功！'
              })
              this.getRolesList()
            }
          }).catch((err)=>{
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    }

  },
  computed:{
    indexMethods(){
      let i = 1
      return i++;
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  height: 600px;
  overflow: auto;
}
.el-table {
  .el-button {
    margin-left: 15px;
  }
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
