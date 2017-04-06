import {ResourceTypes} from "./resource-types";

export class Comment {
  text: string;
  userId: string;
  postId: string;
  resourceType: string = ResourceTypes.COMMENT;
}
