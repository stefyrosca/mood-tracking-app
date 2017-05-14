import {Component} from "@angular/core";
import {Mood} from "../../model/mood";
import {LoadingController, NavParams, NavController} from "ionic-angular";
import {UserService} from "../../services/user-service";
import {MoodService} from "../../services/mood-service";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {HttpErrors} from "../../shared/constants";
@Component({
  selector: 'browse-moods',
  templateUrl: 'browse-moods.html',
})
export class BrowseMoods {
  private moods: {[id: string]: {data: Mood, liked: boolean}};
  private user;
  private userPreferences;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private moodService: MoodService,
              private userService: UserService,
              public loader: LoadingController) {
    this.moods = {};
  }

  ngOnInit() {
    this.userPreferences = this.userService.getUserPreferences();
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

}
