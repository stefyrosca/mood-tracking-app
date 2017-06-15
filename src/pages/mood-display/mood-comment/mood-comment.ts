import {Component} from "@angular/core";
import {Mood} from "../../../model/mood";
import {NavParams, NavController} from "ionic-angular";
import {CommentService} from "../../../services/comment-service";
import {Comment} from "../../../model/comment";
import {UserService} from "../../../services/user-service";
import {User} from "../../../model/user";
import {CreateUserComponent} from "../../auth/create-user/create-user";
import {MoodService} from "../../../services/mood-service";
import {formatTimestamp} from "../../../shared/utils";
import {UserProfile} from "../../user-profile/user-profile";
import {ErrorController} from "../../../services/error-controller";
import {MoodDisplayOptions, defaultOptions, AllowedActions} from "../../../shared/mood-display-options";


@Component({
  selector: 'mood-comment',
  templateUrl: 'mood-comment.html'
})
export class MoodComment {

  private mood: Mood;
  private formattedMood: {[id: string]: {data: Mood, liked: boolean}};
  private moodDisplayOptions: MoodDisplayOptions;
  private comments: any[] = [];
  private currentCommentText: string = '';
  private user: User = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private commentService: CommentService,
              private userService: UserService,
              private moodService: MoodService,
              private errorController: ErrorController) {
    const displayOptions = {
      comment: {
        allowRedirect: false
      },
      userProfile: {
        allowRedirect: true,
        action: AllowedActions.REPLACE
      }
    };
    this.moodDisplayOptions = Object.assign({}, defaultOptions, displayOptions);
  }

  formatTimestamp(timestamp) {
    return formatTimestamp(timestamp);
  }

  formatMood() {
    return {
      [this.mood.id]: {
        data: this.mood,
        liked: this.mood.likes.find(userId => this.user.id == userId) !== undefined
      }
    }
  }

  ngOnInit() {
    this.mood = this.navParams.get("mood");
    this.userService.getLocalUser()
      .then((user: any) => {
        this.user = user;
        this.formattedMood = this.formatMood();
      })
      .catch(error => this.navCtrl.setRoot(CreateUserComponent));
    this.commentService.getCommentsByPost(this.mood._id).subscribe(
      comment => this.comments.push(comment),
      error => console.log('error', error)
    )
  }

  postComment() {
    let comment: Comment = {
      mood: this.mood._id,
      text: this.currentCommentText,
      user: this.user.id,
      timestamp: new Date()
    };
    console.log('post comment', comment);
    this.commentService
      .addCommentToPost(comment)
      .subscribe(result => {
        comment.user = this.user;
        this.comments.push(comment);
        this.mood.comments.push(comment);
        this.formatMood();
        this.currentCommentText = '';
      }, error => console.log('no comment', error));
  }

  async deleteMood() {
    let buttons = [{
      text: 'YES', handler: ()=> {
        this.moodService.deleteMood(this.mood, ()=>console.log('ok, deleted'), (error)=> {
          throw error
        });
      }
    }, {text: 'NO'}];
    this.errorController.setAlert('Warning', 'Are you sure you want to delete this?', buttons);
  }

  navigateToUser(user: any) {
    // push, set root?
    this.navCtrl.push(UserProfile, {user})
  }


}
