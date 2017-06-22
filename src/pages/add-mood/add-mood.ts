import {Component} from "@angular/core/src/metadata/directives";
import {MoodService} from "../../providers/mood-service";
import {UserService} from "../../providers/user-service";
import {Mood} from "../../model/mood";
import {NavController, NavParams, ToastController, Platform} from "ionic-angular";
import {EmotionTypes} from "../../model/emotion-types";
import {MediaPlugin} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {CustomLoadingController} from "../../providers/loading-controller";
import {User} from "../../model/user";
import {VoiceToTextController} from "../../providers/voice-to-text-controller";
import {UserProfile} from "../user-profile/user-profile";

declare var cordova: any;

@Component({
  selector: 'add-mood',
  templateUrl: 'add-mood.html'
})
export class AddMood {
  private title: string = "";
  private body: string = "";
  private user: User;
  private selectedEmotion = null;//EmotionTypes.NEUTRAL;
  private EmotionTypes = EmotionTypes;
  private inputType: {
    title: 'type' | 'record',
    body: 'type' | 'record'
  } = {title: 'type', body: 'type'};

  MediaSuccessStatus = {
    MEDIA_NONE: 0,
    MEDIA_STARTING: 1,
    MEDIA_RUNNING: 2,
    MEDIA_PAUSED: 3,
    MEDIA_STOPPED: 4
  };

  MediaErrorStatus = {
    MEDIA_ERR_ABORTED: 0,
    MEDIA_ERR_NETWORK: 1,
    MEDIA_ERR_DECODE: 2,
    MEDIA_ERR_NONE_SUPPORTED: 3
  };
  private recordingStatus: any;

  constructor(private navCtrl: NavController, private navParams: NavParams, private platform: Platform,
              private moodService: MoodService, private userService: UserService,
              private toastCtrl: ToastController, private voiceToTextController: VoiceToTextController,
              private loadingController: CustomLoadingController) {
    this.recordingStatus = {
      title: false,
      body: false
    };
  }

  ngOnInit() {
    this.user = this.navParams.get('user');
    this.checkMicrophonePermissions();
  }

  checkMicrophonePermissions() {
    if (this.platform.is('cordova'))
      cordova.plugins && cordova.plugins.diagnostic &&
      cordova.plugins.diagnostic.requestMicrophoneAuthorization(function (status) {
        if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
          console.log("Microphone use is authorized");
        }
      }, function (error) {
        console.log('error on michrophone authorization', error)
      });
  }

  isAvailableRecording() {
    return this.voiceToTextController.isAvailable();
  }

  postMood() {
    // this.navCtrl.setRoot(UserProfile);
    // this.apiAiService.textRequest(this.body);
    let mood: Mood = <Mood>{
      title: this.title,
      body: this.body,
      emotion: this.selectedEmotion,
      user: this.user.id,
      timestamp: new Date()
    };
    this.loadingController.create({content: "Saving..."});
    this.moodService.postMood(mood, (m) => {
        console.log('yey!', m);
        this.userService.updateTheme(m.sentiment.outputLabel);
        this.navCtrl.setRoot(UserProfile, {newMood: m.mood, user: this.user});
        this.loadingController.dismiss();
      },
      (error) => {
        this.loadingController.dismiss();
        throw error;
      });
    // .then(result => this.navCtrl.setRoot(UserProfile))
    // .catch(error => console.log('error on post', error));
  }

  selectEmotion(emotion) {
    this.selectedEmotion = emotion;
  }

  createToast() {
    let toast = this.toastCtrl.create({
      message: 'Recording started ...',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  record(filename: "title" | "body") {
    let recording = this.recordingStatus[filename];
    if (recording) {
      this.voiceToTextController.stopListening();
    } else {
      this.voiceToTextController.setCallbacks(
        ()=> {
          this.recordingStatus[filename] = true;
          this.createToast();
        },
        ()=> {
          this.recordingStatus[filename] = false;
          this.loadingController.create({content: 'Wait please ...'});
        }
      );
      this.voiceToTextController.startListening((result: any)=> {
        this.inputType[filename] = 'type';
        this[filename] = result.result.resolvedQuery;
        this.loadingController.dismiss();
      }, (error: any) => {
        this.loadingController.dismiss();
        throw error;
      });
    }
  }
}
