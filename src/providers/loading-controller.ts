import {Injectable} from "@angular/core";
import {LoadingController, LoadingOptions} from "ionic-angular";

@Injectable()
export class CustomLoadingController {
  private loadingIndicator;
  constructor( public loader: LoadingController) {

  }

  create(opts: LoadingOptions) {
    this.loadingIndicator = this.loader.create(opts);
    this.loadingIndicator.present();
  }

  dismiss() {
    this.loadingIndicator && this.loadingIndicator.dismiss();
  }
}
