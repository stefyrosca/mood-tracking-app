import {Component, Input} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Mood} from "../../../model/mood";
import {MoodService} from "../../../services/mood-service";
import {MoodComment} from "../mood-comment/mood-comment";
import {UserService} from "../../../services/user-service";
import {UserActions} from "../../../shared/utils";
import {UserProfile} from "../../user-profile/user-profile";
import {CustomLoadingController} from "../../../services/loading-controller";
import {AuthenticationComponent} from "../../auth/authentication/authentication";
import {HttpErrors} from "../../../shared/constants";


@Component({
  selector: 'mood-list',
  templateUrl: 'mood-list.html',
})
export class MoodList {

  @Input()
  private moods: {[id: string]: {data: Mood, liked: boolean}};
  @Input()
  private user;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private moodService: MoodService,
              private userService: UserService,
              public loadingController: CustomLoadingController) {
    this.moods = {};
  }

  ngOnInit() {
    // console.log('MOODLIST');
    // try {
    //   this.userService.getLocalUser()
    //     .then(user => {
    //       this.user = user;
    //       this.getAllMoods();
    //     })
    //     .catch(error => {
    //       console.log(JSON.stringify(error));
    //       this.navCtrl.setRoot(AuthenticationComponent)
    //     });
    // } catch (error) {
    //   error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(AuthenticationComponent) : console.log('error', error)
    // }
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
        this.navCtrl.push(UserProfile, {user: event.payload.user});
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
    this.loadingController.create({
      content: 'Getting latest entries...',
    });
    this.moodService.getAll(
      (result: any) =>
        this.moods[result.id] = {
          data: result,
          liked: result.likes.find(userId => this.user.id == userId) !== undefined
        },
      (error) => {
        console.log('error', error);
        this.loadingController.dismiss();
      },
      () => {
        console.log('moods', this.moods);
        this.loadingController.dismiss();
      }
    )
  }

}
