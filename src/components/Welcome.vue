<template>
<div>
  <h2>欢迎你 {{ loginUsername }}</h2>
  <img src="../assets/gif/runningDog.gif" alt="">
</div>
</template>

<script>
export default {
  name: 'Welcome',
  computed:{
    loginUsername(){
      return window.sessionStorage.getItem('uName')
    }
  }
}
</script>

<style scoped>

</style>
