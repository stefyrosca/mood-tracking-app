import {NgModule, ErrorHandler} from "@angular/core";
import {IonicStorageModule, Storage} from '@ionic/storage'
import {IonicApp, IonicModule, IonicErrorHandler, MenuController, AlertController} from "ionic-angular";
import {MyApp} from "./app.component";
import {MoodList} from "../pages/mood-display/mood-list/mood-list";
import {MoodView} from "../shared/mood-view/mood-view";
import {HttpModule} from "@angular/http";
import {MoodService} from "../providers/mood-service";
import {MoodComment} from "../pages/mood-display/mood-comment/mood-comment";
import {CommentService} from "../providers/comment-service";
import {UserService} from "../providers/user-service";
import {CreateUserComponent} from "../pages/auth/create-user/create-user";
import {FormsModule} from '@angular/forms';
import {AddMood} from "../pages/add-mood/add-mood";
import {UserProfile} from "../pages/user-profile/user-profile";
import {LoginComponent} from "../pages/auth/login/login";
import {AuthenticationComponent} from "../pages/auth/authentication/authentication";
import {ErrorController} from "../providers/error-controller";
import {AuthService} from "../providers/auth-service";
import {BrowseMoods} from "../pages/browse-moods/browse-moods";
import {SettingsPage} from "../pages/settings/settings";
import {NativeStorage} from "@ionic-native/native-storage";
import {MediaObject, MediaPlugin} from "@ionic-native/media";
import {CustomLoadingController} from "../providers/loading-controller";
import {File} from "@ionic-native/file"
import {Transfer} from "ionic-native";
import {LocalStorageController} from "../providers/local-storage-controller";
import {VoiceToTextController} from "../providers/voice-to-text-controller";
import {StatisticsComponent} from "../pages/statistics/statistics";

@NgModule({
  declarations: [
    MyApp,
    MoodList,
    MoodView,
    MoodComment,
    CreateUserComponent,
    AddMood,
    UserProfile,
    LoginComponent,
    AuthenticationComponent,
    BrowseMoods,
    SettingsPage,
    StatisticsComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MoodList,
    MoodComment,
    CreateUserComponent,
    AddMood,
    UserProfile,
    LoginComponent,
    AuthenticationComponent,
    BrowseMoods,
    SettingsPage,
    StatisticsComponent
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: ErrorController
  }, MenuController, AlertController, ErrorController, File, Transfer, NativeStorage, MediaPlugin, VoiceToTextController,
    MoodService, CommentService, UserService, AuthService, CustomLoadingController, LocalStorageController]
})
export class AppModule {
}

