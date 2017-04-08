import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Database} from "../persistence/database";
import {User, LocalUser} from "../model/user";
import {Observable} from "rxjs";
import {LOCAL_USER_ID, HttpErrors} from "../shared/constants";
import {CreateUser} from "../pages/create-profile/create-user/create-user";
import {NavController} from "ionic-angular";

@Injectable()
export class UserService {
  private _db;
  private user = null;

  constructor(private http: Http, db: Database) {
    this._db = db.getDB();
  }

  createUser(user: User) {
    return this._db.post(user)
      .then(result => {
        return this.createLocalUser(user, result.id);
      })
      .catch(error => {
          console.log('error', error);
          return Promise.reject(new Error("SORRY, no can do"));
        }
      );
  }

  createLocalUser(user: User, id: string) {
    this.user = user;
    return this._db.put({
      _id: LOCAL_USER_ID,
      username: user.username,
      name: user.name,
      userId: id
    }).then(localOk => console.log("localOk", localOk))
      .catch(localNotOk => {
        console.log('localNotOk', localNotOk);
        return Promise.reject(new Error("SORRY, no can do"));
      });
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

  getUser() {
    if (this.user == null) {
      return this._db.get(LOCAL_USER_ID)
        .then(result => {
          this.user = result;
          return this.user;
        })
        .catch(error => {
          console.log('error', error);
          return Promise.reject(error);
        });
    }
    return new Promise((resolve) => resolve(this.user));
  }
}
