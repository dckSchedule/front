<template>
  <div>
    <h2>新建日程</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="details">日程详细信息(不超过500位):</label>
        <input type="text" id="details" v-model="details" required maxlength="500"/>
      </div>
      <div>
        <label for="tags">日程标签(不超过15位):</label>
        <input type="text" id="tags" v-model="tags" required maxlength="15"/>
      </div>
      <div>
        <label for="start">开始时间:</label>
        <input type="datetime-local" id="start" v-model="start" />
      </div>
      <div>
        <label for="end">截止时间:</label>
        <input type="datetime-local" id="end" v-model="end" />
      </div>
      <div class="rp">
        重复方式：每
        <input type="number" v-model.number="x" style="width: 30px" class="rp"/>
        <select v-model="y" style="width: 50px" class="rp">
          <option value="1">日</option>
          <option value="7">周</option>
          <option value="30">月</option>
          <option value="365">年</option>
        </select>
        重复
        <div v-if="repeat < 0" style="color: red">重复周期不能是负数</div>
        <div v-if="repeat > 1825" style="color: red">重复周期不得大于5年</div>
      </div>
      <!-- 当选择不是不重复时，出现一个标签 -->
      <div v-if="repeat > 0 && repeat<=1825">
        <label for=“endrepeattime”>重复截止时间:</label>
        <input type="datetime-local" id=“endrepeattime” v-model="endrepeattime" />
      </div>
      <br>
      <button type="submit" :disabled="x < 0||x>1825">提交</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name:"NewDiary",
  data() {
    return {
      details: "",
      tags: "",
      start: "",
      end: "",
      repeat:0,
      x:0,
      y:"1",
      endrepeattime: null
    };
  },
  watch: {
    x(newVal) {
      this.repeat = newVal * this.y;
    },
    y(newVal) {
      this.repeat = this.x * newVal;
    },
  },
  methods: {
    submitForm() {
      const startTimestamp = new Date(this.start).getTime();
      const endTimestamp = new Date(this.end).getTime();
      const endRepeatTime=new Date(this.endrepeattime).getTime();
      if(Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)){alert("时间不得为空");return;}
      console.log(startTimestamp)
      axios.post("http://schedule.dckong.com:11451/schedule/new",{
        event: this.details,
        tag: this.tags,
        begin: startTimestamp,
        end: endTimestamp,
        repeat:this.repeat,
        endRepeat:endRepeatTime
      },{ withCredentials: true }).then(response=>{
        if(response.status===200){
          alert("创建日程成功");
          this.$router.push("/user")
        }
      }).catch(error=>{
        alert("创建日程失败，检查结束时间是否早于开始时间");
      });
    }
  }
};
</script>
<style scoped>
.rp{
  display: inline-block;
}
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

h2 {
  margin: 0;
  padding: 20px;
  background-color: #4CAF50;
  color: white;
  text-align: center;
}

form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
}

div {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="datetime-local"] {
  padding: 10px;
  border: 1px solid #ccc;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

</style>