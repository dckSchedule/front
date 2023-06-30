<template>
  <div id="app">
    <h1>注册-日程管理</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>用户名(不超过32位):</label>
        <input type="text" v-model="username" required maxlength="32" />
      </div>
      <div class="form-group">
        <label>密码(不超过32位):</label>
        <input type="password" v-model="password" required maxlength="32" />
      </div>
      <div class="form-group">
        <label>确认密码:</label>
        <input type="password" v-model="password_confirm" required maxlength="32" />
        <p style="color: red" v-if="password_confirm!==password">两次输入密码不一致</p>
      </div>
      <div class="form-group">
        <label>邮箱:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <button @click="sendVerificationCode" :disabled="isDisabled" type="send">
          发送验证码{{ remainingTime > 0 ? `(${remainingTime}s)` : "" }}
        </button>
      </div>
      <div class="form-group">
        <label>验证码:</label>
        <input type="text" v-model="verificationCode" required />
      </div>
      <button type="submit" :disabled="password_confirm!==password">注册</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      username: "",
      password: "",
      password_confirm:"",
      email: "",
      verificationCode: "",
      isDisabled: false,
      remainingTime: 0,
    };
  },
  methods: {
    submitForm() {
      axios.post("http://schedule.dckong.com:11451/auth/register",{
        username:this.username,
        password:this.password,
        email:this.email,
        code:this.verificationCode
      }).then(response=>{
        if(response.status===200){
          alert("注册成功,可以用此账号密码进行登录")
          this.$router.push("/login")
        }
      }).catch(error=>{
        if(error.response&&error.response.status===401){
          alert("邮箱或用户名已存在")
        }
        else if(error.response && error.response.status===403){
          alert("验证码不正确")
        }
        else{
          alert("注册失败，请重试")
        }
      })
    },
    sendVerificationCode() {
      axios.post("http://schedule.dckong.com:11451/auth/getCode?email="+this.email
      ).catch(error=>{
        if(error.response && error.response.status === 400){
          alert("验证码发送过于频繁，请稍后再试");
        }else{
          alert("发送验证码失败")
        }
      })
      console.log("发送验证码到:", this.email);
      // 禁用发送验证码按钮
      this.isDisabled = true;

      // 设置剩余被禁用时间
      this.remainingTime = 150;

      // 每秒更新剩余被禁用时间
      const interval = setInterval(() => {
        this.remainingTime--;

        if (this.remainingTime <= 0) {
          clearInterval(interval);
          this.isDisabled = false;
        }
      }, 1000);
    }
  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: inline-block;
  width: 80px;
  white-space: nowrap;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group input[type="email"] {
  width: 200px;
  padding: 3px;
  border: 1px solid #ccc;
}

.form-group input,
.form-group label{
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  margin: 0 10px;
}

input, button {
  padding: .5em .75em;
  font-size: larger;
  margin-bottom: .5em;
}

input[type="email"] {
  width: calc(100% - 120px);
  margin-right: .5em;
}

button[disabled] {
  opacity: .5;
}

button[type="submit"],
button[type="send"]
{
  width: 100%;
  padding: 5px;
  cursor: pointer;
}


</style>
