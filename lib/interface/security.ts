/**
 * 安全
 */
export namespace ISecurity {
  /**
   * 超级管理员密码
   */
  export interface MasterPassword {
    oldMasterPassword: string;
  }
  /**
   * 超级管理员密码修改表单
   */
  export interface MasterPasswordUpdateForm {
    oldMasterPassword: string;
    newMasterPassword: string;
  }
  /**
   * 角色
   */
  export interface Roles {
    roles: string[];
  }
  /**
   * 数据安全校验规则
   */
  export type SecurityRules = Record<string, string>;

  /**
   * 用户信息
   */
  export interface UserInfo{
    userName: string;
    password: string | null;
    enabled: boolean;
  }

  /**
   * 用户
   */
  export interface Users {
    users: UserInfo[];
  }

  /**
   * 用户新增或者编辑参数
   */
  export interface UserOperateParameters {
    user: {
      userName: string;
      password: string;
      enabled: boolean;
    };
  }
}
