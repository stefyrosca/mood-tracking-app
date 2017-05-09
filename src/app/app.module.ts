import {NgModule, ErrorHandler} from "@angular/core";
import { IonicStorageModule, Storage } from '@ionic/storage'
import {IonicApp, IonicModule, IonicErrorHandler, MenuController, AlertController} from "ionic-angular";
import {MyApp} from "./app.component";
import {MoodList} from "../pages/mood-display/mood-list/mood-list";
import {MoodView} from "../shared/mood-view/mood-view";
import {HttpModule} from "@angular/http";
import {MoodService} from "../services/mood-service";
import {MoodComment} from "../pages/mood-display/mood-comment/mood-comment";
import {CommentService} from "../services/comment-service";
import {Database} from "../persistence/database";
import {UserService} from "../services/user-service";
import {CreateUserComponent} from "../pages/auth/create-user/create-user";
import {FormsModule} from '@angular/forms';
import {AddMood} from "../pages/add-mood/add-mood";
import {UserProfile} from "../pages/user-profile/user-profile";
import {LoginComponent} from "../pages/auth/login/login";
import {AuthenticationComponent} from "../pages/auth/authentication/authentication";
import {ErrorController} from "../services/error-controller";
import {AuthService} from "../services/auth-service";

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
    AuthenticationComponent
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
    AuthenticationComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, MenuController, AlertController, ErrorController,
    Database, MoodService, CommentService, UserService, AuthService]
})
export class AppModule {
}
