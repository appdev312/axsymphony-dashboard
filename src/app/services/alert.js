(function () {
  'use strict';

  angular
    .module('symphony')
    .service('AlertService', AlertService);

  angular
    .module('symphony')
    .controller('AlertModalController', AlertModalController);

  function AlertModalController ($uibModalInstance) {
    var vm = this;

    vm.close = function () {
      $uibModalInstance.dismiss('close');
    };
  }

  function AlertService($uibModal) {
    this.ShowAlert = function (title, message) {
      $uibModal.open({
        controller: 'AlertModalController',
        controllerAs: 'vm',
        template: '<div class="modal-header bg-danger">' +
                    '<h2 class="modal-title">' + title + '</h2>' +
                  '</div>' +
                  '<div class="modal-body">' +
                    message +
                  '</div>' +
                  '<div class="modal-footer">' +
                    '<button class="btn btn-primary" type="button" ng-click="vm.close()">Close</button>' +
                  '</div>'
      });
    }
  }
})();
