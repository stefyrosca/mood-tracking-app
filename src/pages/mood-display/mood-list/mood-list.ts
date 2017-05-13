import {Component} from "@angular/core";
import {NavParams, NavController, LoadingController} from "ionic-angular";
import {Mood} from "../../../model/mood";
import {MoodService} from "../../../services/mood-service";
import {MoodComment} from "../mood-comment/mood-comment";
import {UserService} from "../../../services/user-service";
import {HttpErrors} from "../../../shared/constants";
import {AuthenticationComponent} from "../../auth/authentication/authentication";
import {UserActions} from "../../../shared/utils";


@Component({
  selector: 'mood-list',
  templateUrl: 'mood-list.html',
})
export class MoodList {

  moods: {[id: string]: {data: Mood, liked: boolean}};
  private user;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private moodService: MoodService,
              private userService: UserService,
              public loader: LoadingController) {
    this.moods = {};
  }

  ngOnInit() {
    // this.userService.removeLocalUser().then(
    //   result => console.log('result', result),
    // ).catch(error => console.log('error', error));
    // this.navCtrl.setRoot(CreateUserComponent);
    console.log('ngonInit')
    try {
      this.userService.getLocalUser()
        .then(user => {
          this.user = user;
          this.getAllMoods();
        })
        .catch(error => this.navCtrl.setRoot(AuthenticationComponent));
    } catch (error) {
      error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(AuthenticationComponent) : console.log('error', error)
    }
  }

  getMoodList() {
    return Object.keys(this.moods).map(id => this.moods[id].data);
  }

  getButtonStyles(mood: Mood) {
    return {
      heart: {
        color: this.moods[mood._id].liked ? "danger" : "primary"
      }
    }
  }

  ngOnDestroy() {
  }

  onNotify(event) {
    switch (event.message) {
      case UserActions.COMMENT: {
        this.navCtrl.push(MoodComment, {mood: event.payload.mood});
        break;
      }
      case UserActions.USER: {
        console.log('user profile!', event.payload);
        // this.navCtrl.push(UserProfile, {user: event.payload.user});
        break;
      }
      case UserActions.LOVE: {
        let newMood: Mood = Object.assign({}, this.moods[event.payload.mood.id].data);
        if (this.moods[newMood._id].liked) {
          newMood.likes = newMood.likes.filter(id => id !== this.user.id)
        } else {
          newMood.likes.push(this.user.id);
        }
        this.moodService.putMood(newMood, (mood) => {
          this.moods[mood.id].data.likes = mood.likes;
          this.moods[mood.id].liked = !this.moods[mood.id].liked;
        }, (error) => console.log('smth went wrong', error));
        // this.navCtrl.push(MoodComment, {mood: event.payload.mood});
        break;
      }
    }
  }

  getAllMoods() {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    this.moodService.getAll(
      (result: any) =>
        this.moods[result.id] = {
          data: result,
          liked: result.likes.find(userId => this.user.id == userId) !== undefined
        },
      (error) => {
        console.log('error', error);
        loadingIndicator.dismiss();
      },
      () => {
        console.log('moods', this.moods);
        loadingIndicator.dismiss()
      }
    )
  }

  moodClicked(event, mood) {
    this.navCtrl.push(MoodComment, {mood});
  }
}
