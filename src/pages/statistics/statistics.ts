import {Component, ViewChild, ElementRef} from "@angular/core";
import {UserService} from "../../providers/user-service";
import {User} from "../../model/user";
import {NavController} from "ionic-angular";
import {AuthenticationComponent} from "../auth/authentication/authentication";
import {Chart} from 'chart.js';
import {MoodService} from "../../providers/mood-service";
import moment = require("moment");
import {Mood} from "../../model/mood";
import {SENTIMENTS, SENTIMENT_COLOR_MAPPING} from "../../shared/sentiment-mapping";
import {getDataForChart, AVAILABLE_CHARTS, AVAILABLE_CHART_DISPLAY_NAMES} from "./statistic-utils";

@Component({
  selector: 'statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsComponent {
  private user: User;
  private generalChart;
  private customChart;
  private customChartType: string;
  private availableChartTypes: any[];
  @ViewChild('chart') canvas: ElementRef;
  @ViewChild('customChart') customCanvas: ElementRef;
  private allMoods: Mood[];
  private startDate: string;
  private endDate: string;

  constructor(private userService: UserService, private navController: NavController, private moodService: MoodService) {
    this.availableChartTypes = Object.keys(AVAILABLE_CHARTS).map(key => {
      return {key: AVAILABLE_CHARTS[key], display: AVAILABLE_CHART_DISPLAY_NAMES[AVAILABLE_CHARTS[key]]}
    });
  }

  ngOnInit() {
    this.userService.getLocalUser()
      .then(user => {
        this.user = user;
        this.getMoods();
      })
      .catch(error => {
        console.log('error ???', error);
        this.navController.setRoot(AuthenticationComponent)
      })
  }

  ionViewWillEnter() {
    this.startDate = moment().subtract(1, 'week').format();
    this.endDate = moment().format();
    this.customChartType = AVAILABLE_CHARTS.HORIZONTAL_BAR;
  }


  addGeneralChart() {
    let data = getDataForChart(AVAILABLE_CHARTS.HORIZONTAL_BAR, this.allMoods);
    this.generalChart = new Chart(this.canvas.nativeElement, data);
  }

  private getMoods() {
    // let startDate = moment().subtract(2, 'week').toDate();
    // let endDate = moment().toDate();
    this.allMoods = [];
    this.moodService.getMoodsForStatistics(this.user.id, {}, (mood) => {
      this.allMoods.push(mood);
    }, (error) => console.log('WTF', error), () => {
      this.addGeneralChart();
      this.addCustomChart();
    });
  }

  private addCustomChart(chartType?: string) {
    let startDate = moment(this.startDate);
    let endDate = moment(this.endDate);
    let moods = this.allMoods.filter(mood => {
      let timestamp = moment(mood.timestamp);
      return timestamp.isBetween(startDate, endDate, null, "[]");
    });
    if (this.customChart) {
      let context = this.customCanvas.nativeElement.getContext('2d');
      context.clearRect(0, 0, this.customCanvas.nativeElement.width, this.customCanvas.nativeElement.height);
      this.customChart = null;
    }
    let data = getDataForChart(chartType ? chartType : this.customChartType, moods);
    this.customChart = new Chart(this.customCanvas.nativeElement, data);
  }

  ngOnDestroy() {
    this.allMoods = [];
  }

}
