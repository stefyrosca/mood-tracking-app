import {Component} from "@angular/core/src/metadata/directives";
import {AddMood} from "../add-mood/add-mood";
import {NavParams, NavController, LoadingController} from "ionic-angular";
import {UserService} from "../../services/user-service";
import {MoodService} from "../../services/mood-service";
import {LocalUser} from "../../model/user";
import {Mood} from "../../model/mood";

@Component({
  selector: "user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfile {

  private moods: Mood[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController) {

  }

  ngOnInit() {
    console.log('ngOnInit');
    this.userService.getLocalUser()
      .subscribe(
        (user: LocalUser) => {
          console.log('local user', user);
          this.getMyMoods(user.userId);
        },
        (error) => console.log('error ', error)
      );
  }

  getMyMoods(userId: string) {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    this.moodService.getMyMoods(userId)
      .subscribe(
        (result: Mood) => this.moods.push(result),
        (error) => {
          console.log('error', error);
          loadingIndicator.dismiss();
        },
        () => loadingIndicator.dismiss()
      )
  }

  goToAddMood() {
    this.navCtrl.push(AddMood);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

}
