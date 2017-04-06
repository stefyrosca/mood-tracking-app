import {ResourceTypes} from "./resource-types";

export class User {
  username: string;
  name: string;
  _id?: string;
  resourceType: string = ResourceTypes.USER;
}

export class LocalUser extends User{
  userId: string;
}
