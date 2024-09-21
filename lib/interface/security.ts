/**
 * 安全
 */
export namespace ISecurity {
    /**
     * 超级管理员密码
     */
    export interface MasterPassword {
        oldMasterPassword: string
    }
    /**
     * 超级管理员密码修改表单
     */
    export interface MasterPasswordUpdateForm {
        oldMasterPassword: string
        newMasterPassword: string
    }
    /**
     * 数据安全校验规则
     */
    export type SecurityRules = Record<string, string>
}
