export interface UserInfo {
  id: string;
  emailVerified?: boolean;
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

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  roles: RoleModel[]
}

export interface CreateUserRequest{
  name: string,
  email: string,
  password: string
}

export interface UserInfoResponse {
  id: string
  name: string
  email: string
  emailVerified: boolean
  roles: RoleModel[]
}