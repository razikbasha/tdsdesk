/*
Template Name: IIRP Admin - IIRP Dashboard Template build with Twitter Bootstrap 3.3.7 & Bootstrap 4.0.0-Alpha 6
Version: 1.0.0
Author: Roxy stimpson
Website: http://www.seantheme.com/color-admin-v3.0/admin/angularjs4/

01. Organizaton Admin Page
*/



/* 01. Super Admin Page
------------------------------------------------ */
window.addEventListener('dashboard-organization-admin-ready', function(e) {
    $.getScript('/assets/js/dashboard-organization-admin.min.js').done(function() {
        DashboardOrganizationAdmin.init();
        App.initComponent();
    });
});

/* 01. Tenant Admin Page
------------------------------------------------ */
window.addEventListener('dashboard-tenant-admin-ready', function(e) {
    $.getScript('/assets/js/dashboard-tenant-admin.min.js').done(function() {
        DashboardTenantAdmin.init();
        App.initComponent();
    });
});

/* 01. Tenant Admin Page
------------------------------------------------ */
window.addEventListener('dashboard-business-ready', function(e) {
    $.getScript('/assets/js/dashboard-business.min.js').done(function() {
        DashboardBusiness.init();
        App.initComponent();
    });
});
/* 01. Dashboard Home Page
------------------------------------------------*/
window.addEventListener('dashboard-ready', function(e){
    $.getScript('/assets/js/dashboard.min.js').done(function(){
        Dashboard.init();
        App.initComponent();
    });
});

// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('usecases-ready', function(e) {
    $.getScript('/assets/js/iirp-usecases.min.js').done(function() {
        TableManageCombineUsecases.init();
    });
});


// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('users-ready', function(e) {
    $.getScript('/assets/js/iirp-users.min.js').done(function() {
        TableManageCombineUsers.init();
    });
});

// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('organizations-ready', function(e) {
    $.getScript('/assets/js/iirp-organizations.min.js').done(function() {
        TableManageCombineOrganizations.init();
    });
});

// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('tenants-ready', function(e) {
    $.getScript('/assets/js/iirp-tenants.min.js').done(function() {
        TableManageCombineTenants.init();
    });
});


// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('user-groups-ready', function(e) {
    $.getScript('/assets/js/iirp-user-groups.min.js').done(function() {
        TableManageCombineUserGroups.init();
    });
});

// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('devices-ready', function(e) {
    $.getScript('/assets/js/iirp-devices.min.js').done(function() {
        TableManageCombineDevices.init();
    });
});

// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('device-models-ready', function(e) {
    $.getScript('/assets/js/iirp-device-models.min.js').done(function() {
        TableManageCombineDeviceModels.init();
    });
});

// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('device-model-details-ready', function(e) {
    $.getScript('/assets/js/iirp-device-model-details.min.js').done(function() {
        TableManageCombineDeviceModelDetails.init();
    });
});
// From Sean's template 9/11/2017
/* 26. Table Manage Combine 
------------------------------------------------ */
window.addEventListener('device-types-ready', function(e) {
    $.getScript('/assets/js/iirp-device-types.min.js').done(function() {
        TableManageCombineDeviceTypes.init();
    });
});