import {Component} from "@angular/core/src/metadata/directives";
import {AddMood} from "../add-mood/add-mood";
import {NavParams, NavController, LoadingController, Content, InfiniteScroll} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import {MoodService} from "../../providers/mood-service";
import {Mood} from "../../model/mood";
import {HttpErrors} from "../../shared/storage";
import {CreateUserComponent} from "../auth/create-user/create-user";
import {MoodComment} from "../mood-display/mood-comment/mood-comment";
import {MoodDisplayOptions, defaultOptions} from "../../shared/mood-display-options";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {AuthService} from "../../providers/auth-service";
import {LocalStorageController} from "../../providers/local-storage-controller";
import {Observable} from "rxjs";
import {ResourceTypes} from "../../model/resource-types";
import {User} from "../../model/user";
import {ViewChild} from "@angular/core";



@Component({
  selector: "user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfile {

  private moods: {[id: string]: {data: Mood, liked: boolean}} = {};
  private myUser;
  private currentUser;
  private moodListOptions: MoodDisplayOptions;
  private pagination = {page: 1, count: 10};
  private infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, private localStorageController: LocalStorageController,
              private userService: UserService, private moodService: MoodService,
              private loader: LoadingController, private authService: AuthService) {
    let options = {
      userProfile: {
        allowRedirect: false
      }
    };
    this.moodListOptions = Object.assign({}, defaultOptions, options);
  }

  nextPage(infiniteScroll: InfiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.getMoods(this.currentUser.id, (shouldFetch)=> {
      if (shouldFetch)
        infiniteScroll.complete();
      else {
        infiniteScroll.enable(false);
      }
    });
  }

  refresh() {
    this.pagination = {page: 1, count: 10};
    this.infiniteScroll && this.infiniteScroll.enable(true);
    this.content.scrollToTop();
    this.moods = {};
    this.getMoods(this.currentUser.id);
  }

  ionViewDidLoad() {
    this.currentUser = this.navParams.get("user");
    this.authService.getLocalUser()
      .then((user: any) => {
          this.myUser = user;
          const newMood = this.navParams.get('newMood');
          if (newMood) {
            this.moods[newMood.id] = {
              data: newMood,
              liked: newMood.likes.find(userId => this.myUser.id == userId) !== undefined
            }
          }
          if (!this.currentUser)
            this.currentUser = this.myUser;
          if (Object.keys(this.moods).length == 0)
            this.getMoods(this.currentUser.id);
        },
      )
      .catch(error => {
        if (error.status == HttpErrors.UNAUTHORIZED)
          this.navCtrl.setRoot(AuthenticationComponent);
        else {
          console.log('on else ...?', error);
          throw error;
        }
      });
  }

  getMoods(userId: string, doneCallback?: (shouldFetch: boolean)=>void) {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    loadingIndicator.present();
    let moodCount = 0;
    this.moodService.getMoodsByUser(userId,
      (result: any) => {
        moodCount++;
        this.moods[result.id] = {
          data: result,
          liked: result.likes.find(userId => this.myUser.id == userId) !== undefined
        }
      },
      (error) => {
        console.log('error', error);
        doneCallback && doneCallback(false);
        this.getLocalData(loadingIndicator);
        throw error;
      },
      () => {
        doneCallback && doneCallback(moodCount == this.pagination.count);
        this.pagination.page++;
        loadingIndicator.dismiss();
      },
      this.pagination.page,
      this.pagination.count
    )
  }

  getLocalData(loadingIndicator) {
    Observable
      .fromPromise(this.localStorageController.getFromStorage(ResourceTypes.MOOD))
      .flatMap(mood => mood)
      .subscribe((result: Mood) => {
          if ((typeof result.user == 'string' && result.user == this.currentUser.id)
            || (typeof result.user == 'object' && (result.user as User).id == this.currentUser.id))
            this.moods[result.id] = {
              data: result,
              liked: result.likes.find(userId => this.currentUser.id == userId) !== undefined
            }
        },
        (error) => {
          loadingIndicator.dismiss();
          throw error;
        },
        () => {
          loadingIndicator.dismiss()
        });
  }

  goToAddMood() {
    this.navCtrl.push(AddMood, {user: this.myUser});
  }

  goToComments(mood) {
    this.navCtrl.push(MoodComment, {mood, user: this.myUser});
  }

  getMoodList() {
    return Object.keys(this.moods).map(id => this.moods[id].data);
  }

  ngOnDestroy() {
    this.moods = {};
    this.pagination = {page: 1, count: 10};
  }
}
