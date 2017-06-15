import {Component} from "@angular/core";
import {Mood} from "../../model/mood";
import {LoadingController, NavParams, NavController} from "ionic-angular";
import {UserService} from "../../services/user-service";
import {MoodService} from "../../services/mood-service";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {HttpErrors} from "../../shared/storage";
import {User} from "../../model/user";
import {MoodDisplayOptions, defaultOptions, AllowedActions} from "../../shared/mood-display-options";
import {LocalStorageController} from "../../services/local-storage-controller";
import {ResourceTypes} from "../../model/resource-types";
import {Observable} from "rxjs";
@Component({
  selector: 'browse-moods',
  templateUrl: 'browse-moods.html',
})
export class BrowseMoods {
  private moods: {[id: string]: {data: Mood, liked: boolean}};
  private user: User;
  private moodListOptions: MoodDisplayOptions;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private moodService: MoodService,
              private userService: UserService,
              public loader: LoadingController,
              public localStorageController: LocalStorageController) {
    this.moods = {};
    let options = {
      userProfile: {
        allowRedirect: true,
        action: AllowedActions.PUSH
      }
    };
    this.moodListOptions = Object.assign({}, defaultOptions, options);
  }

  ionViewDidLoad() {
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
      (result: Mood) => {
        this.moods[result.id] = {
          data: result,
          liked: result.likes.find(userId => this.user.id == userId) !== undefined
        }
      },
      (error) => {
        console.log('error', error);
        this.getLocalData(loadingIndicator);
        throw error;
      },
      () => {
        loadingIndicator.dismiss()
      }
    )
  }

  getLocalData(loadingIndicator) {
    Observable
      .fromPromise(this.localStorageController.getFromStorage(ResourceTypes.MOOD))
      .flatMap(mood => mood)
      .subscribe((result: Mood) => {
          this.moods[result.id] = {
            data: result,
            liked: result.likes.find(userId => this.user.id == userId) !== undefined
          }
        },
        (error) => {
          loadingIndicator.dismiss();
          throw error;
        },
        () => {
          loadingIndicator.dismiss()
        });
  }
}
