(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('TimeController', TimeController);

  /** @ngInject */
  function TimeController($scope, $interval) {
    var vm=this;
    vm.updateTime = function () {
      vm.clock = Date.now();
    }

    vm.updateTime();
    vm.interval = $interval(function () { vm.updateTime(); }, 1000);

    $scope.$on('$destroy', function () {
      if(vm.interval)
        $interval.cancel(vm.interval);
    });
  }
})();