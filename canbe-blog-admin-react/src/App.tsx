import routes from "@/router";
import useStore from "@/stores";
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
  const { token } = useStore();

  
  // web端不需要登录认证
  if (location.pathname.startsWith("/web")) {
    return outlet;
  }
  // /login，有token，则跳转首页
  if (location.pathname === "/login" && token) {
    return <Navigate to="/home" />;
  }
  // 是/login，没有token，则跳转登录页
  if (location.pathname !== "/login" && !token) {
    alert(token);
    message.warning("您还未登录,请先登录");
    return <Navigate to="/login" />;
  }
  // 其他，正常显示页面
  return outlet;
};

function App() {
  return <AuthRoute />;
}

export default App;
