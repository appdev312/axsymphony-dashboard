(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('TrendsController', TrendsController);

  /** @ngInject */
  function TrendsController(TrendsService, SiteDataService) {
    var vm = this;

    vm.siteInfo = SiteDataService.siteInfo;
    SiteDataService.fetchSiteData();

    vm.categories = [{
      name: 'Efficiency',
      expand: true,
      children: [{
        name: 'Nexus Number',
        unit: '',
        tag: 'Symphony_Nexus_Number'
      }, {
        name: 'Water Efficiency',
        unit: 'Percent(%)',
        tag: 'WaterEfficiency'
      }, {
        name: 'Energy Efficiency ',
        unit: 'Percent(%)',
        tag: 'EnergyEfficency'
      }]
    }, {
      name: 'Water',
      expand: true,
      children: [{
        name: 'Cycles of Concentration',
        unit: 'milliVolts(mV)',
        tag: 'ORP'
      }, {
        name: 'Corrosion (Cu) - Chiller 1a',
        unit: 'MPY',
        tag: 'WebMasterOne_Corrosion_1a_Value'
      }, {
        name: 'Imbalance - Chiller 1a',
        unit: 'IU',
        tag: 'WebMasterOne_Imbalance_1a_Value'
      }, {
        name: 'Corrosion (Cu) - Chiller 1b',
        unit: 'MPY',
        tag: 'WebMasterOne_Corrosion_1b_Value'
      }, {
        name: 'Imbalance - Chiller 1b',
        unit: 'IU',
        tag: 'WebMasterOne_Imbalance_1b_Value'
      }, {
        name: 'Corrosion (Cu) - Chiller 2a',
        unit: 'MPY',
        tag: 'WebMasterOne_Corrosion_2a_Value'
      }, {
        name: 'Imbalance - Chiller 2a',
        unit: 'IU',
        tag: 'WebMasterOne_Imbalance_2a_Value'
      }, {
        name: 'Corrosion (Cu) - Chiller 2b',
        unit: 'MPY',
        tag: 'WebMasterOne_Corrosion_2b_Value'
      }, {
        name: 'Imbalance - Chiller 2b',
        unit: 'IU',
        tag: 'WebMasterOne_Imbalance_2b_Value'
      }]
    }];

    vm.xAxisFormat = 'MM/DD/YYYY HH:mm';

    vm.chartConfig = {
      options: {
        chart: {
          type: 'line',
          backgroundColor: '#f2f2f2',
          ignoreHiddenSeries: true
        },
        title: {
          text: 'Ignore hidden series is set to true'
        },
        tooltip: {
          enabled: true,
          shared: true
        },
        credits: {
          enabled: false
        },

        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          }
        },
        xAxis: [{
          categories: getCategories(2, 60),
          crosshair: true
        }],
        yAxis: []
      },

      title: {
        text: null
      },

      series: []
    };

    vm.menuOptions = [
      ['Delete', function($itemScope) {
        var parent = $itemScope.elem;
        var item = $itemScope.variable;
        item.selected = false;
        vm.chartConfig.series = vm.chartConfig.series.filter(function(s) {
          if (s.name !== parent.name + ' ' + item.name) return true;
          vm.seriesPerAxis[s.yAxis] -= 1;
          if (vm.seriesPerAxis[s.yAxis] === 0) {
            vm.axisCounter -= 1;
            vm.chartConfig.options.yAxis[s.yAxis] = {};
            vm.axisIds[item.name + ' (' + item.unit + ')'] = undefined;
          }
        });
      }, function($itemScope) {
        return $itemScope.variable.selected;
      }]
    ];

    function getCategories(days, interval) {
      var numOfCategories = 1440 / interval; // Minutes per day divide by minutes per interval
      var categories = [];
      var today = moment().startOf('day');
      var baseDate = moment().startOf('day').subtract(days, 'days');
      for (var m = moment(baseDate); m.diff(today, 'days') <= 0; m.add(1, 'days')) {
        categories.push(m.format(vm.xAxisFormat))
        for (var i = 0; i < numOfCategories; i++) {
          categories.push(m.add(interval, 'minutes').format(vm.xAxisFormat));
        }
      }
      return categories;
    }

    vm.axisCounter = 0;
    vm.axisIds = [];
    vm.seriesPerAxis = [];
    vm.onDropComplete = function(data) {
      TrendsService.loadTrendsData(data.node.tag).then(function(trendData) {
        data.node.selected = true;
        var axisText = data.node.name;
        var unit = data.node.unit;
        if (unit) axisText += ' (' + data.node.unit + ')';
        var y = vm.axisIds[axisText];
        if (angular.isUndefined(y)) {
          vm.chartConfig.options.yAxis.push({
            labels: {
              format: '{value}',
              style: {
                color: '#000000'
              }
            },
            title: {
              text: axisText,
              style: {
                color: '#000000'
              }
            },
            opposite: true
          });
          y = vm.axisCounter;
          vm.seriesPerAxis[y] = 0;
          vm.axisIds[axisText] = y;
          vm.axisCounter += 1;
        }
        vm.seriesPerAxis[y] += 1;
        vm.chartConfig.series.push({
          name: data.parent.name + ' ' + data.node.name,
          type: 'spline',
          yAxis: y,
          visible: true,
          data: trendData.data,
          tooltip: {
            valueSuffix: data.node.unit
          }
        });
      });
    }
  }
})();
