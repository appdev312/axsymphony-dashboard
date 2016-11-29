(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('WaterEfficiencyService', WaterEfficiencyService);

  function WaterEfficiencyService($http, apiBasePath, Auth) {
    var endpoint = 'presentationServices/waterEfficiency/';

    var get = function (callback) {
      $http.get(apiBasePath + endpoint + Auth.getSiteGuid())
        .then(function (response) {
          callback(response);
        });
    };

    return {
      get: get
    };
  }
})();
