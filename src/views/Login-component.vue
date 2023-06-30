<!-- src/views/Login-component.vue -->
/* eslint-disable vue/multi-word-component-names */
<template>
  <div class="login">
    <v-img :src="require('../assets/logo.jpg')"></v-img>
    <h1>登录-日程管理系统</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">用户名或注册用的邮箱:</label>
        <br/>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <br>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-actions">
        <button type="submit">登录</button>
        <router-link to="/register">注册</router-link>
        <router-link to="/forgot-password">找回密码</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login_component",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios.post('http://schedule.dckong.com:11451/auth/login', {
        username: this.username,
        password: this.password
      },{ withCredentials: true })
          .then(response => {
            if (response.status===200) {
              this.$router.push("/user");
            }
          }).catch(error=>{
        if (error.response && error.response.status === 403) {
          alert("登录失败，用户名或密码错误")
        } else {
          alert("登录失败，未知的错误")
        }
      })

    },
  },
};
</script>

<style scoped>
.login {
  width: 400px;
  margin: auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
}

button {
  width: 110%;
  padding: 10px;
  background-color: #0099ff;
  color: white;
}
.form-actions a,
.form-actions button{
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  margin: 0 0px;
}
</style>
