import {ApiAiClient} from 'api-ai-javascript/es6/ApiAiClient'
import StreamClient from 'api-ai-javascript/es6/Stream/StreamClient'
import {IStreamClientOptions, IStreamClient} from 'api-ai-javascript/ts/Interfaces'

export class ApiAiService {

  private accessToken: string = "60fb0ff7029b464591840d5647ad2688";
  private streamClient: IStreamClient;
  private textClient: any;

  constructor() {
    this.textClient = new ApiAiClient({accessToken: this.accessToken});

    var options: IStreamClientOptions = {token: this.accessToken,
      onInit: ()=>{console.log('init')},
      onOpen: ()=>{console.log('open', event)},
      onClose: ()=>{console.log('close', event)},
      onStartListening: ()=>{console.log('start', event)},
      onStopListening: ()=>{console.log('stop', event)},
      onResults: (event)=>{console.log('results', event)},
      onEvent: (event, message)=>{console.log('event', event, 'message', message)},
      onError: (event, message)=>{console.log('error', event, 'message', message)},
    };
    this.streamClient = new StreamClient(options);
  }

  textRequest(text: string) {
    let promise = this.textClient.textRequest(text);

    promise
      .then(handleResponse)
      .catch(handleError);

    function handleResponse(serverResponse) {
      console.log('serverResponse',serverResponse);
    }
    function handleError(serverError) {
      console.log('serverError',serverError);
    }
  }

  streamRequest() {

    this.streamClient.init();
  }
}
