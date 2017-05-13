import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Mood} from "../../model/mood";
import {formatTimestamp, UserActions} from "../utils";

@Component({
  selector: 'mood-view',
  templateUrl: 'mood-view.html'
})
export class MoodView {

  @Input() public mood: Mood;
  @Input() public buttonStyles: any;
  @Output() notify: EventEmitter<{[message: string]: any}> = new EventEmitter<{[message: string]: any}>();
  private timestamp: string;
  private UserActions: any = UserActions;

  constructor() {
  }

  ngOnInit() {
    const defaultStyles = {
      heart: {
        color: "primary"
      }
    }
    console.log('buttonStyles', this.buttonStyles)
    this.timestamp = formatTimestamp(this.mood.timestamp);
    this.buttonStyles = Object.assign(defaultStyles, this.buttonStyles)
  }

  clicked(message: string, payload: any) {
    this.notify.emit({message, payload: payload? payload : {mood: this.mood}});
  }

}
