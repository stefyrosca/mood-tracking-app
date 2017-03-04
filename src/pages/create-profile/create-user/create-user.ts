import {Component} from "@angular/core/src/metadata/directives";
import {UserService} from "../../../services/user-service";
import {MenuController, NavController, NavParams} from "ionic-angular";
import {MoodList} from "../../mood-display/mood-list/mood-list";
import {User} from "../../../model/user";

@Component({
  selector: 'create-user',
  templateUrl: 'create-user.html',
})
export class CreateUser {

  private user: User = {username: '', name: null};

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService, private menuController: MenuController) {
  }

  ngOnInit() {
    this.menuController.enable(false);
  }

  createUser() {
    // this.navCtrl.setRoot(MoodList)

    // this.userService.getByUsername();
    this.userService.createUser(this.user)
      .then(user=> {
        console.log("after create user ....", user)
        this.navCtrl.setRoot(MoodList)
      })
      .catch(error => console.log('error', error));
  }

}
