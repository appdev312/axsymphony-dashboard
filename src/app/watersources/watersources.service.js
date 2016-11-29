(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('WaterSourcesService', WaterSourcesService);

  function WaterSourcesService($http, apiBasePath, Auth) {
    var endpoint = 'presentationServices/waterSources/';

    // TODO: remove the mocked dummy data for the chart
    function generateDummyChartData () {
      var data = [];

      for (var i = 0; i < 250; i++) {
        data.push (Math.random() * 95);
      }

      return data;
    }

    var get = function (callback) {
      $http.get(apiBasePath + endpoint + Auth.getSiteGuid())
        .then(function (response) {
          callback({
            waterSources: response.data.waterSources,
            chartData: generateDummyChartData ()
          });
        });
    };

    var save = function (watersources, callbackOnOk, callbackOnFailed) {
      for(var ndx = 0 ; ndx < watersources.length; ndx++) {
        $http.put(apiBasePath + endpoint + watersources.id + '/' + Auth.getSiteGuid(), watersources [ndx])
          .then(function () {
            // ok, we can continue saving the remaining ones
          }, function (response) {
            callbackOnFailed(response.data);
            return;
          });
      }

      callbackOnOk();
    };

    var list = function() {
      return $http.get(apiBasePath + endpoint + Auth.getSiteGuid());
    }

    return {
      get: get,
      save: save,
      list: list
    };
  }
})();
