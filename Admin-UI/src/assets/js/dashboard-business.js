/*
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7 & Bootstrap 4.0.0-Alpha 6
Version: 3.0.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v3.0/admin/angularjs4/

Copy from dashboard.js from the template above 9/5/2017
*/

var blue	= '#348fe2',
blueLight	= '#5da5e8',
blueDark	= '#1993E4',
aqua		= '#49b6d6',
aquaLight	= '#6dc5de',
aquaDark	= '#3a92ab',
green		= '#00acac',
greenLight	= '#33bdbd',
greenDark	= '#008a8a',
orange		= '#f59c1a',
orangeLight	= '#f7b048',
orangeDark	= '#c47d15',
dark		= '#2d353c',
grey		= '#b6c2c9',
purple		= '#727cb6',
purpleLight	= '#8e96c5',
purpleDark	= '#5b6392',
red         = '#ff5b57';

var handleDashboardBusinessSparkline = function() {
	"use strict";
    var options = {
        height: '50px',
        width: '100%',
        fillColor: 'transparent',
        lineWidth: 2,
        spotRadius: '4',
        highlightLineColor: blue,
        highlightSpotColor: blue,
        spotColor: false,
        minSpotColor: false,
        maxSpotColor: false
    };
    function renderDashboardBusinessSparkline() {
        var value = [50,30,45,40,50,20,35,40,50,70,90,40];
        options.type = 'line';
        options.height = '23px';
        options.lineColor = red;
        options.highlightLineColor = red;
        options.highlightSpotColor = red;
        
        var countWidth = $('#sparkline-number-of-tenants').width();
        if (countWidth >= 200) {
            options.width = '200px';
        } else {
            options.width = '100%';
        }
        
        $('#sparkline-number-of-tenants').sparkline(value, options);
        options.lineColor = blue;
        options.highlightLineColor = blue;
        options.highlightSpotColor = blue;
        $('#sparkline-number-of-device-types').sparkline(value, options);
        options.lineColor = blue;
        options.highlightLineColor = blue;
        options.highlightSpotColor = blue;
        $('#sparkline-number-of-usecases').sparkline(value, options);
        options.lineColor = green;
        options.highlightLineColor = green;
        options.highlightSpotColor = green;
        $('#sparkline-number-of-device-models').sparkline(value, options);
        options.lineColor = orange;
        options.highlightLineColor = orange;
        options.highlightSpotColor = orange;
        $('#sparkline-total-daily-active-devices').sparkline(value, options);
        options.lineColor = red;
        options.highlightLineColor = red;
        options.highlightSpotColor = red;
    }
    
    renderDashboardBusinessSparkline();
    
    $(window).on('resize', function() {
        $('#sparkline-number-of-tenants').empty();
        $('#sparkline-number-of-usecases').empty();
        $('#sparkline-number-of-device-types').empty();
        $('#sparkline-total-daily-active-devices').empty();
        $('#sparkline-number-of-device-models').empty();
        renderDashboardBusinessSparkline();
    });
};
var handleDashboardGritterNotification = function() {
    setTimeout(function() {
        $.gritter.add({
            title: 'Welcome back!',
            text: '',
            image: '',
            sticky: true,
            time: '',
            class_name: 'my-sticky-class'
        });
    }, 1000);
};

