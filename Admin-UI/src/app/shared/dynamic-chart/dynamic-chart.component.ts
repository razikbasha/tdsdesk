import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Highcharts } from 'angular-highcharts';
import { DashboardDataSchema } from '../../data-models/dashboard';

@Component({
  selector: 'dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.css']
})
export class DynamicChartComponent implements OnInit {
@Input() chartData: DashboardDataSchema;
@Input() chartType: string;
@Input() chartTitle: string;

  chart:Chart;

  constructor() { 
  
  }

  ngOnInit() {
    console.log('chartData:' + JSON.stringify(this.chartData));
      this.createChart();
  }

  createChart()
  {
      this.chart = new Chart({ 
        chart: {
          type: this.chartType
        },
        title: {
          text: this.chartTitle
        },
        plotOptions: {
          area: {
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1}
            },
            marker: {
                radius: 2
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        },
        series: JSON.parse(JSON.stringify(this.chartData))
      }
    });
    
    
  }
}
