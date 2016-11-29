(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('InterventionsService', InterventionsService);

  function InterventionsService($http, apiBasePath, Auth) {
    var endpoint = 'presentationServices/interventions/';

    var get = function (callback) {
      $http.get(apiBasePath + endpoint + Auth.getSiteGuid())
        .then(function (response) {
          callback (response.data);
        });
    };

    var save = function (intervention, callbackOnOk, callbackOnFailed) {
      $http.put(apiBasePath + endpoint + intervention.interventionId + '/' + Auth.getSiteGuid(), intervention)
        .then(function () {
          callbackOnOk();
        }, function (response) {
        // TODO: once there is real data I need to come back here and see what we need to report to the user
        callbackOnFailed(response.data);
        });
    };

    return {
      get: get,
      save: save
    };
  }
})();