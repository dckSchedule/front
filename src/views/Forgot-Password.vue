<template>
  <div id="app">
    <h1>找回密码</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>注册时绑定的邮箱:</label>
        <br>
        <input type="email" v-model="email" required />
        <button @click="sendVerificationCode" :disabled="isDisabled">
          发送验证码{{ remainingTime > 0 ? `(${remainingTime}s)` : "" }}
        </button>
      </div>
      <div class="form-group">
      </div>
      <div class="form-group">
        <label>验证码:</label>
        <br>
        <input type="text" v-model="verificationCode" required />
      </div>
      <div class="form-group">
        <label>设置新密码(不得超过32位):</label>
        <br>
        <input type="password" v-model="newPassword" required maxlength="32" />
      </div>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: "forgot_password",
  data() {
    return {
      email: "",
      verificationCode: "",
      newPassword: "",
      isDisabled: false,
      remainingTime: 0,
    };
  },
  methods: {
    submitForm() {
      axios.post("http://schedule.dckong.com:11451/auth/resetPassword",{
        email:this.email,
        token:this.verificationCode,
        pswd:this.newPassword
      }).then(response=>{
        if(response.status===200){
          alert("重置密码成功，可以用新密码登录")
          this.$router.push("/login")
        }
      }).catch(error=>{
        if(error.response && error.response.status===403) alert("验证码不正确")
        else alert("重置密码失败")
      })
      console.log("邮箱:", this.email);
      console.log("新密码:", this.newPassword);
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
  padding: 5px;
  border: 1px solid #ccc;
}
.form-group input[type="email"]{
  margin-right: 5px;
}
button[type="submit"]{
  width:100%;
  padding:10px
}
</style>
