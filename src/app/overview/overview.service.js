(function() {
  'use strict';

  angular
    .module('symphony')
    .service('OverviewService', OverviewService);

  function OverviewService(Auth, $http, apiBasePath) {
    var nexusData = {
      nexusNumber: 0,
      waterEfficiency: 0,
      energyEfficiency: 0,
      x_axis: [],
      series: []
    };

    var endpoint = 'presentationServices/overview/';

    var loadOverview = function() {
      return $http.get(apiBasePath + endpoint + Auth.getSiteGuid())
        .then(function(response) {
          nexusData.nexusNumber = response.data.nexusNumber.toFixed(0);
          nexusData.waterEfficiency = response.data.waterEfficiency.toFixed(0);
          nexusData.energyEfficiency = response.data.energyEfficiency.toFixed(0);

          // TODO: move to a config...
          var prefferedColors = ['#25aae1', '#FFA833', '#33FF8D'];
          for(var i = 0; i < 3 && i < response.data.series.length; i++) {
            response.data.series [i].color = prefferedColors [i];
          }

          nexusData.x_axis.splice.apply(nexusData.x_axis, [0, response.data.x_axis.length].concat(response.data.x_axis));
          nexusData.series.splice.apply(nexusData.series, [0, response.data.series.length].concat(response.data.series));
        });
    };

    return {
      loadOverview: loadOverview,
      nexusData: nexusData
    }
  }
})();