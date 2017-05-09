import {Component, Input} from "@angular/core";
import {Mood} from "../../../model/mood";
import {NavParams, NavController} from "ionic-angular";
import {CommentService} from "../../../services/comment-service";
import {Comment} from "../../../model/comment";
import {UserService} from "../../../services/user-service";
import {LocalUser} from "../../../model/user";
import {HttpErrors} from "../../../shared/constants";
import {CreateUserComponent} from "../../auth/create-user/create-user";
import {MoodService} from "../../../services/mood-service";


@Component({
  selector: 'mood-comment',
  templateUrl: 'mood-comment.html'
})
export class MoodComment {

  private mood: Mood;
  private comments: any[] = [];
  private currentCommentText: string = '';
  private user: LocalUser = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private commentService: CommentService,
              private userService: UserService,
              private moodService: MoodService,) {
    this.mood = navParams.get("mood");
    this.userService.getLocalUser()
      .then((user: any) => this.user = user)
      .catch(error => this.navCtrl.setRoot(CreateUserComponent));
    // this.userService.getLocalUser().subscribe(
    //   (user: LocalUser) => this.user = user,
    //   error => error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUserComponent) : console.log('error', error)
    // );
  }

  ngOnInit() {
    this.commentService.getCommentsByPost(this.mood._id).subscribe(
      comment => this.comments.push(comment),
      error => console.log('error', error)
    )
  }

  postComment() {
    let comment = new Comment();
    comment.moodId = this.mood._id;
    comment.text = this.currentCommentText;
    comment.userId = this.user.userId;
    this.commentService
      .addCommentToPost(comment)
      .then(result => {
        this.comments.push(comment);
        this.currentCommentText = '';
      })
      .catch(error => console.log('no comment', error));
  }

  deleteMood() {
    this.moodService.deleteMood(this.mood)
      .subscribe(
        result => {
          console.log('ok deleted', result)
        },
        error => console.log('nu e ok', error)
      )
  }

}
