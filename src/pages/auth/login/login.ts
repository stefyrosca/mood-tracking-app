import {MenuController, NavParams, NavController} from "ionic-angular";
import {UserService} from "../../../services/user-service";
import {Component} from "@angular/core/src/metadata/directives";
import {User} from "../../../model/user";
import {MoodList} from "../../mood-display/mood-list/mood-list";
import {ErrorController} from "../../../services/error-controller";

@Component({
  selector: 'login',
  templateUrl: 'login.html',
})
export class LoginComponent {
  private user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private errorCtrl: ErrorController,
              private userService: UserService, private menuController: MenuController) {
    this.user = new User();
  }

  login() {
    try {
      this.userService.login(this.user, (result) => {
          this.navCtrl.setRoot(MoodList);
        }, (error: any) => {
          this.errorCtrl.handleResponse(error);
        }
      );
    } catch (error) {
      console.log('on catch', error);
    }
  }
}
