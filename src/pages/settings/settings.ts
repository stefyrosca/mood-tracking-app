import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../providers/user-service";
import {UserPreference, defaultUserPreference} from "../../model/user";
import {availableThemes} from "../../shared/sentiment-mapping";

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
  private userPreferences: UserPreference = defaultUserPreference;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
    this.availableThemes = availableThemes;
  }

  ngOnInit() {
    // this.userPreferences = this.userService.getUserPreferences();
    this.userService.getUserPreferences()
      .then((userPreferences: UserPreference) => this.userPreferences = userPreferences);
  }

  changePreference(key: string, value: any) {
    new Promise((resolve) =>
      this.userService.setUserPreference(key, value, resolve)
    ).then((userPreferences: UserPreference) => this.userPreferences = userPreferences);
  }
}
