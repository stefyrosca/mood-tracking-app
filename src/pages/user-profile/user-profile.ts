import {Component} from "@angular/core/src/metadata/directives";
import {AddMood} from "../add-mood/add-mood";
import {NavParams, NavController} from "ionic-angular";

@Component({
  selector: "user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfile {
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  goToAddMood() {
    this.navCtrl.push(AddMood);
  }

}
