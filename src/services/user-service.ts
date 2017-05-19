import {Injectable} from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Database} from "../persistence/database";
import {User} from "../model/user";
import {LOCAL_USER_ID} from "../shared/constants";
import {AuthService} from "./auth-service";

const defaultUserPreferences = {
  theme: "red-theme"
};

@Injectable()
export class UserService {
  private _db;
  private user = null;
  private userPreferences: any = defaultUserPreferences;
  private url = "http://192.168.137.1:3000";

  constructor(private authHttp: AuthService, private db: Database) {
    this._db = db.getDB();
  }

  createUser(user: User, next: (user)=>any, error: (error: any)=>any) {
    return this.authHttp.post(this.url + "/auth/signup", user).subscribe(
      (result: any) => {
        this.authHttp.setLocalUser(result.user, result.token);
        next(result);
      },
      error
    );
  }

  getUserPreferences() {
    return this.userPreferences;
  }

  setUserPreference(key: string, value: any) {
    this.userPreferences[key] = value;
  }

  getLocalUser() {
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

}
