import {Injectable, ErrorHandler} from "@angular/core";
import {AlertController} from "ionic-angular";
// import {ResponseType} from "@angular/http";

// TODO: check this: const Responses = ResponseType;

const HttpErrors = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  NO_CONNECTIVITY: 0,
  UNKNOWN: -1
};

const CustomMessages = {
  [HttpErrors.NO_CONNECTIVITY]: {
    title: "Connectivity problems",
    body: "Operation could not be completed, please check your internet connection"
  },
  [HttpErrors.UNAUTHORIZED]: {
    title: "Unauthorized",
    body: "You are not authorized to complete this operation"
  },
  [HttpErrors.NOT_ACCEPTABLE]: {
    title: "Not accepted",
    body: "The request was not accepted by the server"
  },
  [HttpErrors.UNKNOWN]: {
    title: "Error",
    body: "There was a problem completing this operation, please try again"
  }
}

@Injectable()
export class ErrorController implements ErrorHandler {

  constructor(private alertCtrl: AlertController) {
  }

  handleError(error) {
    console.log('error', error);
    let status;
    try {
      status = error.status;
      error = error.json();
    } catch (e) {
      console.log('not .json', e)
    }
    let customMessage = CustomMessages[status];
    if (!customMessage)
      customMessage = CustomMessages[HttpErrors.UNKNOWN];
    let body = error.message ? error.message : customMessage.body;
    if (typeof body == 'object')
      if (body.message)
        body = body.message;
      else
        body = JSON.stringify(body);
    this.setAlert(customMessage.title, body);
  }

  setAlert(title: string, subtitle: string, buttons: any[] = ['OK']): Promise<any> {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: buttons
    });
    return alert.present();
  }
}
