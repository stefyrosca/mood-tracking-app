import {Method, CallApiKeys, Params} from "./api-keys";

export class CallApi {
  _url: string;
  _port: number;
  _config: any;

  constructor() {
    //TODO: get from configs
    this._url = "localhost";
    this._port = 3000;
    this._config = {};
    return this;
  }

  get() {
    this._config[CallApiKeys.METHOD] = Method.GET;
    return this;
  }
  post() {
    this._config[CallApiKeys.METHOD] = Method.POST;
    return this;
  }
  put() {
    this._config[CallApiKeys.METHOD] = Method.PUT;
    return this;
  }
  delete() {
    this._config[CallApiKeys.METHOD] = Method.DELETE;
    return this;
  }
  query(key: Params, value: string) {
    if (!this._config[CallApiKeys.QUERY])
      this._config[CallApiKeys.QUERY] = {};
    this._config[CallApiKeys.QUERY][key] = value;
    return this;
  }
  call() {

  }

}
