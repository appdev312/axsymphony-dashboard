(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('AlarmsController', AlarmsController);

  /** @ngInject */
  function AlarmsController(AlarmsService, SiteDataService) {
    var vm = this;

    vm.onAck = function (event, ackDone) {
      AlarmsService.ack(event, ackDone);
    };

    AlarmsService.get(init);

    function init (data) {
      vm.events = data;
      vm.siteInfo = SiteDataService.siteInfo;

      SiteDataService.fetchSiteData();
    }
  }
})();