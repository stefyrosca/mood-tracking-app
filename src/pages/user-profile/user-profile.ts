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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController) {
    let options = {
      userProfile: {
        allowRedirect: false
      }
    };
    this.moodListOptions = Object.assign({}, defaultOptions, options);
  }

  ngOnInit() {
    cordova.plugins && cordova.plugins.diagnostic && cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
      if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
        console.log("Microphone use is authorized");
      }
    }, function (error) {
      console.error(error);
    });
    this.currentUser = this.navParams.get("user");
    this.userService.getLocalUser()
      .then((user: any) => {
          this.myUser = user;
          if (!this.currentUser)
            this.currentUser = this.myUser;
          this.getMoods(this.currentUser.id);
        },
      ).catch(error =>
        error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUserComponent) : console.warn('error', error));
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
        loadingIndicator.dismiss();
        throw error;
      },
      () => {
        loadingIndicator.dismiss()
      }
    )
  }


  goToAddMood() {
    this.navCtrl.push(AddMood, {user: this.myUser});
  }

  goToComments(mood) {
    this.navCtrl.push(MoodComment, {mood, user: this.myUser});
  }

  //
  // notify(event) {
  //   console.log('event', event)
  //   switch (event.message) {
  //     case UserActions.COMMENT: {
  //       this.goToComments(event.payload.mood);
  //       break;
  //     }
  //     case UserActions.USER: {
  //       if (this.navCtrl.length() != 1)
  //         this.navCtrl.pop();
  //       this.navCtrl.push(UserProfile, {user: event.payload.user});
  //       break;
  //     }
  //   }
  // }

  getMoodList() {
    return Object.keys(this.moods).map(id => this.moods[id].data);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

}
