export enum UserRole {
  CLIENT = 'CLIENT',
  WORKER = 'WORKER'
};

export interface User {
    username: String,
    password: String,
    role: UserRole,
    refreshToken: String
};
