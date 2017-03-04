import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Database} from "../persistence/database";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {LOCAL_USER_ID} from "../shared/constants";

@Injectable()
export class UserService {
  private _db;

  constructor(private http: Http, db: Database) {
    this._db = db.getDB();
  }

  createUser(user: User) {
    return this._db.post(user)
      .then(result => {
        console.log('result', result);
        return this.createLocalUser(result.id);
      })
      .catch(error => {
          console.log('error', error);
          return Promise.reject(new Error("SORRY, no can do"));
        }
      );
  }

  createLocalUser(id: string) {
    return this._db.put({
      _id: LOCAL_USER_ID,
      username: "bob",
      userId: id
    }).then(localOk => {
      console.log("localOk", localOk);
    })
      .catch(localNotOk => {
        console.log('localNotOk', localNotOk);
        return Promise.reject(new Error("SORRY, no can do"));
      });
  }

  getLocalUser() {
    return Observable.fromPromise(this._db.get(LOCAL_USER_ID));
  }

  removeLocalUser() {
    return this._db.get(LOCAL_USER_ID)
      .then(result => {
        console.log('result!!!!', result);
        result._deleted = true;
        return this._db.put(result)
          .then(after => console.log('after', after))
          .catch(error => console.log('error', error));
      })
      .catch(error => console.log("geterror", error));
  }

  getByUsername() {
    return this._db.get("_design/user/_view/getByUsername?key=\"test\"")
      .then(result => console.log('result', result))
      .catch(error => console.log('error', error))
  }
}
