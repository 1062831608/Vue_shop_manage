<template>
  <div class="login_frame">
    <div class="login_box">
<!--      头像区域-->
      <div class="avatar_box">
        <img src="../assets/likeimg/weixintouxiang.jpg" alt="">
      </div>
<!--      登陆表单区域-->
      <el-form class="form_box"
               :model="loginForm"
               :rules="loginFormRule"
               ref="loginFormRef"
      >
<!--        账号-->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input
                    show-password
                    prefix-icon="el-icon-lock"
                    v-model="loginForm.password"
          >
          </el-input>
        </el-form-item>
<!--        登录重置-->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click.prevent="submitLoginForm"
          >登录</el-button>
          <el-button
            type="info"
            @click.prevent="restLoginForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return{
      loginForm:{
        username:'',
        password:''
      },
      //这是表单的验证规则对象
      loginFormRule:{
        //验证用户名是否合法
        username:[
          { required: true , message: '账号不可以为空', trigger: 'blur' },
          { min: 1, max: 8, message: '用户名只能是1~8个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password:[
          { required: true , message: '密码不可以为空', trigger: 'blur' },
          { min: 4, max: 16, message: '密码必须为4~16位', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    //登录提交loginForm数据，发送post 请求
    submitLoginForm(){
      this.$refs.loginFormRef.validate(valid=>{
        if(!valid) return
        this.$http({
          method:'post',
          url:'login',
          data: this.loginForm
        }).then((res)=>{
          if(res.data.meta.status === 200) {
            //服务端token 存储本地
            window.sessionStorage.setItem('token',res.data.data.token)
            this.$message({   //弹框
              message: '登录成功，欢迎回来',
              type: 'success'
            })
            this.restLoginForm()
            //跳转路由
            this.$router.push({path:'/home'})
          }else {
            this.$message({
              showClose: true,
              message: '账号或密码错误，请重新登录',
              type: 'error'
            });
          }
        }).catch((err)=>{
          console.log(err)
        })
      })
    },
    restLoginForm(){
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_frame {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  position: relative;
  background-color: #fff;
  border-radius: 3px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 7px;
  border-radius: 50%;
  border: 1px solid #eee;
  background-color: #eee;
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.form_box {
  position: absolute;
  width: 80%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%,0);
}
.btns {
  display: flex;
  justify-content: end;
}
</style>
