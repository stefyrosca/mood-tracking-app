import {Component, ViewChild} from "@angular/core";
import {Platform, MenuController, Nav} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {MoodList} from "../pages/mood-display/mood-list/mood-list";
import {UserProfile} from "../pages/user-profile/user-profile";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MoodList;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public menu: MenuController) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title: 'Mood list', component: MoodList},
      {title: 'User profile', component: UserProfile}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
