//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/public/Layout.vue';
import ArticleList from '@/views/public/ArticleList.vue';
import ArticleDetail from '@/views/public/ArticleDetail.vue';
//导入组件

//定义路由关系
const routes = [
    {
        path: '/public',
        component: Layout,
        //子路由
        children: [
            { path: '/public/article', component: ArticleList },
            { path: '/public/detail/:id', component: ArticleDetail, name: 'detail', props: true },
        ],
        // 默认重定向
        redirect: '/public/article' 
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router
