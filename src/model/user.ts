import {ResourceTypes} from "./resource-types";

export const defaultUserPreference: UserPreference = {
  theme: "red-theme",
  allowThemeChange: true,
  automaticDetectMood: true
};

export class User {
  username: string;
  password: string;
  name: string;
  id?: string;
  _id?: string;
  preferences: UserPreference;
  resourceType: string = ResourceTypes.USER;

  constructor() {
    this.preferences = Object.assign({}, defaultUserPreference);
  }
}

export class UserPreference {
  public theme: string;
  public allowThemeChange: boolean;
  public automaticDetectMood: boolean;
}
