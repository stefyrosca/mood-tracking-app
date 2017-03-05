import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Mood} from "../../../model/mood";
import {MoodService} from "../../../services/mood-service";
import {MoodComment} from "../mood-comment/mood-comment";
import {UserService} from "../../../services/user-service";
import {CreateUser} from "../../create-profile/create-user/create-user";
import {HttpErrors} from "../../../shared/constants";


@Component({
  selector: 'mood-list',
  templateUrl: 'mood-list.html',
})
export class MoodList {

  moods: Mood[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private moodService: MoodService, private userService: UserService) {
    this.moods = [];
  }

  ngOnInit() {
    // this.userService.removeLocalUser().then(
    //   result => console.log('result', result),
    // ).catch(error => console.log('error', error));
    // this.navCtrl.setRoot(CreateUser);

    this.userService.getLocalUser().subscribe(
      result => this.getAllMoods(),
      error => error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUser) : console.log('error', error)
    );
  }

  ngOnDestroy() {
  }

  getAllMoods() {
    this.moodService.getAll()
      .subscribe(
        (result: Mood) => this.moods.push(result),
        (error) => console.log('error', error)
      )
  }

  moodClicked(event, mood) {
    this.navCtrl.push(MoodComment, {mood});
  }
}
