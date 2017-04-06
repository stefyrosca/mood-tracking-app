import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Observable} from "rxjs";
import {Database} from "../persistence/database";
import {Comment} from '../model/comment'

@Injectable()
export class CommentService {
  private _db;

  constructor(private http: Http, db: Database) {
    this._db = db.getDB();
  }

  public getCommentsByPost(id: string) {
    return Observable
      .fromPromise(this._db.query("mood/getCommentsByMood", {key: id, include_docs: true}))
      .map((result: any) => result.rows)
      .flatMap(row => row)
      .map((result: any) => result.doc);
  }

  public addCommentToPost(comment: Comment) {
    return this._db.post(comment)
      .then(result => {
        return result;
      })
      .catch(error => {
          return Promise.reject(new Error("SORRY, no can do"));
        }
      );
  }

}
