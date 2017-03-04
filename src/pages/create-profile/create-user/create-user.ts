import {Component} from "@angular/core/src/metadata/directives";
import {UserService} from "../../../services/user-service";
import {MenuController, NavController, NavParams} from "ionic-angular";
import {MoodList} from "../../mood-display/mood-list/mood-list";

@Component({
  selector: 'create-user',
  templateUrl: 'create-user.html',
})
export class CreateUser {

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService, private menuController: MenuController) {
  }

  ngOnInit() {
    console.log('onInit');
    this.menuController.enable(false);
  }

  createUser() {
    this.userService.createUser({username: "bob", password: "doe"})
      .then(user=> this.navCtrl.setRoot(MoodList))
      .catch(error => console.log('error', error));
  }

}
