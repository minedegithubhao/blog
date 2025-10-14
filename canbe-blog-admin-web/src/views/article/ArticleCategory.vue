<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
const categorys = ref([]);
import {
  articleCategoryService,
  articleCategoryAddService,
  aritcleCategoryUpdateService,
  articleCategoryDeleteService,
} from "@/api/article";
const articleCategoryList = async () => {
  let result = await articleCategoryService();
  categorys.value = result.data;
};
articleCategoryList();

//控制添加分类弹窗
const dialogVisible = ref(false);

//添加分类数据模型
const categoryModel = ref({
  id: "",
  categoryName: "",
  categoryCode: "",
});
//添加分类表单校验
const rules = {
  categoryName: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
  ],
  categoryCode: [
    { required: true, message: "请输入分类别名", trigger: "blur" },
  ],
};

const title = ref("");
import { ElMessage } from "element-plus";
const addAritcleCategory = async () => {
  if (title.value === "添加分类") {
    let result = await articleCategoryAddService(categoryModel.value);
    ElMessage.success(result.message ? result.message : "新增成功");
  }
  if (title.value === "编辑分类") {
    let result = await aritcleCategoryUpdateService(categoryModel.value);
    ElMessage.success(result.message ? result.message : "修改成功");
  }

  dialogVisible.value = false; // 关闭弹窗
  articleCategoryList();
};

const updateCategory = async (row) => {
  // 获取当前行数据
  categoryModel.value.categoryName = row.categoryName;
  categoryModel.value.categoryCode = row.categoryCode;
  categoryModel.value.id = row.id;
};

const clearCategoryModule = () => {
  categoryModel.value.categoryName = "";
  categoryModel.value.categoryCode = "";
  categoryModel.value.id = "";
};

import { ElMessageBox } from "element-plus";
const deleteCategory = (row) => {
  ElMessageBox.confirm("你确定删除该分类信息?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await articleCategoryDeleteService(row.id);
      ElMessage.success("删除成功");
      articleCategoryList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>

        <div class="extra">
          <el-button
            type="primary"
            @click="
              title = '添加分类';
              dialogVisible = true;
              clearCategoryModule();
            "
            >添加分类</el-button
          >
        </div>
      </div>
    </template>

    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>

      <el-table-column label="分类名称" prop="categoryName"></el-table-column>

      <el-table-column label="分类别名" prop="categoryCode"></el-table-column>

      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="
              title = '编辑分类';
              dialogVisible = true;
              updateCategory(row);
            "
          ></el-button>

          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategory(row)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form
        :model="categoryModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="categoryModel.categoryName"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>

        <el-form-item label="分类别名" prop="categoryCode">
          <el-input
            v-model="categoryModel.categoryCode"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>

          <el-button type="primary" @click="addAritcleCategory">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
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
</style>
