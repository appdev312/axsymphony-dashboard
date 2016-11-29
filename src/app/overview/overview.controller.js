(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('OverviewController', OverviewController);

  /** @ngInject */
  function OverviewController(OverviewService, SiteDataService, HighchartsHelperService, $interval, $scope) {
    var vm = this;

    vm.nexusData = OverviewService.nexusData;

    vm.refreshNexusData = function () {
      OverviewService.loadOverview();
    };

    // TODO: place all color configurations in one place
    vm.someColors = ['#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#008000'];
    vm.allBlueColors = ['#25aae1', '#25aae1'];

    vm.siteInfo = SiteDataService.siteInfo;
    SiteDataService.fetchSiteData();

    vm.refreshNexusData();

    vm.chartConfig = {
      options: {
        chart: {
          type: 'column',
          backgroundColor: '#f2f2f2',
          height: 195
        },
        tooltip: {
          enabled: true,
          // TODO: review; hacked to make highcharts hide shared tooltips properly
          formatter: HighchartsHelperService.FormatterForSharedTooltips
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
        text: 'Performance Trend'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: vm.nexusData.x_axis,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Percent (%)'
        },
        plotLines: []
      },
      series: vm.nexusData.series
    };

    // refresh every 30 minutes, according to Rob's info
    vm.interval = $interval(function() { vm.refreshNexusData(); }, 1800000);

    $scope.$on('$destroy', function () {
      if(vm.interval)
        $interval.cancel(vm.interval);
    });
  }
})();