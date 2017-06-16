import {Component} from "@angular/core/src/metadata/directives";
import {AddMood} from "../add-mood/add-mood";
import {NavParams, NavController, LoadingController} from "ionic-angular";
import {UserService} from "../../services/user-service";
import {MoodService} from "../../services/mood-service";
import {Mood} from "../../model/mood";
import {HttpErrors} from "../../shared/storage";
import {CreateUserComponent} from "../auth/create-user/create-user";
import {MoodComment} from "../mood-display/mood-comment/mood-comment";
import {MoodDisplayOptions, defaultOptions} from "../../shared/mood-display-options";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {AuthService} from "../../services/auth-service";
import {LocalStorageController} from "../../services/local-storage-controller";
import {Observable} from "rxjs";
import {ResourceTypes} from "../../model/resource-types";
import {User} from "../../model/user";


declare var cordova: any;

@Component({
  selector: "user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfile {

  moods: {[id: string]: {data: Mood, liked: boolean}} = {};
  private myUser;
  private currentUser;
  private moodListOptions: MoodDisplayOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, private localStorageController: LocalStorageController,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController, private authService: AuthService) {
    let options = {
      userProfile: {
        allowRedirect: false
      }
    };
    this.moodListOptions = Object.assign({}, defaultOptions, options);
  }

  ionViewDidLoad() {
    this.checkMicrophonePermissions();
    this.currentUser = this.navParams.get("user");
    this.authService.getLocalUser()
      .then((user: any) => {
          this.myUser = user;
          if (!this.currentUser)
            this.currentUser = this.myUser;
          this.getMoods(this.currentUser.id);
        },
      )
      .catch(error => {
        if (error.status == HttpErrors.UNAUTHORIZED)
          this.navCtrl.setRoot(AuthenticationComponent)
        else {
          console.log('on else ...?', error);
          throw error.message
        }
      });
  }

  checkMicrophonePermissions() {
    cordova.plugins && cordova.plugins.diagnostic && cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
      if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
        console.log("Microphone use is authorized");
      }
    }, function (error) {
      console.error(error);
    });
  }

  getMoods(userId: string) {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    this.moodService.getMoodsByUser(userId,
      (result: any) =>
        this.moods[result.id] = {
          data: result,
          liked: result.likes.find(userId => this.myUser.id == userId) !== undefined
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
          if ((typeof result.user == 'string' && result.user == this.currentUser.id)
            || (typeof result.user == 'object' && (result.user as User).id == this.currentUser.id))
            this.moods[result.id] = {
              data: result,
              liked: result.likes.find(userId => this.currentUser.id == userId) !== undefined
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

  goToAddMood() {
    this.navCtrl.push(AddMood, {user: this.myUser});
  }

  goToComments(mood) {
    this.navCtrl.push(MoodComment, {mood, user: this.myUser});
  }

  getMoodList() {
    return Object.keys(this.moods).map(id => this.moods[id].data);
  }
}
