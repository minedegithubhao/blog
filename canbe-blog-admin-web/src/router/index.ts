//导入vue-router
import { createRouter, createWebHistory } from "vue-router";
//导入组件
import LoginVue from "@/views/Login.vue";
import LayoutVue from "@/views/Layout.vue";
import ArticleCategoryVue from "@/views/article/ArticleCategory.vue";
import ArticleManageVue from "@/views/article/ArticleManage.vue";
import UserInfoVue from "@/views/user/UserInfo.vue";
import UserAvatarVue from "@/views/user/UserAvatar.vue";
import UserResetPasswordVue from "@/views/user/UserResetPassword.vue";

import Layout from "@/views/public/Layout.vue";
import ArticleList from "@/views/public/ArticleList.vue";
import ArticleDetail from "@/views/public/ArticleDetail.vue";
//定义路由关系
const routes = [
  { path: "/login", component: LoginVue },
  {
    path: "/",
    component: LayoutVue,
    //子路由
    children: [
      { path: "/article/category", component: ArticleCategoryVue },
      { path: "/article/manage", component: ArticleManageVue },
      { path: "/user/info", component: UserInfoVue },
      { path: "/user/avatar", component: UserAvatarVue },
      { path: "/user/password", component: UserResetPasswordVue },
    ],
    //重定向
    redirect: "/article/manage",
  },
  {
    path: "/public",
    component: Layout,
    //子路由
    children: [
      { path: "/public/article", component: ArticleList },
      {
        path: "/public/detail/:id",
        component: ArticleDetail,
        name: "detail",
        props: true,
      },
    ],
    // 默认重定向
    redirect: "/public/article",
  },
];

//创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
