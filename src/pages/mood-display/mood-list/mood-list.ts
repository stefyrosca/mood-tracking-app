import {Component} from "@angular/core";
import {NavParams, NavController, Loading, LoadingController} from "ionic-angular";
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
  private user;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private moodService: MoodService,
              private userService: UserService,
              public loader: LoadingController) {
    this.moods = [];
  }

  ngOnInit() {
    // this.userService.removeLocalUser().then(
    //   result => console.log('result', result),
    // ).catch(error => console.log('error', error));
    // this.navCtrl.setRoot(CreateUser);
    try {
      this.userService.getUser()
        .then(user => {
          this.user = user;
          this.getAllMoods();
        })
        .catch(error =>  error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUser) : console.log('error', error));
    } catch (error) {
      error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUser) : console.log('error', error)
    }
  }

  ngOnDestroy() {
  }

  getAllMoods() {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    this.moodService.getAll()
      .subscribe(
        (result: Mood) => this.moods.push(result),
        (error) => {
          console.log('error', error);
          loadingIndicator.dismiss();
        },
        () => loadingIndicator.dismiss()
      )
  }

  moodClicked(event, mood) {
    this.navCtrl.push(MoodComment, {mood});
  }
}
