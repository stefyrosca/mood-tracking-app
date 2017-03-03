import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Mood} from "../../../model/mood";
import {MoodService} from "../../../services/mood-service";
import {MoodComment} from "../mood-comment/mood-comment";


@Component({
  selector: 'mood-list',
  templateUrl: 'mood-list.html',
})
export class MoodList {

  moods: Mood[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private moodService: MoodService) {
    this.moods = [];
  }

  ngOnInit() {
    this.moodService.getAll()
      .subscribe(
        (result: Mood) => this.moods.push(result),
        (error) => console.log('error', error)
      )
  }

  moodClicked(event, mood) {
    this.navCtrl.push(MoodComment, {mood});
  }
}
