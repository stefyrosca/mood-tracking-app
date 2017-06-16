import {Injectable} from "@angular/core";
// import {ApiAIPlugin} from 'cordova-plugin-apiai/www/ApiAiPlugin'

declare var ApiAIPlugin: any;

@Injectable()
export class VoiceToTextController {
  constructor() {

  }

  init() {
    ApiAIPlugin.init(
      {
        clientAccessToken: "60fb0ff7029b464591840d5647ad2688", // insert your client access key here
        lang: "en" // set lang tag from list of supported languages
      },
      (result) => {
        console.log('yey', result);
      },
      (error) => {
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
