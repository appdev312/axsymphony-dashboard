(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('WaterEfficiencyController', WaterEfficiencyController);

  /** @ngInject */
  function WaterEfficiencyController(SiteDataService, WaterEfficiencyService) {
    var vm = this;

    vm.siteInfo = SiteDataService.siteInfo;
    SiteDataService.fetchSiteData();

    var chartConfig = {
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
          column: {
            stacking: 'normal'
          },
          dataLabels: {
            enabled: true
          }
        }
      },
      title: {
        text: 'Daily Water Efficiency'
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
      yAxis: {
        min: 0,
        title: {
          text: 'Gallons / Ton-Hr'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold'
          }
        },
        plotLines: []
      },
      series: [],
      func: function(chart) {
        vm.chartData = chart;
      }
    };

    var prefferedColors = ['#25aae1', '#ffcc66', '#66ffcc'];
    var xAxisFormat = 'MM/DD/YYYY';

    WaterEfficiencyService.get(function(response) {
      vm.data = response.data;

      // Load data from server response to chart config
      chartConfig.xAxis.categories = vm.data.x_axis;
      for(var i = 1; i < vm.data.series.length; i++) {
        var source = vm.data.series [i];
        var s = {
          name: source.name,
          data: source.data,
          color: prefferedColors[chartConfig.series.length]
        }
        chartConfig.series.push(s);
      };
      chartConfig.yAxis.plotLines.push({
        color: '#f09393',
        value: vm.data.series [0] [4],
        width: 2
      });
      vm.chartWaterEfficiencyHistory = chartConfig;
    });

  }
})();
