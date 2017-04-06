import {Component, Input} from "@angular/core";
import {Mood} from "../../../model/mood";
import {NavParams, NavController} from "ionic-angular";
import {CommentService} from "../../../services/comment-service";
import {Comment} from "../../../model/comment";
import {UserService} from "../../../services/user-service";
import {LocalUser} from "../../../model/user";
import {HttpErrors} from "../../../shared/constants";
import {CreateUser} from "../../create-profile/create-user/create-user";


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
              private userService: UserService) {
    this.mood = navParams.get("mood");
    this.userService.getLocalUser().subscribe(
      (user: LocalUser) => this.user = user,
      error => error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(CreateUser) : console.log('error', error)
    );
  }

  ngOnInit() {
    this.commentService.getCommentsByPost(this.mood.id).subscribe(
      comment => this.comments.push(comment),
      error => console.log('error', error)
    )
  }

  postComment() {
    let comment = new Comment();
    comment.postId = this.mood.id;
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

}
