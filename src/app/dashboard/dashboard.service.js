(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('DashboardService', DashboardService);

  function DashboardService($http, apiBasePath, Auth) {
    var loadTrends = function (callback) {
      $http.get(apiBasePath + "presentationServices/operationDashboard/" + Auth.getSiteGuid())
        .then(function (response) {
          callback(angular.fromJson(response.data));
        });
    };

    var loadRiskIndicators = function(callback) {
      $http.get(apiBasePath + "presentationServices/riskIndicators/" + Auth.getSiteGuid())
        .then(function (response) {
          callback(angular.fromJson(response.data));
        });
    };

    return {
      loadTrends: loadTrends,
      loadRiskIndicators: loadRiskIndicators
    };
  }
})();