import {Injectable} from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {User, defaultUserPreference, UserPreference} from "../model/user";
import {AuthService} from "./auth-service";
import {serverConfig} from "./server-config";
import {CustomLoadingController} from "./loading-controller";
import {BehaviorSubject, Observable} from "rxjs";
import {SENTIMENT_MAPPING} from "../shared/sentiment-mapping";


@Injectable()
export class UserService {
  userPreferences: UserPreference = defaultUserPreference;
  private url = serverConfig.getBaseUrl();
  private subscription: BehaviorSubject<UserPreference>;

  constructor(private authHttp: AuthService, private loadingController: CustomLoadingController) {
  }

  createUser(user: User, next: (user)=>any, error: (error: any)=>any) {
    return this.authHttp.post(this.url + "/auth/signup", user)
      .map(result => result.json())
      .subscribe(
        (result: any) => {
          this.authHttp.setLocalUser(result.user, result.token);
          next(result);
        },
        error
      );
  }

  async getUserPreferences(): Promise<UserPreference> {
    if (!this.userPreferences) {
      await this.getLocalUser().then((user: User) => {
        this.userPreferences = user.preferences;
        this.subscription.next(this.userPreferences);
        return Promise.resolve(this.userPreferences);
      });
    }
    return Promise.resolve(this.userPreferences);
  }

  async setUserPreference(key: string, value: any, callback?: (userPreferences: UserPreference)=>void) {
    this.loadingController.create({content: 'Wait please...'});
    this.userPreferences[key] = value;
    let user = await this.authHttp.getLocalUser();
    let updatedUser: User = Object.assign({}, user, {preferences: this.userPreferences});
    this.updateUser(updatedUser, (user: User) => {
      this.userPreferences = user.preferences;
      this.subscription.next(this.userPreferences);
      this.loadingController.dismiss();
      callback && callback(user.preferences);
    }, (error) => {
      console.log('set user preference error', error)
      this.loadingController.dismiss();
      throw error;
    });
  }

  updateUser(user: User, next: (user: any)=>any, error: (err: any) => any) {
    return this.authHttp.put(this.url + "/User/" + user.id, user)
      .map(result => result.json())
      .subscribe(
        (result: any) => {
          this.authHttp.setLocalUser(result);
          next(result);
        },
        error
      );
  }

  updateTheme(sentiment: string) {
    if (this.userPreferences.allowThemeChange) {
      let newTheme = SENTIMENT_MAPPING[sentiment];
      this.setUserPreference('theme', newTheme);
    }
  }

  getLocalUser(): Promise<User> {
    return this.authHttp.getLocalUser();
  }

  login(user: User, next: (result)=>any, error: (error: any)=>any) {
    return this.authHttp.post(this.url + "/auth/login", user)
      .map(result => result.json())
      .subscribe((result) => {
          this.authHttp.setLocalUser(result.user, result.token);
          next(result);
        }
        , error
      );
  }

  subscribe() {
    if (!this.subscription)
      this.subscription = new BehaviorSubject(this.userPreferences);
    return this.subscription;
  }
}
