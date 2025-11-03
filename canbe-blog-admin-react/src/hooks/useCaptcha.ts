import { useEffect } from "react";
export default function useCaptcha() {

  const url = "/api/public/genImageCaptcha";

  // 添加更新验证码图片的方法
    const refreshCaptcha = () => {
      const captchaImg = document.querySelector('.captchaImg img') as HTMLImageElement;
      if (captchaImg) {
        // 添加时间戳参数强制刷新图片
        captchaImg.src = url + "?t=" + Date.now();
      }
    };
  
    // 在组件挂载时更新验证码
    useEffect(() => {
      refreshCaptcha();
    }, []);

  return {
    url: url,
    refreshCaptcha: refreshCaptcha,
  };
}
