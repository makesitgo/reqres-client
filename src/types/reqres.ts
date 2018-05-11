export interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserPayload {
  data: User;
}

export interface UserList {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export interface UsersApi {
  list: () => Promise<UserList>;
  create: (data: UserRequest) => Promise<UserResponse>;
  user: (userId: number) => {
    get: () => Promise<UserPayload>;
    remove: () => Promise<never>;
    update: (data: UserRequest) => Promise<UserResponse>;
    modify: (data: UserRequest) => Promise<UserResponse>;
  }
}

export interface ReqresParams {
  page: number;
  per_page: number;
  delay: number;
}

export interface UserRequest {
  name?: string;
  job?: string;
}

export interface UserResponse {
  id?: number;
  name: string;
  job: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreds {
  email: string;
  password?: string;
}

export interface UserAccess {
  token: string;
}
