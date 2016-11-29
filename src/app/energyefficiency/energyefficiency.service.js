(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('EnergyEfficiencyService', EnergyEfficiencyService);

  function EnergyEfficiencyService($http, apiBasePath, Auth) {
    var get = function (callback) {
      $http.get(apiBasePath + 'presentationServices/energyEfficiency/' + Auth.getSiteGuid())
        .then(function (response) {
          callback (response.data);
        });
    };

    return {
      get: get
    };
  }
})();