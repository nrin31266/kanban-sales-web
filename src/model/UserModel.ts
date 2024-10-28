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