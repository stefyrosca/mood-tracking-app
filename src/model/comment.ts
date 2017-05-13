import {User} from "./user";

export class Comment {
  text: string;
  user: string | User;
  mood: string;
  timestamp: Date;
  // resourceType: string = ResourceTypes.COMMENT;
}
