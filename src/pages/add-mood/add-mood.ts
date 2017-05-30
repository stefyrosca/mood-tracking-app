import {Component} from "@angular/core/src/metadata/directives";
import {MoodService} from "../../services/mood-service";
import {ResourceTypes} from "../../model/resource-types";
import {UserService} from "../../services/user-service";
import {LocalUser} from "../../model/user";
import {Mood} from "../../model/mood";
import {NavController, NavParams, Platform, LoadingController} from "ionic-angular";
import {UserProfile} from "../user-profile/user-profile";
import {CreateUserComponent} from "../auth/create-user/create-user";
import {HttpErrors} from "../../shared/storage";
import {EmotionTypes} from "../../model/emotion-types";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {ApiAiService} from "../../services/api.ai-service";
import {MediaPlugin, MediaObject} from '@ionic-native/media';
import {File, FileError} from '@ionic-native/file';
import {CustomLoadingController} from "../../services/loading-controller";

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
  private fileStatus: any;
  private files: {
    title: MediaObject,
    body: MediaObject
  } = {title: null, body: null};
  private filePath;

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

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private moodService: MoodService, private userService: UserService,
              private apiAiService: ApiAiService, private media: MediaPlugin,
              private nativeFile: File, private loadingController: CustomLoadingController) {
    this.fileStatus = {
      title: {
        status: this.MediaSuccessStatus.MEDIA_NONE,
        error: false,
        recording: false
      },
      body: {
        status: this.MediaSuccessStatus.MEDIA_NONE,
        error: false,
        recording: false
      }
    };
  }

  ngOnInit() {
    let folderName = "temp/";
    this.filePath = "";
    this.user = this.navParams.get('user');
    this.loadingController.create({content: "Loading"});
    this.nativeFile.createDir(this.nativeFile.externalDataDirectory, folderName, false)
      .then((entry) => {
        this.filePath = this.nativeFile.externalDataDirectory + folderName;
        this._createFiles(()=>this.loadingController.dismiss(), ()=>this.loadingController.dismiss());
        // this.loadingController.dismiss()
      })
      .catch((error) => {
        if (error.code == 12)
          this.filePath = this.nativeFile.externalDataDirectory + folderName;
        console.log('ERROR!!!', error);
        this._createFiles(()=>this.loadingController.dismiss(), ()=>this.loadingController.dismiss());
        // this.loadingController.dismiss()
      });
  }

  private _createFiles(callback, error) {
    let promises = [];
    promises.push(this.nativeFile.createFile(this.filePath, 'title.mp3', true));
    promises.push(this.nativeFile.createFile(this.filePath, 'body.mp3', true));
    Promise.all(promises).then((results) => {
      console.log('results', results);
      console.log('filePath', this.filePath + "title.mp3")
      console.log('filePath', this.filePath + "body.mp3")
      callback && callback();
    }).catch(error);
  }

  createAudioFile(filename: "title" | "body") {
    const onStatusUpdate = (status) => {
      console.log('status changed', filename, this.fileStatus[filename].status, status);
      this.fileStatus[filename].status = status;
      this.fileStatus[filename].error = false;
    };
    const onSuccess = () => {
      console.log(this.files.title);
      console.log('Action is successful.', filename)
    };
    const onError = (error) => {
      this.fileStatus[filename].status = error.code;
      this.fileStatus[filename].error = true;
    };
    console.log('why not??', this.filePath + filename + ".mp3");
    this.files[filename] = this.media.create(this.filePath + filename + ".mp3", onStatusUpdate, onSuccess, onError);
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
        this.navCtrl.pop();
        this.loadingController.dismiss();
      },
      (error) => {
        this.loadingController.dismiss();
        throw error
      });
    // .then(result => this.navCtrl.setRoot(UserProfile))
    // .catch(error => console.log('error on post', error));
  }

  selectEmotion(emotion) {
    this.selectedEmotion = emotion;
  }

  play(filename: "title" | "body") {
    let file = this.files[filename];
    let fileStatus = this.fileStatus[filename];
    if (!fileStatus.error && !fileStatus.recording) {
      if (fileStatus.status == this.MediaSuccessStatus.MEDIA_NONE || this.MediaSuccessStatus.MEDIA_PAUSED || this.MediaSuccessStatus.MEDIA_STOPPED) {
        file.play();
      } else if (fileStatus.status == this.MediaSuccessStatus.MEDIA_RUNNING) {
        file.pause();
      } else {
        console.log('nothing', fileStatus);
      }
    } else {
      console.log('sorry, error', fileStatus);
    }
  }

  record(filename: "title" | "body") {
    try {
      let currentFileStatus = this.fileStatus[filename];
      if (currentFileStatus.recording) {
        currentFileStatus.recording = false;
        let file = this.files[filename];
        file.stopRecord();
        console.log('after stop record', this.fileStatus);
      } else {
        currentFileStatus.recording = true;
        this.createAudioFile(filename);
        let file = this.files[filename];
        console.log('file', file);
        file.startRecord();
        console.log('after start record', this.fileStatus);
      }
    } catch (error) {
      this.fileStatus[filename].error = true;
      console.log('some error on recording', error);
      throw error;
    }
  }

  ngOnDestroy() {
    Object.keys(this.files).forEach(filename => this.files[filename] && this.files[filename].release());
  }
}
