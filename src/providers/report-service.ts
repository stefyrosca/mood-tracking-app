import {Injectable} from "@angular/core";
import {Mood} from "../model/mood";
import moment = require("moment");

@Injectable()
export class ReportService {
  constructor() {

  }

  exportDataToHTML(data: Mood[]) {
    const now = moment();
    let reportName = now.format('lll');
    let parsedData = `<h2 style="text-align: center">Report ${reportName}</h2><hr><br>`;
    data.forEach(mood => {
      let timestamp = moment(mood.timestamp).format('lll');
      parsedData += `<h4>${mood.title}</h4><div>${mood.body}</div><div>Feeling ${mood.emotion}</div><div>${timestamp}</div>`
    });
    return {
      reportName: now.format('DD-MM-YY-HHMM'),
      html: `<!DOCTYPE html><html><head><title>Report ${reportName}</title></head><body>${parsedData}</body></html>`
    };
  }
}
