<template>
  <div class="container">
    <div class="left">
      <p>你近期一共有 {{sum}} 个日程</p>
      <p>有 {{end}} 个日程已经截止，其中你完成了 {{finish}} 个日程</p>
      <p v-if="finish/end>0.8">你能够记得完成80%以上的任务,做的很棒！</p>
      <p v-else-if="finish/end>=0.5">你能完成半数以上的任务，做的不错！</p>
      <p v-else>你完成的任务比较少，最近是有什么别的事吗？<br/>努力调整一下！</p>
      <p>有 {{overdue}} 个日程逾期完成</p>
      <p v-if="overdue/finish<0.2">超过80%的任务你都能够按时完成，时间观念不错！</p>
      <p v-else>还需要提升时间观念，争取按时完成任务</p>
      <p>还有 {{urgent}} 个日程是赶着 ddl 完成的</p>
      <p>注意要留出一定富裕时间</p>
    </div>
    <div class="right chart-container">
      <div id="chart1"></div>
      <div id="chart2"></div>
      <div id="chart3"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name:"Analyze",
  data() {
    return {
      sum: 0,
      end: 0,
      finish: 0,
      overdue: 0,
      urgent: 0
    }
  },
  mounted() {
    axios.get('http://schedule.dckong.com:11451/schedule/analyze',{ withCredentials: true })
        .then(response => {
          this.sum = response.data.sum;
          this.end = response.data.end;
          this.finish = response.data.finish;
          this.overdue = response.data.overdue;
          this.urgent = response.data.urgent;

          // draw charts
          let chart1 = echarts.init(document.getElementById('chart1'));
          let chart2 = echarts.init(document.getElementById('chart2'));
          let chart3 = echarts.init(document.getElementById('chart3'));

          let option1 = {
            title: {
              text: '逾期完成的日程',

            },
            grid: {
              bottom: 100
            },
            legend: {
              show: true,
              data: ['逾期完成的日程数量:'+this.overdue, '完成的日程数量:'+this.finish],
              orient: 'horizontal',
              top: 50
            },
            series: [
              {
                type: 'pie',
                center: ['50%', '60%'],
                data: [
                  {value: this.overdue, name: '逾期完成的日程数量:'+this.overdue},
                  {value: this.finish - this.overdue, name: '完成的日程数量:'+this.finish}
                ],
                label: {
                  show:false
                }
              }
            ]
          };
          chart1.setOption(option1);

          let option2 = {
            title: {
              text: '赶着ddl完成的日程',
            },
            grid: {
              bottom: 100
            },

            legend: {
              show: true,
              data: ['赶ddl完成的日程数量:'+this.urgent,'按时完成的日程数量:'+(this.finish-this.overdue)],
              orient: 'horizontal',
              top: 50
            },
            series: [
              {
                type: 'pie',
                center: ['50%', '60%'],
                data: [
                  {value: this.urgent, name: '赶ddl完成的日程数量:'+this.urgent},
                  {value: this.finish - this.overdue-this.urgent, name: '按时完成的日程数量:'+(this.finish-this.overdue)}
                ],
                label: {
                  show:false
                },

              },

            ]
          };
          chart2.setOption(option2);

          let option3 = {
            title: {
              text: '任务完成情况',
            },
            grid: {
              bottom: 100
            },
            legend: {
              show: true,
              data: ['已完成的日程数量:'+this.finish, '已截止的日程数量:'+this.end],
              orient: 'horizontal',
              top: 50
            },
            series: [
              {
                type: 'pie',
                center: ['50%', '60%'],
                data: [
                  {value: this.finish, name: '已完成的日程数量:'+this.finish},
                  {value: this.end - this.finish, name: '已截止的日程数量:'+this.end}
                ],
                label:{
                  show:false
                }
              }
            ]
          };
          chart3.setOption(option3);
        }).catch(error=>{
          this.$router.push("/login");
    });
  }
}
</script>

<style scoped>
.container {
  position: relative;
}

.left {
  float:left;
}

.right {
  position: absolute;
  top: 0;
  right: 0;
}
.chart-container {
  display: flex;
  flex-wrap: wrap;
}

#chart1,
#chart2,
#chart3 {
  width:350px;
  height:350px;
  margin:10px
}

</style>
