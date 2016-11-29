(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('WeatherController', WeatherController);

  /** @ngInject */
  function WeatherController($interval, $http, $scope, SiteDataService) {
    var vm=this;

    var updateWeather = function() {
      $http.get(SiteDataService.siteInfo.weatherURL)
        .success(function(data) {
          vm.weatherData = data;
        });
    };

    SiteDataService.fetchSiteData(function () {updateWeather();});
    vm.updateWeather = updateWeather;

    vm.updateWeather();
    vm.interval = $interval(function() { vm.updateWeather(); }, 3600000);

    $scope.$on('$destroy', function () {
      if(vm.interval)
        $interval.cancel(vm.interval);
    });
  }
})();