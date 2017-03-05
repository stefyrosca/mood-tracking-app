import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Database} from "../persistence/database";

@Injectable()
export class MoodService {
  private _url = 'http://jsonplaceholder.typicode.com/posts';

  constructor(private http: Http, private _db: Database) {}

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
}
