import { create } from "zustand";

type TokenStore = {
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
};
const useTokenStore = create<TokenStore>((set) => ({
  token: localStorage.getItem("token") || "",
  setToken: (token: string) => {
    set({ token });
    // 保存到localStorage
    localStorage.setItem("token", token);
  },
  removeToken: () => {
    set({ token: "" });
    // 同时从localStorage中移除
    localStorage.removeItem("token");
  },
}));

export default useTokenStore
