//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
// 浏览器会自动将当前ajax所在的源拼接上，即http://localhost:5173/api
const baseURL = '/api'; 
//定义一个变量,记录公共的前缀  ,  baseURL
const instance = axios.create({baseURL})

// import { useRouter } from 'vue-router'
// const router = useRouter()
/**
 *  在 request.ts 这样的工具文件中，我们不在Vue组件内部，无法使用组合式API
 *  需要直接访问路由实例来进行导航操作（如
 * 
 *  useRouter() 只能在Vue的响应式系统中使用，通常在组件内部
 * 在axios拦截器这样的独立工具函数中，需要具体的router实例来执行路由跳转
 */
import router from '@/router'
//添加响应拦截器
instance.interceptors.response.use(
    result => {
        // 判断业务状态码
        if (result.data.code === 0) {
            // 响应成功，返回数据
            return result.data
        }
        // 这里提示用户请求失败
        ElMessage.error(result.data.message ? result.data.message : '服务异常')
        // 异步操作的状态转化为失败的状态
        return Promise.reject(result.data);
    },
    err => {
        // 未登录
        if (err.response.status === 401) {
            ElMessage.error('请先登录')
            // 跳转到登录页面
            router.push('/')
        }else{
            ElMessage.error('服务异常')
            return Promise.reject(err);//异步的状态转化成失败的状态
        }
    }
)

export default instance;