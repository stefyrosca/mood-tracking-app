import {Injectable} from "@angular/core";
import * as PouchDB from "pouchdb";
import {DATABASE_URL, TOKEN} from "../shared/constants";
import {Storage} from "@ionic/storage";

@Injectable()
export class Database {
  private _db;
  private token: String = null;
  private headers: any = {};

  constructor(private storage: Storage) {
    this._db = new PouchDB(DATABASE_URL);
    this._db.changes().on('change',
      (change) => {
      }
    );
  }

  public getDB() {
    return this._db;
  }

  createIndexes() {
    this._db.put({
      language: 'javascript',
      views: {
        getCommentsByMood: {map: "function (doc) { if (doc.resourceType=='comment') emit([doc.moodId, doc.timestamp], doc._id);}"}
      }
    });
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    console.log('get headers')
    if (this.token)
      return this.headers;
    return this.storage.get(TOKEN)
      .then(token => {
        this.token = token;
        this.headers = {
          ['Content-Type']: 'application/json',
          Authorization: 'Bearer ' + token
        };
        return Promise.resolve(this.headers);
      }).catch(error => Promise.resolve(this.headers))
  }

}
