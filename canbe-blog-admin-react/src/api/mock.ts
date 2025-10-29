import Mock from "mockjs";

// mock数据：1.安装并配置接口拦截
Mock.mock("/api/sysMenu/getMenuList", "get", () => {
  return {
    code: 0,
    message: "请求成功",
    data: [
      {
        key: "/home",
        label: "首页",
        icon: "HomeOutlined",
        children: null,
      },
      {
        key: "/system",
        label: "系统管理",
        icon: "UserOutlined",
        children: [
          {
            key: "/system/user",
            label: "用户管理",
            icon: "",
            children: null,
          },
          {
            key: "/system/role",
            label: "角色管理",
            icon: "",
            children: null,
          },
          {
            key: "/system/menu",
            label: "菜单管理",
            icon: "",
            children: null,
          },
          {
            key: "/system/dict",
            label: "字典管理",
            icon: "",
            children: null,
          },
          {
            key: "/system/param",
            label: "参数管理",
            icon: "",
            children: null,
          },
          {
            key: "/system/file",
            label: "文件管理",
            icon: "",
            children: null,
          },
        ],
      },
      {
        key: "/blog",
        label: "博客管理",
        icon: "TeamOutlined",
        children: [
          {
            key: "/blog/article",
            label: "文章管理",
            icon: "",
            children: null,
          },
          {
            key: "/blog/tag",
            label: "标签管理",
            icon: "",
            children: null,
          },
          {
            key: "/blog/category",
            label: "分类管理",
            icon: "",
            children: null,
          },
        ],
      },
      {
        key: "/about",
        label: "关于我们",
        icon: "QuestionCircleOutlined",
        children: null,
      },
    ],
  };
});

Mock.mock("/api/user/list", "get", () => {
  return {
    code: 0,
    message: "请求成功",
    data: [
      {
        id: 1,
        username: "admin",
        nickname: "管理员",
        avatar:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
        role: "admin",
        sex: null,
        state: 1,
        createTime: "2021-09-01 00:00:00",
        updateTime: "2021-09-01 00:00:00",
        delFlag: 0,
      },
      {
        id: 2,
        username: "user",
        nickname: "用户",
        avatar:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
        role: "user",
        sex: 0,
        state: 0,
        createTime: "2021-09-01 00:00:00",
        updateTime: "2021-09-01 00:00:00",
        delFlag: 1,
      },
      {
        id: 3,
        username: "guest",
        nickname: "访客",
        avatar:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
        role: "guest",
        sex: 1,
        state: 0,
        createTime: "2021-09-01 00:00:00",
        updateTime: "2021-09-01 00:00:00",
        delFlag: 1,
      }
    ],
  };
});
