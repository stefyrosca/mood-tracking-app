import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Database} from "../persistence/database";
import {Mood} from "../model/mood";
import {ResourceTypes} from "../model/resource-types";
import {Observable} from "rxjs";

@Injectable()
export class MoodService {
  private _url = 'http://jsonplaceholder.typicode.com/posts';
  private _db: any;

  constructor(private http: Http, db: Database) {
    this._db = db.getDB();
  }

  public getById(id: number) {
    return this.http
      .get(this._url + "/" + id)
      .map(data => data.json())
      .catch(error => error);
  }

  public getAll() {
    return this.http
      .get(this._url)
      .map(data => data.json())
      .flatMap(result => result)
  }

  public postMood(mood: Mood) {
    console.log('postMood', mood);
    return this._db.post(mood)
      .then(result => {
        console.log('result', result);
        return result;
      })
      .catch(error => {
          console.log('error', error);
          return Promise.reject(new Error("SORRY, no can do"));
        }
      );
  }

  public getMyMoods(userId: string) {
    return Observable
      .fromPromise(this._db.query("post/getByUser", {key: userId, include_docs: true}))
      .map((result: any) => result.rows)
      .flatMap(row => row)
      .map((result: any) => result.doc);
  }
}
