import {ResourceTypes} from "./resource-types";

export class User {
  username: string;
  password: string;
  name: string;
  _id?: string;
  resourceType: string = ResourceTypes.USER;

  constructor() {
    // this.username;
    // this.password = '';
    // this.name = '';
  }
}

export class LocalUser extends User{
  userId: string;

  constructor() {
    super();
  }
}
