import {Component, Input} from "@angular/core";
import {Mood} from "../../../model/mood";
import {NavParams, NavController} from "ionic-angular";


@Component({
  selector: 'mood-comment',
  templateUrl: 'mood-comment.html'
})
export class MoodComment {

  private mood: Mood;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mood = navParams.get("mood");
  }

  ngOnInit() {
    console.log('onInit', this.mood);
  }

  moodClicked(event, mood) {
    // this.navCtrl.push(MoodView, {mood});

  }
}
