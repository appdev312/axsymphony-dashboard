(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController(DashboardService, SiteDataService, AlarmsService, OverviewService, HighchartsHelperService, $interval, $scope) {
    var vm = this;

    /*
     * get site info
     */
    vm.siteInfo = SiteDataService.siteInfo;
    SiteDataService.fetchSiteData();

    /**
     * In order to synchronize tooltips and crosshairs, override the
     * built-in events with handlers defined on the parent element.
     */
    angular.element('#sync-chart').bind('mousemove touchmove touchstart', function (e) {
      var chart,
          point,
          i,
          event;

      for (i = 1; i < Highcharts.charts.length; i = i + 1) {
        chart = Highcharts.charts[i];
        event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
        point = chart.series[0].searchPoint(event, true); // Get the hovered point

        if (point) {
          point.highlight(e);
        }
      }
    });

    /**
     * Synchronize zooming through the setExtremes event handler.
     */
    function syncExtremes(e) {
      var thisChart = this.chart; // eslint-disable-line

      if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
          if (chart !== thisChart) {
            if (chart.xAxis[0].setExtremes) { // It is null while updating
              chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
            }
          }
        });
      }
    }

    DashboardService.loadTrends(function(data) {
      vm.interventions = data.interventions;
      vm.series = [];

      // Clear DOM
      var syncChart = angular.element('#sync-chart')[0];
      while (syncChart.hasChildNodes()) {
        syncChart.removeChild(syncChart.lastChild);
      }

      for (var index in data.series)
      {
        var dataset = data.series[index];
        dataset.data = Highcharts.map(dataset.data, function (val, j) {
          return [data.x_axis[j], val];
        });

        var chartDiv = angular.element('<div/>');
        angular.element('#sync-chart').append(chartDiv);

        Highcharts.chart(chartDiv[0], {
          chart: {
            marginLeft: 10, // Keep all charts left aligned
            marginRight: 20,
            spacingTop: 5,
            spacingBottom: 5,
            height: 75
          },
          exporting: {
            enabled: false
          },
          title: {
            text: dataset.name,
            align: 'left',
            margin: 0,
            x: 10
          },
          credits: {
            enabled: false
          },
          legend: {
            enabled: false
          },
          xAxis: {
            type: 'category',
            crosshair: true,
            events: {
              setExtremes: syncExtremes
            },
            labels: {
              format: '{value}',
              enabled: false
            }
          },
          yAxis: {
            labels: {
              enabled: false
            },
            title: {
              text: null
            }
          },
          tooltip: {
            positioner: function () {
              return {
                /* eslint-disable */
                x: this.chart.chartWidth - this.label.width - 15,
                y: 0
                /* eslint-enable */
              };
            },
            borderWidth: 0,
            backgroundColor: 'none',
            pointFormat: '{point.y}',
            headerFormat: '',
            shadow: false,
            style: {
              fontSize: '12px'
            }
          },
          series: [{
            data: dataset.data,
            name: dataset.name,
            type: 'line',
            color: Highcharts.getOptions().colors[index],
            fillOpacity: 0.3
          }]
        });
      }
    });

    /*
     * 3 circle gauges in the top left pane
     */
    vm.someColors = ['#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#008000'];
    vm.allBlueColors = ['#25aae1', '#25aae1'];
    vm.nexusData = OverviewService.nexusData;
    
    OverviewService.loadOverview();
    vm.interval = $interval(function() { OverviewService.loadOverview(); }, 1800000);

    $scope.$on('$destroy', function () {
      if (vm.interval) {
        $interval.cancel(vm.interval);
      }
    });

    /*
     * risk indicators
     */
    DashboardService.loadRiskIndicators(function(data) {
      vm.riskIndicators = data;
    });

    /*
     * notification
     */
    vm.onAck = function (event, ackDone) {
      AlarmsService.ack(event, ackDone);
    };

    AlarmsService.get(function(data) {
      vm.events = data;
    });

    /*
     * trend line under 3 circles
     */
    vm.nexusData = OverviewService.nexusData;
    vm.chartConfig = {
      options: {
        chart: {
          type: 'column',
          backgroundColor: '#f2f2f2',
          height: 195
        },
        tooltip: {
          enabled: true,
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
  }
})();