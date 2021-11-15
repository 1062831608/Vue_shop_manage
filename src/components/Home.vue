<template>
<div>
  <el-button
    type="info"
    @click="accountExit"
  >退出</el-button>
  <h1>Home组件</h1>
</div>
</template>

<script>
export default {
  name: 'Home',
  methods:{
    //退出账号，清空 token
    accountExit(){
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
