export interface UserInfo {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  name: string;
  description: string;
}
