import {Component} from "@angular/core/src/metadata/directives";
import {UserService} from "../../../services/user-service";
import {MenuController, NavController, NavParams} from "ionic-angular";
import {User} from "../../../model/user";
import {ErrorController} from "../../../services/error-controller";
import {BrowseMoods} from "../../browse-moods/browse-moods";

@Component({
  selector: 'create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserComponent {

  private user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService,
              private menuController: MenuController, private errorCtrl: ErrorController) {
    this.user = new User();
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  createUser() {
    this.userService.createUser(this.user, () => {
        this.menuController.enable(true);
        this.navCtrl.parent.parent.setRoot(BrowseMoods)
      }, (error) => this.errorCtrl.handleError(error));
  }
}
