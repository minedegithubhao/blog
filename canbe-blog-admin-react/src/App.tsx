import routes from "@/router";
import store from "@/stores/index";
import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { message } from "antd";
/**
 * 路由守卫
 * 1、如果访问的是/login，有token，则跳转首页
 * 2、如果访问的不是/login，没有token，则跳转登录页
 * 3、其余，正常显示页面
 * @returns 路由守卫
 */
const AuthRoute = () => {
  const location = useLocation();
  const outlet = useRoutes(routes);
  const token = store.getState().tokenStore.token;

  if (location.pathname === "/login" && token) {
    return <Navigate to="/home" />;
  }
  if (location.pathname !== "/login" && !token) {
    message.warning("您还未登录,请先登录");
    return <Navigate to="/login" />;
  }
  return outlet;
};

function App() {
  return <AuthRoute />;
}

export default App;
