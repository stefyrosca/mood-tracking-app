import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../services/user-service";

/*
 Generated class for the Settings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private availableThemes;
  private userPreferences;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
    this.availableThemes = [
      {className: "red-theme", display: "Red"},
      {className: "blue-theme", display: "Blue"},
      {className: "orange-theme", display: "Orange"},
      {className: "purple-theme", display: "Purple"},
      {className: "green-theme", display: "Green"},
      {className: "yellow-theme", display: "Yellow"}
    ];
  }

  ngOnInit() {
    this.userPreferences = this.userService.getUserPreferences();
  }

  setTheme(theme) {
    this.userService.setUserPreference("theme", theme);
  }


}
