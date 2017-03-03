import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

@Injectable()
export class MoodService {
  private url = 'http://jsonplaceholder.typicode.com/posts';

  constructor(private http: Http) {}

  public getById(id: number) {
    return this.http
      .get(this.url + "/" + id)
      .map(data => data.json())
      .catch(error => error);
  }

  public getAll() {
    return this.http
      .get(this.url)
      .map(data => data.json())
      .flatMap(result => result)
      .catch(error => error);
  }
}
