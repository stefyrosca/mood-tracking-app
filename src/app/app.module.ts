import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {MoodList} from "../components/mood-display/mood-list/mood-list";
import {MoodView} from "../shared/mood-view/mood-view";
import {HttpModule} from "@angular/http";
import {MoodService} from "../services/mood-service";
import {MoodComment} from "../components/mood-display/mood-comment/mood-comment";
import {CommentService} from "../services/comment-service";

@NgModule({
  declarations: [
    MyApp,
    MoodList,
    MoodView,
    MoodComment
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MoodList,
    MoodView,
    MoodComment
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, MoodService, CommentService]
})
export class AppModule {}
