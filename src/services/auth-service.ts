import {RequestOptionsArgs, Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {TOKEN, USER} from "../shared/storage";
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class AuthService {
  token: string = null;
  user: any = null;

  constructor(private http: Http, private storage: NativeStorage) {
    this.getLocalUser();
  }

  mergeOptions(options: any) {
    let commonHeaders = {
      ['Authorization']: 'Bearer ' + this.token,
      ['Content-Type']: 'application/json',
      ['Accept']: 'application/json',
    };
    if (!options)
      return {headers: commonHeaders};
    if (options.headers)
      options.headers = Object.assign(options.headers, commonHeaders)
    return options;

  }

  get(url: string, options?: any): Observable<Response> {
    return this.http.get(url, this.mergeOptions(options));
  }

  post(url: string, body: any, options?: any): Observable<Response> {
    return this.http.post(url, body, this.mergeOptions(options));
  }

  put(url: string, body: any, options ?: any): Observable<Response> {
    return this.http.put(url, body, this.mergeOptions(options));
  }

  delete(url: string, options ?: any): Observable<Response> {
    return this.http.delete(url, this.mergeOptions(options));
  }

  setLocalUser(user: any, token: string) {
    this.token = token;
    this.user = user;
    this.storage.setItem(TOKEN, token);
    this.storage.setItem(USER, user);
  }

  getLocalUser() {
    if (this.user == null) {
      this.storage.getItem(TOKEN).then(token => {
        console.log('get token!', token);
        this.token = token
      });
      return this.storage.getItem(USER)
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
