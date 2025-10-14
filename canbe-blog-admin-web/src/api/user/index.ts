import request from "@/utils/request";

export const userRegisterService = (registerModule: any) => {
  const params = new URLSearchParams();
  for (let key in registerModule) {
    params.append(key, registerModule[key]);
  }
  return request.post("/user/register", params);
};

export const userLoginService = (loginModule: any) => {
  const params = new URLSearchParams();
  for (let key in loginModule) {
    params.append(key, loginModule[key]);
  }
  return request.post("/user/login", params);
};

export const userInfoService = () => {
  return request.get("/user/userInfo");
};

export const userUpdateService = (userInfo: any) => {
  return request.put("/user/update", userInfo);
};

export const userAvaterUpdateService = (avater: any) => {
  return request.patch("/user/updateAvatar?avatarUrl=" + avater);
};
