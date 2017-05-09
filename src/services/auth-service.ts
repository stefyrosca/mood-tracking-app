import {RequestMethod, RequestOptionsArgs, Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {TOKEN, USER} from "../shared/constants";
import {Storage} from "@ionic/storage";

@Injectable()
export class AuthService {
  token: string = null;
  user: any = null;

  constructor(private http: Http, private storage: Storage) {}

  _request(req: any, additionalOptions?: RequestOptionsArgs) {
    let reqOpts = req || {};
    if (!reqOpts.headers) {
      reqOpts.headers = new Headers();
    }
    reqOpts.headers.set('Content-Type', 'application/json');
    reqOpts.headers.set('Accept', 'application/json');
    reqOpts.headers.set('Authorization', 'Bearer ' + this.token);
    return this.http.request(reqOpts);
  }

  setToken(token: string) {
    this.token = token;
  }

  get(url: string, options?: any): Observable<Response> {
    return this.http.get(url, options);
  }

  post(url: string, body: any, options?: any): Observable<Response> {
    return this.http.post(url, body, options);
  }

  put(url: string, body: any, options ?: any): Observable<Response> {
    return this.http.put(url, body, options);
  }

  delete(url: string, options ?: any): Observable<Response> {
    return this.http.delete(url, options);
  }

  setLocalUser(user: any, token: string) {
    this.token = token;
    this.user = user;
    this.storage.set(TOKEN, token);
    this.storage.set(USER, user);
  }

  getLocalUser() {
    if (this.user == null) {
      var newVar = this.storage.get(USER);
      return newVar
        .then(user => {
          if (user) {
            this.user = user;
            return Promise.resolve(this.user);
          }
          else return Promise.reject('Not logged in');
        });
    }
    return Promise.resolve(this.user);
  }
}
