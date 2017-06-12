import {Component, ViewChild} from "@angular/core";
import {Platform, MenuController, Nav} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {MoodList} from "../pages/mood-display/mood-list/mood-list";
import {UserProfile} from "../pages/user-profile/user-profile";
import {AuthenticationComponent} from "../pages/auth/authentication/authentication";
import {BrowseMoods} from "../pages/browse-moods/browse-moods";
import {SettingsPage} from "../pages/settings/settings";
import {UserService} from "../services/user-service";
import {AddMood} from "../pages/add-mood/add-mood";
import {defaultUserPreference, UserPreference} from "../model/user";
import {Observable, BehaviorSubject} from "rxjs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = UserProfile;
  pages: Array<{title: string, component: any}>;
  private userPreferences: any;

  constructor(public platform: Platform, public menu: MenuController, private userService: UserService) {
    this.userPreferences = defaultUserPreference;
    this.initializeApp();
    // set our app's pages
    this.pages = [
      {title: 'Browse', component: BrowseMoods},
      {title: 'User profile', component: UserProfile},
      {title: 'Settings', component: SettingsPage},
      {title: 'Logout', component: AuthenticationComponent}
    ];
  }

  ngOnInit() {

  }

  async initializeApp() {
    await this.platform.ready();
    // .then(() => {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.userPreferences = await this.userService.getUserPreferences();
    let subject = this.userService.subscribe();
    subject.subscribe((result: UserPreference)=> this.userPreferences = result);

    StatusBar.styleDefault();
    Splashscreen.hide();

    // });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
