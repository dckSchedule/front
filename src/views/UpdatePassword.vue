<template>
  <div class="container">
    <h2>修改密码</h2>
    <div class="form-group">
      <label for="old-password">原密码：</label>
      <input type="password" id="old-password" v-model="oldPassword" />
    </div>
    <div class="form-group">
      <label for="new-password" >新密码(不超过32位)：</label>
      <input type="password" id="new-password" required maxlength="32" v-model="newPassword" />
    </div>
    <div class="form-group">
      <label for="confirm-password">确认新密码：</label>
      <input type="password" id="confirm-password" v-model="confirmPassword" />
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
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  },
  methods: {
    submit() {
      if (this.newPassword !== this.confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
      }

      axios.post('http://schedule.dckong.com:11451/auth/updatePassword', {
        oldPswd: this.oldPassword,
        newPswd: this.newPassword,
      },{ withCredentials: true })
          .then(response => {
            if (response.status===200) {
              alert("修改密码成功")
              this.$router.push('/user');
            }
          })
          .catch(error=>{
            alert("修改密码失败，可能是原密码错误")
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
.form-group input[type='password'] {
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
</style>
