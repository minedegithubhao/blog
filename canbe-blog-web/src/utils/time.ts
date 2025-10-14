/**
 * 格式化日期
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期字符串 YYYY-MM-DD
 */
export const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * 格式化日期
 * @param {string} date 日期对象
 * @returns {string} 格式化后的日期字符串 YYYY-MM-DD
 */
export const formatStringDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 格式化时间
 * @param {string|number|Date} time 时间
 * @returns {string} 格式化后的时间
 */
export function formatTime(time: string | number | Date) {
    const date = new Date(time)
    const now = new Date()
    const diff = (now.getTime() - date.getTime()) / 1000 // 转换为秒

    if (diff < 60) {
        return '刚刚'
    } else if (diff < 3600) {
        return Math.floor(diff / 60) + '分钟前'
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) + '小时前'
    } else if (diff < 2592000) {
        return Math.floor(diff / 86400) + '天前'
    } else if (diff < 31536000) {
        return Math.floor(diff / 2592000) + '个月前'
    } else {
        return formatDate(date)
    }
}