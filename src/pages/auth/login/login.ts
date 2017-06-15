import {MenuController, NavParams, NavController} from "ionic-angular";
import {UserService} from "../../../services/user-service";
import {Component} from "@angular/core/src/metadata/directives";
import {User} from "../../../model/user";
import {ErrorController} from "../../../services/error-controller";
import {UserProfile} from "../../user-profile/user-profile";
import {CustomLoadingController} from "../../../services/loading-controller";

@Component({
  selector: 'login',
  templateUrl: 'login.html',
})
export class LoginComponent {
  private user: User;

  constructor(public navCtrl: NavController, private userService: UserService, private loadingController: CustomLoadingController) {
    this.user = new User();
  }

  login() {
    try {
      this.loadingController.create({content: 'Wait please...'});
      this.userService.login(this.user, (result) => {
          this.loadingController.dismiss();
          this.navCtrl.parent.parent.setRoot(UserProfile)
        }, (error: any) => {
          this.loadingController.dismiss();
          throw error;
        }
      );
    } catch (error) {
      throw error;
    }
  }
}
