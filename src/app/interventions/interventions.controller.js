(function() {
  'use strict';

  angular
    .module('symphony')
    .controller('InterventionsController', InterventionsController);

  /** @ngInject */
  function InterventionsController(InterventionsService, SiteDataService, AlertService) {
    var vm = this;

    vm.siteInfo = SiteDataService.siteInfo;
    SiteDataService.fetchSiteData();

    vm.removeResponse = function (response) {
      _.remove(vm.editableIntervention.responses , function (e) { // eslint-disable-line
        return e == response;
      })
    };

    vm.addResponse = function () {
      vm.editableIntervention.responses.push({
        action: 'SET',
        variable: '',
        value: 0
      });
    };

    vm.removeTrigger = function (trigger) {
      _.remove(vm.editableIntervention.triggerConditions , function (e) { // eslint-disable-line
        return e == trigger;
      })
    };

    vm.addTrigger = function () {
      vm.editableIntervention.triggerConditions.push({
        variable: '',
        condition: '==',
        value: 0,
        andOr: '&'
      });
    };

    vm.selectIntervention = function (intervention) {
      if (vm.editing) {
        AlertService.ShowAlert('Warning', 'Still editing... Please save or cancel prior to selecting a new intervention.');
        return;
      }

      vm.errors = '';
      vm.editing = false;
      vm.editableIntervention = JSON.parse(JSON.stringify(intervention));// eslint-disable-line
      vm.selectedIntervention = intervention;
    };

    vm.startEditing = function () {
      vm.errors = '';
      vm.editing = true;
    };

    vm.cancelEditing = function () {
      vm.errors = '';
      vm.editing = false;
      vm.editableIntervention = JSON.parse(JSON.stringify(vm.selectedIntervention));// eslint-disable-line
    };

    vm.saveIntervention = function () {
      InterventionsService.save(vm.editableIntervention , vm.saveCompleted, vm.saveError);
    };

    vm.saveCompleted = function () {
      vm.editing = false;

      for (var key in vm.editableIntervention) {
        vm.selectedIntervention [key] = vm.editableIntervention [key];
      }

      vm.errors = 'No errors';
    };

    vm.saveError = function (errorData) {
      // TODO: use error data to put on the UI; also check when we have real API, not mocked
      AlertService.ShowAlert('Error', 'Error saving...', errorData);
    };

    InterventionsService.get(init);

    function init (data) {
      vm.interventions = data;

      if (vm.interventions.length > 0)
        vm.selectIntervention (vm.interventions [0]);
    }
  }
})();