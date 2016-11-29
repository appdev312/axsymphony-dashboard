(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($state, Auth, SiteDataService) {
    if ($state.current.name == 'logout') {
      Auth.logout();
    }

    if (Auth.isAuthenticated()) {
      $state.go(Auth.defaultState());
      return;
    }

    var vm = this;
    vm.user = {username: "T5KM3_Admin", password: "rm3XcSLX"};

    Auth.logout();
    vm.login = function(user) {
      Auth.login(user).then(function() {
        SiteDataService.fetchSiteData();
        $state.go(Auth.defaultState());
      });
    }
  }
})();
