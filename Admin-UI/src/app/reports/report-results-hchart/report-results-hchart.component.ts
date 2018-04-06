import { Component, OnInit,Input } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { User } from '../../data-models/user';
import { DynamicChartComponent } from '../../shared/dynamic-chart/dynamic-chart.component';
import { Highcharts } from 'angular-highcharts';
import { ReportService } from '../../core/report.service';
import { ReportRequest, ReportDataSchema } from 'app/data-models/report';

@Component({
  selector: 'report-results-hchart',
  templateUrl: './report-results-hchart.component.html',
  styleUrls: ['./report-results-hchart.component.css']
})
export class ReportResultsHchartComponent implements OnInit {
    @Input('reportRequest') reportRequest: ReportRequest;


    chart:Chart;
    chartData:ReportDataSchema;
    errorMessage:string;
    options:Object;

  constructor(private reportService:ReportService) { }

  ngOnInit() {
    this.getResults();
  }

  
  getResults()
  {
      if (this.reportRequest)
        this.getResultsInChartFormat();
      
  }

    getResultsInChartFormat()
    {
      if (this.reportRequest.result_format.name.includes('raw') || this.reportRequest.result_format.name.includes('grid')) {
          //alert('Chart Type Only!');
      }
      this.reportService.getReportResultsInHChart(this.reportRequest)
      .subscribe(data=>{
        let cData = data['results'];
        if (cData.length == 0 || !cData[0].highcharts) return;
        let tmp =JSON.stringify(cData[0].highcharts).replace(/^({)/,"")
        tmp = tmp.replace(/}\s*$/, "");
        let chartType = this.reportRequest.result_format.chart_type;

        tmp = "{ \"chart\": {\"type\": \""+ chartType +"\"}," + tmp + "}";
        this.options = JSON.parse(tmp);
        console.log(this.options);
        this.chart = new Chart(this.options);  
        
        console.log(this.chart.options.chart.type);
      },
      error => this.errorMessage = <any> Error);
    }  
}
