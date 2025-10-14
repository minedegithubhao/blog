import type { DelFlagStatus } from '@/api/DelFlagStatus'
export interface CommonField {
    /** 创建人ID */
    createUser: string;
    /** 创建人名称 */
    createUsername: string;
    /** 创建时间 */
    createTime: string;
    /** 更新人 */
    updateUser: string;
    /** 更新人名称 */
    updateUsername: string;
    /** 更新时间 */
    updateTime: string;
    /** 删除标记 */
    delFlag: DelFlagStatus;
}