import {Injectable} from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Mood} from "../model/mood";
import {CommentService} from "./comment-service";
import {AuthService} from "./auth-service";
import {serverConfig} from "./server-config";
import {MediaObject} from "@ionic-native/media";
import {LocalStorageController} from "./local-storage-controller";
import {ResourceTypes} from "../model/resource-types";
import {Observable} from "rxjs";


@Injectable()
export class MoodService {
  private url = serverConfig.getBaseUrl();
  private TOKEN: string = null;


  constructor(private authHttp: AuthService, private localStorageController: LocalStorageController) {
  }

  public async getAll(next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    let newMoods = [];
    return this.authHttp.get(this.url + '/Mood')
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe((mood) => {
        newMoods.push(mood);
        next && next(mood);
      }, error, () => {
        if (newMoods.length > 0)
          this.localStorageController.updateStorage(ResourceTypes.MOOD, newMoods);
        done && done();
      });
  }

  public postMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.post(this.url + '/Mood', mood)
      .subscribe(result => {
        result = result.json();
        this.localStorageController.updateStorage(ResourceTypes.MOOD, [result]);
        next(result);
      }, error);
  }

  public getMoodsByUser(userId: string, next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    let newMoods = [];
    return this.authHttp.get(this.url + '/Mood?user=' + userId)
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe((mood) => {
        newMoods.push(mood);
        next && next(mood);
      }, error, () => {
        if (newMoods.length > 0)
          this.localStorageController.updateStorage(ResourceTypes.MOOD, newMoods);
        done && done();
      });
  }

  public putMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.put(this.url + '/Mood/' + mood._id, mood)
      .subscribe(result => {
        result = result.json();
        this.localStorageController.updateStorage(ResourceTypes.MOOD, [result]);
        next(result);
      }, error);
  }

  public deleteMood(mood: Mood, next: ()=>any, error: (error)=>any) {
    return this.authHttp.delete(this.url + '/Mood/' + mood._id)
      .subscribe((result) => {
        this.localStorageController.removeFromStorage(ResourceTypes.MOOD, [mood]);
        next && next();
      }, error);
  }

  public uploadFile(filePath: string, next: (result)=>any, error: (error)=>any) {
    let options = {
      fileName: filePath.split("/").pop(),
      mimeType: 'audio/aac'
    };
    return this.authHttp.postFile(filePath, this.url + '/Speech', options)
      .subscribe(next, error);
  }

}
