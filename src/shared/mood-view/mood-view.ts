import {Component, Input} from "@angular/core";
import {Mood} from "../../model/mood";


@Component({
  selector: 'mood-view',
  templateUrl: 'mood-view.html'
})
export class MoodView {

  @Input() public mood: Mood;

  constructor() {}

  ngOnInit() {
  }

}
