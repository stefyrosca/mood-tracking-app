import {ResourceTypes} from "./resource-types";
export class Mood {
  _id?: string;
  title: string;
  body: string;
  emotion: any; // ? img id
  recording?: any;
  user: string;
  // resourceType: string = ResourceTypes.MOOD;
  timestamp: Date;
}
