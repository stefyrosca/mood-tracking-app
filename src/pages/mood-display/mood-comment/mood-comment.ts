import {Component, Input} from "@angular/core";
import {Mood} from "../../../model/mood";
import {NavParams, NavController} from "ionic-angular";
import {CommentService} from "../../../services/comment-service";
import {Comment} from "../../../model/comment";
import {UserService} from "../../../services/user-service";
import {LocalUser, User} from "../../../model/user";
import {HttpErrors} from "../../../shared/storage";
import {CreateUserComponent} from "../../auth/create-user/create-user";
import {MoodService} from "../../../services/mood-service";
import {formatTimestamp} from '../../../shared/utils'
import {UserProfile} from "../../user-profile/user-profile";
import {ErrorController} from "../../../services/error-controller";


@Component({
  selector: 'mood-comment',
  templateUrl: 'mood-comment.html'
})
export class MoodComment {

  private mood: Mood;
  private comments: any[] = [];
  private currentCommentText: string = '';
  private user: User = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private commentService: CommentService,
              private userService: UserService,
              private moodService: MoodService,
              private errorController: ErrorController) {
    // this.userService.getLocalUser().subscribe(
    //   (user: LocalUser) => this.user = user,
    //   error => error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUserComponent) : console.log('error', error)
    // );
  }

  formatTimestamp(timestamp) {
    return formatTimestamp(timestamp);
  }

  ngOnInit() {
    this.mood = this.navParams.get("mood");
    this.userService.getLocalUser()
      .then((user: any) => this.user = user)
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
