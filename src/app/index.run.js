(function() {
  'use strict';

  angular
    .module('symphony')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $state, Auth) {
    var authRedirect = $rootScope.$on('$stateChangeStart', function(event, next) {
      if (next.authenticate && !Auth.isAuthenticated()) {
        $state.go('home');
        event.preventDefault();
        return false;
      }
    });

    $rootScope.$on('$destroy', authRedirect);
  }
})();
