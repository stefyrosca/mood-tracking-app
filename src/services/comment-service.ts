import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

@Injectable()
export class CommentService {
  private url = 'http://jsonplaceholder.typicode.com/comments';

  constructor(private http: Http) {}

  public getByPostId(id: string) {
    return this.http
      .get(this.url + "?postId=" + id)
      .map(data => data.json())
      .flatMap(data => data)
      .catch(error => error);
  }

}
