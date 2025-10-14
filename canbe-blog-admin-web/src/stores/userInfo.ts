import { defineStore } from "pinia";
import { ref } from "vue";

const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    //1.定义描述token
    const userInfo = ref({});

    //2.定义修改token的方法
    const setUserInfo = (newToken: string) => {
      userInfo.value = newToken;
    };

    //3.定义移除token的方法
    const removeUserInfo = () => {
      userInfo.value = {};
    };

    // 4.更新userInfo
    return { userInfo, setUserInfo, removeUserInfo };
  },
  {
    //参数持久化
    persist: true,
  }
);

export default useUserInfoStore;
