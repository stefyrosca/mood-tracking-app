import {Injectable} from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Database} from "../persistence/database";
import {User} from "../model/user";
import {LOCAL_USER_ID} from "../shared/constants";
import {AuthService} from "./auth-service";

@Injectable()
export class UserService {
  private _db;
  private user = null;

  constructor(private authHttp: AuthService, private db: Database) {
    this._db = db.getDB();
  }

  createUser(user: User, next: (user)=>any, error: (error: any)=>any) {
    return this.authHttp.post("http://localhost:3000/auth/signup", user).subscribe(
      (result: any) => {
        this.authHttp.setLocalUser(result.user, result.token);
        next(result);
      },
      error
    );
  }

  removeLocalUser() {
    return this._db.get(LOCAL_USER_ID)
      .then(result => {
        result._deleted = true;
        return this._db.put(result)
      })
      .catch(error => console.log("geterror", error));
  }

  getByUsername(username: string) {
    return this._db.query("user/getByUsername", {key: username})
      .then(result => {
        if (result.rows.length == 0) {
          return Promise.resolve("username is ok");
        }
        return Promise.reject("username already exists");
      });
  }

  getAllDocs() {
    return this._db.allDocs({include_docs: true})
      .then(result => console.log('result on all docs', result))
      .catch(error => console.log('error on all docs', error))
  }

  getLocalUser() {
    return this.authHttp.getLocalUser();
  }

  login(user: User, next: (result)=>any, error: (error: any)=>any) {
    return this.authHttp.post("http://localhost:3000/auth/login", user)
      .map(result => result.json())
      .subscribe((result) => {
          this.authHttp.setLocalUser(result.user, result.token);
          next(result);
        }
        , error
      );
  }

}
