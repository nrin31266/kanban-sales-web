export interface UserInfo {
  id: string;
  emailVerified?: boolean;
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

export interface UserProfile {
  id: string
  userId: string
  name: string
  phone: string
  dob: any
  avatar: string
  gender: number
  createdAt: string
  updatedAt: string
}

export interface UserProfileRequest {
  name: string
  phone: string
  dob: any
  avatar: string
  gender: number
}
