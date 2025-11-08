/**
 * 登录模型
 */
interface Login {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 确认密码 */
  rePassword?: string;
  /** 验证码 */
  captcha?: string;
  /** 验证码唯一标识 */
  uuid?: string;
}
