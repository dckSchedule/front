<!-- src/views/Login-component.vue -->
/* eslint-disable vue/multi-word-component-names */
<template>
  <div id="app">
    <div class="container">
      <div class="column column-1">
        <button class="btn" @click="getToday(0,10,1)">今日未完成</button>
        <button class="btn" @click="getTodayuf(0,10,1)">今日全部</button>
        <button class="btn" @click="getWeek(0,10,1)">本周未完成</button>
        <button class="btn" @click="getWeekuf(0,10,1)">本周全部</button>
        <button class="btn" @click="getUnfinished(0,10,1)">所有未完成</button>
        <button class="btn" @click="getAll(0,10,1)">全部</button>
        <input type="text" v-model="searchText" @keyup.enter="search" required maxlength="15" placeholder="根据标签搜索日程……"/>
        <button @click="search(searchText,0,10,1)">搜索</button>
      </div>
      <div class="column column-2">
        <h2>{{scheduleType}}</h2>
        <br>
        <button class="new-schedule btn" @click="newSchedule">新建日程</button>
        <div class="schedule" v-for="(schedule, index) in schedules" :key="index">
          <input type="checkbox" v-model="schedule.is_finish" @change="updateSchedule(schedule)" />
          <div class="schedule-content" @click="showSchedule(schedule)"><p>日程标题：{{ schedule.event.slice(0,15) }}</p><p>截止时间：{{formatDate(schedule.end_at)}}</p></div>
          <button class="delete-schedule" @click="deleteSchedule(schedule)">🗑️</button>
        </div>
        <div class="pagination">
          <button @click="prevPage">上一页</button>
          <button @click="nextPage">下一页</button>
        </div>
      </div>
      <div class="column column-3">
        <div v-if="selectedSchedule">
          <h2>日程详细信息</h2>
          <br />
          <br />
          日程信息：{{ selectedSchedule.event }}
          <br />
          标签：{{ selectedSchedule.tag }}
          <br />
          <br />
          开始日期：{{ formatDate(selectedSchedule.begin_at) }}
          <br />
          <p style="color:red">截止日期：{{ formatDate(selectedSchedule.end_at) }} {{selectedSchedule.is_finish?"":(Date.parse(new Date())>selectedSchedule.end_at?"已逾期":Date.parse(new Date())>selectedSchedule.begin_at?"任务进行中":"任务待开始")}}</p>
          <br />
          重复周期：<p v-if="selectedSchedule.repeat_==0">不重复</p>
          <div v-else>
            每 {{selectedSchedule.repeat_/86400000}} 日重复
            <p style="color:blue">
              截止重复时间：{{formatDate(selectedSchedule.endRepeatTime)}}
            </p>
          </div>
          <br/>
          完成状态：{{selectedSchedule.is_finish?"已完成":"未完成"}}
        </div>
      </div>
      <div class="column column-4">
        <div class="user-menu" @click="toggleMenu">
          {{ username }}
          <ul v-if="showUserMenu">
            <li><router-link to="/mail">改绑邮箱</router-link></li>
            <li><router-link to="/updatePassword">修改密码</router-link></li>
            <li><router-link to="/" @click.native="logout">退出登录</router-link></li>
          </ul>
        </div>
        <button class="btn" @click="getAnalyze">获取近期日程分析</button>
