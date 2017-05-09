import {Injectable} from "@angular/core";
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
    body: "Operation could not be completed, please check you internet connection"
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
export class ErrorController {

  constructor(private alertCtrl: AlertController) {}

  handleResponse(response) {
    console.log('response', response);
    let status;
    try {
      status = response.status;
      response = response.json();
    } catch (e) {
      console.log('not .json', e)
    }
    let customMessage = CustomMessages[status];
    if (!customMessage)
      customMessage = CustomMessages[HttpErrors.UNKNOWN];
    let body = response.message ? response.message : customMessage.body;
    this.setAlert(customMessage.title, body);
  }

  setAlert(title, subtitle, buttons = ['OK']) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: buttons
    });
    alert.present();
  }
}
