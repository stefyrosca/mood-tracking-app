import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Database} from "../persistence/database";
import {Mood} from "../model/mood";
import {ResourceTypes} from "../model/resource-types";
import {Observable} from "rxjs";
import {CommentService} from "./comment-service";

@Injectable()
export class MoodService {
  private _url = 'http://jsonplaceholder.typicode.com/posts';
  private _db: any;

  constructor(private http: Http, db: Database, private commentService: CommentService) {
    this._db = db.getDB();
  }

  public getById(id: number) {
    return this.http
      .get(this._url + "/" + id)
      .map(data => data.json())
      .catch(error => error);
  }

  public getAll() {
    return Observable
      .fromPromise(this._db.query("mood/getAllMoods", {include_docs: true, desccending: true}))
      .map((result: any) => {
        return result.rows
      })
      .flatMap(row => row)
      .map((result: any) => result.doc);
  }

  // return this.http
  //   .get(this._url)
  //   .map(data => data.json())
  //   .flatMap(result => result)

  public postMood(mood: Mood) {
    return this._db.post(mood)
      .then(result => {
        return result;
      })
      .catch(error => {
          return Promise.reject(new Error("SORRY, no can do"));
        }
      );
  }

  public getMyMoods(userId: string) {
    return Observable
      .fromPromise(this._db.query("mood/getByUser",
        {
          startKeys: [userId, {}],
          endKey: userId,
          include_docs: true,
          descending: true
        }))
      .map((result: any) => result.rows)
      .flatMap(row => row)
      .map((result: any) => result.doc);
  }

  public deleteMood(mood: Mood) {
    mood['_deleted'] = true;
    let comments = [];
    return Observable.fromPromise(this._db.put(mood)
      .then(result => {
          this.commentService.getCommentsByPost(mood._id).subscribe(
            comment => {
              comment['_deleted'] = true;
              comments.push(comment)
            },
            error => Promise.reject('not good' + error),
            () => {
              console.log('it s done');
              console.log('comments', comments);
              Promise.resolve(this._db.bulkDocs(comments));
            }
          );
        }
      )
      .catch(error =>console.log('patasti', error))
    );
  }
}
