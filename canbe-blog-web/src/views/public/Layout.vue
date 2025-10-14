<script setup lang="ts">
import logo from '@/assets/logo.png'
import { ref } from 'vue'
import { View, User, Edit, Bell, UserFilled } from '@element-plus/icons-vue' // 合并导入

import useCategory from '@/hooks/category'
const { categoryItems, articleCategory } = useCategory()
articleCategory()

import emitter from "@/utils/emitter";
import router from '@/router'
// 默认选中首页index=99
const activeIndex = ref(99)
// 菜单项点击事件
const handleSelect = (key: number, keyPath: number[]) => {
    // 99-首页，查询全部
    if (key === 99) {
        emitter.emit('searchArticleList', null)
    } else {
        emitter.emit('searchArticleList', key)
    }
    // 跳转
    router.push('/public')
}
</script>


<template>
    <el-container class="body-container">
        <el-header>
            <el-menu class="menu" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <el-image class="logo" :src="logo" fit="cover" />
                <el-menu-item :key="activeIndex" :index="activeIndex">
                    首页
                </el-menu-item>
                <el-menu-item v-for="item in categoryItems" :key="item.id" :index="item.id">
                    {{ item.categoryName }}
                </el-menu-item>
            </el-menu>
        </el-header>

        <el-main class="main-container">
            <!-- <el-row :gutter="20" style="width: 100%; max-width: 1200px;">

                <el-col :span="16">
                    <router-view />
                </el-col>

                <el-col :span="8">
                    <el-card class="user-card">
                        <div class="card-header">
                            <div class="avatar-area">
                                <el-avatar src="http://pic1.zhimg.com/v2-8b657dff159debf1cff463d61b7dcafd_r.jpg"
                                    size="large" />
                                <div class="online-tag">在线</div>
                            </div>
                        </div>

                        <div class="user-info">
                            <div class="username">canbe</div>
                            <div class="signature">十八岁以后我的梦想变成了买房买车。</div>
                        </div>

                        <div class="social-icons">
                            <el-icon class="icon">
                                <User />
                            </el-icon>
                            <el-icon class="icon">
                                <Edit />
                            </el-icon>
                            <el-icon class="icon">
                                <Bell />
                            </el-icon>
                            <el-icon class="icon">
                                <UserFilled />
                            </el-icon>
                            <el-icon class="icon">
                                <UserFilled />
                            </el-icon>
                        </div>
                    </el-card>
                </el-col>
            </el-row> -->
            <el-row style="width: 100%; max-width: 800px;">

                <el-col>
                    <router-view />
                </el-col>
            </el-row>
        </el-main>
        <el-footer class="footer">
            Copyright©2021-2025·canbe博客·湘ICP备2022002110号-1
        </el-footer>

    </el-container>
</template>

<style lang="scss" scoped>
.body-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .el-header {
        padding: 0;
        background-color: #fff;
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .logo {
        width: 200px;
    }

    .menu {
        display: flex;
    }

    .main-container {
        flex: 1;
        display: flex;
        justify-content: center;
        overflow-y: auto;
        height: calc(100vh - 60px - 40px);
    }

    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        background-color: #ffffff;
        // position: sticky; // 粘性定位
        bottom: 0;
        z-index: 1000;
    }
}

.user-card {
    width: 240px; // 卡片宽度，可根据布局调整
    border-radius: 8px;
    overflow: hidden; // 裁剪超出部分

    .card-header {
        position: relative;
        height: 100px;

        .header-bg {
            width: 100%;
            height: 100%;
            object-fit: cover; // 保持背景图比例
        }

        .avatar-area {
            position: absolute;
            bottom: -25px; // 让头像部分超出头部背景
            left: 50%;
            transform: translateX(-50%);

            .online-tag {
                position: absolute;
                bottom: -5px;
                right: -5px;
                background-color: green;
                color: white;
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 10px;
            }
        }
    }

    .user-info {
        text-align: center;
        margin-top: 30px; // 给头像留出空间

        .username {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .signature {
            font-size: 12px;
            color: #666;
        }
    }

    .social-icons {
        display: flex;
        justify-content: space-around;
        padding: 10px 0;
        margin-top: 10px;
        border-top: 1px solid #eee;

        .icon {
            font-size: 20px;
            cursor: pointer;
            color: #666;

            &:hover {
                color: #4096ff;
            }
        }
    }
}
</style>
