// src/router.js
/* eslint-disable vue/multi-word-component-names */
import Vue from "vue";
import VueRouter from "vue-router";
import Login_component from "./views/Login-component.vue";
import App from "./views/User-Info.vue";
import Register from "@/views/Register";
import forgot_password from "@/views/Forgot-Password";
import updatePassword from "@/views/UpdatePassword";
import ChangeMailBox from "@/views/ChangeMailBox";
import NewDiary from "@/views/NewDiary";
Vue.use(VueRouter);

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login_component,
    },
    {
        path: "/user",
        name: "User",
        component: App,
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path:"/forgot-password",
        name:"Forgot",
        component: forgot_password
    },

    {
        path:"/updatePassword",
        name:"Update",
        component: updatePassword
    },
    {
        path:"/mail",
        name:"mail",
        component: ChangeMailBox
    },
    {
      path:"/newDairy",
      name:"newDiary",
      component: NewDiary
    },
    {
        path: '*',
        redirect: '/user'
    },


];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
