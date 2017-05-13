import * as  moment from 'moment';

export function formatTimestamp(date:Date | string, format?: string) {
  return moment(date).format(format ? format : 'lll');
}

export const UserActions = {
  LOVE: "love",
  COMMENT: "comment",
  USER: "user"
}
