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
import {serverConfig} from "./server-config";


@Injectable()
export class MoodService {
  private url = serverConfig.getBaseUrl();
  private _db: any;
  private TOKEN: string = null;


  constructor(private authHttp: AuthService, db: Database, private commentService: CommentService) {
    this._db = db.getDB();
  }

  public getAll(next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    return this.authHttp.get(this.url + '/Mood')
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe(next, error, done);
  }

  public postMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.post(this.url + '/Mood', mood)
      .subscribe(mood => {
        mood = mood.json();
        next(mood);
      }, error);
  }

  public getMoodsByUser(userId: string, next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    return this.authHttp.get(this.url + '/Mood?user=' + userId)
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe(next, error, done);
  }

  public putMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.put(this.url + '/Mood/' + mood._id, mood)
      .subscribe(mood => {
        mood = mood.json();
        next(mood);
      }, error);
  }

  public deleteMood(mood: Mood, next: ()=>any, error: (error)=>any) {
    return this.authHttp.put(this.url + '/Mood/' + mood._id, mood)
      .subscribe(next, error);
  }


}
