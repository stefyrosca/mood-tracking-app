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


declare var cordova:any;

@Component({
  selector: "user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfile {

  moods: {[id: string]: {data: Mood, liked: boolean}} = {};
  private myUser;
  private currentUser;
  private deleted;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController) {

  }

  ngOnInit() {
    // let media = new MediaPlugin()
    // console.log('wtf', cordova.plugins.diagnostic);
    cordova.plugins.diagnostic.requestMicrophoneAuthorization(function(status){
      console.log('STATUS', status);
      if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
        console.log("Microphone use is authorized");
      }
    }, function(error){
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
    this.deleted = this.navParams.get('deleted');
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

  notify(event) {
    console.log('event', event)
    switch (event.message) {
      case 'comment': {
        this.goToComments(event.payload.mood);
        break;
      }
    }
  }

  getMoodList() {
    return Object.keys(this.moods).map(id => this.moods[id].data);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

}
