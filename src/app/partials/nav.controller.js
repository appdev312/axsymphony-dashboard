(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('NavController', NavController);

  /** @ngInject */
  function NavController(SiteDataService) {
    var vm=this;

    SiteDataService.fetchSiteData(function () {vm.userImage = SiteDataService.siteInfo.userImage;});
  }
})();