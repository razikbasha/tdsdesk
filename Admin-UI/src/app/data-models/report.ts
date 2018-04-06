export class ReportKPI {
   tenant_id: string;
   kpi:[
    {
        name:string;
        value:number;
    }]
}

export const ReportRequestExample = {
    data_source:'T_heromotocorp_iirp.DM_hero_sm_frd',
    date_range: {
        start_date_time: '01/01/2017',
        end_date_time: '12/31/2017'
    },
    frequency: 'Monthly', //Yearly, Quarterly/Monthly/Weekly/Daily/Hourly/Minute/Second/Rolling12Months
    columns:[
        {name: '00_reading_timestamp', header:'Timestamp', position: 0},
        {name: '01_tdm_unit', header:'TMD Unit', position: 1},
        {name: '25_position_10_hot_pressure_psi', header:'Hot Pressure PSI', position:2}
    ],
    matrix_calculator:[{
        name:'Hot Pressure PSI', 
        matrix_type:'mean',
        columns:[{name:'25_position_10_hot_pressure_psi'}],
    }],
    result_format:{
        name:'csv', //csv, raw, grid, higchart,highstock,map
        chart_type: 'line' //line, gauge, map
    }    
}

export class ReportRequest {
    data_source:string;
    date_range: {
        start_date_time: string;
        end_date_time: string;
    };
    frequency: string; //Yearly, Quarterly/Monthly/Weekly/Daily/Hourly/Minute/Second/Rolling12Months
    columns:[{name: string; header:string; position:number}];
    matrix_calculator:[{
        name:string; 
        matrix_type:string;
        columns:[{name:string;}];
    }];
    result_format:{
        name:string; //csv, raw, grid, higchart,highstock,map
        chart_type: string; //line, gauge, map
        data_table_view_id: string;
    }    
}


export class ReportResultsInGrid {
    results:[
        {
            column_headers:[{position:number, header:string}];
            data:[{position:number, value:string}];
        }
    ];
}


export class ReportResultsInHighChart {
    id: string;
    uri: string;
    highcharts: 
    {
        chart:{
            type:string;
        },
        title:{ text:string;}
        subtitle:{text:string;},
        yAxis:
        {
            title:{
                text:string;
            }
        },
        legend:{
            layout:"vertical",
            align:"right",
            verticalAlign:"middle"
        },
        xAxis:{
            type:"datetime"
        },
        plotOptions:{
            series:
            {
                pointStart: Date,
                pointIntervalUnit:"month"
            }
        },
        series:[{
            type: "line",
            data:[
            {
                name:string,
                data:[number]
            }
            ]
        }]
        }
};

export class ReportDataSchema{
    "_id":"59e93eb9f1b9b798e768ec8e";
    "id":string;
    "series":
        [ {"data": [number],"name":string}]
};

