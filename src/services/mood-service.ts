import {Injectable} from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Mood} from "../model/mood";
import {CommentService} from "./comment-service";
import {AuthService} from "./auth-service";
import {serverConfig} from "./server-config";
import {MediaObject} from "@ionic-native/media";


@Injectable()
export class MoodService {
  private url = serverConfig.getBaseUrl();
  private TOKEN: string = null;


  constructor(private authHttp: AuthService, private commentService: CommentService) {
  }

  public getAll(next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    return this.authHttp.get(this.url + '/Mood')
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe(next, error, done);
  }

  public postMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.post(this.url + '/Mood', mood)
      .subscribe(mood => {
        mood = mood.json();
        next(mood);
      }, error);
  }

  public getMoodsByUser(userId: string, next: (mood)=>any, error: (error)=>any, done?: ()=>void) {
    return this.authHttp.get(this.url + '/Mood?user=' + userId)
      .map(result => result.json())
      .flatMap(mood => mood)
      .subscribe(next, error, done);
  }

  public putMood(mood: Mood, next: (mood)=>any, error: (error)=>any) {
    return this.authHttp.put(this.url + '/Mood/' + mood._id, mood)
      .subscribe(mood => {
        mood = mood.json();
        next(mood);
      }, error);
  }

  public deleteMood(mood: Mood, next: ()=>any, error: (error)=>any) {
    return this.authHttp.put(this.url + '/Mood/' + mood._id, mood)
      .subscribe(next, error);
  }

  public speechToText(recording: MediaObject, next: (response)=>any, error: (error)=>any) {
    return this.authHttp.post(this.url + '/Speech', {file: recording, otherThing: 'bla'}, {headers: {['Content-Type']: 'audio/mp4'}})
      .map(response => response.json())
      .subscribe(next, error);
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
