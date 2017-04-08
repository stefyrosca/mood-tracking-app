import {ResourceTypes} from "./resource-types";

export class Comment {
  text: string;
  userId: string;
  moodId: string;
  resourceType: string = ResourceTypes.COMMENT;
}
