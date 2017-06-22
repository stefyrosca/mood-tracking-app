import {Injectable} from "@angular/core";
// import {ApiAIPlugin} from 'cordova-plugin-apiai'

declare var ApiAIPlugin: any;

@Injectable()
export class VoiceToTextController {
  private _apiAvailable;

  constructor() {
    this._apiAvailable = false;
  }

  isAvailable() {
    return this._apiAvailable;
  }

  init() {
    ApiAIPlugin.init(
      {
        clientAccessToken: "60fb0ff7029b464591840d5647ad2688",
        lang: "en"
      },
      (result) => {
        this._apiAvailable = true;
      },
      (error) => {
        this._apiAvailable = false;
        console.log('error', error);
      }
    );

  }

  startListening(resultCallback: (result: any)=>any, errorCallback: (error: any)=>any) {
    try {
      ApiAIPlugin.requestVoice({}, resultCallback, errorCallback);
    } catch (e) {
      console.log('smth bad happened ..', e);
      errorCallback(e);
    }
  }

  stopListening() {
    ApiAIPlugin.stopListening();
  }

  setCallbacks(listeningStartCallback?: ()=>any, listeningEndCallback?: ()=>any) {
    listeningStartCallback && ApiAIPlugin.setListeningStartCallback(listeningStartCallback);
    listeningEndCallback && ApiAIPlugin.setListeningFinishCallback(listeningEndCallback);
  }
}
