import {Component, ViewChild} from "@angular/core";
import {Platform, MenuController, Nav} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {UserProfile} from "../pages/user-profile/user-profile";
import {AuthenticationComponent} from "../pages/auth/authentication/authentication";
import {BrowseMoods} from "../pages/browse-moods/browse-moods";
import {SettingsPage} from "../pages/settings/settings";
import {UserService} from "../services/user-service";
import {defaultUserPreference, UserPreference} from "../model/user";
import {VoiceToTextController} from "../services/voice-to-text-controller";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = UserProfile;
  // rootPage: any = BrowseMoods;
  pages: Array<{title: string, component: any}>;
  private userPreferences: any;

  constructor(public platform: Platform, public menu: MenuController,
              private userService: UserService, private voiceToTextController: VoiceToTextController) {
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
    Splashscreen.show();
  }

  initializeApp() {
    this.platform.ready()
      .then(async(response) => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        try {
          this.userPreferences = await this.userService.getUserPreferences();
        } catch (error) {
          // this.navCtrl.setRoot(AuthenticationComponent);
        }
        let subject = this.userService.subscribe();
        subject.subscribe((result: UserPreference)=> {
          if (result)
            this.userPreferences = result;
          else
            this.userPreferences = defaultUserPreference;
        });
        if (!this.platform.is('windows') && !this.platform.is('core'))
          this.voiceToTextController.init();
        Splashscreen.hide();
      });
  };

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
