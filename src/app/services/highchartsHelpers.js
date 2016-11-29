(function () {
  'use strict';

  angular
    .module('symphony')
    .service('HighchartsHelperService', HighchartsHelperService);

  function HighchartsHelperService() {
    this.FormatterForSharedTooltips = function() {
      var s = '<b>'+ this.x +'</b><br>';

      for(var ndx = 0; ndx < this.series.chart.series.length; ndx++) {
        s += this.series.chart.series [ndx].name + ': <b>' + this.series.chart.series [ndx].data [this.point.index].y + '</b>' + (ndx + 1 < this.series.chart.series.length ? '<br>' : '');
      }

      return s;
    }
  }
})();
