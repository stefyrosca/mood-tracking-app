import {Component, Input} from "@angular/core";
import {Mood} from "../../../model/mood";
import {NavParams, NavController} from "ionic-angular";
import {CommentService} from "../../../services/comment-service";


@Component({
  selector: 'mood-comment',
  templateUrl: 'mood-comment.html'
})
export class MoodComment {

  private mood: Mood;
  private comments: any[] = [];
  private currentComment: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private commentService: CommentService) {
    this.mood = navParams.get("mood");
  }

  ngOnInit() {
    this.commentService.getByPostId(this.mood.id).subscribe(
      comment => this.comments.push(comment),
      error => console.log('error', error)
    )
  }

  postComment() {
    console.log('this.currentComment', this.currentComment);
  }

}
