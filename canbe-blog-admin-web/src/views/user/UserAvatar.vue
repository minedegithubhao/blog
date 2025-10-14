<script setup>
import { Plus, Upload } from "@element-plus/icons-vue";
import { ref } from "vue";
import avatar from "@/assets/default.png";
const uploadRef = ref();

//用户头像地址
import useUserInfoStore from "@/stores/userInfo";
const userInfoStore = useUserInfoStore();
const imgUrl = ref(userInfoStore.userInfo.userPic);

import { useTokenStore } from "@/stores/token";
const tokenStore = useTokenStore();
import { userAvaterUpdateService } from "@/api/user";

// 上传成功
const uploadSuccsee = async (result) => {
  imgUrl.value = result.data;
};

import { ElMessage } from "element-plus";
const uploadAvatar = async () => {
  // 修改数据库中的头像
  await userAvaterUpdateService(imgUrl.value);
  // 修改pinia中的用户信息
  const userInfo = userInfoStore.userInfo;
  userInfo.userPic = imgUrl.value;
  userInfoStore.setUserInfo(userInfo);
  ElMessage.success("修改成功");
};
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>更换头像</span>
      </div>
    </template>

    <el-row>
      <el-col :span="12">
        <!--
                    auto-upload: 是否自动上传
                    action: 服务器图片接口路径
                    name: 上传的文件字段名
                    headers: 设置上传的请求头部
                    on-success: 文件上传成功事件
                 -->
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="true"
          action="/api/upload"
          name="file"
          :headers="{ Authorization: tokenStore.token }"
          :on-success="uploadSuccsee"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else :src="imgUrl ? imgUrl : avatar" width="278" />
        </el-upload>

        <br />
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>

        <el-button
          type="success"
          :icon="Upload"
          size="large"
          @click="uploadAvatar"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
