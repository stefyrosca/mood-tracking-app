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
import {TOKEN} from "../shared/constants";
import {Storage} from "@ionic/storage";
import {AuthService} from "./auth-service";

@Injectable()
export class MoodService {
  private _url = 'http://jsonplaceholder.typicode.com/posts';
  private _db: any;
  private TOKEN: string = null;

  constructor(private authHttp: AuthService, db: Database, private commentService: CommentService) {
    this._db = db.getDB();
  }

  public getById(id: number) {
    return this.authHttp
      .get(this._url + "/" + id)
      .map(data => data.json())
      .catch(error => error);
  }

  public getAll(next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    return this.authHttp.get('http://localhost:3000/Mood')
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe(next, error, done);
  }

  public postMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.post('http://localhost:3000/Mood', mood)
      .subscribe(mood => {
        mood = mood.json();
        next(mood);
      }, error);
  }

  public getMoodsByUser(userId: string, next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    return this.authHttp.get('http://localhost:3000/Mood?user=' + userId)
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe(next, error, done);
  }

  public putMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.put('http://localhost:3000/Mood/'+mood._id, mood)
      .subscribe(mood => {
        mood = mood.json();
        next(mood);
      }, error);
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
