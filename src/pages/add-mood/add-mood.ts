import {Component} from "@angular/core/src/metadata/directives";
import {MoodService} from "../../services/mood-service";
import {ResourceTypes} from "../../model/resource-types";
import {UserService} from "../../services/user-service";
import {LocalUser} from "../../model/user";
import {Mood} from "../../model/mood";
import {NavController, NavParams} from "ionic-angular";
import {UserProfile} from "../user-profile/user-profile";
import {CreateUserComponent} from "../auth/create-user/create-user";
import {HttpErrors} from "../../shared/constants";
import {EmotionTypes} from "../../model/emotion-types";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {ApiAiService} from "../../services/api.ai-service";

@Component({
  selector: 'add-mood',
  templateUrl: 'add-mood.html'
})
export class AddMood {
  private title: string = "";
  private body: string = "";
  private user;
  private selectedEmotion = null;//EmotionTypes.ANGRY;
  private EmotionTypes = EmotionTypes;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private moodService: MoodService, private userService: UserService,
              private apiAiService: ApiAiService) {

  }

  ngOnInit() {
    this.user = this.navParams.get('user');
    console.log('this.user', this.user)
    this.apiAiService.textRequest();
  }

  postMood() {
    // this.navCtrl.setRoot(UserProfile);
    let mood: Mood = <Mood>{
      title: this.title,
      body: this.body,
      emotion: this.selectedEmotion,
      user: this.user.id,
      timestamp: new Date()
    };
    console.log('ok, before add', mood);
    this.moodService.postMood(mood, (m) => {
        console.log('after', m)
        this.navCtrl.setRoot(UserProfile)
      },
      (error) => console.log('error on post', error))
    // .then(result => this.navCtrl.setRoot(UserProfile))
    // .catch(error => console.log('error on post', error));
  }

  selectEmotion(emotion) {
    this.selectedEmotion = emotion;
  }
}
