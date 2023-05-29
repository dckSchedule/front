<!-- src/views/Login-component.vue -->
/* eslint-disable vue/multi-word-component-names */
<template>
  <div id="app">
    <div class="container">
      <div class="column column-1">
        <button class="btn" @click="getToday(0,30,1)">今天未完成的日程</button>
        <button class="btn" @click="getWeek(0,30,1)">这周未完成的日程</button>
        <button class="btn" @click="getUnfinished(0,30,1)">所有未完成的日程</button>
        <button class="btn" @click="getAll(0,30,1)">全部日程</button>
      </div>
      <div class="column column-2">
        <button class="new-schedule btn" @click="newSchedule">新建日程</button>
        <div class="schedule" v-for="(schedule, index) in schedules" :key="index">
          <input type="checkbox" v-model="schedule.is_finish" @change="updateSchedule(schedule)" />
          <div class="schedule-content" @click="showSchedule(schedule)">{{ schedule.event.slice(0,45) }}</div>
          <button class="delete-schedule" @click="deleteSchedule(schedule)">🗑️</button>
        </div>
        <div class="pagination">
          <button @click="prevPage">上一页</button>
          <button @click="nextPage">下一页</button>
        </div>
      </div>
      <div class="column column-3">
        <div v-if="selectedSchedule">
          <h2>日程信息</h2>
          <br />
          <br />
          日程信息：{{ selectedSchedule.event }}
          <br />
          标签：{{ selectedSchedule.tag }}
          <br />
          <br />
          开始日期：{{ formatDate(selectedSchedule.begin_at) }}
          <br />
          截止日期：{{ formatDate(selectedSchedule.end_at) }}
          <br />
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
      end:30
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
        (endOfDayTimestamp)+"&select_by=2&begin=0&end=30&getFinish=False",{ withCredentials: true })
        .then(response=>{
          this.schedules=response.data;
        })
  },
  methods: {
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
            else{this.schedules=response.data;
            this.method=this.getToday;}
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
            this.method=this.getWeek;}
          })
    },
    getUnfinished(begin,end,m) {
      this.begin=begin;
      this.end=end;
      axios.get("http://schedule.dckong.com:11451/schedule/getAll?begin="+begin+"&end="+end+"&getFinish=False",{ withCredentials: true })
          .then(response=>{
            if(response.data.length===0 && m===1) alert("没有符合要求的日程")
            else{this.schedules=response.data;
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
            this.method=this.getAll;}
          })
    },
    prevPage(){
      if(this.begin===0) return;
      this.method(this.begin-30,this.end-30,1);
    },
    nextPage(){
      this.method(this.begin+30,this.end+30,1);
    },
    newSchedule() {
      window.open("/newDairy")
    },
    updateSchedule(schedule) {
      axios.post("http://schedule.dckong.com:11451/schedule/setFinish?sid="+schedule.sid,null,
          { withCredentials: true })
    },
    deleteSchedule(schedule) {
      axios.post("http://schedule.dckong.com:11451/schedule/remove?sid="+schedule.sid,null,
          { withCredentials: true });
      this.method(this.begin,this.end,0);
    },
    showSchedule(schedule) {

      this.selectedSchedule = schedule;
    },
    toggleMenu(){
      this.showUserMenu=!this.showUserMenu;
    },
    logout(){
      axios.post("http://schedule.dckong.com:11451/auth/logout",null,{ withCredentials: true });
      this.$router.push("/login");
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour=date.getHours();
      const minute=date.getMinutes();
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
}
.schedule-content {
  flex-grow: 1;
}
.user-menu:hover ul {
  display: block;

}
.user-menu ul {
  display: none;

}
.btn {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display:block; /* make buttons stack verticall'y */
  margin-bottom:10px; /* add space between buttons */
}
.new-schedule {

}
.pagination {
  position: absolute;
  bottom: calc(2.5vw);
  left: 50%;
  transform: translateX(-50%);
}
button:active {
  background-color: darkgreen;
}
</style>

