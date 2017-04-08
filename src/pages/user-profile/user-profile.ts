import {Component} from "@angular/core/src/metadata/directives";
import {AddMood} from "../add-mood/add-mood";
import {NavParams, NavController, LoadingController} from "ionic-angular";
import {UserService} from "../../services/user-service";
import {MoodService} from "../../services/mood-service";
import {LocalUser} from "../../model/user";
import {Mood} from "../../model/mood";
import {HttpErrors} from "../../shared/constants";
import {CreateUser} from "../create-profile/create-user/create-user";
import {MoodComment} from "../mood-display/mood-comment/mood-comment";

@Component({
  selector: "user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfile {

  private moods: Mood[] = [];
  private user;
  private deleted;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.userService.getUser()
      .then((user: LocalUser) => {
          console.log('local user', user);
          this.user = user;
          this.getMyMoods(user.userId);
        },
      ).catch(error =>
      error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUser) : console.log('error', error));
    this.deleted = this.navParams.get('deleted');
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

  goToComments(event, mood) {
    this.navCtrl.push(MoodComment, {mood});
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

}
