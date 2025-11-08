import request from "@/utils/request";


export const loginService = (login: Login):Promise<Result> => {
  const params = new URLSearchParams();
  for (const key in login) {
    params.append(key, login[key]);
  }
  return request.post("/public/login", params);
};
