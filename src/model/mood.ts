import {ResourceTypes} from "./resource-types";
import {User} from "./user";
export class Mood {
  _id?: string;
  id?: string;
  title: string;
  body: string;
  likes?: string[];
  emotion: any; // ? img id
  recording?: any;
  user: string | User;
  // resourceType: string = ResourceTypes.MOOD;
  timestamp: Date;
}
