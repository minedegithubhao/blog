import { loginService } from "@/api/login";
import useCaptcha from "@/hooks/useCaptcha";
import useStore from "@/stores";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Space, message } from "antd";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import initLoginBg from "./init";
import "./login.less";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { token,setToken } = useStore();

  useEffect(() => {
    initLoginBg();
    window.onresize = () => {
      initLoginBg();
    };
  }, []);

  const [username, setUsername] = useState("");
  const usernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const [password, setPassword] = useState("");
  const passwordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const [captcha, setCaptcha] = useState("");

  const capthaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCaptcha(e.target.value);
  };

  const { url, refreshCaptcha } = useCaptcha();

  const login = async () => {
    // 参数校验，用户名、密码不能为空，这个可以改为使用参数校验框架
    if (
      !username.trim() ||
      !password.trim()
      // || !captcha
      // || !localStorage.getItem('uuid')
    ) {
      message.warning("请输入用户名、密码");
      return;
    }
    const result = await loginService({
      username,
      password,
      captcha,
      uuid: localStorage.getItem("uuid") as string,
    });
    setToken(result.data as string);
    message.success(result.message);
    navigate("/home");
  };

  return (
    <div className={styles.loginPage}>
      {/* 登录页面北京图片 */}
      <canvas id="canvas" style={{ display: "block" }}></canvas>
      <div className={styles.loginBox + " loginBox"}>
        <div className={styles.title}>
          <h1>Canbe&nbsp;·&nbsp;后台管理系统</h1>
          <p>打开新世界的大门</p>
        </div>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Input
            placeholder="请输入用户名"
            prefix={<UserOutlined />}
            onChange={usernameChange}
          />
          <Input.Password
            placeholder="请输入密码"
            prefix={<LockOutlined />}
            onChange={passwordChange}
          />
          <div className="captchaBox">
            <Input placeholder="请输入验证码" onChange={capthaChange} />
            <div className="captchaImg" onClick={refreshCaptcha}>
              <img
                src={url}
                alt="验证码"
                onClick={refreshCaptcha}
                style={{ height: "32px", borderRadius: "8px" }}
              />
            </div>
          </div>
          <Button type="primary" block onClick={login}>
            登录
          </Button>
        </Space>
      </div>
    </div>
  );
};
export default Login;
