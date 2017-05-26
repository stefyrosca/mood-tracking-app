export enum AllowedActions {
  PUSH = <any>"push",
  REPLACE = <any> "replace"
}

export class UserProfileOptions {
  allowRedirect?: boolean;
  action?: AllowedActions;
}
export class CommentOptions {
  allowRedirect?: boolean;
  action?: AllowedActions;
}

export class HeartOptions {
  allow?: boolean;
}

export class MoodDisplayOptions {
  userProfile?: UserProfileOptions;
  comment?: CommentOptions;
  heart?: HeartOptions;
}

export const defaultOptions: MoodDisplayOptions = {
  comment: {
    allowRedirect: true,
    action: AllowedActions.PUSH
  },
  userProfile: {
    allowRedirect: true,
    action: AllowedActions.PUSH
  },
  heart: {
    allow: true
  }
};

