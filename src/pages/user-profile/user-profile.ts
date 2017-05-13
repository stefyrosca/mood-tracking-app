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
  private user;
  private deleted;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.userService.getLocalUser()
      .then((user: any) => {
          console.log('local user', user);
          this.user = user;
          this.getMyMoods(user.id);
        },
      ).catch(error =>
      error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUserComponent) : console.log('error', error));
    this.deleted = this.navParams.get('deleted');
  }

  getMyMoods(userId: string) {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    console.log('get my moods', userId);
    this.moodService.getMyMoods(userId,
        (result: any) => this.moods.push(result),
        (error) => {
          console.log('error', error);
          loadingIndicator.dismiss();
        },
        () => loadingIndicator.dismiss()
      )
  }

  goToAddMood() {
    this.navCtrl.push(AddMood, {user:this.user});
  }

  goToComments(mood) {
    this.navCtrl.push(MoodComment, {mood, user:this.user});
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
