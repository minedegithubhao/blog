import request from "@/utils/request";


export const loginService = (loginModule: LoginModel):Promise<Result> => {
  const params = new URLSearchParams();
  for (const key in loginModule) {
    params.append(key, loginModule[key]);
  }
  return request.post("/public/login", params);
};
