import {Component} from "@angular/core/src/metadata/directives";
import {MoodService} from "../../services/mood-service";
import {ResourceTypes} from "../../model/resource-types";
import {UserService} from "../../services/user-service";
import {LocalUser} from "../../model/user";
import {Mood} from "../../model/mood";
import {NavController} from "ionic-angular";
import {UserProfile} from "../user-profile/user-profile";
import {CreateUser} from "../create-profile/create-user/create-user";
import {HttpErrors} from "../../shared/constants";

@Component({
  selector: 'add-mood',
  templateUrl: 'add-mood.html'
})
export class AddMood {
  private title: string = "";
  private body: string = "";
  private user;

  constructor(private navCtrl: NavController, private moodService: MoodService, private userService: UserService) {
  this.userService.getUser()
      .then(user => this.user = user)
      .catch(error =>  error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUser) : console.log('error', error));
  }

  postMood() {
    // this.navCtrl.setRoot(UserProfile);
    let mood: Mood = <Mood>{
      title: this.title,
      body: this.body,
      emotion: 1,
      resourceType: ResourceTypes.MOOD,
      userId: this.user.userId,
      timestamp: new Date()
    };
    this.moodService.postMood(mood)
      .then(result => this.navCtrl.setRoot(UserProfile))
      .catch(error => console.log('error on post', error));
  }
}
