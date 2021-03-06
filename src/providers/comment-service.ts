import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Observable} from "rxjs";
import {Comment} from '../model/comment'
import {AuthService} from "./auth-service";
import {serverConfig} from "./server-config";

@Injectable()
export class CommentService {
  private url = serverConfig.getBaseUrl();

  constructor(private authHttp: AuthService) {
  }

  // public getCommentsByPost(id: string, next: (result)=>any, error:(err)=>any, done?:()=>void) {
  public getCommentsByPost(id: string) {
    return this.authHttp.get(this.url + '/Comment?mood='+id)
      .map(result => result.json())
      .flatMap(comment => comment)
      // .subscribe(next, error, done);
    // return Observable
    //   .fromPromise(this._db.query("mood/getCommentsByMood", {key: id, include_docs: true}))
    //   .map((result: any) => result.rows)
    //   .flatMap(row => row)
    //   .map((result: any) => result.doc);
  }

  public addCommentToPost(comment: any) {
    return this.authHttp.post(this.url + '/Comment', comment)
      .map(result => result.json)
    // return this._db.post(comment)
    //   .then(result => {
    //     return result;
    //   })
    //   .catch(error => {
    //       return Promise.reject(new Error("SORRY, no can do"));
    //     }
    //   );
  }

}
