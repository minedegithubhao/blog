<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";

//文章分类数据模型
const categorys = ref([
  {
    id: 3,
    categoryName: "美食",
    categoryCode: "my",
    createTime: "2023-09-02 12:06:59",
    updateTime: "2023-09-02 12:06:59",
  },
  {
    id: 4,
    categoryName: "娱乐",
    categoryCode: "yl",
    createTime: "2023-09-02 12:08:16",
    updateTime: "2023-09-02 12:08:16",
  },
  {
    id: 5,
    categoryName: "军事",
    categoryCode: "js",
    createTime: "2023-09-02 12:08:33",
    updateTime: "2023-09-02 12:08:33",
  },
]);

//用户搜索时选中的分类id
const categoryId = ref("");

//用户搜索时选中的发布状态
const state = ref("");

//文章列表数据模型
const articles = ref([
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
]);

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(5); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  articleList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  articleList();
};

import { articleCategoryService, articleListService } from "@/api/article";

const articleCategory = async () => {
  let result = await articleCategoryService();
  categorys.value = result.data;
};
articleCategory();
const articleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null,
  };
  let result = await articleListService(params);
  articles.value = result.data.records;

  //为列表中添加categoryName属性
  for (let i = 0; i < articles.value.length; i++) {
    let article = articles.value[i];
    for (let j = 0; j < categorys.value.length; j++) {
      if (article.categoryId === categorys.value[j].id) {
        article.categoryName = categorys.value[j].categoryName;
      }
    }
  }

  //渲染总条数
  total.value = result.data.total;
};
articleList();


const search = () => {
  articleList();
};
const reset = () => {
  categoryId.value = "";
  state.value = "";
};

import { Plus } from "@element-plus/icons-vue";
//控制抽屉是否显示
const visibleDrawer = ref(false);
//添加表单数据模型
const articleModel = ref({
  title: "",
  categoryId: 0,
  coverImg: "",
  content: "",
  state: 0,
});

import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { QuillEditor } from "@vueup/vue-quill";

import { articleAddService, articleUpdateService } from "@/api/article";
import { ElMessage } from "element-plus";
const title = ref("");
const publish = async (state) => {
  articleModel.value.state = state;
  if (!articleModel.value.id) {
    await articleAddService(articleModel.value);
    ElMessage.success("发布成功");
  } else {
    await articleUpdateService(articleModel.value);
    ElMessage.success("修改成功");
  }
  articleList();
  visibleDrawer.value = false;
};

import { useTokenStore } from "@/stores/token.ts";
const tokenStore = useTokenStore();

// 上传图片成功回调函数
const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data;
  console.log(result.data);
};

const editArticle = async (row) => {
  visibleDrawer.value = true;
  articleModel.value.title = row.title;
  articleModel.value.categoryId = row.categoryId;
  articleModel.value.coverImg = row.coverImg;
  articleModel.value.content = row.content;
  articleModel.value.id = row.id;
  articleModel.value.state = row.state;
};

const clearArticleModel = () => {
  articleModel.value.title = "";
  articleModel.value.categoryId = "";
  articleModel.value.coverImg = "";
  articleModel.value.content = "";
  articleModel.value.id = "";
  articleModel.value.state = "";
};
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>

        <div class="extra">
          <el-button
            type="primary"
            @click="
              title = '发布文章';
              visibleDrawer = true;
              clearArticleModel();
            "
            >添加文章</el-button
          >
        </div>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select
          placeholder="请选择"
          v-model="categoryId"
          style="width: 180px"
        >
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state" style="width: 180px">
          <el-option label="已发布" value="0"></el-option>

          <el-option label="草稿" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>

        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column
        label="文章标题"
        width="400"
        prop="title"
      ></el-table-column>

      <el-table-column label="分类" prop="categoryName"></el-table-column>

      <el-table-column label="发表时间" prop="createTime"> </el-table-column>

      <el-table-column label="状态" prop="state"></el-table-column>

      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="
              title = '编辑文章';
              editArticle(row);
            "
          ></el-button>

          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </el-card>

  <!-- 抽屉 -->
  <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
    <!-- 添加文章表单 -->
    <el-form :model="articleModel" label-width="100px">
      <el-form-item label="文章标题">
        <el-input
          v-model="articleModel.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>

      <el-form-item label="文章分类">
        <el-select placeholder="请选择" v-model="articleModel.categoryId">
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.categoryName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文章封面">
        <!--
                    auto-upload: 是否自动上传
                    action: 服务器图片接口路径
                    name: 上传的文件字段名
                    headers: 设置上传的请求头部
                    on-success: 文件上传成功事件
                 -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="true"
          :show-file-list="false"
          action="/api/upload"
          name="file"
          :headers="{ Authorization: tokenStore.token }"
          :on-success="uploadSuccess"
        >
          <img
            v-if="articleModel.coverImg"
            :src="articleModel.coverImg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="articleModel.content"
            contentType="text"
          >
          </quill-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="publish(0)">发布</el-button>

        <el-button type="info" @click="publish(1)">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
