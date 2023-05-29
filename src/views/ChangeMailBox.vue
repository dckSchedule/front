<template>
  <div class="container">
    <h2>修改邮箱</h2>
    <div class="form-group">
      <label for="new-email">新邮箱：</label>
      <input type="email" id="new-email" v-model="newEmail" />
      <button class="btn" @click="sendVerificationCode" :disabled="countdown > 0">
        {{ countdown > 0 ? `${countdown} 秒后重新发送` : '发送验证码' }}
      </button>
    </div>
    <div class="form-group">
      <label for="verification-code">验证码：</label>
      <input type="text" id="verification-code" v-model="verificationCode" />
    </div>
    <button class="btn" @click="submit">提交</button>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      newEmail: '',
      verificationCode: '',
      countdown: 0,
    };
  },
  methods: {
    sendVerificationCode() {
      axios.post("http://schedule.dckong.com:11451/auth/getCode?email="+this.newEmail
      ).catch(error=>{
        if(error.response && error.response.status === 400){
          alert("验证码发送过于频繁，请稍后再试");
        }else{
          alert("发送验证码失败")
        }
      })
      this.startCountdown();
    },
    startCountdown() {
      this.countdown = 150;
      const intervalId = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    },
    submit() {
      axios.post('http://schedule.dckong.com:11451/auth/changeMailBox', {
        mail: this.newEmail,
        code: this.verificationCode,
      },{ withCredentials: true })
          .then(response => {
            if (response.status===200) {
              alert("修改邮箱成功")
              this.$router.push('/user');
            }
          })
          .catch(error=>{
            if(error.response && error.response.status===403) alert("验证码不正确");
            else if(error.response && error.response.status===401) alert("邮箱已被使用");
            else alert("修改邮箱失败");
          });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
}
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.form-group label {
  flex-basis: 30%;
}
.form-group input[type='email'],
.form-group input[type='text'] {
  flex-grow: 1;
}
.btn {
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
}
.btn[disabled] {
  background-color: #ccc;
}
</style>
