export interface UserInfo {
  id: string;
  name: string;
  email: string;
  roles: RoleModel[];
}

export interface RoleModel {
  name: string;
  description: string;
  permissions: PermissionModel[];
}

export interface PermissionModel {
  name: string;
  description: string;
}

