class ServerConfig {
  private _url: string;
  private _port: string;
  private _protocol: 'http' | 'https';
  // private _delimiter: '/';

  constructor(protocol: 'http' | 'https', url: string, port: string) {
    this._url = url;
    this._port = port;
    this._protocol = protocol;
  }

  public getBaseUrl() {
    return `${this._protocol}://${this._url}:${this._port}`;
  }
}

export const serverConfig = new ServerConfig("http", "localhost", "3000");
