(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('WaterSourcesController', WaterSourcesController);

  /** @ngInject */
  function WaterSourcesController(WaterSourcesService, SiteDataService, AlertService) {
    var vm = this;

    vm.siteInfo = SiteDataService.siteInfo;
    SiteDataService.fetchSiteData();

    vm.startEditing = function () {
      vm.editableSources = JSON.parse(JSON.stringify(vm.waterSources));// eslint-disable-line
      vm.errors = '';
      vm.editing = true;
    };

    vm.cancelEditing = function () {
      vm.errors = '';
      vm.editing = false;
      vm.editableSources = JSON.parse(JSON.stringify(vm.waterSources));// eslint-disable-line
    };

    vm.save = function () {
      WaterSourcesService.save(vm.editableSources , vm.saveCompleted, vm.saveError);
    };

    vm.saveCompleted = function () {
      vm.editing = false;

      for (var key in vm.editableSources) {
        vm.waterSources [key] = vm.editableSources [key];
      }

      vm.errors = 'No errors';
    };

    vm.saveError = function (errorData) {
      // TODO: use error data to put on the UI; also check when we have real API, not mocked
      AlertService.ShowAlert('Error', 'Error saving...', errorData);
    };

    WaterSourcesService.get(init);

    function init (data) {
      vm.waterSources = data.waterSources;
      vm.editableSources = JSON.parse(JSON.stringify(vm.waterSources));// eslint-disable-line
      vm.chartConfig = {
        options: {
          chart: {
            type: 'line',
            backgroundColor: '#f2f2f2',
            height: 220
          },
          tooltip: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            dataLabels: {
              enabled: false
            }
          }
        },
        title: {
          text: null
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [],
          labels: {
            enabled: false
          }
        },
        series: [
          {
            color: '#25aae1',
            data: data.chartData
          }
        ]
      }
    }
  }
})();