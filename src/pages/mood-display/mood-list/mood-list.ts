import {Component} from "@angular/core";
import {NavParams, NavController, Loading, LoadingController} from "ionic-angular";
import {Mood} from "../../../model/mood";
import {MoodService} from "../../../services/mood-service";
import {MoodComment} from "../mood-comment/mood-comment";
import {UserService} from "../../../services/user-service";
import {HttpErrors} from "../../../shared/constants";
import {CreateUserComponent} from "../../auth/create-user/create-user";
import {AuthenticationComponent} from "../../auth/authentication/authentication";


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

  ngOnDestroy() {
  }

  getAllMoods() {
    console.log('getAllMoods')
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    console.log('getAllMoods 2')
    this.moodService.getAll(
        (result: any) => {
          console.log('result??', result);
          this.moods.push(result)
        },
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
