import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler, MenuController} from "ionic-angular";
import {MyApp} from "./app.component";
import {MoodList} from "../pages/mood-display/mood-list/mood-list";
import {MoodView} from "../shared/mood-view/mood-view";
import {HttpModule} from "@angular/http";
import {MoodService} from "../services/mood-service";
import {MoodComment} from "../pages/mood-display/mood-comment/mood-comment";
import {CommentService} from "../services/comment-service";
import {Database} from "../persistence/database";
import {UserService} from "../services/user-service";
import {CreateUser} from "../pages/create-profile/create-user/create-user";
import { FormsModule } from '@angular/forms';
import {AddMood} from "../pages/add-mood/add-mood";
import {UserProfile} from "../pages/user-profile/user-profile";

@NgModule({
  declarations: [
    MyApp,
    MoodList,
    MoodView,
    MoodComment,
    CreateUser,
    AddMood,
    UserProfile
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MoodList,
    MoodComment,
    CreateUser,
    AddMood,
    UserProfile
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, MenuController,
    Database, MoodService, CommentService, UserService]
})
export class AppModule {}
