import {Component, ViewChild} from "@angular/core";
import {Mood} from "../../model/mood";
import {LoadingController, NavParams, NavController, Content} from "ionic-angular";
import {UserService} from "../../providers/user-service";
import {MoodService} from "../../providers/mood-service";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {HttpErrors} from "../../shared/storage";
import {User} from "../../model/user";
import {MoodDisplayOptions, defaultOptions, AllowedActions} from "../../shared/mood-display-options";
import {LocalStorageController} from "../../providers/local-storage-controller";
import {ResourceTypes} from "../../model/resource-types";
import {Observable} from "rxjs";
@Component({
  selector: 'browse-moods',
  templateUrl: 'browse-moods.html',
})
export class BrowseMoods {
  private moods: {[id: string]: {data: Mood, liked: boolean}};
  private user: User;
  private moodListOptions: MoodDisplayOptions;
  private pagination = {page: 1, count: 10};
  private infiniteScroll: any;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private moodService: MoodService,
              private userService: UserService,
              public loader: LoadingController,
              public localStorageController: LocalStorageController) {
    this.moods = {};
    let options = {
      userProfile: {
        allowRedirect: true,
        action: AllowedActions.PUSH
      }
    };
    this.moodListOptions = Object.assign({}, defaultOptions, options);
  }

  ionViewDidLoad() {
    try {
      this.userService.getLocalUser()
        .then(user => {
          this.user = user;
          this.getAllMoods();
        })
        .catch(error => {
          this.navCtrl.setRoot(AuthenticationComponent)
        });
    } catch (error) {
      error.status == HttpErrors.NOT_FOUND ? this.navCtrl.setRoot(AuthenticationComponent) : console.log('error', error)
    }
  }

  nextPage(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.getAllMoods((shouldFetch)=> {
      if (shouldFetch)
        infiniteScroll.complete();
      else {
        infiniteScroll.enable(false);
      }
    });
  }

  refresh() {
    this.pagination = {page: 1, count: 10};
    this.content.scrollToTop();
    this.moods = {};
    this.infiniteScroll && this.infiniteScroll.enable(true);
    this.getAllMoods();
  }

  getAllMoods(doneCallback?: (shouldFetch: boolean) => void) {
    let loadingIndicator = this.loader.create({
      content: 'Getting latest entries...',
    });
    let moodCount = 0;
    loadingIndicator.present();
    this.moodService.getMoods(
      (result: Mood) => {
        moodCount++;
        this.moods[result.id] = {
          data: result,
          liked: result.likes.find(userId => this.user.id == userId) !== undefined
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
        loadingIndicator.dismiss()
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
          this.moods[result.id] = {
            data: result,
            liked: result.likes.find(userId => this.user.id == userId) !== undefined
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

  ngOnDestroy() {
    this.moods = {};
    this.pagination = {page: 1, count: 10};
  }
}
