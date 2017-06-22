import {Mood} from "../../model/mood";
import {SENTIMENTS, SENTIMENT_COLOR_MAPPING} from "../../shared/sentiment-mapping";
export const AVAILABLE_CHARTS = {
  HORIZONTAL_BAR: 'horizontalBar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut'
};

export const AVAILABLE_CHART_DISPLAY_NAMES = {
  [AVAILABLE_CHARTS.HORIZONTAL_BAR]: 'Horizontal bar',
  [AVAILABLE_CHARTS.PIE]: 'Pie',
  [AVAILABLE_CHARTS.DOUGHNUT]: 'Doughnut'
};

export function getDataForChart(chartType: string, moods: Mood[]) {
  let data = null;
  let labels = Object.keys(SENTIMENTS).map(key => SENTIMENTS[key]);
  let backgroundColors = labels.map(label => SENTIMENT_COLOR_MAPPING[label]);
  let moodsBySentiment = {};
  moods.forEach((mood: Mood) => {
    let emotion = mood.emotion;
    if (moodsBySentiment[emotion])
      moodsBySentiment[emotion].push(mood);
    else
      moodsBySentiment[emotion] = [mood];
  });
  let chartData = labels.map(label => moodsBySentiment[label] ? moodsBySentiment[label].length : 0);
  switch (chartType) {
    case AVAILABLE_CHARTS.HORIZONTAL_BAR: {
      data = {
        type: AVAILABLE_CHARTS.HORIZONTAL_BAR,
        data: {
          labels: labels,
          datasets: [{
            label: '# of Moods',
            data: chartData,
            backgroundColor: backgroundColors,
            // borderColor: [
            //   'rgba(255,99,132,1)',
            //   'rgba(54, 162, 235, 1)',
            //   'rgba(255, 206, 86, 1)',
            //   'rgba(75, 192, 192, 1)',
            //   'rgba(153, 102, 255, 1)',
            //   'rgba(255, 159, 64, 1)'
            // ],
            borderWidth: 1
          }]
        },
        options: {
          events: [],
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }],
            xAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      };
      break;
    }
    case AVAILABLE_CHARTS.PIE:
    case AVAILABLE_CHARTS.DOUGHNUT: {
      data = {
        type: chartType,
        data: {
          labels: labels,
          datasets: [{
            label: '# of Moods',
            data: chartData,
            backgroundColor: backgroundColors,
            // hoverBackgroundColor: [
            //   "#FF6384",
            //   "#36A2EB",
            //   "#FFCE56",
            //   "#FF6384",
            //   "#36A2EB",
            //   "#FFCE56"
            // ]
          }]
        },
        options: {
          events: []
        }
      };
      break;
    }
  }
  return data;
}
