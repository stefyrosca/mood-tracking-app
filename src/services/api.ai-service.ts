import {ApiAiClient} from 'api-ai-javascript/es6/ApiAiClient'
import StreamClient from 'api-ai-javascript/es6/Stream/StreamClient'
import {IStreamClientOptions, IStreamClient} from 'api-ai-javascript/ts/Interfaces'

export class ApiAiService {

  private accessToken: string = "60fb0ff7029b464591840d5647ad2688";
  private streamClient: IStreamClient;
  private textClient: any;

  constructor() {
    this.textClient = new ApiAiClient({accessToken: this.accessToken});

    var options: IStreamClientOptions = {
      token: this.accessToken,
      server: "wss://api-ws.api.ai:4435/v1/ws/query",
      sessionId: '1234',
      readingInterval: '100',
      onInit: ()=> {
        // console.log('init')
        this.streamClient.open();
      },
      onOpen: ()=> {
        // console.log('open', event)
      },
      onClose: ()=> {
        // console.log('close', event)
      },
      onStartListening: ()=> {
        // console.log('start', event)
      },
      onStopListening: ()=> {
        // console.log('stop', event)
      },
      onResults: (event)=> {
        console.log('results', event)
      },
      onEvent: (event, message)=> {
        // console.log('event', event, 'message', message)
        // console.log(JSON.stringify(message))
      },
      onError: (event, message)=> {
        console.error('error', event, 'message', message);
        // console.log(JSON.stringify(message));
      },
    };
    this.streamClient = new StreamClient(options);
    this.streamClient.init();
  }

  textRequest(text: string) {
    let promise = this.textClient.textRequest(text);

    promise
      .then(handleResponse)
      .catch(handleError);

    function handleResponse(serverResponse) {
      // console.log('serverResponse', serverResponse);
    }

    function handleError(serverError) {
      // console.log('serverError', serverError);
    }
  }


  startStreaming() {

    console.log('startStreaming')
    // this.streamClient.init();
    // this.streamClient.open();
    this.streamClient.startListening();
  }

  stopStreaming() {
    console.log('stopStreaming')
    this.streamClient.stopListening();
    // this.streamClient.close();
  }
}
