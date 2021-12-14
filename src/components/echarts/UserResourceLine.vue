<template>
<div id="userEcharts" :style="{width:'800px', height: '530px'}">可视化图表123</div>
</template>

<script>
import _ from 'lodash'
export default {
  data(){
    return{
      // 需要合并的选项
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted(){
    const myCharts = this.$echarts.init(document.querySelector('#userEcharts'))
    // 通过请求获取配置项信息,渲染到图表上面
    this.$http.get('reports/type/1')
    .then(({data:res})=>{
      if(res.meta.status !== 200) {
        this.$message.error('图标渲染失败')
      } else {
        const result = _.merge(this.options,res.data)
        myCharts.setOption(result)
        window.addEventListener('resize',function(){myCharts.resize()})
      }
    }).catch((err)=>{
      console.log(err)
    })
  },
  name: 'UserResourceLine',
}
</script>

<style scoped>

</style>
