import {Injectable} from "@angular/core";
import * as PouchDB from "pouchdb";
import {DATABASE_NAME} from "../shared/constants";

@Injectable()
export class Database {
  private _db;

  constructor() {
    this._db = new PouchDB(DATABASE_NAME, { adapter: 'websql' });
  }

  public getDB() {
    return this._db;
  }

}
