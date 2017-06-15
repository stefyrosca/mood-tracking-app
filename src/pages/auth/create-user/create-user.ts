import {Component} from "@angular/core/src/metadata/directives";
import {UserService} from "../../../services/user-service";
import {MenuController, NavController, NavParams} from "ionic-angular";
import {User} from "../../../model/user";
import {ErrorController} from "../../../services/error-controller";
import {BrowseMoods} from "../../browse-moods/browse-moods";
import {CustomLoadingController} from "../../../services/loading-controller";

@Component({
  selector: 'create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserComponent {

  private user: User;

  constructor(public navCtrl: NavController, private userService: UserService,
              private menuController: MenuController, private loadingController: CustomLoadingController) {
    this.user = new User();
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  createUser() {
    this.loadingController.create({content: 'We are creating your profile, wait please...'});
    this.userService.createUser(this.user, () => {
      this.menuController.enable(true);
      this.loadingController.dismiss();
      this.navCtrl.parent.parent.setRoot(BrowseMoods)
    }, (error) => {
      this.loadingController.dismiss();
      throw error;
    });
  }
}
