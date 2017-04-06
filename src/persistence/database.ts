import {Injectable} from "@angular/core";
import * as PouchDB from "pouchdb";
import {DATABASE_URL} from "../shared/constants";

@Injectable()
export class Database {
  private _db;

  constructor() {
    this._db = new PouchDB(DATABASE_URL);
    this._db.changes().on('change',
      (change) => {}
    );
    this._db.allDocs().then((value) => console.log('allDocs', value));
  }

  public getDB() {
    return this._db;
  }

}