var handleReportDatepicker = function() {
    $('#datepicker-default').datepicker({
        todayHighlight: true
    });
    $('#datepicker-inline').datepicker({
        todayHighlight: true
    });
    $('.input-daterange').datepicker({
        todayHighlight: true
    });
    $('#datepicker-disabled-past').datepicker({
        todayHighlight: true
    });
    $('#datepicker-autoClose').datepicker({
        todayHighlight: true,
        autoclose: true
    });
};
var handleReportDateRangePicker = function() {
    $('#default-daterange').daterangepicker({
        opens: 'right',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        startDate: moment().subtract( 29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2018',
    },
    function (start, end) {
        $('#default-daterange input').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    });
    
    $('#advance-daterange span').html(moment().subtract(29,'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

    $('#advance-daterange').daterangepicker({
        format: 'MM/DD/YYYY',
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: { days: 60 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        drops: 'down',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    }, function(start, end, label) {
        $('#advance-daterange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    });
};


var handleJstreeDefault = function() {
    $('#report-jstree-default').jstree({
        "core": {
            "themes": {
                "responsive": false
            }            
        },
        "types": {
            "default": {
                "icon": "fa fa-folder text-warning fa-lg"
            },
            "file": {
                "icon": "fa fa-file text-inverse fa-lg"
            }
        },
        "plugins": ["types"]
    });

    $('#report-jstree-default').on('select_node.jstree', function(e,data) { 
        var link = $('#' + data.selected).find('a');
        if (link.attr("href") != "#" && link.attr("href") != "javascript:;" && link.attr("href") != "") {
            if (link.attr("target") == "_blank") {
                link.attr("href").target = "_blank";
            }
            document.location.href = link.attr("href");
            return false;
        }
    });
};

var handleJstreeCheckable = function() {
    $('#report-jstree-checkable').jstree({
        'plugins': ["wholerow", "checkbox", "types"],
        'core': {
            "themes": {
                "responsive": false
            },    
            'data': [{
                "text": "Same but with checkboxes",
                "children": [{
                    "text": "initially selected",
                    "state": { "selected": true }
                }, {
                    "text": "Folder 1"
                }, {
                    "text": "Folder 2"
                }, {
                    "text": "Folder 3"
                }, {
                    "text": "initially open",
                    "icon": "fa fa-folder fa-lg",
                    "state": {
                        "opened": true
                    },
                    "children": [{
                        "text": "Another node"
                    }, {
                        "text": "disabled node",
                        "state": {
                            "disabled": true
                        }
                    }]
                }, {
                    "text": "custom icon",
                    "icon": "fa fa-cloud-download fa-lg text-inverse"
                }, {
                    "text": "disabled node",
                    "state": {
                        "disabled": true
                    }
                }
            ]},
            "Root node 2"
        ]},
        "types": {
            "default": {
                "icon": "fa fa-folder text-primary fa-lg"
            },
            "file": {
                "icon": "fa fa-file text-success fa-lg"
            }
        }
    });
};




var handleJstreeDragAndDrop = function() {
    $("#report-jstree-drag-and-drop").jstree({
        "core": {
            "themes": {
                "responsive": false
            }, 
            "check_callback": true,
            'data': [{
                    "text": "Parent Node",
                    "children": [{
                        "text": "Initially selected",
                        "state": {
                            "selected": true
                        }
                    }, {
                        "text": "Folder 1"
                    }, {
                        "text": "Folder 2"
                    }, {
                        "text": "Folder 3"
                    }, {
                        "text": "Initially open",
                        "icon": "fa fa-folder text-success fa-lg",
                        "state": {
                            "opened": true
                        },
                        "children": [
                            {"text": "Disabled node", "disabled": true},
                            {"text": "Another node"}
                        ]
                    }, {
                        "text": "Another Custom Icon",
                        "icon": "fa fa-cog text-inverse fa-lg"
                    }, {
                        "text": "Disabled Node",
                        "state": {
                            "disabled": true
                        }
                    }, {
                        "text": "Sub Nodes",
                        "icon": "fa fa-folder text-danger fa-lg",
                        "children": [
                            {"text": "Item 1", "icon": "fa fa-file fa-lg"},
                            {"text": "Item 2", "icon": "fa fa-file fa-lg"},
                            {"text": "Item 3", "icon": "fa fa-file fa-lg"},
                            {"text": "Item 4", "icon": "fa fa-file fa-lg"},
                            {"text": "Item 5", "icon": "fa fa-file fa-lg"}
                        ]
                    }]
                },
                "Another Node"
            ]
        },
        "types": {
            "default": {
                "icon": "fa fa-folder text-warning fa-lg"
            },
            "file": {
                "icon": "fa fa-file text-warning fa-lg"
            }
        },
        "state": { "key": "demo2" },
        "plugins": [ "contextmenu", "dnd", "state", "types" ]
    });
};


var handleDataTableCombinationSetting1 = function() {
	"use strict";
    
    if ($('#data-table-tableview1').length !== 0) {
        $('data-table-tableview1').DataTable({
            dom: 'lBfrtip',
            buttons: [
                { extend: 'copy', className: 'btn-sm' },
                { extend: 'csv', className: 'btn-sm' },
                { extend: 'excel', className: 'btn-sm' },
                { extend: 'pdf', className: 'btn-sm' },
                { extend: 'print', className: 'btn-sm' }
            ],
            responsive: true,
            autoFill: true,
            colReorder: true,
            keys: true,
            rowReorder: true,
            select: true
        });
    }
};

var handleDataTableCombinationSetting3 = function() {
	"use strict";
    
    if ($('#data-table-business-dyanmic-report').length !== 0) {
        $('data-table-business-dyanmic-report').DataTable({
            dom: 'lBfrtip',
            buttons: [
                { extend: 'copy', className: 'btn-sm' },
                { extend: 'csv', className: 'btn-sm' },
                { extend: 'excel', className: 'btn-sm' },
                { extend: 'pdf', className: 'btn-sm' },
                { extend: 'print', className: 'btn-sm' }
            ],
            responsive: true,
            autoFill: true,
            colReorder: true,
            keys: true,
            rowReorder: true,
            select: true
        });
    }
};

var handleDataTableCombinationSetting2 = function() {
	"use strict";
    
    if ($('#data-table-tableview2').length !== 0) {
        $('data-table-tableview2').DataTable({
            dom: 'lBfrtip',
            buttons: [
                { extend: 'copy', className: 'btn-sm' },
                { extend: 'csv', className: 'btn-sm' },
                { extend: 'excel', className: 'btn-sm' },
                { extend: 'pdf', className: 'btn-sm' },
                { extend: 'print', className: 'btn-sm' }
            ],
            responsive: true,
            autoFill: true,
            colReorder: true,
            keys: true,
            rowReorder: true,
            select: true
        });
    }
};



var DashboardBusiness = function () {
	"use strict";
    return {
        //main function
        init: function () {
            
            
            $.getScript('assets/plugins/sparkline/jquery.sparkline.js').done(function() {
                handleDashboardBusinessSparkline();
            });
            $.getScript('assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js').done(function() {
                handleReportDatepicker();
            });
            $.getScript('assets/plugins/bootstrap-daterangepicker/moment.js').done(function() {
                $.getScript('assets/plugins/bootstrap-daterangepicker/daterangepicker.js').done(function() {
                    handleReportDateRangePicker();
                });
            });
            
            $.getScript('assets/plugins/jstree/dist/jstree.min.js').done(function() {
                handleJstreeDefault();
                handleJstreeCheckable();
                handleJstreeDragAndDrop();
            });
        
            $.getScript('assets/plugins/DataTables/media/js/jquery.dataTables.js').done(function() {
                $.getScript('assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js').done(function() {
                    $.getScript('assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js').done(function() {
                        $.getScript('assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js').done(function() {
                            $.getScript('assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js').done(function() {
                                $.getScript('assets/plugins/DataTables/extensions/Buttons/js/jszip.min.js').done(function() {
                                    $.getScript('assets/plugins/DataTables/extensions/Buttons/js/pdfmake.min.js').done(function() {
                                        $.getScript('assets/plugins/DataTables/extensions/Buttons/js/vfs_fonts.min.js').done(function() {
                                            $.getScript('assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js').done(function() {
                                                $.getScript('assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js').done(function() {
                                                    $.getScript('assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js').done(function() {
                                                        $.getScript('assets/plugins/DataTables/extensions/AutoFill/js/dataTables.autoFill.min.js').done(function() {
                                                            $.getScript('assets/plugins/DataTables/extensions/ColReorder/js/dataTables.colReorder.min.js').done(function() {
                                                                $.getScript('assets/plugins/DataTables/extensions/KeyTable/js/dataTables.keyTable.min.js').done(function() {
                                                                    $.getScript('assets/plugins/DataTables/extensions/RowReorder/js/dataTables.rowReorder.min.js').done(function() {
                                                                        $.getScript('assets/plugins/DataTables/extensions/Select/js/dataTables.select.min.js').done(function() {
                                                                            handleDataTableCombinationSetting1();
                                                                            handleDataTableCombinationSetting2();
                                                                            handleDataTableCombinationSetting3();
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
           
        }
    };
}();