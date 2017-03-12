export interface User {
  username: string;
  name: string;
  _id?: string;
}

export interface LocalUser extends User{
  userId: string;
}
