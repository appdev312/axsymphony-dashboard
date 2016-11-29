(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('EnergyEfficiencyController', EnergyEfficiencyController);

  /** @ngInject */
  function EnergyEfficiencyController(EnergyEfficiencyService, SiteDataService) {
    var vm = this;

    EnergyEfficiencyService.get(init);

    function init (data) {
      vm.siteInfo = SiteDataService.siteInfo;
      SiteDataService.fetchSiteData();

      vm.summary = data.table;

      vm.chartConfig = {
        options: {
          chart: {
            type: 'column',
            backgroundColor: '#f2f2f2'
          },
          tooltip: {
            enabled: true
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            dataLabels: {
              enabled: true
            }
          }
        },
        title: {
          text: 'Energy Efficiency - kWh/Ton-Hr'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [],
          labels: {
            enabled: true
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Target vs. Actual (%)'
          },
          plotLines: []
        },
        series: []
      };

      // TODO: copied from wather efficiency screen, we need to put this in a configuration file and settle on a good color palette
      // TODO: it's necessary to create a common data format for all screens to make them consistent
      var prefferedColors = ['#25aae1', '#ffcc66', '#66ffcc'];

      vm.chartConfig.xAxis.categories = data.x_axis;

      for (var ndxEquipment = 0; ndxEquipment < data.series.length ; ndxEquipment++) {
        var series = {
          color: prefferedColors[ndxEquipment],
          name: data.series [ndxEquipment].name,
          data: data.series [ndxEquipment].data
        };

        vm.chartConfig.series.push(series);
      }
    }
  }
})();