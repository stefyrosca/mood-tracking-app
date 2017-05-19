import {Component} from "@angular/core/src/metadata/directives";
import {MoodService} from "../../services/mood-service";
import {ResourceTypes} from "../../model/resource-types";
import {UserService} from "../../services/user-service";
import {LocalUser} from "../../model/user";
import {Mood} from "../../model/mood";
import {NavController, NavParams, Platform} from "ionic-angular";
import {UserProfile} from "../user-profile/user-profile";
import {CreateUserComponent} from "../auth/create-user/create-user";
import {HttpErrors} from "../../shared/constants";
import {EmotionTypes} from "../../model/emotion-types";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {ApiAiService} from "../../services/api.ai-service";
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

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
  private streaming: any;
  private file: MediaObject;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private moodService: MoodService, private userService: UserService,
              private apiAiService: ApiAiService, private media: MediaPlugin) {
    this.streaming = {
      title: false,
      body: false
    };
  }

  ngOnInit() {
    this.user = this.navParams.get('user');
  }

  createAudioFile() {
    const onStatusUpdate = (status) => console.log('status', status);
    const onSuccess = () => console.log('Action is successful.');
    const onError = (error) => console.log('error', JSON.stringify(error));
    this.file = this.media.create("../Documents/test.mp3", onStatusUpdate, onSuccess, onError);
  }

  postMood() {
    // this.navCtrl.setRoot(UserProfile);
    this.apiAiService.textRequest(this.body);
    let mood: Mood = <Mood>{
      title: this.title,
      body: this.body,
      emotion: this.selectedEmotion,
      user: this.user.id,
      timestamp: new Date()
    };
    this.moodService.postMood(mood, (m) => {
        this.navCtrl.setRoot(UserProfile)
      },
      (error) => {
        throw error
      });
    // .then(result => this.navCtrl.setRoot(UserProfile))
    // .catch(error => console.log('error on post', error));
  }

  selectEmotion(emotion) {
    this.selectedEmotion = emotion;
  }

  play() {
    console.log('duration', this.file.getDuration());
    this.file.play();
  }

  recordTitle() {
    if (this.streaming.title) {
      this.streaming.title = false;
      this.file.stopRecord();
      // this.apiAiService.stopStreaming();
    } else {
      this.streaming.title = true;
      this.createAudioFile();
      this.file.startRecord();
      // this.apiAiService.startStreaming();
    }
  }

  ngOnDestroy() {
    this.file.release();
    // this.file.
  }
}