<!--        <button class="btn">展示日程为栏</button>-->
<!--        <button class="btn">展示日程为日历</button>-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      username: '',
      showUserMenu: false,
      schedules: [],
      selectedSchedule: null,
      method:this.getToday,
      begin:0,
      end:10,
      searchText:"",
      tags:"",
      scheduleType:"今日未完成",

    };
  },
  mounted() {
    axios.get("http://schedule.dckong.com:11451/user/getInfo",
        { withCredentials: true })
        .then(response=>{
          if(response.status===200){
            this.username=response.data.username;
          }
        })
        .catch(error=>{
          this.$router.push("/login");
        })
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const startOfDayTimestamp = startOfDay.getTime();
    const endOfDayTimestamp = endOfDay.getTime();
    axios.get("http://schedule.dckong.com:11451/schedule/getByTime?begin_time="+(startOfDayTimestamp)+"&end_time="+
        (endOfDayTimestamp)+"&select_by=2&begin=0&end=10&getFinish=False",{ withCredentials: true })
        .then(response=>{
          this.schedules=response.data;
        })
        .catch(error=>{
        })
  },
  methods: {
    getAnalyze(){
      window.open("/analyze");
    },
    search(tag,begin,end,m){

      this.begin=begin;
      this.end=end;
      axios.get("http://schedule.dckong.com:11451/schedule/getByTag?tag="+tag+"&begin="+begin+"&end="+end,
          { withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{
              this.scheduleType="标签为\""+tag+"\"";
              this.schedules=response.data;
              this.method=this.search;
              this.tags=tag;
            }
          })
    },
    getToday(begin,end,m) {

      this.begin=begin;
      this.end=end;
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const startOfDayTimestamp = startOfDay.getTime();
      const endOfDayTimestamp = endOfDay.getTime();
      axios.get("http://schedule.dckong.com:11451/schedule/getByTime?begin_time="+(startOfDayTimestamp)+"&end_time="+
          (endOfDayTimestamp)+"&select_by=2&begin="+begin+"&end="+end+"&getFinish=False",{ withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{
              this.scheduleType="今日未完成";this.schedules=response.data;
            this.method=this.getToday;}
          })
    },
    getTodayuf(begin,end,m) {

      this.begin=begin;
      this.end=end;
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const startOfDayTimestamp = startOfDay.getTime();
      const endOfDayTimestamp = endOfDay.getTime();
      axios.get("http://schedule.dckong.com:11451/schedule/getByTime?begin_time="+(startOfDayTimestamp)+"&end_time="+
          (endOfDayTimestamp)+"&select_by=2&begin="+begin+"&end="+end+"&getFinish=True",{ withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{this.schedules=response.data;
              this.scheduleType="今日全部"
              this.method=this.getTodayuf;}
          })
    },
    getWeek(begin,end,m) {

      this.begin=begin;
      this.end=end;
      // 获取当前日期
      var currentDate = new Date();

      // 获取当前星期几 (0-6)
      var currentDay = currentDate.getDay();

      // 计算本周一的日期
      var monday = new Date(currentDate.getTime() - (currentDay - 1) * 24 * 60 * 60 * 1000);

      // 设置时间为零点
      monday.setHours(0, 0, 0, 0);

      // 获取本周一零点的时间戳
      var mondayTimestamp = monday.getTime();

      // 计算本周日的日期
      var sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);

      // 设置时间为23:59:59
      sunday.setHours(23, 59, 59, 999);

      // 获取本周日23:59:59的时间戳
      var sundayTimestamp = sunday.getTime();

      axios.get("http://schedule.dckong.com:11451/schedule/getByTime?begin_time="+(mondayTimestamp)+"&end_time="+
          (sundayTimestamp)+"&select_by=2&begin="+begin+"&end="+end+"&getFinish=False",{ withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{this.schedules=response.data;
              this.scheduleType="本周未完成"
            this.method=this.getWeek;}
          })
    },
    getWeekuf(begin,end,m) {

      this.begin=begin;
      this.end=end;
      // 获取当前日期
      var currentDate = new Date();

      // 获取当前星期几 (0-6)
      var currentDay = currentDate.getDay();

      // 计算本周一的日期
      var monday = new Date(currentDate.getTime() - (currentDay - 1) * 24 * 60 * 60 * 1000);

      // 设置时间为零点
      monday.setHours(0, 0, 0, 0);

      // 获取本周一零点的时间戳
      var mondayTimestamp = monday.getTime();

      // 计算本周日的日期
      var sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);

      // 设置时间为23:59:59
      sunday.setHours(23, 59, 59, 999);

      // 获取本周日23:59:59的时间戳
      var sundayTimestamp = sunday.getTime();

      axios.get("http://schedule.dckong.com:11451/schedule/getByTime?begin_time="+(mondayTimestamp)+"&end_time="+
          (sundayTimestamp)+"&select_by=2&begin="+begin+"&end="+end+"&getFinish=True",{ withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{this.schedules=response.data;
              this.scheduleType="本周全部"
              this.method=this.getWeekuf;}
          })
    },
    getUnfinished(begin,end,m) {

      this.begin=begin;
      this.end=end;
      axios.get("http://schedule.dckong.com:11451/schedule/getAll?begin="+begin+"&end="+end+"&getFinish=False",{ withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{this.schedules=response.data;
              this.scheduleType="全部未完成";
            this.method=this.getUnfinished;}
          })
    },
    getAll(begin,end,m) {
      this.begin=begin;
      this.end=end;
      axios.get("http://schedule.dckong.com:11451/schedule/getAll?begin="+begin+"&end="+end+"&getFinish=True",{ withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{this.schedules=response.data;
              this.scheduleType="全部"
            this.method=this.getAll;}
          })
    },
    prevPage(){
      if(this.begin===0){
        alert("已是第一页")
        return;
      }
      console.log(this.method===this.search);
      if(this.method===this.search) this.method(this.tags,this.begin-10,this.end-10,1);
      else this.method(this.begin-10,this.end-10,1);
    },
    nextPage(){
      console.log(this.searchText);
      if(this.method===this.search) this.method(this.tags,this.begin+10,this.end+10,1);
      else this.method(this.begin+10,this.end+10,1);
    },
    newSchedule() {
      this.$router.push("/newDairy")
    },
    updateSchedule(schedule) {
      axios.post("http://schedule.dckong.com:11451/schedule/setFinish?sid="+schedule.sid,null,
          { withCredentials: true })
    },
    deleteSchedule(schedule) {
      if (confirm('是否确认删除此日程？注意：此操作不可恢复')) {
        axios.post("http://schedule.dckong.com:11451/schedule/remove?sid="+schedule.sid,null,
            { withCredentials: true });
        setTimeout(() => {
          if(this.method===this.search) this.method(this.tags,this.begin-10,this.end-10,0);
          this.method(this.begin,this.end,0);
        }, 500);
      } else {
        // 不进行任何操作
      }
    },
    showSchedule(schedule) {
      this.selectedSchedule = schedule;

    },
    toggleMenu(){
      this.showUserMenu=!this.showUserMenu;
    },
    logout(){
      axios.post("http://schedule.dckong.com:11451/auth/logout",null,{ withCredentials: true });
      alert("退出登录成功！")
      this.$router.push("/login");
    },
    formatDate(timestamp) {
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if(month<10) month="0"+month;
      let day = date.getDate();
      if(day<10) day="0"+day;
      let hour=date.getHours();
      if(hour<10) hour="0"+hour;
      let minute=date.getMinutes();
      if(minute<10) minute="0"+minute;
      return `${year}-${month}-${day} ${hour}:${minute}`;
    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  width: 100vw;
}
.container {
  display: flex;
  height: 100%;
}
.column {
  height: 100%;
  border-right: 1px solid #ddd;
}
.column:last-child {
  border-right: none;
}
.column-1 {
  flex: 2;
}
.column-2 {
  flex: 3;
  position: relative;
}
.column-3 {
  flex: 4;
}
.column-4 {
  flex: 1;
}
.schedule {
  display: flex;
  margin-bottom:5px; /* add space between schedules */
}
.schedule-content {
  flex-grow:1;
}
.user-menu:hover ul {
  display:block;

}
.user-menu ul {
  display:none;

}
.btn {
  background-color:#4CAF50; /* Green */
  border:none;
  color:white;
  padding:15px 32px;
  text-align:center;
  text-decoration:none;
  display:block; /* make buttons stack vertically */
  margin-bottom:10px; /* add space between buttons */
  width:100%; /* make buttons fill column */
}

.btn:focus{
  background-color:#006400; /* darken button when clicked */
}

.new-schedule {

}
.pagination {
  position:absolute;
  bottom:calc(2.5vw);
  left:50%;
  transform:translateX(-50%);
}

.schedule{
  background-color:#d3d3d3; /* set schedule background color to light grey */
  border:none; /* remove schedule border */
}

</style>

