import {Component} from "@angular/core/src/metadata/directives";
import {AddMood} from "../add-mood/add-mood";
import {NavParams, NavController, LoadingController} from "ionic-angular";
import {UserService} from "../../services/user-service";
import {MoodService} from "../../services/mood-service";
import {LocalUser} from "../../model/user";
import {Mood} from "../../model/mood";
import {HttpErrors} from "../../shared/constants";
import {CreateUserComponent} from "../auth/create-user/create-user";
import {MoodComment} from "../mood-display/mood-comment/mood-comment";

@Component({
  selector: "user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfile {

  private moods: Mood[] = [];
  private myUser;
  private userId;
  private deleted;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController) {

  }

  ngOnInit() {
    console.log('ngOnInit');
    this.userId = this.navParams.get("user");
    this.userService.getLocalUser()
      .then((user: any) => {
          this.myUser = user;
          if (!this.userId)
            this.userId = this.myUser.id;
          this.getMoods(this.userId);
        },
      ).catch(error =>
      error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUserComponent) : console.warn('error', error));
    this.deleted = this.navParams.get('deleted');
  }

  getMoods(userId: string) {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    this.moodService.getMoodsByUser(userId,
      (result: any) => this.moods.push(result),
      (error) => {
        console.warn('error', error);
        loadingIndicator.dismiss();
      },
      () => loadingIndicator.dismiss()
    )
  }

  goToAddMood() {
    this.navCtrl.push(AddMood, {user: this.myUser});
  }

  goToComments(mood) {
    this.navCtrl.push(MoodComment, {mood, user: this.myUser});
  }

  notify(event) {
    console.log('event', event)
    switch (event.message) {
      case 'comment': {
        this.goToComments(event.payload.mood);
        break;
      }
    }
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

}
