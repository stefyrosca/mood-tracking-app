import {Component, Input} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Mood} from "../../../model/mood";
import {MoodService} from "../../../services/mood-service";
import {MoodComment} from "../mood-comment/mood-comment";
import {UserService} from "../../../services/user-service";
import {UserActions} from "../../../shared/utils";
import {UserProfile} from "../../user-profile/user-profile";
import {CustomLoadingController} from "../../../services/loading-controller";
import {User} from "../../../model/user";
import {MoodDisplayOptions, AllowedActions} from "../../../shared/mood-display-options";

@Component({
  selector: 'mood-list',
  templateUrl: 'mood-list.html',
})
export class MoodList {

  @Input()
  private moods: {[id: string]: {data: Mood, liked: boolean}};
  @Input()
  private user: User;
  @Input()
  private options: MoodDisplayOptions;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private moodService: MoodService,
              private userService: UserService,
              public loadingController: CustomLoadingController) {
    this.moods = {};
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
        let commentOptions = this.options.comment;
        if (commentOptions.allowRedirect)
          if (commentOptions.action == AllowedActions.PUSH)
            this.navCtrl.push(MoodComment, {mood: event.payload.mood});
          else {
            let length = this.navCtrl.length();
            this.navCtrl.push(MoodComment, {mood: event.payload.mood})
              .then(() => this.navCtrl.remove(length - 1, 1));
          }
        break;
      }
      case UserActions.USER: {
        let userOptions = this.options.userProfile;
        if (userOptions.allowRedirect) {
          if (userOptions.action == AllowedActions.PUSH) {
            this.navCtrl.push(UserProfile, {user: event.payload.user});
          } else { // replace
            let length = this.navCtrl.length();
            this.navCtrl.push(UserProfile, {user: event.payload.user})
              .then(() => this.navCtrl.remove(length - 1, 1));
          }
        }
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
        }, (error) => {
          console.log('smth went wrong', error);
          throw error;
        });
        break;
      }
    }
  }

}
